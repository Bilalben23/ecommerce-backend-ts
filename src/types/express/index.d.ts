import { Document, Types } from "mongoose";

interface UserDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    role: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
}

// Extend the 'express-serve-static-core' module's Request interface
declare module 'express-serve-static-core' {
    interface Request {
        user?: UserDocument;
    }
}