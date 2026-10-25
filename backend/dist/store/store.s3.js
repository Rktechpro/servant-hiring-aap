"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadObject = exports.downloadObject = exports.isFileExist = exports.Conn = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
exports.Conn = new client_s3_1.S3Client({
    region: process.env.S3_RESION,
    endpoint: `https://s3-${process.env.S3_RESION}.amazonaws.com`,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});
const isFileExist = async (path) => {
    try {
        const command = new client_s3_1.HeadObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: path
        });
        await exports.Conn.send(command);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.isFileExist = isFileExist;
const downloadObject = async (path) => {
    const options = {
        Bucket: process.env.S3_BUCKET,
        Key: path
    };
    const command = new client_s3_1.GetObjectCommand(options);
    const url = await (0, s3_request_presigner_1.getSignedUrl)(exports.Conn, command, { expiresIn: 100 });
    return url;
};
exports.downloadObject = downloadObject;
const uploadObject = async (path, type, acl = "private") => {
    const cmd = new client_s3_1.PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: path,
        ContentType: type,
        ACL: acl
    });
    const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(exports.Conn, cmd, {
        expiresIn: 300
    });
    return uploadUrl;
};
exports.uploadObject = uploadObject;
