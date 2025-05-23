import axios from "axios";
import type { UserDTO } from "../dtos/userDTO";

const API_URL = import.meta.env.VITE_API_URL;

export const register = async (payload: UserDTO): Promise<UserDTO> => {  
  const response = await axios.post<UserDTO>(`${API_URL}/user`, payload);
  return response.data;
};
