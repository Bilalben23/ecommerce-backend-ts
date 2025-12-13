import type { Request, Response, NextFunction } from "express-serve-static-core";
import { type ZodType, z } from "zod";


type Location = "body" | "query" | "params";

/**
 * 
 * @param schema - Zod schema to validate against
 * @param where - Request property to validate (body, query, params)
 * @param statusCode - Optional HTTP status code to return on failure (default 400)
 */
export const validate = (
    schema: ZodType,
    where: Location = "body",
    statusCode = 400
) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[where]);

        if (!result.success) {
            const formatted = z.treeifyError(result.error).errors;

            return res.status(statusCode).json({
                success: false,
                message: "Validation failed",
                errors: formatted
            })
        }

        next();
    }
