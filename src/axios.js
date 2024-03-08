import axios from "axios";
import { OPENAI_API_KEY, BACKEND_URL, OPENAI_API_URL } from "./constants";

export const BACKEND = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
});

export const OPENAI = axios.create({
    baseURL: OPENAI_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
    }
});