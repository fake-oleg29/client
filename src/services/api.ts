import axios from "axios";

const API_URL = "http://localhost:3001/api/";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AuthResponse {
  user: { id: string; email: string };
  token: string;
}

export const register = async (
  email: string,
  password: string,
  name?: string
) => {
  const result = await api.post<AuthResponse>("auth/register", {
    email,
    password,
    name,
  });
  console.log(result);
  return result;
};

export const login = async (email: string, password: string) => {
  console.log(email, password);
  return await api.post<AuthResponse>("auth/login", { email, password });
};
