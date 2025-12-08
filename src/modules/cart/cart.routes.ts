import { Router } from "express";
import * as CartController from "./cart.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();


// all routes require authentication
//router.use(authMiddleware);

/**
 * @route GET /api/cart
 * @desc Get the current user's cart
 */
router.get("/", CartController.getCartHandler);

/**
 * @route POST /api/cart
 * @desc Add an item to the cart
 */
router.post("/", CartController.addItemToCartHandler);

/**
 * PATCH /api/cart
 * Update quantity if a specific cart item
 */
router.patch("/", CartController.updateCartItemHandler);

/**
 * @route DELETE /api/cart/:productId
 * @desc Remove a specific item from the cart
 */
router.delete("/:productId", CartController.removeItemFromHandler);

/**
 * @route DELETE /api/cart
 * @desc Clear all items from the cart
 */
router.delete("/", CartController.clearCartHandler);

export default router;
