import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario_id: string;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/auth/login`,
    payload
  );
  return response.data;
};
