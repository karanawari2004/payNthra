import axios from "axios";

const api = axios.create({
baseURL: "https://paynthra-8.onrender.com/api",
withCredentials: true,
});

export default api;
