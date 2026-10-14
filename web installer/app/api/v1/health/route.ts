import { NextResponse } from 'next/server';
import { getLatestStableRelease } from '@/lib/releases/manifest';
import { isTrustedDownloadUrl } from '@/lib/validation/releases';

export async function GET() {
    const latest = getLatestStableRelease();
    const hasValidDownload = Boolean(latest?.downloadUrl && isTrustedDownloadUrl(latest.downloadUrl));

    const status = latest && hasValidDownload ? 'operational' : latest ? 'degraded' : 'unavailable';

    return NextResponse.json(
        {
            success: status !== 'unavailable',
            data: {
                status,
                releaseConfigured: Boolean(latest),
                downloadServiceReady: hasValidDownload,
                timestamp: new Date().toISOString(),
            },
        },
        {
            status: status === 'unavailable' ? 503 : 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        }
    );
}