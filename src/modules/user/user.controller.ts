import { Request, Response } from "express-serve-static-core";
import { handleControllerError } from "../../utils/handleError.js";
import * as UserService from "./user.service.js";
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie, type JWTPayload } from "../../utils/jwt.js";
import jwt from "jsonwebtoken";

/**
 * Register a new user
 * POST /api/users/register
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
 * POST /api/users/login
 */
export const loginUserHandler = async (req: Request<{}, {}, { email: string, password: string }>, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await UserService.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const match = await UserService.verifyPassword(password, user.password);

        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        // generate tokens
        const payload: JWTPayload = {
            _id: user._id.toString(),
            role: user.role
        }
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateAccessToken(payload);

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
 * POST /api/users/refresh-token
 */
export const refreshTokenHandler = async (res: Response, req: Request) => {
    try {
        const token = req.cookies?.refreshToken as (string | undefined);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No refresh token provided"
            });
        }

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
 * GET /api/users/me
 */
export const getProfileHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        const user = await UserService.getUser(userId);

        res.json({
            success: true,
            message: "User profile fetched successfully",
            data: {
                _id: user._id,
                name: user.email,
                role: user.role
            }
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}