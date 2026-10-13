<div align="center">

<img src="assets/logo.png" alt="FeraExam Logo" width="180" height="180" />

# FeraExam
**Browser Ujian Modern, Cepat, Fleksibel, dan Teroptimasi Penuh**

[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011%20x64-blue?style=for-the-badge&logo=windows)](https://github.com/Afra4509/feraexam)
[![Version](https://img.shields.io/badge/Release-v3.8.0-success?style=for-the-badge)](https://github.com/Afra4509/feraexam/releases)
[![Engine](https://img.shields.io/badge/Engine-Chromium%20%2F%20CEF-orange?style=for-the-badge&logo=googlechrome)](https://github.com/Afra4509/feraexam)
[![License](https://img.shields.io/badge/License-MPL%202.0-purple?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Tentang FeraExam

**FeraExam** adalah lingkungan browser ujian yang dikembangkan berbasis Safe Exam Browser (SEB) dengan peningkatan performa, perombakan branding visual total, serta fleksibilitas tinggi bagi pengawas maupun pengembang ujian.

FeraExam dirancang agar ringan, gegas saat dibuka, mendukung tampilan seluruh website tanpa batasan kaku yang menyulitkan, dan tetap menyajikan antarmuka modern yang profesional.

---

## ✨ Fitur Unggulan

- 🚀 **Optimasi Maksimal & Responsif**
  - **GPU Accelerated Rasterization** (`enable-gpu-rasterization`) untuk render grafis dan animasi halaman web yang mulus.
  - **Zero-Copy Buffering** (`enable-zero-copy`) untuk akselerasi alokasi memori buffer grafis.
  - Menghilangkan background telemetry & background networking Chromium yang membebani disk dan RAM.
  - Startup dan shutdown cepat tanpa jeda watchdog atau runtime freeze.

- 🔓 **Fleksibel & Terbuka**
  - **Dukungan Screenshot**: Fitur capture layar dapat digunakan tanpa diblokir oleh OS Display Affinity guard.
  - **Dukungan All Websites**: Membuka seluruh tautan dan situs ujian modern tanpa blokir URL filter berlebihan.
  - **Clipboard Support**: Akses copy-paste diizinkan secara fleksibel.

- 🎨 **Total Rebranding FeraExam**
  - Logo dan ikon baru disesuaikan di seluruh aplikasi, taskbar, splash screen, dan installer.
  - Menggunakan format ikon 32-bit DIB Bitmap yang 100% kompatibel dengan native WPF .NET Framework.
  - Pesan aplikasi dan teks lokalisasi (Bahasa Indonesia & Multi-bahasa) diperbarui ke FeraExam.

- 🛡️ **Penanganan Error Pintar (Smart Auto-Redirect)**
  - Jika pengguna membuka sub-proses client secara manual (`FeraExam.Client.exe`), sistem otomatis mengalihkan (auto-launch) ke aplikasi utama `FeraExam.exe` tanpa memunculkan error argument.

- 📦 **Single-File Setup Installer**
  - Dilengkapi paket installer mandiri terkompresi ultra LZMA2 (`FeraExam_Setup.exe`) dengan setup wizard grafis FeraExam, desktop shortcut, start menu shortcut, dan uninstaller bersih.

---

## 📥 Unduh & Instalasi

### 1. Menggunakan Installer (Direkomendasikan)
1. Unduh **`FeraExam_Setup.exe`** dari tab [Releases](https://github.com/Afra4509/feraexam/releases).
2. Jalankan installer dan ikuti petunjuk wizard.
3. Buka **FeraExam** langsung dari Desktop atau Start Menu.

### 2. Menggunakan Versi Portable
1. Unduh folder build portable `FeraExam_Release`.
2. Klik ganda `FeraExam.exe` untuk langsung menjalankan aplikasi.

---

## 🛠️ Build dari Source Code

### Prasyarat
- **Windows 10 / 11 (64-bit)**
- **Visual Studio 2022** atau **Build Tools for Visual Studio 2022** (dengan Workload *.NET Desktop Build Tools*)
- **.NET Framework 4.8 SDK & Targeting Pack**
- **Inno Setup 6** *(opsional, untuk mengompilasi installer `.exe`)*

### Langkah Kompilasi
1. Clone repositori ini:
   ```bash
   git clone https://github.com/Afra4509/feraexam.git
   cd feraexam
   ```

2. Restore dependensi dan kompilasi dengan MSBuild:
   ```powershell
   & "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\MSBuild\Current\Bin\MSBuild.exe" src\SafeExamBrowser.Runtime\SafeExamBrowser.Runtime.csproj /p:Configuration=Release /p:Platform=x64 /p:SolutionDir=".\src\\"
   & "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\MSBuild\Current\Bin\MSBuild.exe" src\SafeExamBrowser.Client\SafeExamBrowser.Client.csproj /p:Configuration=Release /p:Platform=x64 /p:SolutionDir=".\src\\"
   ```

3. Mengompilasi Installer Inno Setup:
   ```powershell
   & "ISCC.exe" installer\FeraExam_Setup.iss
   ```

---

## 📂 Struktur Repositori

```
feraexam/
├── assets/                  # Logo dan aset grafis untuk dokumentasi
├── installer/               # Skrip compiler Inno Setup (FeraExam_Setup.iss & grafis wizard)
├── logo/                    # Master logo FeraExam (PNG & ICO)
├── src/                     # Seluruh source code solusi FeraExam C# / WPF / CEF
│   ├── SafeExamBrowser.Browser/        # Integrasi CEF / Chromium & konfigurasi engine
│   ├── SafeExamBrowser.Client/         # Kontrol UI browser & custom features
│   ├── SafeExamBrowser.Configuration/  # Manajemen konfigurasi & data values
│   ├── SafeExamBrowser.Runtime/        # Runtime host utama FeraExam
│   └── SafeExamBrowser.UserInterface.*/ # Tampilan antarmuka desktop & mobile
├── web installer/           # Komponen pendukung platform web installer
├── .gitignore               # Konfigurasi file yang diabaikan Git
└── README.md                # Dokumentasi proyek
```

---

## 📄 Lisensi

Proyek ini berbasis pada sumber terbuka Safe Exam Browser dan tunduk pada ketentuan **Mozilla Public License 2.0 (MPL-2.0)**.
Hak cipta © 2026 FeraExam.
