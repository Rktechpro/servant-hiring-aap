import { Document, Types } from "mongoose";

export interface servantInterface extends Document {
    userId: Types.ObjectId;
    image?: string;
    bio?: string;
    skills: string[];
    servantAddress:string;
    servantlocation:string;
    hourlyPrice: number;
    availability: boolean;
    isActive: boolean;
    embeddingText?: string;
    embedding?: number[];
    embeddingModel?: string;
    createdAt: Date;
    updatedAt: Date;
}