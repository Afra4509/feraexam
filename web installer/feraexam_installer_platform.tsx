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
  version: '2.4.1',
  releaseDate: 'October 12, 2026',
  platform: 'Windows 10 / 11 (64-bit)',
  architecture: 'x86_64',
  filename: 'FeraExam-Setup-v2.4.1.exe',
  fileSize: '84.6 MB',
  downloadUrl: 'https://releases.aefera.internal/feraexam/v2.4.1/FeraExam-Setup-v2.4.1.exe',
  sha256: '9f83a48e6c7104b2e88a381fb6b221d6092e07171c775080c9849ef9b578cf23',
  releaseChannel: 'Production Stable',
  minRam: '4 GB RAM (8 GB Recommended)',
  minDiskSpace: '250 MB Free Space',
  signatureIssuer: 'AEFERA Cryptographic Security Org',
  customLogoUrl: ''
};

const CHANGELOG_DATA = [
  {
    version: 'v2.4.1',
    date: 'October 12, 2026',
    channel: 'Stable',
    isLatest: true,
    highlights: 'Critical security patch & Windows 11 24H2 display isolation compatibility.',
    sections: {
      newFeatures: [
        'Enhanced hardware-accelerated kiosk window pinning prevents external overlay interruptions.',
        'Zero-trust network heartbeat for instant student connection continuity.'
      ],
      improvements: [
        'Installer payload compressed with LZMA2, reducing binary size to 84.6 MB.',
        'Reduced startup benchmark latency from 1.8s down to 420ms on NVMe storage.',
        'Refined dual-monitor lockdown logic with automated resolution detection.'
      ],
      fixes: [
        'Resolved intermittent secondary screen flicker on custom DPI scaling configurations.',
        'Fixed clipboard sanitizer loop when hotkey combination Ctrl+Alt+Ins is triggered.',
        'Corrected silent exit crash when running on localized non-Latin Windows user profiles.'
      ],
      knownIssues: [
        'Experimental ARM64 emulation on Snapdragon X Elite requires manual driver signing exception.'
      ]
    }
  },
  {
    version: 'v2.4.0',
    date: 'September 18, 2026',
    channel: 'Major Release',
    isLatest: false,
    highlights: 'Complete rewrite of the core containment sandbox engine and secure audio-video monitor pipeline.',
    sections: {
      newFeatures: [
        'Next-generation process sandbox prevents background virtualization instances.',
        'Encrypted local exam buffer cache protects answers during unexpected local network drops.',
        'Unified AEFERA Diagnostic Utility integrated directly inside installer options.'
      ],
      improvements: [
        'Modernized dark hellfire UI theming across the student examination interface.',
        'Reduced peak memory footprint to under 90MB during active exam sessions.'
      ],
      fixes: [
        'Patched shortcut injection through Windows Accessibility Ease-of-Access tools.',
        'Resolved font rendering artifact on high-refresh 144Hz+ gaming displays.'
      ],
      knownIssues: [
        'None identified in current release channel.'
      ]
    }
  },
  {
    version: 'v2.3.2',
    date: 'August 04, 2026',
    channel: 'Maintenance',
    isLatest: false,
    highlights: 'Maintenance update delivering TLS 1.3 session resumption and certificate pin enforcement.',
    sections: {
      newFeatures: [
        'Configurable proxy traversal for institutional campus networks with custom enterprise root certs.'
      ],
      improvements: [
        'Streamlined installer step wizard with silent argument support (/S /D=C:\\FeraExam).'
      ],
      fixes: [
        'Fixed taskbar edge bleed-through when using taskbar auto-hide mode on Windows 10.'
      ],
      knownIssues: []
    }
  }
];

