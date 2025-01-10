'use server'
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '../../../interfaces/interfaces';
import { cookies } from 'next/headers'

const secretKey = process.env.secret_key;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}      

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.log(error)
    }
}

export async function createSession(userId: string, user_role: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 1000)
    const session = await encrypt({ userId, expiresAt, user_role})
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/'
    })
}
