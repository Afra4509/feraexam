import { NextRequest, NextResponse } from 'next/server';
import { PaginationQuerySchema } from '@/lib/validation/releases';
import { getPublishedReleases } from '@/lib/releases/manifest';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const rawPage = searchParams.get('page') ?? '1';
    const rawLimit = searchParams.get('limit') ?? '10';
    const rawChannel = searchParams.get('channel') ?? undefined;

    const parsed = PaginationQuerySchema.safeParse({
        page: rawPage,
        limit: rawLimit,
        channel: rawChannel,
    });

    if (!parsed.success) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'INVALID_PAGINATION',
                    message: 'Pagination parameters are invalid. Page must be >= 1 and limit must be between 1 and 100.',
                    details: parsed.error.flatten(),
                },
            },
            { status: 400 }
        );
    }

    const { page, limit, channel } = parsed.data;
    let releases = getPublishedReleases();

    if (channel && channel !== 'all') {
        releases = releases.filter((r) => r.channel.toLowerCase() === channel.toLowerCase());
    }

    const total = releases.length;
    const startIndex = (page - 1) * limit;
    const items = releases.slice(startIndex, startIndex + limit);

    return NextResponse.json(
        {
            success: true,
            data: {
                items,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit) || 1,
                },
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
