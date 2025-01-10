import { z } from "zod";
import { JWTPayload } from 'jose';
import { RowDataPacket } from 'mysql2';



export const registerSchema = z.object({
    email: z
    .string()
    .email({ message: "Please enter an valid email address" })
    .trim(),
    password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})

export const loginSchema = z.object({
    email: z
    .string()
    .min(1, {message: "Fill in your email"}),
    password: z
    .string()
    .min(1, {message: "Fill in your password"})
})

export type formState = | {
    errors?: {
        email?: string[]
        password?: string[]
        discordID?: string[]
    }
    message?: string
} | undefined


export interface SessionPayload extends JWTPayload {
    user_role: string,
    userId: string,
    expiresAt: Date
}

export interface User extends RowDataPacket {
    user_email: string,
    user_id: string,
    user_role: string,
    user_password: string
}
