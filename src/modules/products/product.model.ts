import { Document, model, Schema, Types } from "mongoose";


export interface IProduct extends Document {
    name: string;
    description: string;
    sku: string;
    price: number;
    discount?: number;
    categories: string[];
    tags: string[];
    images: string[];
    stock: number;
    variants?: {
        color?: string;
        size?: string;
        [key: string]: any
    }[];
    ratings: {
        average: number;
        totalRatings: number;
        reviews?: {
            user: Types.ObjectId;
            rating: number;
            comment?: string;
            createdAt: Date
        }[]
    };
    metadata?: Record<string, any>;
    isActive: boolean
}


const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    categories: [
        {
            type: String,
            index: true
        }
    ],
    tags: [
        {
            type: String,
            index: true
        }
    ],
    images: [
        { type: String }
    ],
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    variants: [
        {
            color: String,
            size: String,
            type: Map,
            of: String
        }
    ],
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalRatings: {
            type: Number,
            default: 0,
            min: 0
        },
        reviews: [
            {
                user: {
                    type: Types.ObjectId,
                    ref: "User"
                },
                rating: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 5
                },
                comment: String,
                createdAt: {
                    type: Date,
                    default: Date.now()
                }
            }
        ]
    },
    metadata: {
        type: Schema.Types.Mixed,
        default: {}
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})


export const Product = model('Product', productSchema);