import { ApiError } from "../../utils/errors.js";
import { User } from "./user.model.js"
import bcrypt from "bcrypt";
import crypto from "crypto";


/**
 * Create a new user
 * @param name - User's full name
 * @param email - Unique email address
 * @param password - Plain text password
 * @param avatar - Optional URL/path to user's avatar
 * @returns Newly created user document
 */
export const createUser = async (name: string, email: string, password: string, avatar = "") => {
    const existingUser = await User.findOne({ email });

    if (existingUser) throw new ApiError("Email already in use", 400);

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashed,
        avatar
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


/**
 * Generate a password reset token and save its hash in DB
 * @param email - User email
 * @returns raw reset token to send via email
 */
export const generatePasswordResetToken = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError("User not found", 404);

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256")
        .update(resetToken).
        digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    return resetToken;
}


/**
 * Reset user password using token
 * @param token - Raw reset token from email
 * @param newPassword - New plaintext password
 * @returns User with updated password
 */
export const resetPassword = async (token: string, newPassword: string) => {
    const hashedToken = crypto.createHash("sha256")
        .update(token)
        .digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {
            $gt: new Date()
        }
    })

    if (!user) throw new ApiError("Invalid or expired password reset token", 400);

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return user;
}