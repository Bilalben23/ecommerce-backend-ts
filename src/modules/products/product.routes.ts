import { Router } from 'express';
import * as ProductController from './product.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema } from './product.validation.js';

const router = Router();

/**
 * @route POST /api/products
 * @desc Create a new product
 */
router.post("/",
    validate(createProductSchema),
    ProductController.createProductHandler);

/**
 * @route GET /api/products
 * @desc Get all products(supports optional filters)
 */
router.get("/", ProductController.getAllProductsHandler);

/**
 * @route GET /api/products/:id
 * @desc Get a single product by ID
 */
router.get("/:id", ProductController.getProductByIdHandler);

/**
 * @route PATCH /api/products/:id
 * @desc Update an existing product by ID
 */
router.patch("/:id",
    validate(updateProductSchema),
    ProductController.updateProductHandler);

/**
 * @route DELETE /api/products/:id
 * @desc Soft delete a product (set - isActive=false)
 */
router.delete("/:id", ProductController.deleteProductHandler);


export default router;