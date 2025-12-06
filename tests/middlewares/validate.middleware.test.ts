import { describe, it, vi, expect } from "vitest";
import { z } from "zod";
import { Request, Response } from "express-serve-static-core";
import express from "express";
import request from "supertest";
import { validate } from "../../src/middlewares/validate.middleware.js";


const makeApp = (middleware: any) => {
    const app = express();

    app.post("/test", middleware, (req, res) => {
        res.status(200).json({
            success: true,
            data: req.body
        })
    })

    return app;
}

describe("Validate middleware", async () => {
    const schema = z.object({
        name: z.string(),
        price: z.number().positive()
    });


    it("should call next() when body is valid", async () => {
        const nextSPy = vi.fn();

        const req = {
            body: {
                name: "Product A",
                price: 10
            }
        } as unknown as Request;

        const res = {} as Response;

        validate(schema)(req, res, nextSPy);

        expect(nextSPy).toHaveBeenCalledOnce();
    })


    it("should return 400 when body is invalid", async () => {
        const app = makeApp(validate(schema));

        const response = await request(app)
            .post("/test")
            .send({
                name: "Invalid Product",
                price: -5
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/Validation failed/i)
    })


    it("should validate params", async () => {
        const idSchema = z.object({
            id: z.uuid()
        })


        const app = express();
        app.get("/item/:id", validate(idSchema, "params"), (req, res) => {
            res.status(200).json({
                success: true,
                id: req.params.id
            })
        })

        const invalid = await request(app).get("/item/123");
        expect(invalid.status).toBe(400);

        const validUUID = crypto.randomUUID();
        const valid = await request(app).get(`/item/${validUUID}`);

        expect(valid.status).toBe(200);
        expect(valid.body.id).toBe(validUUID);
    })


    it("should validate query", async () => {
        const querySchema = z.object({
            search: z.string().min(3)
        })

        const app = express();
        app.get("/search", validate(querySchema, "query"), (req, res) => {
            res.status(200).json({
                success: true,
                q: req.query.search
            })
        })

        const bad = await request(app).get("/search?search=ab");
        expect(bad.status).toBe(400);


        const good = await request(app).get("/search?search=hello");
        expect(good.status).toBe(200);
        expect(good.body.q).toBe("hello");
    })
})