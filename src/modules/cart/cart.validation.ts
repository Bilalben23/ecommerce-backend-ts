import { z } from "zod";


/**
 * Base schema for a cart item
 */
const basicSchema = z.object({
    productId: z.string()
        .nonempty("Product ID is required"),
    quantity: z.number()
        .int()
        .min(1, "Quantity must be at least 1")
});


/**
 * Schema for adding an item to the cart
 */
export const addItemSchema = basicSchema;

/**
 * Schema for updating an item quantity in the cart
 */
export const updateItemSchema = basicSchema;