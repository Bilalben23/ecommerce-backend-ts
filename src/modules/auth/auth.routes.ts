import { Router } from "express";
import * as UserController from "./auth.controller.js";
// import { authMiddleware } from "../../middlewares/auth.middleware.js";


const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 */
router.post("/register", UserController.registerHandler);


/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT
 */
router.post("/login", UserController.loginUserHandler);


/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh access token using refresh token cookie
 */
router.post("/refresh-token", UserController.refreshTokenHandler);


/**
 * @route GET /api/auth/me
 * @desc GET profile of logged-in user
 * @access Protected
 */
router.get("/me", UserController.getProfileHandler);


/**
 * @route POST /api/auth/request-password-reset
 * @desc Request password reset link via email
 */
router.post("/request-password-reset", UserController.requestPasswordResetHandler);


/**
 * @route POST /api/users/reset-password
 * @desc Reset password using token from query param
 */
router.post("/reset-password", UserController.resetPasswordHandler);


export default router;