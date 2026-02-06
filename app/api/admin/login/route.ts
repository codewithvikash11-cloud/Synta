import { NextResponse } from 'next/server';
import { signAdminToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // In a real app, check against DB. Here we use env vars for single admin.
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@synta.ai';
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SyntaAdmin2026!';

        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = await signAdminToken({ email });

        const response = NextResponse.json({ success: true });

        // Set HTTP-only cookie
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
