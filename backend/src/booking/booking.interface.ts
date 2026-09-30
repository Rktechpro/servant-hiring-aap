import { Document, Types } from "mongoose";
import { bookingStatus } from "./booking.enum";


export interface bookingInterface extends Document {
    customerId: Types.ObjectId;
    servantId: Types.ObjectId;
    bookingDate: Date;
    startTime: string;
    endTime: string;
    hours: number;
    hourlyPrice: number;
    totalAmount: number;
    location: string;
    address: string;
    status: bookingStatus;
    createdAt: Date;
    updatedAt: Date;
}