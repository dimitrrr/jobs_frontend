import axios from "axios";
import { BACKEND_URL } from "./constants";

export const BACKEND = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
})