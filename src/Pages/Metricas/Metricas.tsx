import {
    ResponsiveContainer, CartesianGrid, LineChart, Tooltip, XAxis, YAxis, Legend, Line,
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import "./Metricas.css";

const data = [
    { dia: "Dia 1", planejado: 100, real: 100 },
    { dia: "Dia 3", planejado: 90, real: 92 },
    { dia: "Dia 5", planejado: 75, real: 75 },
    { dia: "Dia 7", planejado: 60, real: 65 },
    { dia: "Dia 9", planejado: 45, real: 48 },
    { dia: "Dia 11", planejado: 30, real: 32 },
    { dia: "Dia 13", planejado: 15, real: 20 },
    { dia: "Dia 15", planejado: 0, real: 10 }
];

const dataLead = [
    { semana: "S1", leadtime: 4.2 },
    { semana: "S2", leadtime: 3.9 },
    { semana: "S3", leadtime: 3.6 },
    { semana: "S4", leadtime: 3.2 },
];

const leadTimeData = [
    { semana: "S1", leadtime: 4.2 },
    { semana: "S2", leadtime: 3.9 },
    { semana: "S3", leadtime: 3.6 },
    { semana: "S4", leadtime: 3.2 },
];

const velocidadeData = [
    { sprint: "Sprint 1", pontos: 25 },
    { sprint: "Sprint 2", pontos: 28 },
    { sprint: "Sprint 3", pontos: 30 },
    { sprint: "Sprint 4", pontos: 27 },
];

const capacidadeData = [
    { sprint: "Sprint 1", trabalhadas: 120, disponiveis: 150 },
    { sprint: "Sprint 2", trabalhadas: 140, disponiveis: 150 },
    { sprint: "Sprint 3", trabalhadas: 135, disponiveis: 150 },
    { sprint: "Sprint 4", trabalhadas: 145, disponiveis: 150 },
];

const orcadoRealData = [
    { sprint: "Sprint 1", orcado: 2000, real: 2200 },
    { sprint: "Sprint 2", orcado: 2500, real: 2400 },
    { sprint: "Sprint 3", orcado: 1800, real: 1900 },
    { sprint: "Sprint 4", orcado: 2200, real: 2100 },
];


const Metricas = () => {
    return (
        <>
            <div>
                <NavbarHome />
            </div>
            <main className="container_conteudos">
                <MenuLateral />
                <div className="container_vertical_conteudos">
                    <div className="container_dashboard">
                        <div>
                            <h1 className="titulo_projetos">Métricas do projeto</h1>
                            <p className="descricao_titulo_projetos">Acompanhe o desempenho e progresso do projeto através de indicadores essenciais</p>
                        </div>


                        <div className="card_atualizacoes">
                            <div>
                                <h1 className="titulo_projetos">Burndown Chart - Progresso vs Planejado</h1>
                                <p className="descricao_titulo_projetos">
                                    Visualização do trabalho restante ao longo do tempo. <b>Cálculo:</b> Story Points restantes dividido por dias úteis restantes
                                </p>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid stroke="#e5e7eb" strokeOpacity={0.4} strokeDasharray="4 4" />

                                    <XAxis
                                        dataKey="dia"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "10px",
                                            border: "1px solid #e5e7eb",
                                            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                                            fontSize: "12px"
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: "12px", color: "#6b7280" }} />

                                    {/* Linha Planejada (pontilhada azul) */}
                                    <Line
                                        type="monotone"
                                        dataKey="planejado"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                    />

                                    {/* Linha Real (verde contínua) */}
                                    <Line
                                        type="monotone"
                                        dataKey="real"
                                        stroke="#10b981"
                                        strokeWidth={2.5}
                                        dot={{ r: 5, fill: "#10b981" }}
                                        activeDot={{ r: 7 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="cards_resumo">
                                <div className="card_kpi bg-blue-50">
                                    <h3 className="valor_kpi text-blue-600">85%</h3>
                                    <p className="descricao_kpi">Progresso Atual</p>
                                </div>
                                <div className="card_kpi bg-green-50">
                                    <h3 className="valor_kpi text-green-600">8 pts</h3>
                                    <p className="descricao_kpi">Trabalho Restante</p>
                                </div>
                                <div className="card_kpi bg-red-50">
                                    <h3 className="valor_kpi text-red-600">3 dias</h3>
                                    <p className="descricao_kpi">Prazo Restante</p>
                                </div>
                            </div>
                        </div>




                        <div className="card_atualizacoes bg-green-50 relative rounded-xl p-4 shadow-sm border border-green-100">
                            <h2 className="font-semibold text-gray-800">Lead Time - Tendência</h2>

                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={leadTimeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorLeadTime" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} />
                                    <XAxis dataKey="semana" tick={{ fill: "#6b7280", fontSize: 12 }} />
                                    <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="leadtime" stroke="#10b981" fillOpacity={1} fill="url(#colorLeadTime)" />
                                </AreaChart>
                            </ResponsiveContainer>

                            <p className="text-2xl font-bold text-green-600 mt-2">3.2 dias</p>
                            <p className="text-sm text-gray-600">
                                Cálculo: Tempo desde criação até conclusão da tarefa
                            </p>
                        </div>

                        

                        {/* Velocidade da Equipe */}
                        <div className="card_atualizacoes bg-blue-50 relative rounded-xl p-4 shadow-sm border border-blue-100">
                            <h2 className="font-semibold text-gray-800">Velocidade da Equipe</h2>

                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={velocidadeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="sprint" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="pontos" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>

                            <p className="text-2xl font-bold text-blue-600 mt-2">27.5 pts</p>
                            <p className="text-sm text-gray-600">
                                Cálculo: Média de Story Points entregues por sprint
                            </p>
                        </div>

                        


                        {/* Capacidade vs Demanda - Barras lado a lado */}
                        <div className="card_atualizacoes bg-purple-50 relative rounded-xl p-4 shadow-sm border border-purple-100">
                            <h2 className="font-semibold text-gray-800">Capacidade vs Demanda</h2>

                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={capacidadeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="sprint" tick={{ fill: "#6b7280", fontSize: 12 }} />
                                    <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />

                                    {/* Barras lado a lado */}
                                    <Bar dataKey="trabalhadas" fill="#8b5cf6" name="Horas trabalhadas" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="disponiveis" fill="#c4b5fd" name="Horas disponíveis" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>

                            <p className="text-2xl font-bold text-purple-600 mt-2">93%</p>
                            <p className="text-sm text-gray-600">
                                Cálculo: (Horas trabalhadas / Horas disponíveis) × 100
                            </p>
                        </div>






                    </div>
                </div>
            </main>
        </>
    );
};

export default Metricas;
