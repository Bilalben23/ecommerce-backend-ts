import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
    loginSchema,
    registerSchema,
    requestPasswordResetSchema,
    resetPasswordQuerySchema,
    resetPasswordSchema
} from "./auth.validation.js";


const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 */
router.post(
    "/register",
    validate(registerSchema),
    AuthController.registerHandler
);


/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT
 */
router.post(
    "/login",
    validate(loginSchema),
    AuthController.loginUserHandler
);


/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh access token using refresh token cookie
 */
router.post("/refresh-token", AuthController.refreshTokenHandler);


/**
 * @route GET /api/auth/me
 * @desc GET profile of logged-in user
 * @access Protected
 */
router.get(
    "/me",
    authMiddleware,
    AuthController.getProfileHandler
);


/**
 * @route POST /api/auth/request-password-reset
 * @desc Request password reset link via email
 */
router.post(
    "/request-password-reset",
    validate(requestPasswordResetSchema),
    AuthController.requestPasswordResetHandler
);


/**
 * @route POST /api/users/reset-password
 * @desc Reset password using token from query param
 */
router.post(
    "/reset-password",
    validate(resetPasswordQuerySchema, "query"),
    validate(resetPasswordSchema),
    AuthController.resetPasswordHandler);


export default router;