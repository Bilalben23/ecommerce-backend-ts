import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { connectTestDB, disconnectTestDB } from "../setup/mongo-memory.js";
import * as ProductService from "../../src/modules/products/product.service.js";
import { Product } from "../../src/modules/products/product.model.js";

beforeAll(async () => {
    await connectTestDB();
})

afterAll(async () => {
    await disconnectTestDB();
})


describe("Product Service", () => {

    it("should create a product", async () => {
        const product = await ProductService.createProduct({
            name: "Test Product",
            description: "This is a test product description.",
            sku: "SKU123",
            price: 100,
            categories: ["Tech"],
            tags: [],
            images: [],
            stock: 10,
            ratings: {
                average: 0,
                totalRatings: 0,
                reviews: []
            },
            variants: [],
            metadata: {},
            isActive: true
        });

        expect(product).toHaveProperty("_id");
        expect(product.name).toBe("Test Product");
    })


    it("should get all products", async () => {
        const products = await ProductService.getAllProducts({});
        expect(products.length).toBeGreaterThan(0);
    })


    it("should get a product by ID", async () => {
        const created = await Product.create({
            name: "To Fetch",
            description: "desc",
            sku: "SKU123",
            price: 50,
            categories: [],
            tags: [],
            images: [],
            stock: 5,
            ratings: {
                average: 0,
                totalRatings: 0
            }
        })

        const found = await ProductService.getProductById(created._id.toString());
        expect(found.name).toBe("To Fetch");
    })


    it("should update a product", async () => {
        const prod = await Product.create({
            name: "Old",
            description: "old",
            sku: "OLD1",
            price: 40,
            categories: [],
            tags: [],
            images: [],
            stock: 3,
            ratings: {
                average: 0,
                totalRatings: 0
            }
        })

        const updated = await ProductService.updateProduct(prod._id.toString(), { name: "New" });

        expect(updated.name).toBe("New");
    })


    it("should soft delete a product", async () => {
        const prod = await Product.create({
            name: "Delete",
            description: "desc",
            sku: "DEL1",
            price: 20,
            categories: [],
            tags: [],
            images: [],
            stock: 1,
            ratings: {
                average: 0,
                totalRatings: 0
            }
        })

        const deleted = await ProductService.deleteProduct(prod._id.toString());
        expect(deleted.isActive).toBe(false);
    })
})