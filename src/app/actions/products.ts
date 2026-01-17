'use server'

import { connect } from "../../../private/connection";
import { ProductToken } from "../../../interfaces/interfaces";
import { cookies } from "next/headers";
import { decrypt } from "../private/session";

export async function getOwnedProducts() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const payload = await decrypt(session);

    if (!payload?.userId) return [];

    const conn = await connect();
    try {
        // Get distinct product_ids that the user has tokens for
        const [rows] = await conn.execute<ProductToken[]>(
            'SELECT DISTINCT product_id, user_id FROM tbl_tokens WHERE user_id = ?',
            [payload.userId]
        );
        return rows.map(r => r.product_id);
    } catch (error) {
        console.error("Failed to fetch owned products:", error);
        return [];
    }
}

export async function getUserTokens(productId: string) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const payload = await decrypt(session);

    if (!payload?.userId) return [];

    const conn = await connect();
    try {
        const [rows] = await conn.execute<ProductToken[]>(
            'SELECT * FROM tbl_tokens WHERE user_id = ? AND product_id = ? ORDER BY created_at DESC',
            [payload.userId, productId]
        );
        // Normalize boolean if it comes back as 0/1 number
        return rows.map(row => ({
            ...row,
            is_used: Boolean(row.is_used)
        }));
    } catch (error) {
        console.error("Failed to fetch tokens:", error);
        return [];
    }
}
