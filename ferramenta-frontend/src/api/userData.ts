import axios from "axios";
import type { UserDTO } from "../dtos/userDTO";

const API_URL = "http://localhost:3001/api";

export const register = async (payload: UserDTO): Promise<UserDTO> => {  
  const response = await axios.post<UserDTO>(`${API_URL}/user`, payload);
  return response.data;
};

export const getUserById = async (): Promise<UserDTO> => {
  const usuarioId = localStorage.getItem("usuario_id");

  if (!usuarioId) {
    throw new Error("ID do usuário não encontrado no localStorage.");
  }

  const response = await axios.get<UserDTO>(`${API_URL}/user/${usuarioId}`);
  return response.data;
};
