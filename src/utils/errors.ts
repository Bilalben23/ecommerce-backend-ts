/**
 * Custom API error with HTTP status code
 * 
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 500)
 */
export class ApiError extends Error {
    statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApiError"
    }
}