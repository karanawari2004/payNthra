import axios from "axios";

const api = axios.create({
baseURL: "https://paynthra.onrender.com/api",
withCredentials: true,
});

export default api;
