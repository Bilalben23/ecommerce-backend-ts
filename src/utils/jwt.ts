import jwt from "jsonwebtoken";
import { Response } from "express-serve-static-core";


export interface JWTPayload {
    _id: string;
    role: "user" | "admin"
}

/**
 * Generate a JWT access token
 * @param payload - User information (_id and role)
 * @returns Signed JWT string (expires in 15 minutes)
 */
export const generateAccessToken = (payload: JWTPayload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "15m"
    })
}

/**
 * Generate a JWT refresh token
 * @param payload - User information (_id and role)
 * @returns Signed JWT string (expires in 7 days)
 */
export const generateRefreshToken = (payload: JWTPayload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d"
    })
}


/**
 * Set refresh token as HTTP-only cookie in the response
 * @param res - Express response object
 * @param token - JWT refresh token
 */
export const setRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
}