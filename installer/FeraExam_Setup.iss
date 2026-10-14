; Script generated for FeraExam Installer
#define MyAppName "FeraExam"
#define MyAppVersion "3.8.0"
#define MyAppPublisher "FeraExam / Afra4509"
#define MyAppURL "https://github.com/Afra4509/feraexam"
#define MyAppExeName "FeraExam.exe"

[Setup]
AppId={{D8C9A310-9118-4720-A22C-58EBE2C20822}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
OutputDir=..\installer_output
OutputBaseFilename=FeraExam_Setup
SetupIconFile=..\FeraExam_Release\FeraExam.ico
WizardImageFile=wizard_large.bmp
WizardSmallImageFile=wizard_small.bmp
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
ArchitecturesInstallIn64BitMode=x64compatible
DisableProgramGroupPage=yes

; Full Windows Executable Metadata (Mitigates Unknown Binary Flags)
VersionInfoVersion=3.8.0.0
VersionInfoCompany={#MyAppPublisher}
VersionInfoDescription=FeraExam Setup Launcher (Windows 64-Bit)
VersionInfoCopyright=Copyright (C) 2026 FeraExam. Licensed under MPL 2.0.
VersionInfoProductName={#MyAppName}
VersionInfoProductVersion=3.8.0.0

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "..\FeraExam_Release\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\FeraExam.ico"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\FeraExam.ico"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#MyAppName}}"; Flags: nowait postinstall skipifsilent
