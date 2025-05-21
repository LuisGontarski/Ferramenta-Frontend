import axios from 'axios';

const API_URL = 'http://localhost:3001/api/github/commit/count';

export interface GithubCommitResponse {
  quant_commits: number;
}

export const getGithubCommitCount = async (params: { user: string; repo_name: string }): Promise<GithubCommitResponse> => {
  const response = await axios.get<GithubCommitResponse>(API_URL, { params });
  return response.data;
};