import { z } from "zod";

const stringArray = z
    .array(z.string().trim().min(1, "String cannot be empty"))
    .default([]);


const variantSchema = z.object({
    color: z.string().optional(),
    size: z.string().optional()
})


const reviewSchema = z.object({
    user: z
        .string()
        .min(1, "user ID is required"),
    rating: z
        .number()
        .min(0, "Rating must be at least 0")
        .max(5, "Rating cannot exceed 5"),
    comment: z.string().optional(),
    createdAt: z.date().optional()
})


const ratingsSchema = z.object({
    average: z.number()
        .min(0, "Average rating must be between 0 and 5")
        .max(5, "Average rating must be between 0 and 5")
        .default(0),
    totalRatings: z.number()
        .min(0, "Total ratings cannot be negative")
        .default(0),
    reviews: z.array(reviewSchema).default([])
})


const productBaseSchema = z.object({
    name: z
        .string({ error: "Product name is required" })
        .trim()
        .min(2, "Name must be at least 2 characters"),

    description: z
        .string({ error: "Product description is require" })
        .min(10, "Description must be at least 10 characters"),

    sku: z
        .string({ error: "Sku is required" })
        .trim()
        .min(3, "SKU must be at least 3 character"),

    price: z
        .number({ error: "Price is required" })
        .min(0, "Price cannot be negative"),

    discount: z
        .number()
        .min(0, "Discount cannot be negative")
        .max(90, "Discount cannot exceed 90%")
        .optional()
        .default(0),

    categories: stringArray,
    tags: stringArray,
    images: stringArray,

    stock: z
        .number()
        .min(0, "Stock cannot be negative")
        .default(0),

    variants: z
        .array(variantSchema)
        .optional()
        .default([]),

    ratings: ratingsSchema.default({
        average: 0,
        totalRatings: 0,
        reviews: []
    }),

    metadata: z
        .record(z.string(), z.any())
        .optional()
        .default({}),

    isActive: z.boolean()
        .default(true)
})



export const createProductSchema = productBaseSchema;

export const updateProductSchema = productBaseSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;