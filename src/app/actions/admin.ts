'use server'

import { connect } from "../../../private/connection";
import { cookies } from "next/headers";
import { decrypt } from "../private/session";
import { RowDataPacket } from "mysql2";

// Types
export interface User extends RowDataPacket {
    user_id: string;
    user_email: string;
    user_role: string;
    created_at?: Date;
}

export interface AdminToken extends RowDataPacket {
    id: number;
    user_id: string;
    product_id: string;
    token: string;
    ip: string | null;
    is_used: boolean;
    duration: string;
    created_at: Date;
}

// Authentication Check
async function isAdmin() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const payload = await decrypt(session);
    return payload?.user_role === 'admin';
}

// --- User Management ---

export async function searchUsers(query: string) {
    if (!await isAdmin()) return [];

    const conn = await connect();
    try {
        const [rows] = await conn.execute<User[]>(
            'SELECT user_id, user_email, user_role FROM tbl_users WHERE user_email LIKE ? OR user_id LIKE ? LIMIT 20',
            [`%${query}%`, `%${query}%`]
        );
        return rows;
    } catch (e) {
        console.error("Search error:", e);
        return [];
    }
}

export async function updateUserRole(userId: string, newRole: string) {
    if (!await isAdmin()) return { success: false, message: "Unauthorized" };

    const conn = await connect();
    try {
        await conn.execute('UPDATE tbl_users SET user_role = ? WHERE user_id = ?', [newRole, userId]);
        return { success: true };
    } catch (e) {
        console.error("Update role error:", e);
        return { success: false, message: "Database error" };
    }
}

// --- Token Management ---

export async function getUserTokens(userId: string) {
    if (!await isAdmin()) return [];

    const conn = await connect();
    try {
        const [rows] = await conn.execute<AdminToken[]>(
            'SELECT * FROM tbl_tokens WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows.map(r => ({ ...r, is_used: Boolean(r.is_used) }));
    } catch (e) {
        console.error("Get tokens error:", e);
        return [];
    }
}

export async function grantProduct(email: string, productId: string, duration: string = 'infinite') {
    if (!await isAdmin()) return { success: false, message: "Unauthorized" };

    const conn = await connect();
    try {
        const [users] = await conn.execute<User[]>('SELECT user_id FROM tbl_users WHERE user_email = ?', [email]);
        if (users.length === 0) return { success: false, message: "User not found" };
        const userId = users[0].user_id;

        const generateSegment = () => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let gen = "";
            for (let i = 0; i < 6; i++)
                gen += chars.charAt(Math.floor(Math.random() * chars.length));

            return gen;
        };

        const token = `${generateSegment()}-${generateSegment()}-${generateSegment()}-${generateSegment()}`;

        await conn.execute(
            'INSERT INTO tbl_tokens (user_id, product_id, token, duration) VALUES (?, ?, ?, ?)',
            [userId, productId, token, duration]
        );

        return { success: true };
    } catch (e) {
        console.error("Grant product error:", e);
        return { success: false, message: "Database error" };
    }
}

export async function revokeToken(tokenId: number) {
    if (!await isAdmin()) return { success: false, message: "Unauthorized" };

    const conn = await connect();
    try {
        await conn.execute('DELETE FROM tbl_tokens WHERE id = ?', [tokenId]);
        return { success: true };
    } catch (e) {
        console.error("Revoke error:", e);
        return { success: false, message: "Database error" };
    }
}

export async function revokeAllUserTokens(userId: string) {
    if (!await isAdmin()) return { success: false, message: "Unauthorized" };

    const conn = await connect();
    try {
        await conn.execute('DELETE FROM tbl_tokens WHERE user_id = ?', [userId]);
        return { success: true };
    } catch (e) {
        console.error("Revoke all error:", e);
        return { success: false, message: "Database error" };
    }
}
