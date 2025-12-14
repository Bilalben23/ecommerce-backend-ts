import { Types } from "mongoose";
import { ApiError } from "../../utils/apiError.js";
import { Cart } from "./cart.model.js";
import { Product } from "../products/product.model.js";


/**
 * Create an empty cart for a user.
 * @param userId - MongoDB objectId of the user
 * @returns Newly created cart
 */
export const createCart = (userId: string) => {
    const cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    return cart.save();
}


/**
 * Get a user's cart. Creates one if it doesn't exist.
 * @param userId - MongoDB objectId of the user
 * @returns Cart document
 */
export const getCartByUser = async (userId: string) => {
    let cart = await Cart.findOne({ user: userId })
        .populate({
            path: "items.product",
            model: "Product",
            select: "-__v -isActive"
        })
        .select("-__v")
        .exec();

    if (!cart) {
        cart = await createCart(userId);
    }
    return cart;
}

/**
 * Add a product to the cart or increase its quantity.
 * @param userId - User ID
 * @param productId - Product ID
 * @param quantity - number to add
 * @returns Updated cart
 */
export const addItemToCart = async (userId: string, productId: string, quantity: number) => {
    const cart = await getCartByUser(userId);

    const existingItem = cart.items.find(item => item.product.equals(productId))
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({ product: new Types.ObjectId(productId), quantity })
    }

    await updateCartTotal(cart);
    return cart.save();
};


/**
 * Update or replace the quantity of a cart item.
 * Removes the item if quantity < 1.
 * @param userId - User ID
 * @param productId - Product ID
 * @param updatedQuantity - New quantity value
 * @returns updated cart
 */
export const updateItemQuantity = async (userId: string, productId: string, updatedQuantity: number) => {
    const cart = await Cart.findOne({ user: userId }).select("-__v");
    if (!cart) throw new ApiError("Cart not found", 404);

    const item = cart.items.find(i => i.product.equals(productId));
    if (!item) throw new ApiError("Item not found in cart", 404);

    if (updatedQuantity < 1) {
        cart.items = cart.items.filter(i => !i.product.equals(productId));
    } else {
        item.quantity = updatedQuantity;
    }

    await updateCartTotal(cart);

    return cart.save();
}


/**
 * Remove a product from the cart
 * @param userId - User ID
 * @param productId - Product ID
 * @returns Updated cart
 */
export const removeItemFromCart = async (userId: string, productId: string) => {
    const cart = await Cart.findOne({ user: userId }).select("-__v");
    if (!cart) throw new ApiError("Cart not found", 404);

    cart.items = cart.items.filter(item => !item.product.equals(productId));

    await updateCartTotal(cart);

    return cart.save();
}


/**
 * Remove all items from a user's cart.
 * @param userId - User ID
 * @returns Cleared cart
 */
export const clearCart = async (userId: string) => {
    const cart = await Cart.findOne({ user: userId }).select("-__v");
    if (!cart) throw new ApiError("cart not found", 404);

    cart.items = [];
    cart.totalPrice = 0;
    return cart.save();
}


/**
 * Helper: Recalculate totalPrice for a cart
 * @param cart - Cart document
 */
const updateCartTotal = async (cart: typeof Cart.prototype) => {
    let total = 0;
    for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (product) total += product.price * item.quantity;
    }
    cart.totalPrice = total;
}