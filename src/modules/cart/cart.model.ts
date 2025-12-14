import { Document, model, Schema, Types } from "mongoose";


export interface ICartItem {
    product: Types.ObjectId;
    quantity: number
}


export interface ICart extends Document {
    user: Types.ObjectId;
    items: ICartItem[],
    totalPrice: number
}

const cartItemSchema = new Schema<ICartItem>({
    product: {
        type: Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false })


const cartSchema = new Schema<ICart>({
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [cartItemSchema],
    totalPrice: {
        type: Number,
        default: 0,
        min: 0
    }
}, { timestamps: true });


export const Cart = model<ICart>("Cart", cartSchema);