import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'


export type ACLType = "private" | "public-read"


export const Conn = new S3Client({
    region: process.env.S3_RESION,
    endpoint: `https://s3-${process.env.S3_RESION}.amazonaws.com`,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_KEY!
    }

})

export const isFileExist = async (path: string) => {
    try {
        const command = new HeadObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: path
        })

        await Conn.send(command)
        return true
    } catch (error) {
        return false
    }
}

export const downloadObject = async (path: string) => {
    const options = {
        Bucket: process.env.S3_BUCKET,
        Key: path
    }
    const command = new GetObjectCommand(options)
    const url = await getSignedUrl(Conn, command, { expiresIn: 100 })
    return url

}


export const uploadObject = async (path: string, type: string, acl: ACLType = "private") => {
    const cmd = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: path,
        ContentType: type,
        ACL: acl
    })
    const uploadUrl = await getSignedUrl(Conn, cmd, {
        expiresIn: 300
    })
    return uploadUrl
}
