import { NextRequest, NextResponse } from 'next/server';
import { VersionParamSchema } from '@/lib/validation/releases';
import { getReleaseByVersion } from '@/lib/releases/manifest';

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ version: string }> }
) {
    const { version } = await context.params;
    const parsed = VersionParamSchema.safeParse(version);

    if (!parsed.success) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'INVALID_VERSION_FORMAT',
                    message: 'Requested version does not match semantic version pattern (e.g., v3.8.0).',
                },
            },
            { status: 400 }
        );
    }

    const release = getReleaseByVersion(parsed.data);

    if (!release) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'VERSION_NOT_FOUND',
                    message: `Release ${parsed.data} was not found in the published manifest.`,
                },
            },
            { status: 404 }
        );
    }

    return NextResponse.json(
        {
            success: true,
            data: release,
        },
        {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
            },
        }
    );
}
