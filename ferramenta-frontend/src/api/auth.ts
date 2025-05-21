import axios from 'axios';

const API_URL = 'https://daea-2804-7f2-c041-1bab-519b-dd5b-9a0d-dc58.ngrok-free.app/api/auth';

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
