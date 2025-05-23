import axios from "axios";
import type { UserDTO } from "../dtos/userDTO";

const API_URL = "http://localhost:3001/api";

export const register = async (payload: UserDTO): Promise<UserDTO> => {  
  const response = await axios.post<UserDTO>(`${API_URL}/user`, payload);
  return response.data;
};
