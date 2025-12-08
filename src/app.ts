import express from 'express';
import { configDotenv } from "dotenv";
import productsRoutes from "./modules/products/product.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";

configDotenv();
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/products", productsRoutes);
app.use("/apu/cart", cartRoutes);

export default app;