import type { Request, Response } from "express-serve-static-core";
import * as ProductService from './product.service.js';
import { handleControllerError } from "../../utils/handleError.js";


/**
 * create a new product
 * POST /api/products
 */
export const createProductHandler = async (req: Request, res: Response) => {
    try {
        const product = await ProductService.createProduct(req.body);
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });

    } catch (err) {
        handleControllerError(err, res);
    }
}


/**
 * GET /api/products - Get all products with optional query filters and pagination
 * @param filters - Optional query filters (category, tags, isActive, ect.)
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of products per page (default: 10)
 * @returns IProduct[] - Array of product documents for the requests page  
 */
export const getAllProductsHandler = async (req: Request, res: Response) => {
    try {

        const { page = "1", limit = "10", ...filters } = req.query as Record<string, any>;

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        const products = await ProductService.getAllProducts(filters, pageNum, limitNum);
        const total = await ProductService.countProducts(filters);
        const totalPages = Math.ceil(total / limitNum);
        const nextPage = page < totalPages ? pageNum + 1 : null;

        res.json({
            success: true,
            message: "Products fetched successfully",
            data: products,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
                nextPage
            }
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}


/**
 * GET /api/products/:id - Get a product by ID
 */
export const getProductByIdHandler = async (req: Request, res: Response) => {
    try {
        const product = await ProductService.getProductById(req.params.id);

        res.json({
            success: true,
            message: "Product fetched successfully",
            data: product
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}

/**
 * PATCH /api/product/:id - Update a product by Id
 */
export const updateProductHandler = async (req: Request, res: Response) => {
    try {
        const updated = await ProductService.updateProduct(req.params.id, req.body);

        res.json({
            success: true,
            message: "Product updated successfully",
            data: updated
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}


/**
 * DELETE /api/products/:id - Soft delete a product (set isActive=false)
 */
export const deleteProductHandler = async (req: Request, res: Response) => {
    try {
        const deleted = await ProductService.deleteProduct(req.params.id);

        res.json({
            success: true,
            message: "Product soft deleted successfully",
            data: deleted
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}