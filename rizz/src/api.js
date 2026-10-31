import axios from "axios";

const api = axios.create({
baseURL: "https://paynthra-3.onrender.com/api",
withCredentials: true,
});

export default api;
