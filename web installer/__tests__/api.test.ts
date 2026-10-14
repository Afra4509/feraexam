import { describe, it, expect } from 'vitest';
import { GET as getLatest } from '@/app/api/v1/releases/latest/route';
import { GET as getReleases } from '@/app/api/v1/releases/route';
import { GET as getByVersion } from '@/app/api/v1/releases/[version]/route';
import { GET as getDownload } from '@/app/api/v1/downloads/[platform]/route';
import { GET as getHealth } from '@/app/api/v1/health/route';
import { NextRequest } from 'next/server';

describe('FeraExam Release & Distribution API v1', () => {
    it('GET /api/v1/releases/latest returns validated v3.8.0 schema', async () => {
        const res = await getLatest();
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.success).toBe(true);
        expect(body.data.version).toBe('v3.8.0');
        expect(body.data.platform).toBe('windows');
        expect(body.data.architecture).toBe('x64');
        expect(body.data.filename).toBe('FeraExam_Setup.exe');
    });

    it('GET /api/v1/releases rejects invalid pagination parameters', async () => {
        const req = new NextRequest('http://localhost:3000/api/v1/releases?page=-2&limit=999');
        const res = await getReleases(req);
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.error.code).toBe('INVALID_PAGINATION');
    });

    it('GET /api/v1/releases/:version rejects path traversal or malformed versions', async () => {
        const req = new NextRequest('http://localhost:3000/api/v1/releases/..%2F..%2Fetc');
        const res = await getByVersion(req, { params: Promise.resolve({ version: '../../etc' }) });
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error.code).toBe('INVALID_VERSION_FORMAT');
    });

    it('GET /api/v1/downloads/:platform redirects for windows and blocks invalid platforms', async () => {
        const validReq = new NextRequest('http://localhost:3000/api/v1/downloads/windows');
        const validRes = await getDownload(validReq, { params: Promise.resolve({ platform: 'windows' }) });
        expect(validRes.status).toBe(302);
        expect(validRes.headers.get('location')).toContain('FeraExam_Setup.exe');

        const badReq = new NextRequest('http://localhost:3000/api/v1/downloads/linux');
        const badRes = await getDownload(badReq, { params: Promise.resolve({ platform: 'linux' }) });
        expect(badRes.status).toBe(400);
    });

    it('GET /api/v1/health reports operational status without leaking internals', async () => {
        const res = await getHealth();
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.data.status).toBe('operational');
        expect(body.data).not.toHaveProperty('env');
    });
});