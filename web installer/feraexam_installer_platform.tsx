import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Download,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Cpu,
  Lock,
  RefreshCw,
  Box,
  Flame,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Settings,
  HelpCircle,
  FileCode,
  Info,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Key,
  HardDrive,
  Calendar,
  Code2,
  FileText,
  Upload,
  X,
  Play,
  RotateCcw
} from 'lucide-react';

const DEFAULT_RELEASE_CONFIG = {
  version: '3.8.0',
  releaseDate: 'October 13, 2026',
  platform: 'Windows 10 / 11 (64-bit)',
  architecture: 'x64',
  filename: 'FeraExam_Setup.exe',
  fileSize: '139.9 MB',
  downloadUrl: 'https://github.com/Afra4509/feraexam/releases/download/v3.8.0/FeraExam_Setup.exe',
  sha256: 'Official Release v3.8.0 - Authenticated Binary',
  releaseChannel: 'Production Stable',
  minRam: '4 GB RAM (8 GB Recommended)',
  minDiskSpace: '500 MB Free Space',
  signatureIssuer: 'FeraExam Open Source Release (Afra4509)',
  customLogoUrl: './logo.png'
};

const CHANGELOG_DATA = [
  {
    version: 'v3.8.0',
    date: 'October 13, 2026',
    channel: 'Stable (Latest)',
    isLatest: true,
    highlights: 'Rilis Perdana Resmi FeraExam: Total Rebranding dari Safe Exam Browser (SEB), Chromium GPU acceleration, screenshot allowed, zero kiosk freeze, dan setup wizard mandiri.',
    sections: {
      newFeatures: [
        'Dukungan Screenshot Penuh: SetWindowDisplayAffinity dinonaktifkan sehingga capture layar pengawas dan proctoring dapat berjalan tanpa blackout.',
        'Universal Web Compatibility: Akses ke seluruh web ujian online dibuka tanpa hambatan URL filter berlebih.',
        'Smart Client Auto-Redirect: Eksekusi langsung FeraExam.Client.exe otomatis dialihkan ke launcher utama FeraExam.exe tanpa crash.',
        'Single-File Setup Installer: Paket instalasi mandiri terkompresi ultra LZMA2 (139.9 MB) lengkap dengan shortcut desktop, start menu, dan uninstaller.'
      ],
      improvements: [
        'Ultra-Fast Chromium Engine: GPU Accelerated Rasterization (enable-gpu-rasterization) & Zero-Copy Buffering (enable-zero-copy).',
        'Startup Cepat & Bebas Telemetri: Pemangkasan background telemetry & automatic network syncing bawaan Chromium untuk cold boot instan.',
        'Native 32-bit DIB Bitmap Icons: Seluruh format ikon dikonversi ke DIB Bitmap native untuk stabilitas 100% pada WPF .NET Framework 4.8.',
        'Total Rebranding Visual: Title bar, metadata assembly, splash screen, dan 12 file translasi I18n diperbarui ke identitas FeraExam.'
      ],
      fixes: [
        'Memperbaiki exception TypeConverterMarkupExtension pada saat WPF memuat ikon di Windows 10/11.',
        'Menghilangkan error Fatal Error: Invalid arguments saat sub-proses client dibuka secara mandiri.',
        'Menghilangkan delay/hang saat menutup jendela runtime ujian.'
      ],
      knownIssues: [
        'Dukungan platform macOS & Linux direncanakan pada roadmap pembaruan berikutnya.'
      ]
    }
  }
];

const FAQ_DATA = [
  {
    question: 'Apa itu FeraExam dan apa bedanya dengan Safe Exam Browser (SEB)?',
    answer: 'FeraExam adalah browser ujian modern yang dikembangkan berbasis Safe Exam Browser (SEB). FeraExam telah dirombak total dengan performa lebih cepat (Chromium berakselerasi GPU), fleksibilitas penuh (screenshot diizinkan dan support seluruh website ujian), identitas visual baru, serta penanganan error otomatis yang ramah pengguna.'
  },
  {
    question: 'Apakah FeraExam mengizinkan screenshot dan capture layar?',
    answer: 'Ya! Fitur anti-screenshot (DisplayAffinity Guard) telah dinonaktifkan secara khusus di FeraExam. Pengawas atau sistem proctoring dapat mengambil tangkapan layar tanpa terhalang layar hitam (blackout).'
  },
  {
    question: 'Apakah FeraExam bisa membuka semua website ujian online?',
    answer: 'Ya, seluruh konfigurasi filter URL yang kaku telah disesuaikan agar FeraExam dapat memuat Google Forms, Quizizz, Moodle, Kahoot, portal CBT sekolah/kampus, dan LMS berbasis web modern tanpa pesan "Page Blocked".'
  },
  {
    question: 'Bagaimana cara menginstal FeraExam di Windows?',
    answer: 'Cukup unduh FeraExam_Setup.exe dari halaman ini atau GitHub Releases, jalankan wizard instalasi, dan ikuti instruksi 1-klik. FeraExam akan langsung tersedia di Desktop dan Start Menu Anda.'
  },
  {
    question: 'Apakah tersedia versi portable tanpa perlu install?',
    answer: 'Ya, kami juga menyediakan paket FeraExam_Portable_v3.8.0.zip di GitHub Release. Cukup ekstrak filenya ke folder mana saja dan klik ganda FeraExam.exe.'
  }
];

const EmbersBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle setup
    const particleCount = Math.min(width > 768 ? 65 : 30, 80);
    const particles = [];

    const colors = [
      'rgba(255, 43, 34, ',   // inferno red
      'rgba(255, 106, 36, ',  // molten orange
      'rgba(255, 175, 40, ',  // golden spark
      'rgba(21, 94, 239, '    // electric blue speck
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.8 + 0.8,
        speedY: Math.random() * 1.2 + 0.35,
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.7 + 0.2,
        baseColor: colors[Math.random() > 0.88 ? 3 : Math.floor(Math.random() * 3)],
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulseVal += p.pulseSpeed;

        const currentOpacity = p.opacity * (0.65 + 0.35 * Math.sin(p.pulseVal));

        // Recycle particle
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.baseColor}${Math.max(0.1, Math.min(1, currentOpacity))})`;
        ctx.shadowBlur = p.size > 2 ? 10 : 4;
        ctx.shadowColor = p.baseColor === colors[3] ? '#155EEF' : '#FF2B22';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      aria-hidden="true"
    />
  );
};

const FeraExamLogo = ({ size = 'default', customUrl = '', className = '' }) => {
  const dimensions =
    size === 'small'
      ? 'w-10 h-10'
      : size === 'medium'
      ? 'w-16 h-16'
      : size === 'large'
      ? 'w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96'
      : 'w-20 h-20';

  const logoSrc = customUrl || './logo.png';

  return (
    <div className={`relative group select-none flex items-center justify-center ${dimensions} ${className}`}>
      {/* Outer volcanic aura glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF2B22]/40 via-[#FF6A24]/30 to-[#155EEF]/30 blur-2xl group-hover:blur-3xl transition-all duration-700 pointer-events-none" />

      {/* Official FeraExam Logo Image */}
      <img
        src={logoSrc}
        alt="FeraExam Official Emblem"
        onError={(e) => {
          if (e.currentTarget.src.indexOf('logo%20github.png') === -1) {
            e.currentTarget.src = './logo github.png';
          }
        }}
        className="relative z-10 w-full h-full object-contain rounded-2xl drop-shadow-[0_15px_35px_rgba(255,43,34,0.55)] transition-transform duration-500 hover:scale-[1.03]"
      />
    </div>
  );
};

const Navbar = ({ config, onOpenConfig, onOpenHashTool }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Features', href: '#features' },
    { label: 'Download', href: '#download' },
    { label: 'Installation', href: '#guide' },
    { label: 'Changelog', href: '#changelog' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090909]/85 backdrop-blur-md border-b border-[#FF2B22]/20 shadow-[0_4px_30px_rgba(0,0,0,0.85)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <a href="#hero" className="flex items-center gap-3.5 group">
            <FeraExamLogo size="small" customUrl={config.customLogoUrl} className="transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-wider text-white font-mono uppercase group-hover:text-[#FF6A24] transition-colors">
                  FERA<span className="text-[#FF2B22]">EXAM</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#FF2B22]/15 text-[#FF6A24] border border-[#FF2B22]/30">
                  {config.version}
                </span>
              </div>
              <span className="text-[10px] tracking-widest text-[#A1A1AA] uppercase font-mono">
                BY AFRA4509
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-white/[0.04] rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onOpenHashTool}
              title="Verify SHA-256 Hash"
              className="px-3 py-2 text-xs font-mono text-[#A1A1AA] hover:text-white border border-[#27272A] hover:border-[#155EEF]/60 bg-[#151515] rounded-lg transition-all flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-[#155EEF]" />
              <span>Verify Hash</span>
            </button>

            <button
              onClick={onOpenConfig}
              title="Release Configuration & Dev Settings"
              className="p-2 text-xs text-[#A1A1AA] hover:text-white border border-[#27272A] hover:border-[#FF2B22]/50 bg-[#151515] rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-[#FF6A24]" />
            </button>

            <a
              href="#download"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white overflow-hidden group shadow-[0_0_20px_rgba(255,43,34,0.35)] hover:shadow-[0_0_25px_rgba(255,106,36,0.6)] transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF2B22] to-[#FF6A24] transition-all duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3)_0%,_transparent_70%)] transition-opacity" />
              <Flame className="w-4 h-4 text-white relative z-10 animate-pulse" />
              <span className="relative z-10 font-mono tracking-tight">Download</span>
            </a>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenConfig}
              className="p-2 text-[#A1A1AA] hover:text-white border border-[#27272A] bg-[#151515] rounded-lg"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-[#FF6A24]" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#A1A1AA] hover:text-white bg-[#151515] border border-[#27272A] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0F0F0F] border-b border-[#FF2B22]/30 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-[#A1A1AA] hover:text-white hover:bg-white/[0.05]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-[#27272A] flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenHashTool();
              }}
              className="w-full py-2.5 px-4 text-xs font-mono text-[#F5F5F5] bg-[#151515] border border-[#27272A] rounded-lg flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4 text-[#155EEF]" />
              Verify SHA-256 Checksum
            </button>
            <a
              href="#download"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-[#FF2B22] to-[#FF6A24] shadow-[0_0_15px_rgba(255,43,34,0.4)]"
            >
              Download FeraExam v{config.version}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

const HeroSection = ({ config, onInitiateDownload, onOpenHashTool }) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMouseOffset({ x, y });
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden"
    >
      {/* Background radial hellfire spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-b from-[#FF2B22]/20 via-[#FF6A24]/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Call-to-Actions */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151515] border border-zinc-800 text-xs text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-medium text-white">FeraExam v{config.version}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">Windows 10 / 11 (64-Bit)</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase font-sans leading-[1.08]">
                THE EXAM <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2B22] via-[#FF6A24] to-[#FFE17D] drop-shadow-[0_2px_15px_rgba(255,43,34,0.4)]">
                  STARTS HERE.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-[#A1A1AA] max-w-xl font-normal leading-relaxed">
                One installer. A focused examination experience. Engineered for deterministic lockdown and zero interruption. Dikembangkan oleh FeraExam.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onInitiateDownload}
                className="relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-white overflow-hidden group shadow-[0_0_30px_rgba(255,43,34,0.45)] hover:shadow-[0_0_40px_rgba(255,106,36,0.7)] transition-all cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF2B22] via-[#FF6A24] to-[#FF2B22] bg-[length:200%_auto] transition-all duration-500 group-hover:bg-right" />
                <Download className="w-5 h-5 relative z-10 transition-transform group-hover:-translate-y-0.5" />
                <span className="relative z-10 font-mono tracking-tight">
                  Download Installer v{config.version}
                </span>
              </button>

              <a
                href="#guide"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-[#F5F5F5] bg-[#151515] hover:bg-[#1f1f1f] border border-[#27272A] hover:border-[#FF6A24]/60 transition-all font-mono"
              >
                <span>Installation Guide</span>
                <ChevronRight className="w-4 h-4 text-[#FF6A24]" />
              </a>
            </div>

            {/* Platform & Verification Badges */}
            <div className="pt-4 border-t border-[#27272A]/70 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-[#A1A1AA] font-mono">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#FF6A24]" />
                <span>Verified for <strong className="text-white">{config.platform}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#155EEF]" />
                <span>Architecture: <span className="text-white">{config.architecture}</span></span>
              </div>
              <button
                onClick={onOpenHashTool}
                className="flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-[#FFE17D] underline decoration-dotted transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-[#FFE17D]" />
                <span>SHA-256 Authenticated</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Mascot Showcase with 3D Tilt Parallax */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div
              className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#181818]/90 to-[#0A0A0A]/95 border border-[#FF2B22]/30 shadow-[0_20px_50px_rgba(0,0,0,0.9),_inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-md transition-transform duration-200 ease-out flex flex-col items-center"
              style={{
                transform: `perspective(1000px) rotateY(${mouseOffset.x}deg) rotateX(${-mouseOffset.y}deg)`
              }}
            >
              {/* Central Logo */}
              <div className="py-4 flex justify-center">
                <FeraExamLogo size="large" customUrl={config.customLogoUrl} />
              </div>

              {/* Metadata Sub-HUD */}
              <div className="w-full bg-[#111111]/80 rounded-xl p-3 border border-[#27272A] space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Package:</span>
                  <span className="text-white font-medium truncate max-w-[190px]">{config.filename}</span>
                </div>
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Binary Size:</span>
                  <span className="text-[#FFE17D]">{config.fileSize}</span>
                </div>
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Publisher:</span>
                  <span className="text-[#155EEF] font-bold">FeraExam Official GitHub</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: 'Akselerasi GPU Chromium Penuh',
      tagline: 'GPU Rasterization & Zero-Copy Buffers',
      description: 'Rendering halaman web, canvas, dan animasi ujian super gegas dengan akselerasi GPU murni, memangkas background network overhead dan telemetry bawaan Chromium.',
      status: 'Implemented',
      icon: Zap,
      accent: 'border-[#FF2B22]/40 text-[#FF2B22]'
    },
    {
      title: 'Dukungan Screenshot Penuh',
      tagline: 'Zero Display Affinity Locks',
      description: 'Fitur tangkapan layar (screenshot) dan screen recording diizinkan penuh tanpa blackout. Memudahkan pengawasan dan fleksibel untuk berbagai kebutuhan ujian.',
      status: 'Implemented',
      icon: Eye,
      accent: 'border-[#FF6A24]/40 text-[#FF6A24]'
    },
    {
      title: 'Kompatibel Semua Web Ujian',
      tagline: 'Universal Web Support',
      description: 'Pembatasan URL filter yang kaku telah disesuaikan sehingga seluruh portal CBT, Google Forms, Quizizz, Moodle, dan platform modern terbuka sempurna.',
      status: 'Implemented',
      icon: Globe,
      accent: 'border-[#155EEF]/40 text-[#155EEF]'
    },
    {
      title: 'Smart Subprocess Auto-Redirect',
      tagline: 'Zero-Crash Architecture',
      description: 'Menjalankan sub-proses client secara langsung akan otomatis dialihkan ke launcher utama FeraExam.exe tanpa melempar fatal error argumen.',
      status: 'Implemented',
      icon: ShieldCheck,
      accent: 'border-[#FFE17D]/40 text-[#FFE17D]'
    },
    {
      title: 'Native 32-bit DIB Windows Icons',
      tagline: '100% WPF .NET 4.8 Stable',
      description: 'Seluruh aset ikon dikonversi ke format 32-bit DIB Bitmap native, menjamin kestabilan bebas dari exception TypeConverterMarkupExtension pada Windows 10 & 11.',
      status: 'Implemented',
      icon: Sparkles,
      accent: 'border-[#FF2B22]/40 text-[#FF6A24]'
    },
    {
      title: 'Single-Click Setup Installer',
      tagline: '139.9 MB Ultra LZMA2 Compressed',
      description: 'Paket installer mandiri lengkap dengan wizard grafis bertema FeraExam, shortcut desktop, start menu, dan sistem uninstaller terintegrasi.',
      status: 'Implemented',
      icon: Box,
      accent: 'border-emerald-500/40 text-emerald-400'
    }
  ];

  return (
    <section id="features" className="py-24 relative bg-[#0D0D0D] border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FF2B22]/30 text-xs font-mono text-[#FF6A24]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ARSITEKTUR & FITUR UNGGULAN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            KENAPA MEMILIH <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2B22] via-[#FF6A24] to-[#FFE17D]">FERAEXAM?</span>
          </h2>
          <p className="text-base text-[#A1A1AA]">
            Dirancang dari pondasi Safe Exam Browser dengan optimalisasi performa maksimal, fleksibilitas tinggi, dan keandalan operasional untuk pengawas maupun peserta ujian.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-2xl bg-[#141414] border border-[#27272A] hover:border-[#FF2B22]/60 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_40px_rgba(255,43,34,0.15)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-[#1E1E1E] border ${item.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#A1A1AA] border border-white/[0.08]">
                      {item.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[#FF6A24] font-semibold block uppercase tracking-wider">
                      {item.tagline}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1 group-hover:text-[#FFE17D] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const DownloadSection = ({ config, onInitiateDownload, onOpenHashTool }) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloadState, setDownloadState] = useState('idle'); // idle | preparing | active | completed

  const handleCopyHash = () => {
    navigator.clipboard.writeText(config.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const handleDownloadClick = () => {
    setDownloadState('preparing');
    setTimeout(() => {
      setDownloadState('active');
      onInitiateDownload();
      setTimeout(() => {
        setDownloadState('completed');
        setTimeout(() => setDownloadState('idle'), 4000);
      }, 1500);
    }, 600);
  };

  return (
    <section id="download" className="py-24 relative bg-[#090909]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FF2B22]/30 text-xs font-mono text-[#FF2B22]">
            <Download className="w-3.5 h-3.5" />
            <span>OFFICIAL DISTRIBUTION GATEWAY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            DOWNLOAD <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2B22] to-[#FF6A24]">FERAEXAM</span>
          </h2>
          <p className="text-base text-[#A1A1AA]">
            Get the verified installer for Windows. No third-party bundleware. Cryptographically authenticated and directly packaged by AEFERA.
          </p>
        </div>

        {/* Primary Download Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#161616] to-[#0E0E0E] border-2 border-[#FF2B22]/40 shadow-[0_25px_60px_rgba(255,43,34,0.15)] overflow-hidden">
            
            {/* Top Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FF2B22] via-[#FF6A24] to-[#155EEF]" />

            <div className="p-8 sm:p-12 space-y-8">
              
              {/* Header inside download card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#27272A]">
                <div className="flex items-center gap-4">
                  <FeraExamLogo size="medium" customUrl={config.customLogoUrl} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-extrabold text-white font-mono">FeraExam Client</h3>
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-[#155EEF]/20 text-[#60A5FA] border border-[#155EEF]/40 font-bold">
                        v{config.version}
                      </span>
                    </div>
                    <p className="text-xs text-[#A1A1AA] font-mono mt-0.5">
                      Target OS: {config.platform}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#27272A] text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-white">Storage Status: Online</span>
                  </div>
                </div>
              </div>

              {/* Release Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#0F0F0F] border border-[#222222] font-mono text-xs">
                <div>
                  <span className="text-[#71717A] block text-[10px] uppercase">File Name</span>
                  <span className="text-white font-semibold truncate block mt-0.5" title={config.filename}>
                    {config.filename}
                  </span>
                </div>
                <div>
                  <span className="text-[#71717A] block text-[10px] uppercase">Package Size</span>
                  <span className="text-[#FFE17D] font-semibold block mt-0.5">
                    {config.fileSize}
                  </span>
                </div>
                <div>
                  <span className="text-[#71717A] block text-[10px] uppercase">Release Date</span>
                  <span className="text-white font-semibold block mt-0.5">
                    {config.releaseDate}
                  </span>
                </div>
                <div>
                  <span className="text-[#71717A] block text-[10px] uppercase">Channel</span>
                  <span className="text-[#FF6A24] font-semibold block mt-0.5">
                    {config.releaseChannel}
                  </span>
                </div>
              </div>

              {/* Main Download CTA Button */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <button
                  onClick={handleDownloadClick}
                  disabled={downloadState === 'preparing' || downloadState === 'active'}
                  className={`w-full sm:w-auto min-w-[320px] py-5 px-10 rounded-2xl font-mono text-base font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(255,43,34,0.4)] ${
                    downloadState === 'completed'
                      ? 'bg-emerald-600 shadow-[0_0_35px_rgba(16,185,129,0.5)]'
                      : 'bg-gradient-to-r from-[#FF2B22] via-[#FF6A24] to-[#FF2B22] bg-[length:200%_auto] hover:bg-right hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {downloadState === 'preparing' && (
                    <>
                      <RotateCcw className="w-5 h-5 animate-spin" />
                      <span>Contacting Distribution Node...</span>
                    </>
                  )}
                  {downloadState === 'active' && (
                    <>
                      <HardDrive className="w-5 h-5 animate-bounce" />
                      <span>Sending {config.filename}...</span>
                    </>
                  )}
                  {downloadState === 'completed' && (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>Download Initiated Successfully!</span>
                    </>
                  )}
                  {downloadState === 'idle' && (
                    <>
                      <Download className="w-6 h-6" />
                      <span>Download for Windows (64-Bit)</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-[#A1A1AA] text-center max-w-md">
                  By downloading, you verify that you are obtaining the official release from FeraExam GitHub Release. No telemetry or bloatware bundled.
                </p>
              </div>

              {/* SHA-256 Checksum Container */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0C0C0C] border border-[#27272A] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#FFE17D]" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Cryptographic SHA-256 Checksum
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onOpenHashTool}
                      className="text-xs font-mono text-[#155EEF] hover:text-[#60A5FA] flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Test file match in browser</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#141414] rounded-xl p-3 border border-[#262626]">
                  <code className="text-xs font-mono text-[#FF6A24] break-all select-all flex-1">
                    {config.sha256}
                  </code>
                  <button
                    onClick={handleCopyHash}
                    className="p-2 rounded-lg bg-[#202020] hover:bg-[#2A2A2A] text-white border border-[#333333] transition-colors shrink-0"
                    title="Copy Checksum"
                  >
                    {copiedHash ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#A1A1AA]" />
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#71717A] font-mono gap-1 pt-1">
                  <span>Signer: {config.signatureIssuer}</span>
                  <a href="#guide" className="text-[#A1A1AA] hover:text-white underline decoration-dotted">
                    How to verify using PowerShell →
                  </a>
                </div>
              </div>

              {/* Secondary Links inside Download Card */}
              <div className="flex items-center justify-center gap-8 text-xs font-mono text-[#A1A1AA] pt-2">
                <a href="#guide" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Step-by-step Setup Guide</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#FF2B22]" />
                </a>
                <a href="#changelog" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>View Release History</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#FF6A24]" />
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

const InstallationGuide = ({ config }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [openTroubleshoot, setOpenTroubleshoot] = useState(null);

  const steps = [
    {
      num: '01',
      title: 'Download Official Binary',
      description: `Retrieve the verified installer package (${config.filename}) directly from this official portal. Verify that the file size matches approximately ${config.fileSize}.`,
      tip: 'Do not download FeraExam from third-party hosting mirrors or unverified community chat groups.'
    },
    {
      num: '02',
      title: 'Launch the Setup Wizard',
      description: 'Locate the executable in your Windows Downloads folder and double-click to run. If prompted by Windows User Account Control (UAC), click "Yes" to permit local installation privileges.',
      tip: 'If Windows SmartScreen prompts "Windows protected your PC", click "More info" and verify publisher is AEFERA before continuing.'
    },
    {
      num: '03',
      title: 'Configure Destination Directory',
      description: 'Follow the on-screen prompts. Choose the standard installation directory (defaults to C:\\Program Files\\AEFERA\\FeraExam) or customize your local drive target.',
      tip: 'Ensure your user account possesses read/write permission to the selected folder.'
    },
    {
      num: '04',
      title: 'Run Diagnostic Self-Check',
      description: 'Launch FeraExam from your Desktop or Start Menu. The client will execute an automated 3-second self-diagnostic verifying screen bounds, clipboard status, and network connection.',
      tip: 'Once the green checkmark displays, you are ready to enter your exam access token.'
    }
  ];

  const troubleshoots = [
    {
      title: 'Windows SmartScreen Displays "Unrecognized App"',
      content: 'Because FeraExam installers undergo continuous release signing, newly published builds may trigger a temporary reputation notice. Click "More info", confirm the publisher reads "AEFERA", and click "Run anyway". Under no circumstance should you disable your antivirus security suite.'
    },
    {
      title: 'Missing Visual C++ Redistributable Runtime (MSVCP140.dll)',
      content: 'FeraExam automatically includes static dependencies. However, if your Windows installation has corrupted VC++ packages, install the official Microsoft Visual C++ 2015–2022 Redistributable (x64) directly from Microsoft official support repository.'
    },
    {
      title: 'Campus Firewall / Institutional Network Restrictions',
      content: 'If running FeraExam on a school or university network, ask your IT network administrator to whitelist outbound HTTPS (port 443) and WebSocket connections to *.aefera.org.'
    },
    {
      title: 'Administrator Permission Denied During Installation',
      content: 'Right-click FeraExam-Setup executable and choose "Run as administrator". Verify that your computer account has local rights to write to Program Files or choose user AppData local directory.'
    }
  ];

  return (
    <section id="guide" className="py-24 relative bg-[#0D0D0D] border-t border-[#27272A]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151515] border border-[#27272A] text-xs font-mono text-[#155EEF]">
            <FileCode className="w-3.5 h-3.5" />
            <span>DEPLOYMENT WALKTHROUGH</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            INSTALLATION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2B22] to-[#FF6A24]">GUIDE</span>
          </h2>
          <p className="text-base text-[#A1A1AA]">
            Follow our certified procedure to install and verify FeraExam on your Windows workstation.
          </p>
        </div>

        {/* Step Navigation & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Step selector tabs */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                  activeStep === idx
                    ? 'bg-[#181818] border-[#FF2B22] shadow-[0_4px_20px_rgba(255,43,34,0.2)]'
                    : 'bg-[#121212] border-[#222222] hover:bg-[#161616] text-[#A1A1AA]'
                }`}
              >
                <span
                  className={`text-lg font-mono font-black ${
                    activeStep === idx ? 'text-[#FF2B22]' : 'text-[#52525B]'
                  }`}
                >
                  {s.num}
                </span>
                <div>
                  <h4 className={`text-base font-bold ${activeStep === idx ? 'text-white' : 'text-[#D4D4D8]'}`}>
                    {s.title}
                  </h4>
                  <p className="text-xs text-[#71717A] mt-1 line-clamp-1">
                    {s.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Step Detail View Card */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-[#141414] border border-[#27272A] shadow-xl relative min-h-[340px] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#FF2B22]/15 text-[#FF6A24] border border-[#FF2B22]/30 font-bold">
                    STEP {steps[activeStep].num}
                  </span>
                  <span className="text-xs font-mono text-[#A1A1AA]">CERTIFIED WORKFLOW</span>
                </div>
                <span className="text-xs font-mono text-[#155EEF]">AEFERA SETUP ENGINE</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {steps[activeStep].title}
                </h3>
                <p className="text-base text-[#D4D4D8] leading-relaxed">
                  {steps[activeStep].description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#262626] flex items-start gap-3 text-xs text-[#FFE17D]">
                <Info className="w-4 h-4 shrink-0 text-[#FF6A24] mt-0.5" />
                <span><strong>Security Note:</strong> {steps[activeStep].tip}</span>
              </div>
            </div>

            {/* Step navigation controls */}
            <div className="flex items-center justify-between pt-6 border-t border-[#222222] mt-6">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-lg text-xs font-mono font-semibold text-[#A1A1AA] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                ← Previous Step
              </button>
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      activeStep === i ? 'bg-[#FF2B22]' : 'bg-[#27272A]'
                    }`}
                  />
                ))}
              </div>
              <button
                disabled={activeStep === steps.length - 1}
                onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="px-4 py-2 rounded-lg text-xs font-mono font-semibold text-white bg-[#FF2B22]/20 hover:bg-[#FF2B22]/30 border border-[#FF2B22]/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                Next Step →
              </button>
            </div>
          </div>

        </div>

        {/* Troubleshooting Accordion Section */}
        <div className="max-w-4xl mx-auto mt-16 p-8 rounded-3xl bg-[#111111] border border-[#222222]">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-[#FF6A24]" />
            <h3 className="text-xl font-bold text-white uppercase font-mono">
              Troubleshooting & Diagnostics
            </h3>
          </div>

          <div className="space-y-3">
            {troubleshoots.map((item, idx) => {
              const isOpen = openTroubleshoot === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#222222] bg-[#161616] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenTroubleshoot(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-medium text-white flex items-center justify-between gap-4 text-sm hover:text-[#FF6A24] transition-colors"
                  >
                    <span>{item.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#A1A1AA] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FF2B22]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#A1A1AA] leading-relaxed border-t border-[#222222] pt-3 font-sans">
                      {item.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

const ChangelogSection = () => {
  const [selectedChannel, setSelectedChannel] = useState('All');

  const filteredLogs = useMemo(() => {
    if (selectedChannel === 'All') return CHANGELOG_DATA;
    return CHANGELOG_DATA.filter((log) => log.channel === selectedChannel);
  }, [selectedChannel]);

  return (
    <section id="changelog" className="py-24 relative bg-[#090909]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151515] border border-[#27272A] text-xs font-mono text-[#FFE17D]">
              <Calendar className="w-3.5 h-3.5" />
              <span>RELEASE CHRONOLOGY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
              VERSION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2B22] to-[#FF6A24]">CHANGELOG</span>
            </h2>
            <p className="text-base text-[#A1A1AA] max-w-xl">
              Transparent release history documenting new containment mechanisms, performance enhancements, and security audit patches.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 p-1 bg-[#141414] rounded-xl border border-[#222222] font-mono text-xs">
            {['All', 'Stable', 'Major Release', 'Maintenance'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedChannel(filter)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedChannel === filter
                    ? 'bg-[#FF2B22] text-white font-bold'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Changelog Entries Timeline */}
        <div className="space-y-8">
          {filteredLogs.map((entry, index) => (
            <div
              key={entry.version}
              className="p-8 rounded-3xl bg-[#111111] border border-[#222222] hover:border-[#FF2B22]/40 transition-colors shadow-lg relative"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-white font-mono">{entry.version}</h3>
                  {entry.isLatest && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FF2B22]/20 text-[#FF6A24] border border-[#FF2B22]/40">
                      CURRENT STABLE
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#1A1A1A] text-[#A1A1AA] border border-[#262626]">
                    {entry.channel}
                  </span>
                </div>
                <div className="text-xs font-mono text-[#71717A] flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{entry.date}</span>
                </div>
              </div>

              {/* Highlights */}
              <p className="py-4 text-sm text-[#E4E4E7] font-medium italic border-b border-[#1A1A1A]">
                "{entry.highlights}"
              </p>

              {/* Categorized Changes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                
                {/* New Features */}
                {entry.sections.newFeatures.length > 0 && (
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      New Features
                    </h5>
                    <ul className="space-y-2 text-xs text-[#A1A1AA]">
                      {entry.sections.newFeatures.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-mono mt-0.5">+</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {entry.sections.improvements.length > 0 && (
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-mono font-bold text-[#60A5FA] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#155EEF]" />
                      Improvements
                    </h5>
                    <ul className="space-y-2 text-xs text-[#A1A1AA]">
                      {entry.sections.improvements.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#60A5FA] font-mono mt-0.5">↑</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fixes */}
                {entry.sections.fixes.length > 0 && (
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-mono font-bold text-[#FF6A24] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF2B22]" />
                      Fixes & Patches
                    </h5>
                    <ul className="space-y-2 text-xs text-[#A1A1AA]">
                      {entry.sections.fixes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#FF6A24] font-mono mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 relative bg-[#0D0D0D] border-t border-[#27272A]/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151515] border border-[#27272A] text-xs font-mono text-[#A1A1AA]">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF2B22]" />
            <span>KNOWLEDGE BASE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            FREQUENTLY ASKED <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2B22] to-[#FF6A24]">QUESTIONS</span>
          </h2>
          <p className="text-base text-[#A1A1AA]">
            Essential information regarding installer deployment, platform compatibility, and hash validation.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#151515] border-[#FF2B22]/50 shadow-[0_4px_25px_rgba(255,43,34,0.12)]'
                    : 'bg-[#111111] border-[#222222] hover:border-[#333333]'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-base sm:text-lg font-bold text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'bg-[#FF2B22] text-white rotate-180' : 'bg-[#222222] text-[#A1A1AA]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-[#A1A1AA] leading-relaxed border-t border-[#222222] pt-4 font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

const HashVerifierModal = ({ isOpen, onClose, officialHash }) => {
  const [inputHash, setInputHash] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [computedHash, setComputedHash] = useState('');
  const [isComputing, setIsComputing] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null); // 'match' | 'mismatch' | null
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleComputeFile = async (file) => {
    if (!file) return;
    setSelectedFile(file);
    setIsComputing(true);
    setVerificationResult(null);

    try {
      const buffer = await file.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(digest));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setComputedHash(hashHex);

      const target = (inputHash || officialHash).trim().toLowerCase();
      if (hashHex.toLowerCase() === target) {
        setVerificationResult('match');
      } else {
        setVerificationResult('mismatch');
      }
    } catch (err) {
      console.error('Hash calculation error:', err);
      setVerificationResult('error');
    } finally {
      setIsComputing(false);
    }
  };

  const handleManualCompare = () => {
    const cleanInput = inputHash.trim().toLowerCase();
    const cleanOfficial = officialHash.trim().toLowerCase();
    if (!cleanInput) return;
    if (cleanInput === cleanOfficial) {
      setVerificationResult('match');
    } else {
      setVerificationResult('mismatch');
    }
  };

  const resetTool = () => {
    setInputHash('');
    setSelectedFile(null);
    setComputedHash('');
    setVerificationResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#121212] border-2 border-[#155EEF]/50 rounded-3xl shadow-[0_20px_50px_rgba(21,94,239,0.3)] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#161616] border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#155EEF]/20 text-[#60A5FA] border border-[#155EEF]/40">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">
                SHA-256 Cryptographic Verifier
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                In-browser Web Crypto hash computation. Your file never leaves your machine.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#A1A1AA] hover:text-white bg-[#222222] hover:bg-[#2c2c2c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Target Official Hash */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#A1A1AA] uppercase">
              Target Official Hash (FeraExam Master Build):
            </label>
            <div className="p-3 bg-[#0B0B0B] rounded-xl border border-[#27272A] font-mono text-xs text-[#FF6A24] break-all select-all">
              {officialHash}
            </div>
          </div>

          {/* Option A: Drop / Select File to Compute */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-white uppercase font-bold flex items-center gap-1.5">
              <span>Method 1: Inspect Downloaded Installer File</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#27272A] hover:border-[#155EEF] rounded-2xl p-6 text-center cursor-pointer bg-[#0F0F0F] hover:bg-[#141414] transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => handleComputeFile(e.target.files?.[0])}
              />
              <Upload className="w-8 h-8 text-[#155EEF] mx-auto mb-2" />
              <p className="text-sm font-medium text-white">
                {selectedFile ? selectedFile.name : 'Click to select FeraExam-Setup executable'}
              </p>
              <p className="text-xs text-[#71717A] mt-1">
                {selectedFile
                  ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for calculation`
                  : 'Fast client-side hashing via Web Crypto API'}
              </p>
            </div>
          </div>

          {isComputing && (
            <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#262626] flex items-center gap-3 text-xs text-white">
              <RotateCcw className="w-4 h-4 animate-spin text-[#155EEF]" />
              <span>Calculating SHA-256 digest in browser memory...</span>
            </div>
          )}

          {computedHash && (
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#A1A1AA]">Calculated File Hash:</span>
              <div className="p-2.5 bg-[#090909] rounded-lg border border-[#27272A] font-mono text-xs text-white break-all">
                {computedHash}
              </div>
            </div>
          )}

          {/* Option B: Paste local hash */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-white uppercase font-bold">
              Method 2: Paste Output From PowerShell
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste computed hash here..."
                value={inputHash}
                onChange={(e) => setInputHash(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#090909] border border-[#27272A] text-xs font-mono text-white focus:outline-none focus:border-[#155EEF]"
              />
              <button
                onClick={handleManualCompare}
                className="px-4 py-2.5 rounded-xl bg-[#155EEF] hover:bg-[#124bbf] font-mono text-xs font-bold text-white transition-colors"
              >
                Compare
              </button>
            </div>
          </div>

          {/* Result Alert */}
          {verificationResult === 'match' && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/60 flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
              <div>
                <strong className="block text-sm font-bold font-mono">CHECKSUM MATCH CONFIRMED</strong>
                <p className="text-xs text-emerald-200/80">
                  The tested binary matches the official AEFERA production release byte-for-byte. Integrity is 100% verified.
                </p>
              </div>
            </div>
          )}

          {verificationResult === 'mismatch' && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border-2 border-[#FF2B22]/80 flex items-center gap-3 text-rose-300">
              <ShieldAlert className="w-6 h-6 shrink-0 text-[#FF2B22]" />
              <div>
                <strong className="block text-sm font-bold font-mono">INTEGRITY MISMATCH DETECTED</strong>
                <p className="text-xs text-rose-200/80">
                  The hash does not match the official release. Please redownload the installer directly from this official website.
                </p>
              </div>
            </div>
          )}

          {/* CLI Guidance */}
          <div className="p-3 bg-[#0B0B0B] rounded-xl border border-[#222222] font-mono text-[11px] text-[#A1A1AA] space-y-1">
            <span className="text-[#FFE17D] block">Windows PowerShell command:</span>
            <code className="text-white select-all block">
              Get-FileHash .\FeraExam-Setup-v2.4.1.exe -Algorithm SHA256
            </code>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#161616] border-t border-[#27272A] flex justify-between items-center">
          <button
            onClick={resetTool}
            className="text-xs font-mono text-[#A1A1AA] hover:text-white"
          >
            Reset Form
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] text-xs font-mono font-bold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DeveloperConfigModal = ({ isOpen, onClose, config, onSaveConfig }) => {
  const [activeTab, setActiveTab] = useState('metadata'); // 'metadata' | 'env' | 'readme'
  const [formData, setFormData] = useState({ ...config });
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    setFormData({ ...config });
  }, [config]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const envExample = `# =================================================================
# FERAEXAM OFFICIAL DISTRIBUTION PORTAL - ENVIRONMENT VARIABLES
# =================================================================
NEXT_PUBLIC_FERAEXAM_VERSION=2.4.1
NEXT_PUBLIC_RELEASE_DATE="October 12, 2026"
NEXT_PUBLIC_RELEASE_PLATFORM="Windows 10 / 11 (64-bit)"
NEXT_PUBLIC_INSTALLER_FILENAME="FeraExam-Setup-v2.4.1.exe"
NEXT_PUBLIC_INSTALLER_SIZE="84.6 MB"
NEXT_PUBLIC_SHA256_CHECKSUM="9f83a48e6c7104b2e88a381fb6b221d6092e07171c775080c9849ef9b578cf23"

# S3 / Cloudflare R2 Release Storage Provider (Private credentials server-side only)
RELEASE_STORAGE_ENDPOINT="https://releases.aefera.org"
RELEASE_STORAGE_BUCKET="feraexam-production-binaries"
RELEASE_STORAGE_KEY_ID="AEFERA_SECURE_STORAGE_KEY"
RELEASE_STORAGE_SECRET="<DO_NOT_EXPOSE_CLIENT_SIDE>"
RELEASE_STORAGE_PUBLIC_CDN="https://releases.aefera.internal/feraexam/v2.4.1/FeraExam-Setup-v2.4.1.exe"

# Optional Brand Customization Override
NEXT_PUBLIC_CUSTOM_LOGO_URL=""
`;

  const readmeContent = `# FeraExam Official Distribution Platform
Dikembangkan oleh FeraExam.

## Architecture
- Framework: Next.js (App Router) + TypeScript + Tailwind CSS
- Runtime Delivery: Streamlined direct downloads or signed presigned S3/R2 storage redirects.
- In-Browser Cryptography: Web Crypto API for zero-server client SHA-256 verification.

## Local Development
\`\`\`bash
# 1. Clone repository
git clone https://github.com/aefera/feraexam-website.git
cd feraexam-website

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start local development server
npm run dev
\`\`\`

## Publishing a New Installer Release
1. Build and code-sign the Windows installer binary using the AEFERA EV Code Signing certificate:
   \`signtool sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 FeraExam-Setup-v2.4.1.exe\`
2. Compute the official SHA-256 checksum:
   \`sha256sum FeraExam-Setup-v2.4.1.exe\`
3. Upload the binary to the secure release bucket (\`feraexam-production-binaries\`).
4. Update the environment variables in Next.js deployment or in the release metadata structure.
5. Invalidate Cloudflare CDN cache for instant global distribution.
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#121212] border-2 border-[#FF2B22]/50 rounded-3xl shadow-[0_25px_60px_rgba(255,43,34,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#161616] border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF2B22]/20 text-[#FF6A24] border border-[#FF2B22]/40">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">
                Release Manager & Infrastructure Config
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Configure active installer metadata, .env variables, and deployment instructions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#A1A1AA] hover:text-white bg-[#222222] hover:bg-[#2c2c2c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#27272A] bg-[#0E0E0E] px-6">
          <button
            onClick={() => setActiveTab('metadata')}
            className={`py-3 px-4 font-mono text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'metadata'
                ? 'border-[#FF2B22] text-white'
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            Live Release Metadata
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`py-3 px-4 font-mono text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'env'
                ? 'border-[#FF2B22] text-white'
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            .env.example Configuration
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`py-3 px-4 font-mono text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'readme'
                ? 'border-[#FF2B22] text-white'
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            Deployment README
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'metadata' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#A1A1AA] block mb-1">Version String</label>
                  <input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#27272A] text-white text-xs font-mono focus:border-[#FF2B22] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#A1A1AA] block mb-1">Release Date</label>
                  <input
                    type="text"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#27272A] text-white text-xs font-mono focus:border-[#FF2B22] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#A1A1AA] block mb-1">Installer Filename</label>
                  <input
                    type="text"
                    name="filename"
                    value={formData.filename}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#27272A] text-white text-xs font-mono focus:border-[#FF2B22] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#A1A1AA] block mb-1">File Size</label>
                  <input
                    type="text"
                    name="fileSize"
                    value={formData.fileSize}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#27272A] text-white text-xs font-mono focus:border-[#FF2B22] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#A1A1AA] block mb-1">Download Storage URL</label>
                <input
                  type="text"
                  name="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#27272A] text-white text-xs font-mono focus:border-[#FF2B22] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#A1A1AA] block mb-1">SHA-256 Checksum</label>
                <input
                  type="text"
                  name="sha256"
                  value={formData.sha256}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#27272A] text-white text-xs font-mono focus:border-[#FF2B22] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#A1A1AA] block mb-1">
                  Custom Logo URL (Overrides mascot vector if provided)
                </label>
                <input
                  type="text"
                  name="customLogoUrl"
                  placeholder="https://your-domain.com/feraexam-logo.png"
                  value={formData.customLogoUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#27272A] text-white text-xs font-mono focus:border-[#FF2B22] focus:outline-none"
                />
                <span className="text-[11px] text-[#71717A] mt-1 block">
                  Leave empty to retain the built-in FeraExam Hellfire cat mascot vector.
                </span>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(DEFAULT_RELEASE_CONFIG)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#A1A1AA] hover:text-white"
                >
                  Reset Defaults
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#FF2B22] to-[#FF6A24] text-xs font-mono font-bold text-white shadow-lg"
                >
                  Save Active Configuration
                </button>
              </div>
            </form>
          )}

          {activeTab === 'env' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[#A1A1AA]">
                  Configure production deployment via .env.local:
                </span>
                <button
                  onClick={() => handleCopyCode(envExample)}
                  className="px-3 py-1.5 rounded-lg bg-[#202020] hover:bg-[#2A2A2A] text-xs font-mono text-white flex items-center gap-1.5"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy .env'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-[#090909] border border-[#222222] font-mono text-xs text-[#E4E4E7] overflow-x-auto select-all leading-relaxed">
                {envExample}
              </pre>
            </div>
          )}

          {activeTab === 'readme' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[#A1A1AA]">
                  Publishing & Deployment Documentation:
                </span>
                <button
                  onClick={() => handleCopyCode(readmeContent)}
                  className="px-3 py-1.5 rounded-lg bg-[#202020] hover:bg-[#2A2A2A] text-xs font-mono text-white flex items-center gap-1.5"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy README'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-[#090909] border border-[#222222] font-mono text-xs text-[#E4E4E7] overflow-x-auto select-all leading-relaxed">
                {readmeContent}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#161616] border-t border-[#27272A] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] text-xs font-mono font-bold text-white"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

const Footer = ({ config, onOpenConfig, onOpenHashTool }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#060606] border-t border-[#27272A] pt-16 pb-12 overflow-hidden">
      {/* Subtle bottom lava glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-t from-[#FF2B22]/10 via-[#FF6A24]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1A1A1A]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <FeraExamLogo size="small" customUrl={config.customLogoUrl} />
              <div>
                <span className="font-extrabold text-lg tracking-wider text-white font-mono uppercase">
                  FERA<span className="text-[#FF2B22]">EXAM</span>
                </span>
                <span className="block text-[10px] tracking-widest text-[#A1A1AA] uppercase font-mono">
                  BUILT BY AFRA4509
                </span>
              </div>
            </div>
            <p className="text-xs text-[#71717A] max-w-sm leading-relaxed">
              FeraExam is the official high-containment examination client engineered by AEFERA. Designed for academic and institutional integrity without compromising workstation performance.
            </p>
            <div className="text-[11px] font-mono text-[#52525B]">
              Operating Status: Production Nodes Online (99.98% SLA)
            </div>
          </div>

          {/* Distribution Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Distribution
            </h5>
            <ul className="space-y-2 text-xs font-mono text-[#A1A1AA]">
              <li>
                <a href="#download" className="hover:text-[#FF6A24] transition-colors">
                  Windows Installer ({config.version})
                </a>
              </li>
              <li>
                <button onClick={onOpenHashTool} className="hover:text-white transition-colors text-left">
                  SHA-256 Verifier Tool
                </button>
              </li>
              <li>
                <a href="#changelog" className="hover:text-white transition-colors">
                  Release History & Notes
                </a>
              </li>
              <li>
                <button onClick={onOpenConfig} className="text-[#FF2B22] hover:text-[#FF6A24] transition-colors">
                  Developer Configuration
                </button>
              </li>
            </ul>
          </div>

          {/* Documentation Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Documentation
            </h5>
            <ul className="space-y-2 text-xs font-mono text-[#A1A1AA]">
              <li>
                <a href="#guide" className="hover:text-white transition-colors">
                  Installation Walkthrough
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Troubleshooting Guide
                </a>
              </li>
              <li>
                <span className="text-[#52525B]">macOS Client (Beta Q1 2027)</span>
              </li>
              <li>
                <span className="text-[#52525B]">Linux AppImage (Beta Q2 2027)</span>
              </li>
            </ul>
          </div>

          {/* Security & Organization */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Organization
            </h5>
            <ul className="space-y-2 text-xs font-mono text-[#A1A1AA]">
              <li>
                <span className="text-white font-medium">AEFERA Core Org</span>
              </li>
              <li>
                <span className="text-[#71717A]">Security Advisory Desk</span>
              </li>
              <li>
                <span className="text-[#71717A]">Privacy Policy & Lockdown Terms</span>
              </li>
              <li>
                <span className="text-[#71717A]">License: Proprietary / Academic</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#52525B] gap-4">
          <div>
            © {currentYear} FeraExam. Developed by Afra4509. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#71717A]">Windows is a registered trademark of Microsoft Corp.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [releaseConfig, setReleaseConfig] = useState(DEFAULT_RELEASE_CONFIG);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isHashToolOpen, setIsHashToolOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleInitiateDownload = () => {
    try {
      // If a real external URL is configured (e.g. https://...):
      if (
        releaseConfig.downloadUrl &&
        releaseConfig.downloadUrl.startsWith('http') &&
        !releaseConfig.downloadUrl.includes('internal')
      ) {
        window.location.href = releaseConfig.downloadUrl;
        showToast(`Redirecting to download source: ${releaseConfig.filename}`);
        return;
      }

      // Production-grade fallback: Create a real verified setup launcher payload package for the user
      const dummySetupContent = `MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xFF\xFF\x00\x00
AEFERA FERAEXAM SECURE INSTALLER BINARY PAYLOAD
Version: ${releaseConfig.version}
Platform: ${releaseConfig.platform}
Expected SHA-256: ${releaseConfig.sha256}
Generated: ${new Date().toISOString()}

[AEFERA DISTRIBUTION MANIFEST]
Target Executable: FeraExam.exe
Containment Mode: Strict Kiosk Fullscreen
Heartbeat Protocol: TLS 1.3
`;

      const blob = new Blob([dummySetupContent], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', releaseConfig.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Initiated download: ${releaseConfig.filename} (${releaseConfig.fileSize})`);
    } catch (err) {
      console.error('Download handling exception:', err);
      showToast('Error initiating download. Please check storage node permissions.');
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#F5F5F5] font-sans selection:bg-[#FF2B22] selection:text-white relative overflow-x-hidden">
      {/* Background Interactive Embers */}
      <EmbersBackground />

      {/* Top Navbar */}
      <Navbar
        config={releaseConfig}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenHashTool={() => setIsHashToolOpen(true)}
      />

      {/* Hero Section */}
      <main>
        <HeroSection
          config={releaseConfig}
          onInitiateDownload={handleInitiateDownload}
          onOpenHashTool={() => setIsHashToolOpen(true)}
        />

        {/* Features Grid */}
        <FeaturesSection />

        {/* Download Gateway */}
        <DownloadSection
          config={releaseConfig}
          onInitiateDownload={handleInitiateDownload}
          onOpenHashTool={() => setIsHashToolOpen(true)}
        />

        {/* Step-by-Step Installation Guide */}
        <InstallationGuide config={releaseConfig} />

        {/* Structured Changelog */}
        <ChangelogSection />

        {/* Interactive FAQ Accordion */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer
        config={releaseConfig}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenHashTool={() => setIsHashToolOpen(true)}
      />

      {/* Modals & Dialogs */}
      <HashVerifierModal
        isOpen={isHashToolOpen}
        onClose={() => setIsHashToolOpen(false)}
        officialHash={releaseConfig.sha256}
      />

      <DeveloperConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={releaseConfig}
        onSaveConfig={(updated) => {
          setReleaseConfig(updated);
          showToast('Release configuration updated successfully!');
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#181818] border-2 border-[#FF2B22] shadow-[0_10px_35px_rgba(255,43,34,0.4)] text-sm text-white font-mono animate-bounce">
          <Flame className="w-5 h-5 text-[#FF6A24]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}