import { ClientSession } from "mongoose";
import { createCustomerDto } from "./customer.dto";
import { Customer } from "./customer.model";
import path from "path";
import fs from "fs/promises"

export const createCustomer = async (userId: string, data: createCustomerDto, session: ClientSession) => {
    const customer = await Customer.findOne({ userId })

    if (customer)
        throw new Error("Customer profile already exists");

    const payload = {
        userId,
        image: data.image,
        address: data.address,
        location: data.location,
    }

    const customers = await Customer.create([payload], { session })
    return customers
}

export const getCustomer = async (userId: string) => {
    const customer = await Customer.findOne({ userId, })
        .populate({
            path: "userId",
            select: "fullname email mobile role -_id",
        }).select("-_id ");

    if (!customer) {
        return null
    }
    return customer;
};

export const updateCustomer = async (
    userId: string,
    data: createCustomerDto,
    session: ClientSession
) => {
    const payload = {
        image: data.image,
        address: data.address,
        location: data.location,
    };

    const customer = await Customer.findOneAndUpdate(
        { userId },
        { $set: payload },
        { session, }
    );

    if (!customer)
        throw new Error("Customer profile not found");

    return customer;
};

export const deleteCustomer = async (
    userId: string,
    session: ClientSession
) => {
    const customer = await Customer.findOneAndDelete(
        { userId },
        { session }
    );

    if (!customer)
        throw new Error("Customer profile not found");

    return customer;
};

export const updateImageProfile = async (userId: string, file: Express.Multer.File, session: ClientSession) => {

    const customers = await Customer.findOne({ userId })

    if (!customers)
        throw new Error("Customer profile not found");

    const imageUrl = `/uploads/customers/${file.filename}`;
    const oldImage = customers.image;

    customers.image = imageUrl;
    await customers.save({ session });

    if (oldImage?.startsWith('/uploads/customers/')) {
        const oldPath = path.join(process.cwd(),
            oldImage.replace(/^\/+/, "")
        );

        if (oldPath !== file.path) {
            await fs.unlink(oldPath).catch(() => { })
        }

        return {
            image: customers.image,
        }
    }
}