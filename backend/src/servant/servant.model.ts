import { Schema, model } from "mongoose";
import { servantInterface } from "./servant.interface";


const servantSchema = new Schema<servantInterface>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "auth",
            required: true,
            unique: true,
        },

        image: {
            type: String,
            default: null,
        },

        bio: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },

        skills: {
            type: [String],
            default: [],
        },
        servantAddress:{
            type:String,
            required: true,

        },

        servantlocation: {
            type: String,
            required: true,
            trim: true,
        },

        hourlyPrice: {
            type: Number,
            required: true,
            min: 1,
        },

        availability: {
            type: Boolean,
            default: true,
        },

        isActive: {
            type: Boolean,
            default: true
        },

        embeddingText: {
            type: String,
            default: "",
        },
        embedding: {
            type: [Number],
            default: [],
            select: false,
        },
        embeddingModel: {
            type: String,
            default: "",
        },

    },
    {
        timestamps: true,
    }
);

export const Servant = model<servantInterface>(
    "Servant",
    servantSchema
);