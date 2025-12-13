import { z } from "zod";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export const registerSchema = z.object({
    name: z.string({ error: "Name is required" })
        .min(3, "Name must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z.string({ error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .regex(passwordRegex, "Password must contain at least one letter and one number"),
    avatar: z.url("Avatar must be a valid url")
        .optional()
});


export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string({ error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
});


export const requestPasswordResetSchema = z.object({
    email: z.email("Invalid email address")
});


export const resetPasswordSchema = z.object({
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .regex(passwordRegex, "Password must contain at least one letter and one number"),
});


export const resetPasswordQuerySchema = z.object({
    token: z.string({ error: "Token is required" })
        .nonempty("Token is required")
});