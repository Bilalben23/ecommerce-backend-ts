import { faker } from "@faker-js/faker";
import { Product } from "../../modules/products/product.model.js";
import { connectDB, disconnectDB } from "../../database/mongo.js";


// Get optional CLI argument: number of products
// Example usage: npx tsx src/scripts/seed/seedProducts.ts 50

const NUM_PRODUCTS = Number(process.argv[2]) || 30;

const categories = ["Electronics", "Clothing", "Books", "Toys", "Home", "Sports", "Beauty"];
const tags = ["New", "Hot", "Sale", "Limited", "Popular"];



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
    if (process.env.NODE_ENV === "production") {
        throw new Error("❌ Seeding is disabled in production");
    }

    try {
        await connectDB();

        // Clear existing products before inserting new ones
        await Product.deleteMany({});
        console.log("🧹 Products collection cleared");

        const products = Array.from({ length: NUM_PRODUCTS }, generateProductData);

        await Product.insertMany(products);
        console.log(`${NUM_PRODUCTS} dummy products inserted successfully!`)

    } catch (err) {
        console.error("❌ Error seeding products", err);
    } finally {
        await disconnectDB();
    }
}


seedProducts();