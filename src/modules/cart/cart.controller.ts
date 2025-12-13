import type { Request, Response } from "express-serve-static-core";
import { handleControllerError } from "../../utils/handleError.js";
import * as CartService from "./cart.service.js";


/**
 * Get the cart for a user
 * GET /api/cart
 */
export const getCartHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id.toString();
        const cart = await CartService.getCartByUser(userId);

        res.json({
            success: true,
            message: "cart items fetched successfully",
            data: cart
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}


/**
 * Add item(s) to the cart
 * POST /api/cart
 */
export const addItemToCartHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id.toString();
        const { productId, quantity } = req.body as { productId: string, quantity: number };
        const cart = await CartService.addItemToCart(userId, productId, quantity);
        res.status(201).json({
            success: true,
            message: "Item added to cart successfully",
            data: cart
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}


/**
 * Update cart item quantity
 * PATCH /api/cart
 */
export const updateCartItemHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id.toString();
        const { productId, quantity } = req.body;
        const cart = await CartService.updateItemQuantity(userId, productId, quantity);

        res.json({
            success: true,
            message: "Cart item quantity updated successfully",
            data: cart
        })
    } catch (err) {
        handleControllerError(err, res);
    }
}


/**
 * Remove an item from the cart
 * DELETE /api/cart/:productId
 */
export const removeItemFromHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id.toString();
        const { productId } = req.params;
        const cart = await CartService.removeItemFromCart(userId, productId);

        res.json({
            success: true,
            message: "Item removed from cart successfully",
            data: cart
        })
    } catch (err) {
        handleControllerError(err, res);
    }
}


/**
 * clear entire cart
 * DELETE /api/cart
 */
export const clearCartHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id.toString();
        const cart = await CartService.clearCart(userId);

        res.json({
            success: true,
            message: "Cart cleared successfully",
            data: cart
        })
    } catch (err) {
        handleControllerError(err, res);
    }
}