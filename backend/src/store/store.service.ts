import { ACLType, uploadObject } from "./store.s3"

export const storage = async (type: string, path: string, status: ACLType = 'private') => {
    try {
        const storageUrl = await uploadObject(path, type, status)
        return storageUrl

    } catch (err) {
        throw err
    }
}