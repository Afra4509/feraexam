using System;
using SafeExamBrowser.Logging.Contracts;

namespace SafeExamBrowser.Client
{
	/// <summary>
	/// Modul kustom FeraExam untuk menambahkan fitur-fitur baru.
	/// Kamu bisa menuliskan logika kustom kamu di sini.
	/// </summary>
	internal static class FeraExamCustomFeatures
	{
		/// <summary>
		/// Dipanggil otomatis ketika FeraExam Client berhasil dimulai dan siap digunakan.
		/// </summary>
		internal static void OnClientReady(ClientContext context, ILogger logger)
		{
			logger.Info("========================================");
			logger.Info("  FeraExam: Engine Ready & Initialized  ");
			logger.Info("========================================");

			// CONTOH TEMPAT MENAMBAHKAN FITUR BARU:
			// 1. Inisialisasi token / identitas peserta ujian
			// 2. Mengirim sinyal kehadiran (heartbeat/kehadiran) ke server kamu
			// 3. Menambahkan floating widget, catatan, timer ujian, atau kalkulator kustom
			// 4. Integrasi bot pengawas / notifikasi
			
			ApplyCustomFeatures(context, logger);
		}

		/// <summary>
		/// Tuliskan implementasi fitur tambahanmu di sini.
		/// </summary>
		private static void ApplyCustomFeatures(ClientContext context, ILogger logger)
		{
			// TODO: Tulis fitur tambahan FeraExam kamu di sini
		}
	}
}
