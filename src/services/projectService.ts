import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // pega do .env

export interface Projeto {
  titulo: string;
  descricao: string;
  atualizadoEm?: string;
  membros: number;
  branches: number;
  status: string;
}

export const projectService = {
  async create(projeto: Projeto) {
    const response = await axios.post(`${API_URL}/projects`, projeto);
    return response.data;
  },
};