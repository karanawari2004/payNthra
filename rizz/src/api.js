import axios from "axios";

const api = axios.create({
baseURL: "https://pay-nthra-tck6.vercel.app/api",
withCredentials: true,
});

export default api;
