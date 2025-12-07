import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import { Product } from "../../modules/products/product.model.js";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce";

// Get optional CLI argument: number of products
// Example usage: tsx src/scripts/seed/seedProducts.ts 50
const NUM_PRODUCTS = Number(process.argv[2]) || 30;

const categories = ["Electronics", "Clothing", "Books", "Toys", "Home", "Sports", "Beauty"];
const tags = ["New", "Hot", "Sale", "Limited", "Popular"];

/**
 * Connect to MongoDB database
 */
async function connectDB() {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");
}

/**
 * Disconnect from the MongoDB database
 */
async function disconnectedDB() {
    await mongoose.connection.close();
    console.log("Disconnected from DB")
}


/**
 * Generate one fake product object using Fake
 * @returns {object} a single product with fake data
 */
function generateProductData() {
    const name = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const sku = faker.string.uuid();
    const price = parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 }));
    const discount = faker.number.int({ min: 0, max: 50 });
    const productCategories = faker.helpers.arrayElements(categories, faker.number.int({ min: 1, max: 2 }));
    const productTags = faker.helpers.arrayElements(tags, faker.number.int({ min: 1, max: 3 }));
    const images = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.image.url());
    const stock = faker.number.int({ min: 0, max: 100 });

    const variants = [
        {
            color: faker.color.human(),
            size: faker.helpers.arrayElement(["S", "M", "L", "XL"])
        }
    ];

    const ratings = {
        average: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
        totalRatings: faker.number.int({ min: 0, max: 200 }),
        reviews: []
    };


    const metaData = {
        brand: faker.commerce.product(),
        warranty: faker.datatype.boolean() ? `${faker.number.int({ min: 1, max: 5 })}` : undefined
    }

    return {
        name,
        description,
        sku,
        price,
        discount,
        categories: productCategories,
        tags: productTags,
        images,
        stock,
        variants,
        ratings,
        metaData,
        isActive: true
    }
}


/**
 * Seed the database with a batch of dummy products
 */
async function seedProducts() {
    try {
        await connectDB();

        // Clear existing products before inserting new ones
        await Product.deleteMany({});
        console.log("Existing products cleared");

        const products = Array.from({ length: NUM_PRODUCTS }, generateProductData);

        await Product.insertMany(products);
        console.log(`${NUM_PRODUCTS} dummy products inserted successfully!`)

    } catch (err) {
        console.error("Error seeding products");
    } finally {
        await disconnectedDB();
    }
}


seedProducts();

/**
 * Run this script:
 * npx tsx src/scripts/seed/seedProducts.ts
 */
