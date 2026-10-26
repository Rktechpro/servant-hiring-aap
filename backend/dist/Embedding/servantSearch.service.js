import { Servant } from "../servant/servant.model";
import { generateEmbedding } from "./servantEmbedding.service";
const cosineSimilarity = (a, b) => {
    if (!a.length || a.length !== b.length)
        return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (!normA || !normB)
        return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};
const keywordScore = (query, text) => {
    const words = query
        .toLowerCase()
        .split(/[\s,.;!?]+/)
        .filter((word) => word.length > 2);
    if (!words.length || !text)
        return 0;
    const searchable = text.toLowerCase();
    const matched = words.filter((word) => searchable.includes(word)).length;
    return matched / words.length;
};
export const searchServants = async (options) => {
    const { q, location, maxPrice, available, limit = 20 } = options;
    const mongoFilter = { isActive: true };
    if (location?.trim()) {
        mongoFilter.location = {
            $regex: location.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $options: "i",
        };
    }
    if (maxPrice !== undefined && Number.isFinite(maxPrice)) {
        mongoFilter.hourlyPrice = { $lte: maxPrice };
    }
    // Load the saved vector explicitly because the schema uses select:false.
    const servants = await Servant.find(mongoFilter)
        .select("+embedding +embeddingText +embeddingModel")
        .limit(500)
        .lean();
    if (!servants.length)
        return [];
    const queryVector = q.trim()
        ? await generateEmbedding(q.trim())
        : null;
    const results = servants
        .filter((servant) => {
        if (available === undefined)
            return true;
        // Supports a boolean availability field.
        // If your schema uses time-slot strings, replace this
        // with your application's actual availability logic.
        return servant.availability === available;
    })
        .map((servant) => {
        const vector = servant.embedding;
        const text = servant.embeddingText || [
            servant.bio || "",
            Array.isArray(servant.skills)
                ? servant.skills.join(" ")
                : servant.skills || "",
            servant.location || "",
        ].join(" ");
        const semantic = queryVector && vector?.length
            ? Math.max(0, cosineSimilarity(queryVector, vector))
            : 0;
        const lexical = q.trim()
            ? keywordScore(q, text)
            : 0;
        // Weighted hybrid relevance score.
        const score = queryVector
            ? 0.75 * semantic + 0.25 * lexical
            : lexical;
        const { embedding, embeddingText, embeddingModel, ...profile } = servant;
        return {
            ...profile,
            relevanceScore: Number(score.toFixed(4)),
        };
    })
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, Math.min(Math.max(limit, 1), 50));
    return results;
};
