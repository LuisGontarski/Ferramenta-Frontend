import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface Props {
  data: { dia: string; total: number; produtivas: number }[];
}

const GraficoHoras = ({ data }: Props) => {
  return (
    <div className="grafico">
      <h3>Horas Trabalhadas por Dia</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dia" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#8884d8" />
          <Line type="monotone" dataKey="produtivas" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoHoras;
