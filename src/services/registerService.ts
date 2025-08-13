import axios from "axios";
import type { UserDTO, ResponseUserDTO } from "../dtos/userDTO";

const API_URL = import.meta.env.VITE_API_URL;

export const register = async (payload: UserDTO): Promise<ResponseUserDTO> => {
  const response = await axios.post<ResponseUserDTO>(`${API_URL}/user`, payload);
  return response.data;
};