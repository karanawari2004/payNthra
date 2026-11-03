import axios from "axios";

const api = axios.create({
baseURL: "https://pay-nthra-fv75.vercel.app/api",
withCredentials: true,
});

export default api;
