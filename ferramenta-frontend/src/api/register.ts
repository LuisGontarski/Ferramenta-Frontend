import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
}

export interface RegisterResponse {
  data: string;
}

export const register = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(
    `${API_URL}/create`,
    payload
  );
  return response.data;
};
