import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface Props {
  data: { projeto: string; commits: number; linhas: number }[];
}

const GraficoCommits = ({ data }: Props) => {
  return (
    <div className="grafico">
      <h3>Commits por Projeto</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="projeto" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="commits" fill="#8884d8" />
          <Bar dataKey="linhas" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoCommits;
