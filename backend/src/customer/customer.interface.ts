import { Document, Types } from "mongoose";

export interface customerInterface extends Document {
    userId: Types.ObjectId;
    image?: string;
    address?: string;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
}