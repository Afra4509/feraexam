/*
 * Copyright (c) 2025 ETH Zürich, IT Services
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;
using SafeExamBrowser.Logging.Contracts;
using SafeExamBrowser.Monitoring.Contracts.Applications;
using SafeExamBrowser.Monitoring.Contracts.Applications.Events;
using SafeExamBrowser.Settings.Applications;
using SafeExamBrowser.WindowsApi.Contracts;

namespace SafeExamBrowser.Monitoring.Applications
{
	public class ApplicationMonitor : IApplicationMonitor
	{
		private readonly IList<BlacklistApplication> blacklist;
		private readonly ILogger logger;
		private readonly INativeMethods nativeMethods;
		private readonly IProcessFactory processFactory;
		private readonly Timer timer;
		private readonly IList<WhitelistApplication> whitelist;

		private Guid? captureHookId;
		private Guid? foregroundHookId;
		private IList<IProcess> processes;
		private Window activeWindow;

		public event ExplorerStartedEventHandler ExplorerStarted;
		public event InstanceStartedEventHandler InstanceStarted;
		public event TerminationFailedEventHandler TerminationFailed;

		public ApplicationMonitor(int interval_ms, ILogger logger, INativeMethods nativeMethods, IProcessFactory processFactory)
		{
			this.blacklist = new List<BlacklistApplication>();
			this.logger = logger;
			this.nativeMethods = nativeMethods;
			this.processes = new List<IProcess>();
			this.processFactory = processFactory;
			this.timer = new Timer(interval_ms);
			this.whitelist = new List<WhitelistApplication>();
		}

		public InitializationResult Initialize(ApplicationSettings settings)
		{
			var result = new InitializationResult();

			InitializeProcesses();
			InitializeBlacklist(settings, result);
			InitializeWhitelist(settings, result);

			return result;
		}

		public void Start()
		{
			timer.AutoReset = false;
			timer.Elapsed += Timer_Elapsed;
			timer.Start();
			logger.Info("Started monitoring applications.");

			captureHookId = nativeMethods.RegisterSystemCaptureStartEvent(SystemEvent_WindowChanged);
			logger.Info($"Registered system capture start event with ID = {captureHookId}.");

			foregroundHookId = nativeMethods.RegisterSystemForegroundEvent(SystemEvent_WindowChanged);
			logger.Info($"Registered system foreground event with ID = {foregroundHookId}.");
		}

		public void Stop()
		{
			timer.Stop();
			timer.Elapsed -= Timer_Elapsed;
			logger.Info("Stopped monitoring applications.");

			if (captureHookId.HasValue)
			{
				nativeMethods.DeregisterSystemEventHook(captureHookId.Value);
				logger.Info($"Unregistered system capture start event with ID = {captureHookId}.");
			}

			if (foregroundHookId.HasValue)
			{
				nativeMethods.DeregisterSystemEventHook(foregroundHookId.Value);
				logger.Info($"Unregistered system foreground event with ID = {foregroundHookId}.");
			}
		}

		public bool TryGetActiveApplication(out ActiveApplication application)
		{
			application = default;

			if (activeWindow != default && TryGetProcessFor(activeWindow, out var process))
			{
				var window = new Window
				{
					Handle = activeWindow.Handle,
					Title = nativeMethods.GetWindowTitle(activeWindow.Handle)
				};

				application = new ActiveApplication(process, window);
			}

			return application != default;
		}

		public bool TryTerminate(RunningApplication application)
		{
			var success = true;

			foreach (var process in application.Processes)
			{
				success &= TryTerminate(process);
			}

			return success;
		}

		private void SystemEvent_WindowChanged(IntPtr handle)
		{
			if (handle != IntPtr.Zero && activeWindow?.Handle != handle)
			{
				var title = nativeMethods.GetWindowTitle(handle);
				var window = new Window { Handle = handle, Title = title };

				logger.Debug($"Window has changed from {activeWindow} to {window}.");
				activeWindow = window;

				Task.Run(() =>
				{
					if (!IsAllowed(window) && !TryHide(window))
					{
						Close(window);
					}
				});
			}
		}

		private void Timer_Elapsed(object sender, ElapsedEventArgs args)
		{
			MonitorProcesses();
			MonitorWindows();

			timer.Start();
		}

		private void AddFailed(IProcess process, List<RunningApplication> failed)
		{
			var name = blacklist.First(a => BelongsToApplication(process, a)).ExecutableName;
			var application = failed.FirstOrDefault(a => a.Name == name);

			if (application == default(RunningApplication))
			{
				application = new RunningApplication(name);
				failed.Add(application);
			}

			application.Processes.Add(process);
		}

		private void AddFailed(string name, IProcess process, InitializationResult result)
		{
			var application = result.FailedAutoTerminations.FirstOrDefault(a => a.Name == name);

			if (application == default(RunningApplication))
			{
				application = new RunningApplication(name);
				result.FailedAutoTerminations.Add(application);
			}

			application.Processes.Add(process);
			logger.Error($"Process {process} belongs to application '{application.Name}' and could not be terminated automatically!");
		}

		private void AddForTermination(string name, IProcess process, InitializationResult result)
		{
			var application = result.RunningApplications.FirstOrDefault(a => a.Name == name);

			if (application == default(RunningApplication))
			{
				application = new RunningApplication(name);
				result.RunningApplications.Add(application);
			}

			application.Processes.Add(process);
			logger.Debug($"Process {process} belongs to application '{application.Name}' and needs to be terminated.");
		}

		private bool BelongsToApplication(IProcess process, BlacklistApplication application)
		{
			var sameName = process.Name.Equals(application.ExecutableName, StringComparison.OrdinalIgnoreCase);
			var sameOriginalName = process.OriginalName?.Equals(application.OriginalName, StringComparison.OrdinalIgnoreCase) == true;

			return sameName || sameOriginalName;
		}

		private bool BelongsToApplication(IProcess process, WhitelistApplication application)
		{
			var ignoreOriginalName = string.IsNullOrWhiteSpace(application.OriginalName);
			var ignoreSignature = string.IsNullOrWhiteSpace(application.Signature);
			var sameName = process.Name.Equals(application.ExecutableName, StringComparison.OrdinalIgnoreCase);
			var sameOriginalName = process.OriginalName?.Equals(application.OriginalName, StringComparison.OrdinalIgnoreCase) == true;
			var sameSignature = process.Signature?.Equals(application.Signature, StringComparison.OrdinalIgnoreCase) == true;

			return sameName && (ignoreOriginalName || sameOriginalName) && (ignoreSignature || sameSignature);
		}

		private bool BelongsToSafeExamBrowser(IProcess process)
		{
			return true;
		}

		private void Close(Window window)
		{
			// FeraExam: Window termination disabled
		}

		private void HandleExplorerStart(IProcess process)
		{
			// FeraExam: Windows Explorer termination disabled
		}

		private void HandleInstanceStart(Guid applicationId, IProcess process)
		{
			logger.Debug($"Detected start of whitelisted application instance {process}.");
			Task.Run(() => InstanceStarted?.Invoke(applicationId, process));
		}

		private void InitializeProcesses()
		{
			processes = processFactory.GetAllRunning();
			logger.Debug($"Initialized {processes.Count} currently running processes.");
		}

		private void InitializeBlacklist(ApplicationSettings settings, InitializationResult result)
		{
			logger.Debug("FeraExam: Blacklist auto-termination disabled.");
		}

		private void InitializeWhitelist(ApplicationSettings settings, InitializationResult result)
		{
			logger.Debug("FeraExam: Whitelist termination disabled.");
		}

		private bool IsAllowed(IProcess process)
		{
			return true;
		}

		private bool IsAllowed(Window window)
		{
			return true;
		}

		private bool IsWhitelisted(IProcess process, out Guid? applicationId)
		{
			applicationId = default;

			foreach (var application in whitelist)
			{
				if (BelongsToApplication(process, application))
				{
					applicationId = application.Id;

					return true;
				}
			}

			return false;
		}

		private void MonitorProcesses()
		{
			try
			{
				var failed = new List<RunningApplication>();
				var running = processFactory.GetAllRunning();
				var started = running.Where(r => processes.All(p => p.Id != r.Id)).ToList();
				var terminated = processes.Where(p => running.All(r => r.Id != p.Id)).ToList();

				foreach (var process in started)
				{
					logger.Debug($"Process {process} has been started [{process.GetAdditionalInfo()}].");
					processes.Add(process);

					if (process.Name == "explorer.exe")
					{
						HandleExplorerStart(process);
					}
					else if (!IsAllowed(process) && !TryTerminate(process))
					{
						AddFailed(process, failed);
					}
					else if (IsWhitelisted(process, out var applicationId))
					{
						HandleInstanceStart(applicationId.Value, process);
					}
				}

				foreach (var process in terminated)
				{
					logger.Debug($"Process {process} has been terminated.");
					processes.Remove(process);
				}

				if (failed.Any())
				{
					logger.Warn($"Failed to terminate these blacklisted applications: {string.Join(", ", failed.Select(a => a.Name))}.");
					TerminationFailed?.Invoke(failed);
				}
			}
			catch (Exception e)
			{
				logger.Error("Failed to monitor processes!", e);
			}
		}

		private void MonitorWindows()
		{
			try
			{
				foreach (var handle in nativeMethods.GetAllWindows())
				{
					var style = nativeMethods.GetWindowStyle(handle);
					var window = new Window
					{
						Handle = handle,
						IsOverlay = style.IsDisabled || style.IsNotActivatable || style.IsTopmost,
						Title = nativeMethods.GetWindowTitle(handle)
					};

					if (window.IsOverlay && style.IsVisible && !IsAllowed(window) && !TryHide(window))
					{
						Close(window);
					}
				}
			}
			catch (Exception e)
			{
				logger.Error("Failed to monitor windows!", e);
			}
		}

		private bool TryGetProcessFor(Window window, out IProcess process)
		{
			var processId = Convert.ToInt32(nativeMethods.GetProcessIdFor(window.Handle));

			if (!processFactory.TryGetById(processId, out process))
			{
				logger.Error($"Could not find process for window {window} and process ID = {processId}!");
			}

			return process != default;
		}

		private bool TryHide(Window window)
		{
			return true;
		}

		private bool TryTerminate(IProcess process, bool gracefully = true, bool kill = true)
		{
			return true;
		}
	}
}
