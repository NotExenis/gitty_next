'use server'
import { cookies } from "next/headers";
import { decrypt } from "../private/session";

export async function getCookie() {
    const cookieStore = await cookies();
    return cookieStore.has("session") ? cookieStore.get("session")?.value : "guest";
}

export async function getUserRole(): Promise<string> {
    const cookie = await getCookie();
    // If it's "guest", decrypt might return undefined or fail. 
    // If "guest", return "guest".
    if (cookie === "guest") return "guest";

    const dc = await decrypt(cookie);
    return dc?.user_role ? dc.user_role + "" : "guest";
}