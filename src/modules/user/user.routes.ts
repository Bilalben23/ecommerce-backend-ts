import { Router } from "express";
import * as UserController from "./user.controller.js";
// import { authMiddleware } from "../../middlewares/auth.middleware.js";


const router = Router();

/**
 * @route POST /api/users/register
 * @desc Register a new user
 */
router.post("/register", UserController.registerHandler);


/**
 * @route POST /api/users/login
 * @desc Login user and return JWT
 */
router.post("/login", UserController.loginUserHandler);


/**
 * @route POST /api/users/refresh-token
 * @desc Refresh access token using refresh token cookie
 */
router.post("/refresh-token", UserController.refreshTokenHandler);


/**
 * @route GET /api/users/me
 * @desc GET profile of logged-in user
 * @access Protected
 */
router.get("/me", UserController.getProfileHandler);


export default router;