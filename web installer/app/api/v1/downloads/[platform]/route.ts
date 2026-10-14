import { NextRequest, NextResponse } from 'next/server';
import { PlatformParamSchema, isTrustedDownloadUrl } from '@/lib/validation/releases';
import { getLatestStableRelease } from '@/lib/releases/manifest';

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ platform: string }> }
) {
    const { platform } = await context.params;

    // Reject path traversal or unsupported platforms immediately
    const parsedPlatform = PlatformParamSchema.safeParse(platform.toLowerCase());
    if (!parsedPlatform.success) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'UNSUPPORTED_PLATFORM',
                    message: 'Supported platform targets are "windows" and "windows-portable".',
                },
            },
            { status: 400 }
        );
    }

    const release = getLatestStableRelease();
    if (!release) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'RELEASE_UNAVAILABLE',
                    message: 'No active release is configured for download.',
                },
            },
            { status: 404 }
        );
    }

    const targetUrl =
        parsedPlatform.data === 'windows-portable'
            ? release.portableDownloadUrl
            : release.downloadUrl;

    if (!targetUrl || !isTrustedDownloadUrl(targetUrl)) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'STORAGE_DESTINATION_UNAVAILABLE',
                    message: 'The installer binary URL is either unconfigured or fails trusted origin verification.',
                },
            },
            { status: 503 }
        );
    }

    // Secure 302 redirect to verified external storage without buffering binary in memory
    return NextResponse.redirect(targetUrl, {
        status: 302,
        headers: {
            'Cache-Control': 'no-store, max-age=0',
            'X-Content-Type-Options': 'nosniff',
        },
    });
}