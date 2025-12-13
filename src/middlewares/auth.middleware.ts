import { Response, Request, NextFunction } from "express-serve-static-core";
import passport from "passport";


export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
        if (err) return next(err);

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