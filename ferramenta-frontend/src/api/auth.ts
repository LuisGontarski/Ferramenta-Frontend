import axios from 'axios';

const API_URL = 'https://646e-2804-7f2-c041-1bab-f18b-d5b1-5f5e-7d48.ngrok-free.app/api/auth';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
  };
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, payload);
  return response.data;
};