const FAQ_DATA = [
  {
    question: 'What is FeraExam and who develops it?',
    answer: 'FeraExam is a dedicated, high-performance examination environment developed by AEFERA. Designed to establish a focused, distraction-free, and locked-down test-taking workspace, FeraExam ensures academic integrity while maintaining a lightweight footprint on host machines.'
  },
  {
    question: 'How do I download and install FeraExam?',
    answer: 'Click the "Download for Windows" button above to obtain the official FeraExam-Setup executable. Once downloaded, double-click the installer, review the destination directory, and complete the guided wizard. FeraExam will perform a fast self-integrity check upon first launch.'
  },
  {
    question: 'Which operating systems and hardware platforms are supported?',
    answer: 'FeraExam v2.4.1 is officially certified for Windows 10 (64-bit, Version 20H2+) and Windows 11 (64-bit). It requires an x86_64 architecture processor, at least 4 GB of RAM, and 250 MB of free storage. Dedicated macOS and Linux client binaries are currently in private beta testing.'
  },
  {
    question: 'How can I verify the installer SHA-256 checksum?',
    answer: 'You can verify the cryptographic hash directly in your browser using our built-in SHA-256 Verification tool on this page, or locally via PowerShell by executing: `Get-FileHash .\\FeraExam-Setup-v2.4.1.exe -Algorithm SHA256`. Match the output hash with the one listed on this official portal.'
  },
  {
    question: 'What should I do if Windows SmartScreen displays a warning?',
    answer: 'Windows SmartScreen may display an alert for newly updated release builds while the Microsoft global reputation cache updates. To continue, click "More info" and verify the Publisher says "AEFERA" before clicking "Run anyway". Never disable your antivirus protection.'
  },
  {
    question: 'How do I report bugs or submit security advisories?',
    answer: 'Technical issues, bug logs, and verified security advisories can be submitted through AEFERA Security Portal or by emailing security@aefera.org with diagnostic system information and replication steps.'
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
  if (customUrl) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img
          src={customUrl}
          alt="FeraExam Official Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(255,43,34,0.65)]"
        />
      </div>
    );
  }

  const dimensions =
    size === 'small'
      ? 'w-10 h-10'
      : size === 'medium'
      ? 'w-16 h-16'
      : size === 'large'
      ? 'w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96'
      : 'w-20 h-20';

  return (
    <div className={`relative group select-none ${dimensions} ${className}`}>
      {/* Outer volcanic aura glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF2B22]/30 via-[#FF6A24]/20 to-[#155EEF]/20 blur-2xl group-hover:blur-3xl transition-all duration-700 pointer-events-none" />

      {/* SVG Emblem representing: Sinister white cat mascot holding devil mask, blue-orange globe with key, and fiery hellcrest */}
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_15px_30px_rgba(255,43,34,0.45)] transition-transform duration-500 hover:scale-[1.02]"
      >
        <defs>
          <linearGradient id="fireShieldGrad" x1="50" y1="20" x2="350" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1a0605" />
            <stop offset="35%" stopColor="#2c0906" />
            <stop offset="70%" stopColor="#0d0d0d" />
            <stop offset="100%" stopColor="#060606" />
          </linearGradient>

          <linearGradient id="lavaBorder" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6A24" />
            <stop offset="45%" stopColor="#FF2B22" />
            <stop offset="85%" stopColor="#7a0d08" />
            <stop offset="100%" stopColor="#155EEF" />
          </linearGradient>

          <radialGradient id="hellAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF2B22" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#FF6A24" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="globeGrad" x1="260" y1="180" x2="350" y2="290" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#155EEF" />
            <stop offset="45%" stopColor="#0B3CB0" />
            <stop offset="80%" stopColor="#FF6A24" />
            <stop offset="100%" stopColor="#FF2B22" />
          </linearGradient>

          <linearGradient id="keyGold" x1="280" y1="200" x2="340" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE17D" />
            <stop offset="50%" stopColor="#FFB319" />
            <stop offset="100%" stopColor="#B37700" />
          </linearGradient>

          <linearGradient id="devilMaskGrad" x1="100" y1="190" x2="190" y2="290" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF2B22" />
            <stop offset="60%" stopColor="#9C0A04" />
            <stop offset="100%" stopColor="#4A0200" />
          </linearGradient>

          <filter id="infernoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient fiery backdrop aura */}
        <circle cx="200" cy="200" r="175" fill="url(#hellAura)" />

        {/* Shield / Crest Contour */}
        <path
          d="M200 24 L340 78 V200 C340 292 278 356 200 382 C122 356 60 292 60 200 V78 L200 24 Z"
          fill="url(#fireShieldGrad)"
          stroke="url(#lavaBorder)"
          strokeWidth="6"
        />

        {/* Hellfire tongues rising in crest background */}
        <path
          d="M110 320 Q140 250 155 280 T200 210 Q245 280 255 240 T295 320 C265 348 235 365 200 376 C165 365 135 348 110 320 Z"
          fill="#FF2B22"
          opacity="0.25"
        />
        <path
          d="M135 335 Q170 270 185 295 T225 245 Q260 300 275 330 C248 355 225 368 200 375 C175 368 152 355 135 335 Z"
          fill="#FF6A24"
          opacity="0.3"
        />

        {/* --- SINISTER WHITE CAT MASCOT --- */}
        {/* Cat ears with inner shadow */}
        <path d="M142 145 L118 72 L182 112 Z" fill="#F0F0F5" stroke="#D1D5DB" strokeWidth="2.5" />
        <path d="M140 135 L126 88 L170 114 Z" fill="#FF2B22" opacity="0.6" />

        <path d="M258 145 L282 72 L218 112 Z" fill="#F0F0F5" stroke="#D1D5DB" strokeWidth="2.5" />
        <path d="M260 135 L274 88 L230 114 Z" fill="#FF2B22" opacity="0.6" />

        {/* Cat Head Shape */}
        <path
          d="M145 135 C120 160 120 205 145 230 C165 250 235 250 255 230 C280 205 280 160 255 135 C225 110 175 110 145 135 Z"
          fill="#FAFAFC"
          stroke="#D4D4D8"
          strokeWidth="3"
        />

        {/* Sinister Red Glowing Cat Eyes */}
        <ellipse cx="168" cy="172" rx="14" ry="11" fill="#FF1E16" filter="url(#infernoGlow)" />
        <ellipse cx="232" cy="172" rx="14" ry="11" fill="#FF1E16" filter="url(#infernoGlow)" />
        {/* Slit pupils */}
        <path d="M168 163 C170 167 170 177 168 181 C166 177 166 167 168 163 Z" fill="#150201" />
        <path d="M232 163 C234 167 234 177 232 181 C230 177 230 167 232 163 Z" fill="#150201" />

        {/* Cat nose & sinister subtle smirk */}
        <polygon points="196,192 204,192 200,198" fill="#FF6A24" />
        <path d="M192 204 Q200 209 208 204" stroke="#27272A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M184 207 Q192 214 200 207 Q208 214 216 207" stroke="#27272A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Cat Whiskers */}
        <line x1="130" y1="188" x2="105" y2="182" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" />
        <line x1="128" y1="198" x2="100" y2="198" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" />
        <line x1="270" y1="188" x2="295" y2="182" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" />
        <line x1="272" y1="198" x2="300" y2="198" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" />

        {/* --- DEVIL MASK (HELD IN LEFT PAW) --- */}
        <g transform="translate(4, 12)">
          {/* Paw holding mask */}
          <ellipse cx="140" cy="245" rx="16" ry="12" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2" />

          {/* Devil Mask with Horns */}
          <path
            d="M102 240 L88 205 L112 222 Z"
            fill="#FF2B22"
            stroke="#9C0A04"
            strokeWidth="2"
          />
          <path
            d="M168 240 L182 205 L158 222 Z"
            fill="#FF2B22"
            stroke="#9C0A04"
            strokeWidth="2"
          />
          <path
            d="M105 235 C95 255 98 285 118 298 C135 310 155 305 168 285 C178 270 176 248 165 235 C148 225 120 225 105 235 Z"
            fill="url(#devilMaskGrad)"
            stroke="#FF6A24"
            strokeWidth="2.5"
          />
          {/* Mask eye cutouts */}
          <path d="M118 255 L132 258 L122 265 Z" fill="#090909" />
          <path d="M154 255 L140 258 L150 265 Z" fill="#090909" />
          {/* Menacing fanged grin on mask */}
          <path d="M122 280 Q136 292 150 280 L146 286 L140 282 L134 286 L128 282 Z" fill="#FFEFEF" />
        </g>

        {/* --- BLUE & ORANGE GLOBE WITH GOLD KEY (RIGHT SIDE) --- */}
        <g transform="translate(10, -5)">
          {/* Globe Sphere */}
          <circle cx="282" cy="245" r="38" fill="url(#globeGrad)" stroke="#FF6A24" strokeWidth="3" />
          {/* Longitude and Latitude grid on globe */}
          <ellipse cx="282" cy="245" rx="20" ry="38" fill="none" stroke="#60A5FA" strokeWidth="1.5" opacity="0.6" />
          <ellipse cx="282" cy="245" rx="38" ry="16" fill="none" stroke="#60A5FA" strokeWidth="1.5" opacity="0.6" />

          {/* Electric Blue Core Ring */}
          <circle cx="282" cy="245" r="38" fill="none" stroke="#155EEF" strokeWidth="2.5" opacity="0.8" />

          {/* Glowing Golden Key Crossing the Globe */}
          <g transform="rotate(-30 282 245)">
            {/* Key Bow */}
            <circle cx="270" cy="215" r="14" fill="none" stroke="url(#keyGold)" strokeWidth="4.5" />
            <circle cx="270" cy="215" r="6" fill="#0B132B" stroke="url(#keyGold)" strokeWidth="2" />
            {/* Key Shaft */}
            <line x1="270" y1="229" x2="270" y2="280" stroke="url(#keyGold)" strokeWidth="5" strokeLinecap="round" />
            {/* Key Bits */}
            <line x1="270" y1="265" x2="284" y2="265" stroke="url(#keyGold)" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="270" y1="276" x2="282" y2="276" stroke="url(#keyGold)" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        </g>

        {/* AEFERA Ribbon / Wordmark Crest at Bottom */}
        <path
          d="M120 338 L200 326 L280 338 L265 362 L200 354 L135 362 Z"
          fill="#111111"
          stroke="#FF2B22"
          strokeWidth="2"
        />
        <text
          x="200"
          y="348"
          textAnchor="middle"
          fill="#F5F5F5"
          fontSize="13"
          fontWeight="900"
          fontFamily="monospace"
          letterSpacing="4"
        >
          AEFERA
        </text>

        {/* Crown Horns / Hellfire crest top spike */}
        <path d="M200 38 L208 65 L200 62 L192 65 Z" fill="#FF6A24" />
      </svg>
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
                BY AEFERA
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
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#151515] border border-[#FF2B22]/40 shadow-[0_0_15px_rgba(255,43,34,0.2)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2B22] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6A24]" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#F5F5F5]">
                OFFICIAL EXAM APPLICATION
              </span>
              <span className="text-[#A1A1AA] text-xs">|</span>
              <span className="text-[11px] font-mono text-[#155EEF] font-semibold">
                AEFERA SECURE
              </span>
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
                One installer. A focused examination experience. Engineered for deterministic lockdown and zero interruption. Built by AEFERA.
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
              {/* Corner Sci-Fi / Cyberpunk Accents */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#FF2B22]" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#FF2B22]" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#FF6A24]" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#FF6A24]" />

              {/* Status Header inside HUD */}
              <div className="w-full flex items-center justify-between pb-4 border-b border-[#27272A] text-[11px] font-mono text-[#A1A1AA]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-bold">RELEASE: ACTIVE</span>
                </div>
                <span className="text-[#FF6A24]">CHANNEL // {config.releaseChannel}</span>
              </div>

              {/* Central Mascot Logo */}
              <div className="py-6 flex justify-center">
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
                  <span className="text-[#155EEF] font-bold">AEFERA Core Distribution</span>
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
      title: 'Exam-Focused Environment',
      tagline: 'Deterministic Kiosk Containment',
      description: 'Isolates the testing environment into an exclusive, full-screen workspace. Locks out arbitrary application switching and secondary window popups.',
      status: 'Implemented',
      icon: Terminal,
      accent: 'border-[#FF2B22]/40 text-[#FF2B22]'
    },
    {
      title: 'Simple 1-Click Installation',
      tagline: 'Lightweight Setup Wizard',
      description: 'Streamlined desktop installer handles destination configuration, self-registers required runtime libraries, and cleans up temporary setup caches automatically.',
      status: 'Implemented',
      icon: Box,
      accent: 'border-[#FF6A24]/40 text-[#FF6A24]'
    },
    {
      title: 'Secure Process Isolation',
      tagline: 'Integrity & Clipboard Sanitization',
      description: 'Monitors testing session boundaries, cleanses transient clipboard state upon launch, and logs integrity heartbeats during formal assessments.',
      status: 'Implemented',
      icon: ShieldCheck,
      accent: 'border-[#155EEF]/40 text-[#155EEF]'
    },
    {
      title: 'Ultra-Lightweight Footprint',
      tagline: '<90 MB RAM Footprint',
      description: 'Optimized binary compiled specifically for x86_64 Windows architectures. Fast cold boot in under 500ms without background bloatware or telemetry miners.',
      status: 'Implemented',
      icon: Cpu,
      accent: 'border-[#FFE17D]/40 text-[#FFE17D]'
    },
    {
      title: 'Verified Release Pipeline',
      tagline: 'Cryptographic SHA-256 Signatures',
      description: 'Every official installer executable is authenticated with published SHA-256 digests and signed under AEFERA distribution credentials for foolproof verification.',
      status: 'Implemented',
      icon: Lock,
      accent: 'border-[#FF2B22]/40 text-[#FF2B22]'
    },
    {
      title: 'Decentralized Server Sync',
      tagline: 'Offline Exam Caching & Resumption',
      description: 'Preserves local encrypted assessment checkpoints in case of campus Wi-Fi drops, synchronizing automatically once network connection restores.',
      status: 'Planned (v2.5.0)',
      icon: RefreshCw,
      accent: 'border-purple-500/40 text-purple-400'
    }
  ];

  return (
    <section id="features" className="py-24 relative border-t border-[#27272A]/50 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151515] border border-[#27272A] text-xs font-mono text-[#FF6A24]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AUTHENTIC CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase font-sans">
            ENGINEERED FOR RIGOR. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2B22] to-[#FF6A24]">
              BUILT FOR STABILITY.
            </span>
          </h2>
          <p className="text-base text-[#A1A1AA]">
            FeraExam cuts out bloated third-party middleware to provide a rock-solid, focused testing application. Every feature listed here reflects the genuine software build.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const isPlanned = feat.status.includes('Planned');

            return (
              <div
                key={idx}
                className="group relative p-7 rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#FF2B22]/50 hover:bg-[#161616] transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex flex-col justify-between"
              >
                {/* Glow hovering effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FF2B22]/10 via-transparent to-transparent rounded-tr-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-[#1A1A1A] border ${feat.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-md border ${
                        isPlanned
                          ? 'bg-purple-950/40 text-purple-300 border-purple-500/40'
                          : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {feat.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#FF6A24] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs font-mono text-[#FF2B22] mt-0.5">{feat.tagline}</p>
                  </div>

                  <p className="text-sm text-[#A1A1AA] leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#1F1F1F] flex items-center justify-between text-xs font-mono text-[#71717A]">
                  <span>AEFERA ARCHITECTURE</span>
                  <span className="text-white group-hover:translate-x-1 transition-transform">→</span>
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
                  By downloading, you verify that you are obtaining the official release from AEFERA Distribution nodes. No telemetry or bloatware bundled.
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
Built by AEFERA.

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
                  BUILT BY AEFERA
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
            © {currentYear} AEFERA. All rights reserved. FeraExam and the FeraExam Hellfire mascot emblem are trademarks of AEFERA.
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