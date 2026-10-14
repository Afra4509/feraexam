import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FeraExam v3.8.0 - Modern Safe Exam Browser',
  description:
    'Download installer resmi FeraExam v3.8.0 untuk Windows 10 & 11 (64-Bit). Akselerasi GPU Chromium, izin screenshot penuh, dan siap untuk semua platform ujian web.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-[#050505] text-[#ededed] antialiased">
        {children}
      </body>
    </html>
  );
}
