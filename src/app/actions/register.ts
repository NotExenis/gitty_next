'use server'

import { registerSchema, formState } from "../../../interfaces/interfaces";
import { connect } from "../../../private/connection";
import * as bcrypt from "@ts-rex/bcrypt";

export default async function registerAction (state: formState, formData: FormData){
    const validatedFields = registerSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        discordID: formData.get('discordID'),
    })

    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    let conn = await connect();
    const email = formData.get('email');
    const password = formData.get('password');
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await conn.execute(
        "SELECT * FROM tbl_users WHERE user_email = ?",
        [email]
    )

    if(Array.isArray(existingUser) && existingUser.length > 0) {
        fetch('http://localhost:3000/register', {
            method: "POST",
            body: JSON.stringify({ 
                email: email,
                error: "The email is already in use",
            }),
            headers: {
              "content-type": "application/json",
            },
        }).then(() => {
            return new Response(null, {
                status: 302,
                headers: { location: "/register" }
            })
        });
    };

    await conn.execute(
        "INSERT INTO tbl_users (user_email, user_password) VALUES (?,?)",
        [email, hashedPassword],
    );

    await conn.end();
    return new Response(null, {
        status: 302,
        headers: { location: "/login" }
    })
}