import axios from "axios";
import { BACKEND_URL, BACKEND_EXTERNAL_URL, OPENAI_API_URL } from "./constants";

export const BACKEND = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? BACKEND_EXTERNAL_URL : BACKEND_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
});

export const OPENAI = axios.create({
    baseURL: OPENAI_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    }
});