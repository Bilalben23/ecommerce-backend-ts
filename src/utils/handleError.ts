import { ApiError } from "./apiError.js";
import type { Response } from "express-serve-static-core";


/**
 * Handles controller errors in a unified way.
 * - Sends proper status + message for ApiError instances
 * - Falls back to a generic 500 response for unexpected errors
 * 
 * @param err - The thrown error
 * @param res - Express response object
 */
export function handleControllerError(err: unknown, res: Response) {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    })
}