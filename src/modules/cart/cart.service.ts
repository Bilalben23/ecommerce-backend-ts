import { Types } from "mongoose";
import { ApiError } from "../../utils/errors.js";
import { Cart } from "./cart.model.js"
import { Product } from "../products/product.model.js";


/**
 * 
 * @param userId - MongoDB objectId of the user
 * @returns Cart document or null
 */
export const getCartByUser = async (userId: string) => {
    return Cart.findOne({ user: userId })
        .populate("items.product");
}


/**
 * Create a new cart for a user
 * @param userId - MongoDB objectId of the user
 * @returns Created cart
 */
export const createCart = (userId: string) => {
    const cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    return cart.save();
}


/**
 * Add item to cart
 * @param userId - MongoDB ObjectId of the user
 * @param productId - MongoDB ObjectId of the product
 * @param quantity - Quantity of the product
 * @returns Updated cart
 */
export const addItemToCart = async (userId: string, productId: string, quantity: number) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError("Cart not found", 404);

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
 * Remove item from cart
 * @param userId - MongoDB ObjectId of the user
 * @param productId - MongoDB ObjectId of the product
 * @returns Updated cart
 */
export const removeItemFromCart = async (userId: string, productId: string) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError("Cart not found", 404);

    cart.items = cart.items.filter(item => !item.product.equals(productId));

    await updateCartTotal(cart);

    return cart.save();
}


/**
 * 
 * @param userId - MongoDB Object of the user
 * @param productId - MongoDB ObjectId of the product
 * @param updatedQuantity - New quantity(replace old one)
 * @returns updated cart
 */
export const updateItemQuantity = async (userId: string, productId: string, updatedQuantity: number) => {
    const cart = await Cart.findOne({ user: userId });
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
 * Clear all items in cart
 * @param userId - MongoDB ObjectId of the user
 * @returns Cleared cart
 */
export const clearCart = async (userId: string) => {
    const cart = await Cart.findOne({ user: userId });
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