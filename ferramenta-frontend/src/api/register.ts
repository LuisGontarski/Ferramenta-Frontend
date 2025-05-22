import axios from "axios";

const API_URL = "https://localhost:3000/api";

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
    `${API_URL}/register`,
    payload
  );
  return response.data;
};
