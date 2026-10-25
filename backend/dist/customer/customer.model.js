"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "auth",
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: "",
    },
    addressCustomer: {
        type: String,
        default: "",
        trim: true,
    },
    locationCustomer: {
        type: String,
        default: "",
        trim: true,
    },
}, {
    timestamps: true,
});
exports.Customer = (0, mongoose_1.model)("Customer", customerSchema);
