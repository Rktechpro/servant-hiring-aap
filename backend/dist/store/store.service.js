"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const store_s3_1 = require("./store.s3");
const storage = async (type, path, status = 'private') => {
    try {
        const storageUrl = await (0, store_s3_1.uploadObject)(path, type, status);
        return storageUrl;
    }
    catch (err) {
        throw err;
    }
};
exports.storage = storage;
