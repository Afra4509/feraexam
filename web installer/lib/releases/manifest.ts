import { ReleaseItem, isTrustedDownloadUrl } from '@/lib/validation/releases';

function parseNullableInt(val: string | undefined, fallback: number | null): number | null {
    if (!val) return fallback;
    const parsed = Number.parseInt(val, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseSha256(val: string | undefined): string | null {
    if (!val) return null;
    const clean = val.trim().toLowerCase();
    return /^[a-f0-9]{64}$/.test(clean) ? clean : null;
}

export function getPublishedReleases(): ReleaseItem[] {
    const rawDownloadUrl =
        process.env.FERAEXAM_WIN64_DOWNLOAD_URL ??
        'https://github.com/Afra4509/feraexam/releases/download/v3.8.0/FeraExam_Setup.exe';

    const rawPortableUrl =
        process.env.FERAEXAM_PORTABLE_DOWNLOAD_URL ??
        'https://github.com/Afra4509/feraexam/releases/download/v3.8.0/FeraExam_Portable_v3.8.0.zip';

    const v380: ReleaseItem = {
        version: process.env.FERAEXAM_RELEASE_VERSION || 'v3.8.0',
        channel: 'stable',
        platform: 'windows',
        architecture: 'x64',
        filename: process.env.FERAEXAM_WIN64_FILENAME || 'FeraExam_Setup.exe',
        sizeBytes: parseNullableInt(process.env.FERAEXAM_WIN64_SIZE_BYTES, 146695680),
        sha256: parseSha256(process.env.FERAEXAM_WIN64_SHA256),
        releaseDate: process.env.FERAEXAM_RELEASE_DATE || '2026-10-13T00:00:00Z',
        downloadUrl: isTrustedDownloadUrl(rawDownloadUrl) ? rawDownloadUrl : null,
        portableFilename: process.env.FERAEXAM_PORTABLE_FILENAME || 'FeraExam_Portable_v3.8.0.zip',
        portableSizeBytes: parseNullableInt(process.env.FERAEXAM_PORTABLE_SIZE_BYTES, 209190912),
        portableDownloadUrl: isTrustedDownloadUrl(rawPortableUrl) ? rawPortableUrl : null,
        releaseNotes: [
            'Dukungan tangkapan layar (screenshot) diizinkan tanpa pemblokiran DisplayAffinity.',
            'Dukungan ke seluruh website ujian online tanpa filter pembatas yang kaku.',
            'Smart auto-redirect saat sub-proses client dibuka langsung.',
            'Single-file installer setup mandiri terkompresi LZMA2 (FeraExam_Setup.exe).',
        ],
        improvements: [
            'Akselerasi GPU Chromium (enable-gpu-rasterization & enable-zero-copy).',
            'Pemangkasan background telemetry dan sinkronisasi otomatis Chromium.',
            'Seluruh ikon menggunakan format native 32-bit DIB Bitmap Windows.',
            'Total rebranding nama, metadata, splash screen, dan 12 file translasi ke FeraExam.',
        ],
        bugFixes: [
            'Memperbaiki exception TypeConverterMarkupExtension pada decoder icon WPF.',
            'Menghilangkan error Invalid arguments pada eksekusi client mandiri.',
            'Menghilangkan delay/hang saat proses penutupan jendela runtime.',
        ],
        knownIssues: [
            'Mendukung khusus sistem operasi Windows 10 dan Windows 11 (64-Bit).',
        ],
    };

    return [v380];
}

export function getLatestStableRelease(): ReleaseItem | null {
    const releases = getPublishedReleases();
    return releases.find((r) => r.channel === 'stable') ?? null;
}

export function getReleaseByVersion(versionInput: string): ReleaseItem | null {
    const normalized = versionInput.startsWith('v') ? versionInput : `v${versionInput}`;
    const releases = getPublishedReleases();
    return releases.find((r) => r.version.toLowerCase() === normalized.toLowerCase()) ?? null;
}