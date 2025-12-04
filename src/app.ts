import express from 'express';
import productsRoutes from "./modules/products/product.routes.js";
import { configDotenv } from "dotenv";
configDotenv();

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/products", productsRoutes);


export default app;