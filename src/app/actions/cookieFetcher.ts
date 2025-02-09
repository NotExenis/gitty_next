'use server'
import { cookies } from "next/headers";

export async function getCookie() {
    const cookieStore = await cookies();
    return cookieStore.has("session") ? cookieStore.get("session")?.value : "guest";
}