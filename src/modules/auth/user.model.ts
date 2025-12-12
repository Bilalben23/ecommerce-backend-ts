import { model, Schema, Types } from "mongoose";


export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    avatar?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    avatar: {
        type: String,
        default: ""
    },
    passwordResetToken: String,
    passwordResetExpires: Date

}, { timestamps: true });


export const User = model<IUser>("User", userSchema);