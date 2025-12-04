import axios from "axios";

const baseURL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  "http://localhost:3001/api/v1";

const api = axios.create({
  baseURL,
});

export default api;


