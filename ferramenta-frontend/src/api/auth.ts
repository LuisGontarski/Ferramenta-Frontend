import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

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
