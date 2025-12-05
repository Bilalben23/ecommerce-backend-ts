import { ApiError } from "../../utils/errors.js";
import { Product, type IProduct } from "./product.model.js";


/**
 * Create a new Product
 * @param data - Partial product data
 * @returns IProduct - Newly created product document
 */
export const createProduct = async (data: Partial<IProduct>) => {
    const product = await Product.create(data);
    return product;
}


/**
 * Get all products with optional filters
 * @param filters - Optional Query filters (category, tags, isActive, etc.)
 * @returns IProduct[] - Array of product documents
 */
export const getAllProducts = async (filters?: Record<string, any>) => {
    const products = await Product.find(filters);
    return products;
}


/**
 * Get a single product by ID
 * @param id - MongoDB ObjetId of the product
 * @throws Error - if product not found
 * @returns IProduct - document or null if not found
 */
export const getProductById = async (id: string) => {
    const product = await Product.findById(id);
    if (!product) throw new ApiError("Product not found", 404);
    return product;
}


/**
 * 
 * @param id - MongoDB ObjetId of the product
 * @param data - Partial product data to update
 * @throws Error - if product not found
 * @returns IProduct - Updated product document
 */
export const updateProduct = async (id: string, data: Partial<IProduct>) => {
    const updated = await Product.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    })
    if (!updated) throw new ApiError("Product not found", 404);
    return updated;
}


/**
 * 
 * @param id - MongoDB ObjetId of the product
 * @throws Error - if product not found
 * @returns IProduct - Soft-deleted product document
 */
export const deleteProduct = async (id: string) => {
    const deleted = await Product.findByIdAndUpdate(id,
        { isActive: false },
        { new: true }
    );
    if (!deleted) throw new ApiError("Product not found", 404);
    return deleted;
}