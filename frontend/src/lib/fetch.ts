import { isAxiosError } from "axios";
import { httpsRequest } from './http'

export const fetchUrl = async (url: string) => {
    try {
        const { data } = await httpsRequest.get(url)
        return data

    } catch (err) {
        if (isAxiosError(err))
            throw new Error(err.response?.data?.message || 'something went wrong!')

        if (err instanceof Error)
            throw new Error(err.message)
    }
}