import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface Props {
  data: { dia: string; commits: number; reviews: number; reunioes: number }[];
}

const GraficoAtividadeSemanal = ({ data }: Props) => {
  return (
    <div className="grafico">
      <h3>Atividade Semanal</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorReunioes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="dia" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="commits" stroke="#8884d8" fill="url(#colorCommits)" />
          <Area type="monotone" dataKey="reviews" stroke="#82ca9d" fill="url(#colorReviews)" />
          <Area type="monotone" dataKey="reunioes" stroke="#ffc658" fill="url(#colorReunioes)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoAtividadeSemanal;
