import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface GithubCommitResponse {
  quant_commits: number;
}

export const getGithubCommitCount = async (params: { user: string; repo_name: string }): Promise<GithubCommitResponse> => {
  const response = await axios.get<GithubCommitResponse>(API_URL, { params });
  return response.data;
};