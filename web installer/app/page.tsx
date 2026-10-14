'use client';

import dynamic from 'next/dynamic';

const FeraExamPlatform = dynamic(() => import('../feraexam_installer_platform'), {
  ssr: false,
});

export default function Home() {
  return <FeraExamPlatform />;
}
