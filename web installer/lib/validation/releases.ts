import { z } from 'zod';

export interface ReleaseItem {
    version: string;
    channel: string;
    platform: string;
    architecture: string;
    filename: string;
    sizeBytes: number | null;
    sha256: string | null;
    releaseDate: string;
    downloadUrl: string | null;
    portableFilename?: string;
    portableSizeBytes?: number | null;
    portableDownloadUrl?: string | null;
    releaseNotes?: string[];
    improvements?: string[];
    bugFixes?: string[];
    knownIssues?: string[];
}

export function isTrustedDownloadUrl(rawUrl: string | null | undefined): boolean {
    if (!rawUrl) return false;
    try {
        const parsed = new URL(rawUrl);
        if (parsed.protocol !== 'https:') return false;

        const trustedHostsEnv =
            process.env.FERAEXAM_TRUSTED_HOSTS ||
            'github.com,objects.githubusercontent.com,releases.feraexam.dev';
        const trustedList = trustedHostsEnv
            .split(',')
            .map((h) => h.trim().toLowerCase())
            .filter(Boolean);

        const host = parsed.hostname.toLowerCase();
        return trustedList.some((trusted) => host === trusted || host.endsWith(`.${trusted}`));
    } catch {
        return false;
    }
}

export const VersionParamSchema = z
    .string()
    .trim()
    .regex(/^v?\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/, 'Invalid semantic version format');

export const PlatformParamSchema = z.enum(['windows', 'windows-portable']);

export const PaginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1),
    limit: z.coerce.number().int().min(1).max(100),
    channel: z.enum(['stable', 'beta', 'nightly', 'all']).optional(),
});
