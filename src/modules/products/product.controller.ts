import { Request, Response } from "express-serve-static-core";
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
 * Get all products with optional query filters
 * GET /api/products
 */
export const getAllProductsHandler = async (req: Request, res: Response) => {
    try {
        const filters = req.query as Record<string, any>;
        const products = await ProductService.getAllProducts(filters);

        res.json({
            success: true,
            message: "Products fetched successfully",
            data: products
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}


/**
 * Get a product by ID
 * GET /api/products/:id
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
 * Update a product by Id
 * PATCH /api/product/:id
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
 * Soft delete a product (set isActive=false)
 * DELETE /api/products/:id
 */
export const deleteProductHandler = async (req: Request, res: Response) => {
    try {
        const deleted = await ProductService.deleteProduct(req.params.id);

        res.json({
            success: true,
            message: "Product soft deleted successfully",
            date: deleted
        })

    } catch (err) {
        handleControllerError(err, res);
    }
}