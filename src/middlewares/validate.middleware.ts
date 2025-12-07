import { Request, Response, NextFunction } from "express-serve-static-core";
import { type ZodType, z } from "zod";


type Location = "body" | "query" | "params";

/**
 * 
 * @param schema - Zod schema to validate against
 * @param where - Request property to validate (body, query, params)
 */
export const validate = (schema: ZodType, where: Location = "body") =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[where]);

        if (!result.success) {
            const formatted = z.treeifyError(result.error);

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: formatted
            })
        }

        next();
    }
