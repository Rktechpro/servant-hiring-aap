import { Document, Types } from "mongoose";

export interface customerInterface extends Document {
    userId: Types.ObjectId;
    image?: string;
    addressCustomer?: string;
    locationCustomer?: string;
    createdAt: Date;
    updatedAt: Date;
}