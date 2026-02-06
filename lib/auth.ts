import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'default-secret-key-change-me';
const key = new TextEncoder().encode(SECRET_KEY);

export async function signAdminToken(payload: { email: string }) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function verifyAdminToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}
