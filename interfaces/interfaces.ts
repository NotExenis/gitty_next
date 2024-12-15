import { z } from "zod";

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

export type formState = | {
    errors?: {
        email?: string[]
        password?: string[]
        discordID?: string[]
    }
    message?: string
} | undefined
