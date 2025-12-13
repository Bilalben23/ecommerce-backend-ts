import { beforeAll, describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import passport from "passport";
import { authMiddleware } from "../../src/middlewares/auth.middleware.js";
import { UserDocument } from "../../src/types/express/index.js";

/**
 * Mock passport
 */
vi.mock("passport", () => ({
    default: {
        authenticate: vi.fn()
    }
}));

/**
 * Helpers
 */
const mockReq = () => ({
    headers: {}
} as Partial<Request> as Request);

const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockRejectedValue(res);
    return res as Response;
}

const mockNext = vi.fn() as NextFunction;



beforeAll(() => {
    vi.clearAllMocks();
})


describe("authMiddleware", () => {

    it("returns 500 if passport returns an error", async () => {
        const req = mockReq();
        const res = mockRes();

        (passport.authenticate as any).mockImplementation(
            (_strategy: string, _opts: any, callback: Function) => {
                return (_req: Request, _res: Response, _next: NextFunction) => {
                    callback(new Error("Passport error"), null);
                };
            }
        );

        await authMiddleware(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "An error occurred during authentication",
        });
        expect(mockNext).not.toHaveBeenCalled();
    });


    it("returns 401 if user is not authenticated", async () => {
        const req = mockReq();
        const res = mockRes();

        (passport.authenticate as any).mockImplementation(
            (_strategy: string, _opts: any, callback: Function) => {
                return (_req: Request, _res: Response, _next: NextFunction) => {
                    callback(null, false);
                };
            }
        );

        await authMiddleware(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Authentication required. Invalid or missing token.",
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("attaches user to request and calls next()", async () => {
        const req = mockReq();
        const res = mockRes();

        const mockUser = {
            _id: "user-id",
            email: "test@example.com",
            role: "user",
        };

        (passport.authenticate as any).mockImplementation(
            (_strategy: string, _opts: any, callback: Function) => {
                return (_req: Request, _res: Response, _next: NextFunction) => {
                    callback(null, mockUser);
                };
            }
        );

        await authMiddleware(req, res, mockNext);

        expect(req.user).toEqual(mockUser);
        expect(mockNext).toHaveBeenCalledOnce();
    });
})