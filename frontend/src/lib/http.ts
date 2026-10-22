import axios from "axios";


export const httpsRequest = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});