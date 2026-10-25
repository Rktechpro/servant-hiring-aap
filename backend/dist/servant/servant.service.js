"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServantImageProfile = exports.deleteDataServant = exports.updateDataServant = exports.getServant = exports.createServant = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const servant_model_1 = require("./servant.model");
const createServant = async (userId, data, session) => {
    const existingServant = await servant_model_1.Servant.findOne({ userId });
    if (existingServant)
        throw new Error("Servant profile already exists");
    const payload = {
        userId,
        image: data.image,
        bio: data.bio,
        skills: data.skills,
        servantAddress: data.servantAddress,
        servantlocation: data.servantlocation,
        hourlyPrice: data.hourlyPrice,
        availability: data.availability,
    };
    const servant = await servant_model_1.Servant.create([payload], { session });
    return servant;
};
exports.createServant = createServant;
const getServant = async () => {
    const servant = await servant_model_1.Servant.find({ isActive: true })
        .populate({ path: "userId", select: "fullname email mobile role", })
        .sort({ createdAt: -1 });
    if (!servant) {
        return null;
    }
    return servant;
};
exports.getServant = getServant;
const updateDataServant = async (userId, data, session) => {
    const existingServant = await servant_model_1.Servant.findOne({
        userId,
    });
    if (!existingServant)
        throw new Error("Servant profile not found");
    const payload = {
        image: data.image,
        bio: data.bio,
        skills: data.skills,
        address: data.servantAddress,
        location: data.servantlocation,
        hourlyPrice: data.hourlyPrice,
        availability: data.availability,
    };
    const updateSeravant = await servant_model_1.Servant.findOneAndUpdate({ userId: userId }, { $set: [payload] }, {
        session, returnDocument: "after",
        runValidators: true,
    });
    return updateSeravant;
};
exports.updateDataServant = updateDataServant;
const deleteDataServant = async (userId, session) => {
    const deletedProfile = await servant_model_1.Servant.findOneAndDelete({
        userId,
    }, session);
    if (!deletedProfile) {
        throw new Error("Servant profile not found");
    }
    return deletedProfile;
};
exports.deleteDataServant = deleteDataServant;
// export const ServantImageProfile = async (userId: string, path: string) => {
//     try {
//         const url = `${process.env.S3_URL}/${path}`
//         const customers = await Servant.findOne({ userId });
//         if (!customers)
//             throw new Error("Servant profile not found");
//         const updatepath = await Servant.updateOne({ userId }, { $set: { image: url } })
//         return updatepath
//     } catch (err) {
//         throw err
//     }
// }
const ServantImageProfile = async (userId, file, session) => {
    const servants = await servant_model_1.Servant.findOne({ userId });
    if (!servants)
        throw new Error("Servant profile not found");
    const imageUrl = `/uploads/Servant/${file.filename}`;
    const oldImage = servants.image;
    servants.image = imageUrl;
    await servants.save({ session });
    if (oldImage?.startsWith('/uploads/Servant/')) {
        const oldPath = path_1.default.join(process.cwd(), oldImage.replace(/^\/+/, ""));
        if (oldPath !== file.path) {
            await promises_1.default.unlink(oldPath).catch(() => { });
        }
        return {
            image: servants.image
        };
    }
};
exports.ServantImageProfile = ServantImageProfile;
