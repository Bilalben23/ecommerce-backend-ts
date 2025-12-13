import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { connectTestDB, disconnectTestDB } from "../setup/mongo-memory.js";
import { User } from "../../src/modules/auth/user.model.js";
import { generateAccessToken } from "../../src/utils/jwt.js";
import { Product } from "../../src/modules/products/product.model.js";
import { createAuthAgent } from "../setup/requestAgent.js";
import bcrypt from "bcrypt";


let agent: ReturnType<typeof createAuthAgent>;
let userId: string;
let productId: string;

beforeAll(async () => {
    await connectTestDB();

    // create a test user
    const user = await User.create({
        name: "Controller Test User",
        email: "controller@example.com",
        password: await bcrypt.hash("hashedPassword1234", 10)
    });
    userId = user._id.toString();

    // create JWT for authMiddleware
    const token = generateAccessToken({ _id: userId, role: user.role });

    // Create agent that automatically includes Authorization header
    agent = createAuthAgent(token);

    // Create a test product
    const product = await Product.create({
        name: "Sample Product",
        description: "Sample description",
        sku: "SP001",
        price: 100,
        categories: ["Electronics"],
        tags: ["New"],
        images: ["image1.jpg"],
        stock: 50,
        ratings: { average: 0, totalRatings: 0 },
        isActive: true
    });
    productId = product._id.toString();
})


afterAll(async () => {
    await disconnectTestDB();
})


describe("Cart Controller", async () => {
    it("GET /api/cart - should fetch empty cart", async () => {
        const res = await agent
            .get("/api/cart")
            .send();

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.items).toHaveLength(0);
        expect(res.body.data.totalPrice).toBe(0);
    });

    it("POST /api/cart - should add item to cart", async () => {
        const res = await agent
            .post("/api/cart")
            .send({ productId, quantity: 2 });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.items[0].product).toBe(productId);
        expect(res.body.data.items[0].quantity).toBe(2);
        expect(res.body.data.totalPrice).toBe(200);
    });

    it("PATCH /api/cart - should update item quantity", async () => {
        const res = await agent
            .patch("/api/cart")
            .send({ productId, quantity: 3 });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.items[0].quantity).toBe(3);
        expect(res.body.data.totalPrice).toBe(300);
    });

    it("DELETE /api/cart/:productId - should remove item from cart", async () => {
        const res = await agent
            .delete(`/api/cart/${productId}`)
            .send();

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.items).toHaveLength(0);
        expect(res.body.data.totalPrice).toBe(0);
    });

    it("DELETE /api/cart - should clear the cart", async () => {
        await agent
            .post("/api/cart")
            .send({ productId, quantity: 2 });

        const res = await agent
            .delete("/api/cart")
            .send();

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.items).toHaveLength(0);
        expect(res.body.data.totalPrice).toBe(0);
    });

    it("GET /api/cart - should still fetch empty cart after clearing", async () => {
        const res = await agent
            .get("/api/cart")
            .send();

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.items).toHaveLength(0);
        expect(res.body.data.totalPrice).toBe(0);
    });
})