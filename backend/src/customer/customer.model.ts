import { Schema, model } from "mongoose";
import { customerInterface } from "./customer.interface";


const customerSchema = new Schema<customerInterface>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "auth",
            required: true,
            unique: true,
        },

        image: {
            type: String,
            default: "",
        },

        address: {
            type: String,
            default: "",
            trim: true,
        },

        location: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Customer = model<customerInterface>("Customer", customerSchema);