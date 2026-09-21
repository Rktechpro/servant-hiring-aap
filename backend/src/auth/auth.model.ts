import { Schema, model } from "mongoose";
import { RoleEnum } from "./auth.enum";
import { authSingupInterface } from "./auth.interface";
import bcrypt from 'bcrypt'


const authSchema = new Schema<authSingupInterface>({
    fullname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(RoleEnum),
        default: RoleEnum.CUSTOMER
    }
}, { timestamps: true })

authSchema.pre("save", async function () {
    this.password = (await bcrypt.hash(this.password, 10)).toString()
})

export const authModel = model<authSingupInterface>("auth", authSchema)