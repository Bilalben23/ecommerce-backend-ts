import { z } from "zod";

export const ProductSchema = z.object({
    name: z.string(),
    price: z.number().positive()
})

export function add(a: number, b: number): number {
    return a + b;
}
