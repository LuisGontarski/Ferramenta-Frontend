import axios from "axios";
import type { UserDTO } from "../dtos/userDTO";

const API_URL = import.meta.env.VITE_API_URL;

export const register = async (payload: UserDTO): Promise<UserDTO> => {  
  const response = await axios.post<UserDTO>(`${API_URL}/user`, payload);
  return response.data;
};

export const getUserById = async (usuarioId: string | null): Promise<UserDTO> => {
  const storedUsuarioId = usuarioId || localStorage.getItem("usuario_id");

  if (!storedUsuarioId) {
    throw new Error("ID do usuário não encontrado no localStorage.");
  }

  const response = await axios.get<UserDTO>(`${API_URL}/user/${storedUsuarioId}`);
  return response.data;
};
