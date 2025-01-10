'use server'
import { createSession } from '../private/session'
import { formState, loginSchema, User } from '../../../interfaces/interfaces'
import { connect } from '../private/connection';
import { redirect } from 'next/navigation';

export async function signIn(_state: formState, formData: FormData){
    const validatedFields = loginSchema.safeParse ({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if(!validatedFields.success){
        console.log("empty fields")
        return {
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    let conn = await connect();
    const email = formData.get('email');
    const password = formData.get('password');
    const bcrypt = require('bcrypt');

    const [rows] = await conn.execute<User[]>(
        'SELECT user_email, user_password, user_id, user_role FROM tbl_users WHERE user_email = ?',
        [email]
    );

    const { user_email, user_password, user_id, user_role } = rows[0] || {};

    const isMatch = await bcrypt.compare(password, user_password);

    if(!isMatch){
        return //TODO:: return error message email/password are incorrect
    }

    await createSession(user_id, user_role)
    redirect('/loggedin/profile')
}