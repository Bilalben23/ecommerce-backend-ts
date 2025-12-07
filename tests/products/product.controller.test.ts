import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { connectTestDB, disconnectTestDB } from "../setup/mongo-memory.js";
import request from "supertest";
import app from "../../src/app.js";


beforeAll(async () => {
    await connectTestDB();


    // seed multiple products for pagination test
    for (let i = 1; i <= 25; i++) {
        await request(app)
            .post("/api/products")
            .send({
                name: `Seed product ${i}`,
                description: "Pagination seed product",
                sku: `SEED${i}`,
                price: 50 + i,
                categories: ["Tech"],
                tags: ["seed"],
                images: [],
                stock: 5,
                ratings: {
                    average: 0,
                    totalRatings: 0
                },
                variants: [],
                metadata: {},
                isActive: true
            })
    }
})


afterAll(async () => {
    await disconnectTestDB();
})


describe("Product Controllers", () => {
    let productId: string;


    it("POST /api/products - should create a product", async () => {
        const res = await request(app)
            .post("/api/products")
            .send({
                name: "Controller Test Product",
                description: "Test description for product",
                sku: "CTP001",
                price: 100,
                categories: ["Tech"],
                tag: ["tag1"],
                images: ["image1.jpg"],
                stock: 10,
                ratings: {
                    average: 0,
                    totalRatings: 0
                },
                variants: [],
                metadata: {},
                isActive: true
            })
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("_id");
        productId = res.body.data._id;
    })

    it("POST /api/products - should fail validation with missing required fields", async () => {
        const res = await request(app)
            .post("/api/products")
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Validation failed/i);
        expect(res.body.errors).toBeDefined();
    })


    it("GET /api/products - should returned paginated products (default page=1, limit=10)", async () => {
        const res = await request(app).get("/api/products");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        // should return an array of products
        expect(Array.isArray(res.body.data)).toBe(true);

        expect(res.body.data.length).toBeLessThanOrEqual(10);

        // Pagination object should exist
        expect(res.body.pagination).toBeDefined();
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.limit).toBe(10);

        // totalPages must be >=1
        expect(res.body.pagination.totalPages).toBeGreaterThanOrEqual(1);
    })


    it("GET /api/products?page=2&limit=10 - should return paginated result", async () => {
        const res = await request(app).get("/api/products?page=2&limit=10");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        // data check
        expect(res.body.data.length).toBe(10);

        // pagination checks
        expect(res.body.pagination).toBeDefined();
        expect(res.body.pagination.page).toBe(2);
        expect(res.body.pagination.limit).toBe(10);
        expect(res.body.pagination.total).toBeGreaterThan(20);
        expect(res.body.pagination.totalPages).toBeGreaterThan(2);
        expect(res.body.pagination.nextPage).toBe(3);
    })


    it("GET /api/products/:id - should get product by ID", async () => {
        const res = await request(app).get(`/api/products/${productId}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBe(productId);
    })


    it("GET /api/products/:id - should return 404 for non-existing product", async () => {
        const res = await request(app).get("/api/products/64f000000000000000000000");

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Product not found/i)
    })


    it("PATCH /api/products/:id", async () => {
        const res = await request(app)
            .patch(`/api/products/${productId}`)
            .send({ name: "Updated Product Name" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe("Updated Product Name")
    })


    it("PATCH /api/products/:id - should fail validation on invalid data", async () => {
        const res = await request(app)
            .patch(`/api/products/${productId}`)
            .send({ price: -50 });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).match(/Validation failed/i)
    })

    it("DELETE /api/products/:id - should soft delete product", async () => {
        const res = await request(app)
            .delete(`/api/products/${productId}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.isActive).toBe(false);
    })

})