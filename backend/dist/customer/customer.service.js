"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImageProfile = exports.deleteCustomer = exports.updateCustomer = exports.getCustomer = exports.createCustomer = void 0;
const customer_model_1 = require("./customer.model");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const createCustomer = async (userId, data, session) => {
    const customer = await customer_model_1.Customer.findOne({ userId });
    if (customer)
        throw new Error("Customer profile already exists");
    const payload = {
        userId,
        image: data.image,
        addressCustomer: data.addressCustomer,
        locationCustomer: data.locationCustomer,
    };
    const customers = await customer_model_1.Customer.create([payload], { session });
    return customers;
};
exports.createCustomer = createCustomer;
const getCustomer = async (userId) => {
    const customer = await customer_model_1.Customer.findOne({ userId, })
        .populate({
        path: "userId",
        select: "fullname email mobile role -_id",
    }).select("-_id ");
    if (!customer) {
        return null;
    }
    return customer;
};
exports.getCustomer = getCustomer;
const updateCustomer = async (userId, data, session) => {
    const payload = {
        image: data.image,
        addressCustomer: data.addressCustomer,
        locationCustomer: data.locationCustomer,
    };
    const customer = await customer_model_1.Customer.findOneAndUpdate({ userId }, { $set: payload }, { session, });
    if (!customer)
        throw new Error("Customer profile not found");
    return customer;
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (userId, session) => {
    const customer = await customer_model_1.Customer.findOneAndDelete({ userId }, { session });
    if (!customer)
        throw new Error("Customer profile not found");
    return customer;
};
exports.deleteCustomer = deleteCustomer;
const updateImageProfile = async (userId, file, session) => {
    const customers = await customer_model_1.Customer.findOne({ userId });
    if (!customers)
        throw new Error("Customer profile not found");
    const imageUrl = `/uploads/customers/${file.filename}`;
    const oldImage = customers.image;
    customers.image = imageUrl;
    await customers.save({ session });
    if (oldImage?.startsWith('/uploads/customers/')) {
        const oldPath = path_1.default.join(process.cwd(), oldImage.replace(/^\/+/, ""));
        if (oldPath !== file.path) {
            await promises_1.default.unlink(oldPath).catch(() => { });
        }
        return {
            image: customers.image,
        };
    }
};
exports.updateImageProfile = updateImageProfile;
