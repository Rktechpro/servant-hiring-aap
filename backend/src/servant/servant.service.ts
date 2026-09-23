import { ClientSession } from "mongoose";
import { CreateServantInput } from "./servant.dto";
import { Servant } from "./servant.model";

export const createServant = async (userId: string, data: CreateServantInput, session: ClientSession) => {
    const existingServant = await Servant.findOne({
        userId,
    });

    if (existingServant)
        throw new Error("Servant profile already exists");

    const payload = {
        userId,
        image: data.image,
        bio: data.bio,
        skills: data.skills,
        location: data.location,
        hourlyPrice: data.hourlyPrice,
        availability: data.availability,
    };

    const servant = await Servant.create([payload], { session })
    return servant

}

export const getServant = async () => {
    const servant = await Servant.find({ isActive: true }).populate({ path: "userId", select: "fullname email mobile role", }).sort({ createdAt: -1 })

    if (servant.length === 0)
        throw new Error("No servant profile found")

    return servant
}

export const updateDataServant = async (userId: string, data: CreateServantInput, session: ClientSession) => {
    const existingServant = await Servant.findOne({
        userId,
    });

    if (!existingServant)
        throw new Error("Servant profile not found");

    const payload = {
        image: data.image,
        bio: data.bio,
        skills: data.skills,
        location: data.location,
        hourlyPrice: data.hourlyPrice,
        availability: data.availability,
    };

    const updateSeravant = await Servant.findOneAndUpdate(
        { userId: userId },
        { $set: [payload] },
        { session },

    )

    return updateSeravant

}

export const deleteDataServant = async (userId: string, session: ClientSession) => {
    const deletedProfile = await Servant.findOneAndDelete({
        userId,
    }, session);

    if (!deletedProfile) {
        throw new Error("Servant profile not found");
    }

    return deletedProfile;
};