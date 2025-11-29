import useRequest from "./useRequest";
import useAuthStore from "../store/useAuthStore";

const useAuth = () => {
  const { Request } = useRequest();
  const setToken = useAuthStore((state) => state.setToken);
  const clearToken = useAuthStore((state) => state.clearToken);

  const login = async (email, password) => {
    try {
      const response = await Request.post("/login", {
        email,
        password,
      });

      if (response.token) {
        localStorage.setItem("token", response.token);
        setToken(response.token);          // store in zustand immediately
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await Request.post("/register", {
        name,
        email,
        password,
      });

      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    clearToken();
  };

  return { login, register, logout };
};

export default useAuth;
