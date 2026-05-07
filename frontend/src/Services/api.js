import axios from "axios";
import { toast } from "sonner";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url || "";

    if (
      error.response?.status === 401 &&
      !url.includes("/auth/me") &&
      !url.includes("/auth/token")
    ) {
      try {
        await http.post("/auth/logout");
        toast.info("Session expired. Login again !")
      } catch {
        console.warn("Logout cleanup failed");
       }

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default http;