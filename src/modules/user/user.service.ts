import { ApiError } from "../../utils/errors.js";
import { User } from "./user.model.js"
import bcrypt from "bcrypt";


/**
 * Create a new user
 * @param name - User's full name
 * @param email - Unique email address
 * @param password - Plain text password
 * @returns Newly created user document
 */
export const createUser = async (name: string, email: string, password: string) => {
    const existing = await User.find({ email });
    if (existing) throw new ApiError("Email already in use", 400);

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashed,
    })

    return user;
}


/**
 * Get a user by email (used for login)
 * @param email - User email
 * @returns User document or null
 */
export const getUserByEmail = async (email: string) => {
    return User.findOne({ email });
}


/**
 * Get a user by ID
 * @param id - MongoDB User ID
 * @returns User document
 * @throws 404 if user not found
 */
export const getUser = async (id: string) => {
    const user = await User.findById(id);
    if (!user) throw new ApiError("User not found", 404);
    return user;
}


/**
 * Compare a plaintext password with a hashed password
 * @param password - Provided plaintext password
 * @param hashed - Stored hashed password
 * @returns Boolean result
 */
export const verifyPassword = async (password: string, hashed: string) => {
    return bcrypt.compare(password, hashed);
} 