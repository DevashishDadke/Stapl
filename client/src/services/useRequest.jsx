import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const useRequest = () => {
  const navigation = useNavigate();
  const token = useAuthStore((state) => state.token);

  const Request = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || "http://127.0.0.1:8000/",
  });

  Request.interceptors.request.use(
    async (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  Request.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      if (error.response) {
        const status = error.response.status;

        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          useAuthStore.getState().clearToken();
          navigation("/login");
        }

        return Promise.reject(error.response.data);
      }

      return Promise.reject({
        success: false,
        message: error.message,
      });
    }
  );

  return { Request };
};

export default useRequest;
