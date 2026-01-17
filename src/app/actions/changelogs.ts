'use server'

import { connect } from "../../../private/connection";
import { ChangelogPost } from "../../../interfaces/interfaces";
import { cookies } from "next/headers";
import { decrypt } from "../private/session";
import { revalidatePath } from "next/cache";

export async function getChangelogs() {
    const conn = await connect();
    try {
        const [rows] = await conn.execute<ChangelogPost[]>(
            'SELECT * FROM tbl_changelogs ORDER BY date DESC'
        );
        return rows;
    } catch (error) {
        console.error("Failed to fetch changelogs:", error);
        return [];
    }
}

export async function createChangelog(prevState: unknown, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!title || !description) {
        return { message: "Title and description are required" };
    }

    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const payload = await decrypt(session);

    if (payload?.user_role !== 'admin') {
        return { message: "Unauthorized" };
    }

    const conn = await connect();
    try {
        await conn.execute(
            'INSERT INTO tbl_changelogs (title, description) VALUES (?, ?)',
            [title, description]
        );
        revalidatePath('/changelog');
        return { message: "Success" };
    } catch (error) {
        console.error("Failed to create changelog:", error);
        return { message: "Database Error" };
    }
}
