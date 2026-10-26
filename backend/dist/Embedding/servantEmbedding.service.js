import { GoogleGenAI } from "@google/genai";
import { Servant } from "../servant/servant.model";
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
export const buildServantText = (servant) => {
    const skills = Array.isArray(servant.skills)
        ? servant.skills.join(", ")
        : servant.skills || "";
    return [
        "Service provider",
        `Bio: ${servant.bio || ""}`,
        `Skills: ${skills}`,
        `Location: ${servant.location || ""}`,
    ].join("\n");
};
export const generateEmbedding = async (text) => {
    try {
        const response = await ai.models.embedContent({
            model: process.env.GEMINI_EMBEDDING_MODEL,
            contents: text,
            config: {
                outputDimensionality: Number(process.env.GEMINI_EMBEDDING_DIMENSIONS),
            },
        });
        const values = response.embeddings?.[0]?.values;
        if (!values || values.length === 0)
            throw new Error("Gemini returned an empty embedding");
        return values;
    }
    catch (err) {
        throw err;
    }
};
export const updateServantEmbedding = async (servant) => {
    const embeddingText = buildServantText({
        bio: servant.bio,
        skills: servant.skills,
        location: servant.location,
    });
    if (!embeddingText || !embeddingText.trim()) {
        throw new Error("Cannot generate embedding: embeddingText is empty");
    }
    const embedding = await generateEmbedding(embeddingText);
    if (!Array.isArray(embedding) || embedding.length !== 768) {
        throw new Error(`Invalid embedding: expected 768 values, received ${embedding?.length ?? 0}`);
    }
    servant.set({
        embeddingText,
        embedding,
        embeddingModel: Number(process.env.GEMINI_EMBEDDING_DIMENSIONS),
    });
    await servant.save();
    return servant;
};
export const updateServantEmbeddingById = async (servantId) => {
    const servant = await Servant.findById(servantId).select("+embedding +embeddingText +embeddingModel");
    if (!servant)
        throw new Error("Servant profile not found");
    return updateServantEmbedding(servant);
};
export const updateAllServantEmbeddings = async () => {
    const servants = await Servant.find({ isActive: true }).select("+embedding +embeddingText +embeddingModel");
    let successCount = 0;
    let failedCount = 0;
    for (const servant of servants) {
        try {
            const updated = await updateServantEmbedding(servant);
            if (updated.embedding?.length === 768) {
                successCount++;
            }
            else {
                failedCount++;
            }
        }
        catch (error) {
            failedCount++;
            throw error;
        }
    }
};
