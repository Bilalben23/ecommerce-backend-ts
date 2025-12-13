import type { Request, Response } from "express-serve-static-core";
import { handleControllerError } from "../../utils/handleError.js";
import * as UserService from "./auth.service.js";
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie, type JWTPayload } from "../../utils/jwt.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/apiError.js";

/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerHandler = async (req: Request<{}, {}, { name: string, email: string, password: string, avatar?: string }>, res: Response) => {
    try {
        const { name, email, password, avatar } = req.body;

        const user = await UserService.createUser(name, email, password, avatar);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}


/**
 * Login user and return tokens
 * POST /api/auth/login
 */
export const loginUserHandler = async (req: Request<{}, {}, { email: string, password: string }>, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await UserService.getUserByEmail(email);
        if (!user) throw new ApiError("Invalid credentials", 400);

        const match = await UserService.verifyPassword(password, user.password);
        if (!match) throw new ApiError("Invalid credentials", 400);

        // generate tokens
        const payload: JWTPayload = {
            _id: user._id.toString(),
            role: user.role
        }
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        setRefreshTokenCookie(res, refreshToken);
        // set refresh token as httpOnly


        res.json({
            success: true,
            message: "Logged in successfully",
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.email,
                    avatar: user.avatar
                },
                accessToken
            }
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}


/**
 * Refresh access token using refresh token stored in HTTP-only cookie
 * POST /api/auth/refresh-token
 */
export const refreshTokenHandler = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.refreshToken as (string | undefined);
        if (!token) throw new ApiError("No refresh token provided", 401);

        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as JWTPayload;
        const user = await UserService.getUser(payload._id);

        // generate new tokens
        const userPayload: JWTPayload = {
            _id: user._id.toString(),
            role: user.role
        }
        const accessToken = generateAccessToken(userPayload);
        const refreshToken = generateRefreshToken(userPayload);

        // update refresh token cookie
        setRefreshTokenCookie(res, refreshToken);

        res.json({
            success: true,
            message: "Token refreshed successfully",
            data: {
                accessToken
            }
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}


/**
 * Get user's profile (protected)
 * GET /api/auth/me
 */
export const getProfileHandler = async (req: Request, res: Response) => {
    try {
        const userDocument = req.user!;
        const user = userDocument.toObject();

        res.json({
            success: true,
            message: "User profile fetched successfully",
            data: {
                ...user
            }
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}


/**
 * Request password reset
 * POST /api/auth/request-password-reset
 */
export const requestPasswordResetHandler = async (req: Request<{}, {}, { email: string }>, res: Response) => {
    try {
        const { email } = req.body;
        const resetToken = await UserService.generatePasswordResetToken(email);

        // TODO: send resetToken via email link to user
        console.log("Password reset link:", `https://yourapp.com/reset-password?token=${resetToken}`)

        res.json({
            success: true,
            message: "Password reset link sent to email"
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}


/**
 * Reset password
 * POST /api/auth/reset-password?token
 */
export const resetPasswordHandler = async (req: Request<{}, {}, { password: string }, { token: string }>, res: Response) => {
    try {
        const { token } = req.query;
        const { password } = req.body;

        await UserService.resetPassword(token, password);

        res.json({
            success: true,
            message: "Password updated successfully"
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}