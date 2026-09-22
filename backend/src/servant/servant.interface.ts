import { Document, Types } from "mongoose";

export interface servantInterface extends Document {
    userId: Types.ObjectId;
    image?: string;
    bio?: string;
    skills: string[];
    location: string;
    hourlyPrice: number;
    availability: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}