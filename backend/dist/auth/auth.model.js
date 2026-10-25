"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authModel = void 0;
const mongoose_1 = require("mongoose");
const auth_enum_1 = require("./auth.enum");
const bcrypt_1 = __importDefault(require("bcrypt"));
const authSchema = new mongoose_1.Schema({
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
        enum: Object.values(auth_enum_1.RoleEnum),
        default: auth_enum_1.RoleEnum.CUSTOMER
    }
}, { timestamps: true });
authSchema.pre("save", async function () {
    this.password = (await bcrypt_1.default.hash(this.password, 10)).toString();
});
exports.authModel = (0, mongoose_1.model)("auth", authSchema);
