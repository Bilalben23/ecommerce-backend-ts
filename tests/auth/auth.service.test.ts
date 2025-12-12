import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { connectTestDB, disconnectTestDB } from "../setup/mongo-memory.js";
import * as AuthService from "../../src/modules/auth/auth.service.js";
import bcrypt from "bcrypt";
import { User } from "../../src/modules/auth/user.model.js";


beforeAll(async () => {
    await connectTestDB();
})

afterAll(async () => {
    await disconnectTestDB();
})


describe("Auth Service", () => {
    it("createUser - should create a user successfully", async () => {
        const user = await AuthService.createUser(
            "Bilal Test",
            "bilal@example.com",
            "password123"
        )

        expect(user).toBeDefined();
        expect(user.email).toBe("bilal@example.com");

        const match = await bcrypt.compare("password123", user.password);
        expect(match).toBe(true);
    });


    it("createUser - should throw error if email already exists", async () => {
        await expect(
            AuthService.createUser("Test", "bilal@example.com", "pass")
        ).rejects.toThrow(/Email already in use/i)
    });


    it("getUserByEmail - should find existing user", async () => {
        const user = await AuthService.getUserByEmail("bilal@example.com");

        expect(user).toBeDefined();
        expect(user!.email).toBe("bilal@example.com");
    });


    it("getUserByEmail - should return null for non-existing user", async () => {
        const user = await AuthService.getUserByEmail("notfound@example.com");
        expect(user).toBeNull();
    });


    it("getUser - should throw 404 for invalid ID", async () => {
        await expect(
            AuthService.getUser("64f000000000000000000000")
        ).rejects.toThrow(/User not found/i);
    });


    it("verifyPassword - should return true for matching password", async () => {
        const user = await AuthService.getUserByEmail("bilal@example.com");
        const match = await AuthService.verifyPassword("password123", user!.password);

        expect(match).toBe(true);
    });

    it("verifyPassword - should return false for invalid password", async () => {
        const user = await AuthService.getUserByEmail("bilal@example.com");
        const match = await AuthService.verifyPassword("wrong-pass", user!.password);

        expect(match).toBe(false);
    });


    it("generatePasswordResetToken - should generate reset token and store hash", async () => {
        const token = await AuthService.generatePasswordResetToken("bilal@example.com");

        expect(token).toBeDefined();
        expect(token.length).toBeGreaterThan(10);

        const user = await User.findOne({ email: "bilal@example.com" });
        expect(user!.passwordResetToken).toBeDefined();
        expect(user!.passwordResetExpires).toBeDefined();
    });


    it("resetPassword - should reset password with valid token", async () => {

        const rawToken = await AuthService.generatePasswordResetToken("bilal@example.com");

        const userBefore = await AuthService.getUserByEmail("bilal@example.com");
        const oldHash = userBefore!.password;

        await AuthService.resetPassword(rawToken, "newPassword123");

        const userAfter = await AuthService.getUserByEmail("bilal@example.com");

        // password should be updated
        expect(userAfter!.password).not.toBe(oldHash);

        const match = await bcrypt.compare("newPassword123", userAfter!.password);
        expect(match).toBe(true);
    });


    it("resetPassword - should throw for invalid or expired token", async () => {
        await expect(
            AuthService.resetPassword("fake-token", "pass")
        ).rejects.toThrow(/Invalid or expired/i);
    });
})