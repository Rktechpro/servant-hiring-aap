import { message } from "antd"
import { isAxiosError } from "axios"


export const catchError = (err: unknown) => {

    if (import.meta.env.VITE_NODE_ENV === "dev")
        console.log(err)


    if (isAxiosError(err))
        return message.error(err?.response?.data?.message || err.message || "Unknown error from server")
    if (err instanceof Error)
        return message.error(err.message || "Unknown error from client")

    message.error("Client error")
}