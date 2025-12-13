import type { Response, Request, NextFunction } from "express-serve-static-core";
import passport from "passport";
import { UserDocument } from "../types/express/index.js";


export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    passport.authenticate("jwt", { session: false }, (err: any, user: UserDocument | false) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "An error occurred during authentication"
            })
        };

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Invalid or missing token."
            });
        }

        req.user = user;
        next();
    })(req, res, next)
};