import { Customer } from "./customer.model";
import path from "path";
import fs from "fs/promises";
export const createCustomer = async (userId, data, session) => {
    const customer = await Customer.findOne({ userId });
    if (customer)
        throw new Error("Customer profile already exists");
    const payload = {
        userId,
        image: data.image,
        addressCustomer: data.addressCustomer,
        locationCustomer: data.locationCustomer,
    };
    const customers = await Customer.create([payload], { session });
    return customers;
};
export const getCustomer = async (userId) => {
    const customer = await Customer.findOne({ userId, })
        .populate({
        path: "userId",
        select: "fullname email mobile role -_id",
    }).select("-_id ");
    if (!customer) {
        return null;
    }
    return customer;
};
export const updateCustomer = async (userId, data, session) => {
    const payload = {
        image: data.image,
        addressCustomer: data.addressCustomer,
        locationCustomer: data.locationCustomer,
    };
    const customer = await Customer.findOneAndUpdate({ userId }, { $set: payload }, { session, });
    if (!customer)
        throw new Error("Customer profile not found");
    return customer;
};
export const deleteCustomer = async (userId, session) => {
    const customer = await Customer.findOneAndDelete({ userId }, { session });
    if (!customer)
        throw new Error("Customer profile not found");
    return customer;
};
export const updateImageProfile = async (userId, file, session) => {
    const customers = await Customer.findOne({ userId });
    if (!customers)
        throw new Error("Customer profile not found");
    const imageUrl = `/uploads/customers/${file.filename}`;
    const oldImage = customers.image;
    customers.image = imageUrl;
    await customers.save({ session });
    if (oldImage?.startsWith('/uploads/customers/')) {
        const oldPath = path.join(process.cwd(), oldImage.replace(/^\/+/, ""));
        if (oldPath !== file.path) {
            await fs.unlink(oldPath).catch(() => { });
        }
        return {
            image: customers.image,
        };
    }
};
