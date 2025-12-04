import { describe, it, expect } from "vitest";
import { add } from "../../src/modules/products/product.controller.js";

describe("Product Controller", () => {
    it("adds numbers correctly", () => {
        expect(add(2, 3)).toBe(5);
    });
});