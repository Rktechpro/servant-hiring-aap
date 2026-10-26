import path from 'path';
import fs from 'fs/promises';
import { Servant } from "./servant.model";
export const createServant = async (userId, data, session) => {
    const existingServant = await Servant.findOne({ userId });
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
    const servant = await Servant.create([payload], { session });
    return servant;
};
export const getServant = async () => {
    const servant = await Servant.find({ isActive: true })
        .populate({ path: "userId", select: "fullname email mobile role", })
        .sort({ createdAt: -1 });
    if (!servant) {
        return null;
    }
    return servant;
};
export const updateDataServant = async (userId, data, session) => {
    const existingServant = await Servant.findOne({
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
    const updateSeravant = await Servant.findOneAndUpdate({ userId: userId }, { $set: [payload] }, {
        session, returnDocument: "after",
        runValidators: true,
    });
    return updateSeravant;
};
export const deleteDataServant = async (userId, session) => {
    const deletedProfile = await Servant.findOneAndDelete({
        userId,
    }, session);
    if (!deletedProfile) {
        throw new Error("Servant profile not found");
    }
    return deletedProfile;
};
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
export const ServantImageProfile = async (userId, file, session) => {
    const servants = await Servant.findOne({ userId });
    if (!servants)
        throw new Error("Servant profile not found");
    const imageUrl = `/uploads/Servant/${file.filename}`;
    const oldImage = servants.image;
    servants.image = imageUrl;
    await servants.save({ session });
    if (oldImage?.startsWith('/uploads/Servant/')) {
        const oldPath = path.join(process.cwd(), oldImage.replace(/^\/+/, ""));
        if (oldPath !== file.path) {
            await fs.unlink(oldPath).catch(() => { });
        }
        return {
            image: servants.image
        };
    }
};
