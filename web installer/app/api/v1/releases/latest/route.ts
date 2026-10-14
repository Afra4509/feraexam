import { NextResponse } from 'next/server';
import { getLatestStableRelease } from '@/lib/releases/manifest';

export async function GET() {
    const latest = getLatestStableRelease();

    if (!latest) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'RELEASE_NOT_FOUND',
                    message: 'No published stable release is currently configured.',
                },
            },
            { status: 404 }
        );
    }

    return NextResponse.json(
        {
            success: true,
            data: {
                version: latest.version,
                channel: latest.channel,
                platform: latest.platform,
                architecture: latest.architecture,
                filename: latest.filename,
                sizeBytes: latest.sizeBytes,
                sha256: latest.sha256,
                releaseDate: latest.releaseDate,
                downloadUrl: latest.downloadUrl,
                releaseNotes: latest.releaseNotes,
            },
        },
        {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                'X-Content-Type-Options': 'nosniff',
            },
        }
    );
}