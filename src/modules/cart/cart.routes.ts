import { Router } from "express";
import * as CartController from "./cart.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { addItemSchema, updateItemSchema } from "./cart.validation.js";

const router = Router();


// all routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/cart
 * @desc Get the current user's cart
 */
router.get("/", CartController.getCartHandler);

/**
 * @route POST /api/cart
 * @desc Add an item to the cart
 */
router.post("/",
    validate(addItemSchema),
    CartController.addItemToCartHandler
);

/**
 * PATCH /api/cart
 * Update quantity if a specific cart item
 */
router.patch("/",
    validate(updateItemSchema),
    CartController.updateCartItemHandler
);

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
