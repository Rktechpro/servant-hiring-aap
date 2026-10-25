"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servant = void 0;
const mongoose_1 = require("mongoose");
const servantSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    servantAddress: {
        type: String,
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
}, {
    timestamps: true,
});
exports.Servant = (0, mongoose_1.model)("Servant", servantSchema);
