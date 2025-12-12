import express from 'express';
import { configDotenv } from "dotenv";
import productsRoutes from "./modules/products/product.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import cookieParser from "cookie-parser";

configDotenv();
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);

export default app;