"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllServantEmbeddings = exports.updateServantEmbeddingById = exports.updateServantEmbedding = exports.generateEmbedding = exports.buildServantText = void 0;
const genai_1 = require("@google/genai");
const servant_model_1 = require("../servant/servant.model");
const ai = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
const buildServantText = (servant) => {
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
exports.buildServantText = buildServantText;
const generateEmbedding = async (text) => {
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
exports.generateEmbedding = generateEmbedding;
const updateServantEmbedding = async (servant) => {
    const embeddingText = (0, exports.buildServantText)({
        bio: servant.bio,
        skills: servant.skills,
        location: servant.location,
    });
    if (!embeddingText || !embeddingText.trim()) {
        throw new Error("Cannot generate embedding: embeddingText is empty");
    }
    const embedding = await (0, exports.generateEmbedding)(embeddingText);
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
exports.updateServantEmbedding = updateServantEmbedding;
const updateServantEmbeddingById = async (servantId) => {
    const servant = await servant_model_1.Servant.findById(servantId).select("+embedding +embeddingText +embeddingModel");
    if (!servant)
        throw new Error("Servant profile not found");
    return (0, exports.updateServantEmbedding)(servant);
};
exports.updateServantEmbeddingById = updateServantEmbeddingById;
const updateAllServantEmbeddings = async () => {
    const servants = await servant_model_1.Servant.find({ isActive: true }).select("+embedding +embeddingText +embeddingModel");
    let successCount = 0;
    let failedCount = 0;
    for (const servant of servants) {
        try {
            const updated = await (0, exports.updateServantEmbedding)(servant);
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
exports.updateAllServantEmbeddings = updateAllServantEmbeddings;
