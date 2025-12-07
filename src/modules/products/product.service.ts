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
 * Get all products with optional filters and pagination
 * @param filters - Optional Query filters (category, tags, isActive, etc.)
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of products to return per page (default: 10)
 * @returns Promise<IProduct[]> - The products for the requested page.
 */
export const getAllProducts = async (filters: Record<string, any> = {}, page = 1, limit = 10) => {
    const products = await Product.find({ ...filters, isActive: true })
        .skip((page - 1) * limit)
        .limit(limit);
    return products;
}


/**
 * count total number of products matching the filters
 * @param filters - Optional query filters (category, tags, isActive, ect.)
 * @returns number - Total count of matching products
 */
export const countProducts = (filters: Record<string, any> = {}) => {
    return Product.countDocuments(filters);
}



/**
 * Get a single product by ID
 * @param id - MongoDB ObjetId of the product
 * @throws Error - if product not found
 * @returns IProduct - document or null if not found
 */
export const getProductById = async (id: string) => {
    const product = await Product.findOne({ _id: id, isActive: true });
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