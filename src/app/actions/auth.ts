import { SessionPayload, loginSchema } from "../../../interfaces/interfaces";
import { connect } from "../../../private/connection";
import { createSession } from "../../../private/session";
import { redirect } from 'next/navigation';

export async function signin(state: SessionPayload, formData: FormData){
    const validatedFields = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    });

    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    let conn = await connect();
    const email = formData.get('email');
    const bcrypt = require('bcrypt');

    const [users] = await conn.execute(
        'SELECT user_email, user_password, user_role, user_id FROM tbl_users WHERE user_email = ?',
        [email]
    );


    if(Array.isArray(users) && users.length > 0) {
        return; // TODO: show error on client possibly a post request or either in session mangement
    };

    // await createSession(user['user_id'], user['user_role'])

}