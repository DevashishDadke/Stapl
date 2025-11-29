const host = import.meta.env.VITE_SERVER_URL;

export const API_URL = `${host}/api`;


export const APIS = {
  register: API_URL + "/register",
  login: API_URL + "/login",
}