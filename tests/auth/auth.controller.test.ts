import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { connectTestDB, disconnectTestDB } from "../setup/mongo-memory.js";
import request from "supertest";
import app from "../../src/app.js";
import { User } from "../../src/modules/auth/user.model.js";
import { generateAccessToken } from "../../src/utils/jwt.js";
import { generatePasswordResetToken } from "../../src/modules/auth/auth.service.js";
import bcrypt from "bcrypt";

let refreshToken: string;
let userId: string;


beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await disconnectTestDB();
});


describe("Auth Controller", () => {
    const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        avatar: "https://example.com/avatar.png"
    }


    /* ------------------------------------------ */
    /*                 REGISTER                   */
    /* ------------------------------------------ */

    it("POST /api/auth/register - should register a new user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send(userData);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("_id");
        expect(res.body.data.email).toBe(userData.email);

        userId = res.body.data._id;
    });


    it("POST /api/auth/register - should fail for duplicate email", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send(userData);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Email already in use/);
    });


    it("POST /api/auth/register - should fail validation (weak password)", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Weak Pass",
                email: "weak@example.com",
                password: "password", // no number
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Validation failed/i);
    });


    it("POST /api/auth/register - should fail validation (invalid avatar URL)", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Bad Avatar",
                email: "avatar@example.com",
                password: "password123",
                avatar: "not-a-url"
            })

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    })


    /* ------------------------------------------ */
    /*                   LOGIN                    */
    /* ------------------------------------------ */

    it("POST /api/auth/login - should login user and return tokens", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: userData.email,
                password: userData.password
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe(userData.email);
        expect(res.body.data.accessToken).toBeDefined();

        // save refresh token from cookie
        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();

        const match = cookies[0].match(/refreshToken=([^;]+)/);
        if (match) refreshToken = match[1];
    });

    it("POST /api/auth/login - should fail with wrong password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: userData.email,
                password: "wongpassword"
            })

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/Invalid credentials/i)
    });


    /* ------------------------------------------ */
    /*               REFRESH TOKEN                */
    /* ------------------------------------------ */

    it("POST /api/auth/refresh-token - should refresh access token", async () => {
        const res = await request(app)
            .post("/api/auth/refresh-token")
            .set("Cookie", [`refreshToken=${refreshToken}`]);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.accessToken).toBeDefined();
    });

    it("POST /api/auth/refresh-token - should fail without cookie", async () => {
        const res = await request(app)
            .post("/api/auth/refresh-token");

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    })


    /* ------------------------------------------ */
    /*                  Profile                   */
    /* ------------------------------------------ */

    it("GET /api/auth/me - should get user profile", async () => {
        const accessToken = generateAccessToken({
            _id: userId,
            role: "user"
        });

        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBe(userId);
    })


    /* ------------------------------------------ */
    /*         PASSWORD RESET REQUEST             */
    /* ------------------------------------------ */

    it("POST /api/auth/request-password-reset - should request password reset", async () => {
        const res = await request(app)
            .post("/api/auth/request-password-reset")
            .send({ email: userData.email });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/Password reset link sent/i);
    });

    it("POST /api/auth/request-password-reset - should fail validation (bad email)", async () => {
        const res = await request(app)
            .post("/api/auth/request-password-reset")
            .send({ email: "not-an-email" });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    })


    /* ------------------------------------------ */
    /*               RESET PASSWORD              */
    /* ------------------------------------------ */

    it("POST /api/auth/reset-password - should reset password using token", async () => {
        const rawToken = await generatePasswordResetToken(userData!.email);

        const res = await request(app)
            .post("/api/auth/reset-password")
            .query({ token: rawToken })
            .send({ password: "newPassword123" });

        const user = await User.findOne({ email: userData.email });
        const match = await bcrypt.compare("newPassword123", user!.password);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(match).toBe(true);
        expect(res.body.message).toMatch(/Password updated successfully/i);
    })


    it("POST /api/auth/reset-password - should fail without token", async () => {
        const res = await request(app)
            .post("/api/auth/reset-password")
            .send({ password: "newPassword" });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    })


    it("POST /api/auth/reset-password - should fail validation (weak password)", async () => {
        const res = await request(app)
            .post("/api/auth/reset-password")
            .query({ token: "someToken" })
            .send({ password: "password" });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    })
})

