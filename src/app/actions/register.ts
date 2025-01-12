'use server'
import { redirect } from 'next/navigation';
import { registerSchema, formState } from "../../../interfaces/interfaces";
import { connect } from "../../../private/connection";

export default async function registerAction (_state: formState, formData: FormData){
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

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await conn.execute(
        "SELECT * FROM tbl_users WHERE user_email = ?",
        [email]
    )

    if(Array.isArray(existingUser) && existingUser.length > 0) {
       return; // TODO: show error on client possibly a post request or either in session mangement
    };

    await conn.execute(
        "INSERT INTO tbl_users (user_email, user_password) VALUES (?,?)",
        [email, hashedPassword],
    );

    await conn.end();
    redirect('/login');
}