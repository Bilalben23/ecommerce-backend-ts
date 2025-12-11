import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { connectTestDB, disconnectTestDB } from "../setup/mongo-memory.js";
import { Types } from "mongoose";
import { Product } from "../../src/modules/products/product.model.js";
import * as CartService from "../../src/modules/cart/cart.service.js";


let userId: string;
let productId: string;

beforeAll(async () => {
    await connectTestDB();
    userId = new Types.ObjectId().toString();

    // create a sample product to use in cart
    const product = await Product.create({
        name: "Sample Product",
        description: "Sample description",
        sku: "SP001",
        price: 100,
        categories: ["Electronics"],
        tags: ["New"],
        images: ["image1.jpg"],
        stock: 50,
        ratings: {
            average: 0,
            totalRatings: 0
        },
        isActive: true
    });

    productId = product._id.toString();
})


afterAll(async () => {
    await disconnectTestDB();
})


describe("Cart Service", () => {

    it("should create a new cart", async () => {
        const cart = await CartService.createCart(userId);

        expect(cart).toHaveProperty("_id");
        expect(cart.user.toString()).toBe(userId);
        expect(cart.items.length).toBe(0);
        expect(cart.totalPrice).toBe(0);
    });


    it("should add an item to cart", async () => {
        const cart = await CartService.addItemToCart(userId, productId, 2);

        expect(cart.items.length).toBe(1);
        expect(cart.items[0].quantity).toBe(2);
        expect(cart.totalPrice).toBe(200); // price * quantity
    });


    it("should update item quantity in cart", async () => {
        const updatedCart = await CartService.updateItemQuantity(userId, productId, 3);

        // Quantity should now be 5 (existing 2 + 3)
        const item = updatedCart.items.find(i => i.product._id.equals(productId));
        expect(item?.quantity).toBe(3);
        expect(updatedCart.totalPrice).toBe(300);
    });


    it("should remove item if quantity updated to 0", async () => {
        await CartService.addItemToCart(userId, productId, 2);
        const cart = await CartService.updateItemQuantity(userId, productId, 0);

        expect(cart.items.length).toBe(0);
        expect(cart.totalPrice).toBe(0);
    })


    it("should throw error when updating quantity for non-existing item", async () => {
        const fakedProductId = new Types.ObjectId().toString();
        await expect(
            CartService.updateItemQuantity(userId, fakedProductId, 2)
        ).rejects.toThrow("Item not found in cart");
    });


    it("should remove item from cart", async () => {
        await CartService.addItemToCart(userId, productId, 1);
        const cartAfterRemove = await CartService.removeItemFromCart(userId, productId);

        expect(cartAfterRemove.items.length).toBe(0);
        expect(cartAfterRemove.totalPrice).toBe(0);
    });


    it("should clear the cart", async () => {
        await CartService.addItemToCart(userId, productId, 1);
        const clearedCart = await CartService.clearCart(userId);

        expect(clearedCart.items.length).toBe(0);
        expect(clearedCart.totalPrice).toBe(0);
    });


    it("should get cart by user", async () => {
        const cart = await CartService.getCartByUser(userId);

        expect(cart).toBeDefined();
        expect(cart?.user.toString()).toBe(userId);
    })


    it("should automatically create a cart for a new user", async () => {
        const newUserId = new Types.ObjectId().toString();
        const cart = await CartService.getCartByUser(newUserId);

        expect(cart).toBeDefined();
        expect(cart.user.toString()).toBe(newUserId);
        expect(cart.totalPrice).toBe(0);
    })
})