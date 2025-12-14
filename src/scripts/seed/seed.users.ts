import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { connectDB, disconnectDB } from "../../database/mongo.js";
import { User } from "../../modules/auth/user.model.js";

const NUM_USERS = Number(process.argv[0]) || 10;
const DEFAULT_PASSWORD = "Password123";


/**
 * Generate one fake user
 * @param role - 'user' or 'admin' (defaults to 'user')
 */
async function generateUser(role: "user" | "admin" = "user") {
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    return {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        role,
        avatar: faker.image.avatar()
    }
}



async function seedUsers() {
    if (process.env.NODE_ENV === "production") {
        throw new Error("❌ Seeding is disabled in production");
    }

    try {
        await connectDB();

        await User.deleteMany({});
        console.log("🧹 Users collection cleared");

        const users = [];

        // Admin user
        users.push(await generateUser("admin"));

        // Normal users
        for (let i = 0; i < NUM_USERS; i++) {
            users.push(await generateUser("user"));
        }

        await User.insertMany(users);

        console.log(`✅ ${users.length} users seeded`);
        console.log(`🔐 Default password ${DEFAULT_PASSWORD}`);

    } catch (err) {
        console.error("❌ Error seeding users:", err);
    } finally {
        await disconnectDB();
    }
}

seedUsers();