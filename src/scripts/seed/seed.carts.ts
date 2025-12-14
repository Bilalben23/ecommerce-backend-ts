import { faker } from "@faker-js/faker";
import { connectDB, disconnectDB } from "../../database/mongo.js";
import { Cart } from "../../modules/cart/cart.model.js";
import { User } from "../../modules/auth/user.model.js";
import { IProduct, Product } from "../../modules/products/product.model.js";

const NUM_CARTS = Number(process.argv[0]) || 5;


/**
 * Generate cart items
 */
function generateCartItems(products: IProduct[]) {
    const itemsCount = faker.number.int({ min: 1, max: 3 });
    const items = [];
    let totalPrice = 0;

    for (let i = 0; i < itemsCount; i++) {
        const product = faker.helpers.arrayElement(products);
        const quantity = faker.number.int({ min: 1, max: 5 });

        totalPrice += product.price * quantity;

        items.push({
            product: product._id,
            quantity
        })
    }

    return { items, totalPrice };
}


async function seedCarts() {
    if (process.env.NODE_ENV === "production") {
        throw new Error("❌ Seeding is disabled in production");
    }

    try {
        await connectDB();

        await Cart.deleteMany({});
        console.log("🧹 Carts collection cleared");

        const users = await User.find();
        const products = await Product.find();

        if (!users.length || !products.length) {
            throw new Error("Users or products collection is empty. Seed them first.");
        }

        const carts = [];
        for (let i = 0; i < NUM_CARTS; i++) {
            const user = faker.helpers.arrayElement(users);
            const { items, totalPrice } = generateCartItems(products);

            carts.push({
                user: user._id,
                items,
                totalPrice
            });
        }

        await Cart.insertMany(carts);
        console.log(`✅ ${carts.length} carts seeded`);
    } catch (err) {
        console.error("❌ Error seeding carts:", err);
    } finally {
        await disconnectDB();
    }
}

seedCarts();