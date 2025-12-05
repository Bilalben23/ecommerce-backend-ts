import { Router } from 'express';
import * as ProductController from './product.controller.js';

const router = Router();


router.post("/", ProductController.createProductHandler);
router.get("/", ProductController.getAllProductsHandler);
router.get("/:id", ProductController.getProductByIdHandler);
router.patch("/:id", ProductController.updateProductHandler);
router.delete("/:id", ProductController.deleteProductHandler);


export default router;