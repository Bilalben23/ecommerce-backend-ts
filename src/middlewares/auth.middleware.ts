import { Response, Request, NextFunction } from "express-serve-static-core";


export const authMiddleware = async (res: Response, req: Request, next: NextFunction) => {
    next();
}