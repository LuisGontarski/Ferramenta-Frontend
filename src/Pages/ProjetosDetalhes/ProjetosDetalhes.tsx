import { useState } from "react";
import "./ProjetosDetalhes.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import imgPerfil from "../../assets/desenvolvedor1.jpeg";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import { FaChevronRight } from "react-icons/fa6";
import desenvolvedor1 from "../../Assets/desenvolvedor1.jpeg";
import desenvolvedor2 from "../../Assets/desenvolvedor2.jpeg";
import desenvolvedor3 from "../../Assets/desenvolvedor3.jpeg";
import { MdModeEdit } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { GrEdit } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import {
    ResponsiveContainer, CartesianGrid, LineChart, Tooltip, XAxis, YAxis, Legend, Line,
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const throughputData = [
    { semana: "S1", entregas: 12 },
    { semana: "S2", entregas: 15 },
    { semana: "S3", entregas: 10 },
    { semana: "S4", entregas: 18 },
];

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

const cargo = localStorage.getItem("cargo");

const ProjetosDetalhes = () => {
    const value = 6.5;
    const max = 10;

    const fillPercent = (value / max) * 100;

    const gradientStyle = {
        background: `linear-gradient(to right, #155dfc 0%, #155dfc ${fillPercent}%, #e0e0e0 ${fillPercent}%)`
    };

    return (
        <>
            <div>
                <NavbarHome />
            </div>
            <main className="container_conteudos">
                <MenuLateral />
                <div className="container_vertical_conteudos">
                    <div className="container_dashboard">
                        <div className="div_titulo_pagina_projetos">
                                      <div>
                                        <h1 className="titulo_projetos">Projeto All Gym</h1>
                                        <p className="descricao_titulo_projetos">
                                          Sistema de gestão de projetos com interface moderna e funcionalidades avançadas
                                        </p>
                                      </div>
                                      {cargo === "Product Owner" && (
                                        <button className="btn_novo_projeto" >
                                          <GrEdit size={'14px'}/>
                                          Editar projeto
                                        </button>
                                      )}
                                    </div>
                        <div className="container_informacoes_projeto_detalhes">
                            <div className="div_informacoes_projeto_detalhes">
                                <h2 className="titulo_metricas_detalhes_projetos">Progresso Geral</h2>
                                <h2 className="valor_metricas_detalhes_projetos">65%</h2>
                                <input type="range" className="custom-range" max={max} min={0} value={value} style={gradientStyle} />
                            </div>
                            <div className="div_informacoes_projeto_detalhes">
                                <h2 className="titulo_metricas_detalhes_projetos">Tarefas concluídas</h2>
                                <h2 className="valor_metricas_detalhes_projetos">29</h2>
                                <h2 className="adicional_metricas_detalhes_projetos">de 45 tarefas</h2>
                            </div>
                            <div className="div_informacoes_projeto_detalhes">
                                <h2 className="titulo_metricas_detalhes_projetos">Em progresso</h2>
                                <h2 className="valor_metricas_detalhes_projetos">12</h2>
                                <h2 className="adicional_metricas_detalhes_projetos">tarefas ativas</h2>
                            </div>
                            <div className="div_informacoes_projeto_detalhes">
                                <h2 className="titulo_metricas_detalhes_projetos">Membros da Equipe</h2>
                                <h2 className="valor_metricas_detalhes_projetos">4</h2>
                                <h2 className="adicional_metricas_detalhes_projetos">membros ativos</h2>
                            </div>
                        </div>

                        <div className="card_atualizacoes">
                            <div>
                                <h2 className="titulo_projetos">Burndown Chart (Progresso vs Planejado)</h2>
                                <p className="descricao_graficos_projetos">
                                    Visualização do trabalho restante ao longo do tempo.
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

                                    <Line
                                        type="monotone"
                                        dataKey="planejado"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                    />

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

                        <div className="container_metricas_projeto_detalhes">
                            <div className="card_atualizacoes bg-green-50 rounded-xl p-4 shadow-sm border border-green-100">
                                <h2 className="titulo_projetos">Lead Time</h2>
                                <p className="descricao_graficos_projetos">
                                    Visualização do tempo médio que as tarefas levam desde o início até a entrega.
                                </p>
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={leadTimeData}>
                                        <defs>
                                            <linearGradient id="colorLeadTime" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="semana" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="leadtime" stroke="#10b981" fill="url(#colorLeadTime)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                                <p className="valor_final">Média de 3.2 dias</p>
                            </div>

                            <div className="card_atualizacoes bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-100">
                                <h2 className="titulo_projetos">Velocidade da Equipe</h2>
                                <p className="descricao_graficos_projetos">
                                    Visualização do tempo médio que as tarefas levam desde o início até a entrega.
                                </p>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={velocidadeData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="sprint" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="pontos" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                                <p className="valor_final">Média de 27.5 pts</p>
                            </div>
                            <div className="card_atualizacoes ultimo_grafico_metricas bg-purple-50 rounded-xl p-4 shadow-sm border border-purple-100">
                                <h2 className="titulo_projetos">Throughput - Entregas por Semana</h2>
                                <p className="descricao_graficos_projetos">
                                    Número médio de tarefas concluídas por semana, medindo a produtividade da equipe.
                                </p>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart
                                        data={throughputData}
                                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }} // <-- aqui
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="semana" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="entregas"
                                            stroke="#1e3a8a"
                                            strokeWidth={1.8}
                                            dot={{ r: 6, fill: "#1e3a8a" }}
                                            activeDot={{ r: 8, fill: "#1e3a8a" }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>

                                <p className="valor_final">Média de 13.7 tarefas</p>
                            </div>
                            <div className="div_informacoes_projeto_detalhes">
                                <h2 className="titulo_metricas_detalhes_projetos">Custo por Feature</h2>
                                <h2 className="valor_metricas_detalhes_projetos">R$ 1.250</h2>
                                <h2 className="adicional_metricas_detalhes_projetos">média por funcionalidade</h2>
                            </div>

                            <div className="div_informacoes_projeto_detalhes">
                                <h2 className="titulo_metricas_detalhes_projetos">Taxa de Retrabalho</h2>
                                <h2 className="valor_metricas_detalhes_projetos">12%</h2>
                                <h2 className="adicional_metricas_detalhes_projetos">tarefas retornadas</h2>
                            </div>

                            <div className="div_informacoes_projeto_detalhes">
                                <h2 className="titulo_metricas_detalhes_projetos">Cycle Time</h2>
                                <h2 className="valor_metricas_detalhes_projetos">2.8 dias</h2>
                                <h2 className="adicional_metricas_detalhes_projetos">tempo médio por tarefa</h2>
                            </div>

                            <div className="div_informacoes_projeto_detalhes">
                                <h2 className="titulo_metricas_detalhes_projetos">Taxa de bugs</h2>
                                <h2 className="valor_metricas_detalhes_projetos">1.5 bugs/função</h2>
                                <h2 className="adicional_metricas_detalhes_projetos">Taxa de Bugs por Funcionalidade</h2>
                            </div>
                        </div>

                        <div className="div_informacoes_projeto_detalhes">
                            <h2 className="titulo_card_projeto_detalhes">Informações do Projeto</h2>
                            <div className="div_datas_projeto">
                                <h2 className="sub_titulo_card_projeto_detalhes">Gerente do Projeto:</h2>
                                <h2 className="sub_titulo_card_projeto_detalhes">Jõao Silva</h2>
                            </div>
                            <div className="div_datas_projeto">
                                <h2 className="sub_titulo_card_projeto_detalhes">Status:</h2>
                                <h2 className="sub_titulo_card_projeto_detalhes">Em Andamento</h2>
                            </div>
                            <div className="div_datas_projeto">
                                <h2 className="sub_titulo_card_projeto_detalhes">Data de Início:</h2>
                                <h2 className="sub_titulo_card_projeto_detalhes">14/01/2024</h2>
                            </div>
                            <div className="div_datas_projeto">
                                <h2 className="sub_titulo_card_projeto_detalhes">Data de Término:</h2>
                                <h2 className="sub_titulo_card_projeto_detalhes">29/06/2024</h2>
                            </div>
                            <div className="div_datas_projeto">
                                <h2 className="sub_titulo_card_projeto_detalhes">Duração:</h2>
                                <h2 className="sub_titulo_card_projeto_detalhes">5 meses</h2>
                            </div>
                        </div>
                        <div className="card_atualizacoes">
                            <h2 className="titulo_homepage">Atividades Recentes</h2>
                            <div className="div_atividades_recentes">
                                <div className="container_projetos">
                                    <img src={desenvolvedor1} className="img_atividade_recente" />
                                    <div>
                                        <h2 className="texto_atividade_recente"><span className="responsavel_atividade_recente">João Silva</span> completou a tarefa <span className="projeto_atividade_recente">Implementar autenticação</span></h2>
                                        <h2 className="texto_recente_atualizacao">2 horas atrás</h2>
                                    </div>
                                </div>
                                <FaChevronRight color="#71717A" />
                            </div>
                            <div className="div_atividades_recentes">
                                <div className="container_projetos">
                                    <img src={desenvolvedor2} className="img_atividade_recente" />
                                    <div>
                                        <h2 className="texto_atividade_recente"><span className="responsavel_atividade_recente">João Silva</span> completou a tarefa <span className="projeto_atividade_recente">Implementar autenticação</span></h2>
                                        <h2 className="texto_recente_atualizacao">2 horas atrás</h2>
                                    </div>
                                </div>
                                <FaChevronRight color="#71717A" />
                            </div>
                            <div className="div_atividades_recentes">
                                <div className="container_projetos">
                                    <img src={desenvolvedor3} className="img_atividade_recente" />
                                    <div>
                                        <h2 className="texto_atividade_recente"><span className="responsavel_atividade_recente">João Silva</span> completou a tarefa <span className="projeto_atividade_recente">Implementar autenticação</span></h2>
                                        <h2 className="texto_recente_atualizacao">2 horas atrás</h2>
                                    </div>
                                </div>
                                <FaChevronRight color="#71717A" />
                            </div>
                        </div>
                        <div className="div_informacoes_projeto_detalhes">
                            <h2 className="titulo_card_projeto_detalhes">Equipe do projeto</h2>
                            <div className="container_equipe_projeto">
                                <div className="div_equipe_projeto">
                                    <div>
                                        <img src={imgPerfil} className="imagemEquipe" />
                                    </div>
                                    <div className="div_equipe_dados">
                                        <div>
                                            <h2 className="sub_titulo_card_projeto_detalhes">João Silva</h2>
                                            <h2 className="adicional_metricas_detalhes_projetos">Tech Lead</h2>
                                        </div>
                                        <div className="div_equipe_tarefas">
                                            <h2 className="sub_titulo_card_projeto_detalhes">5 tarefas ativas</h2>
                                            <h2 className="sub_titulo_card_projeto_detalhes">12 concluidas</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="div_equipe_projeto">
                                    <div>
                                        <img src={imgPerfil} className="imagemEquipe" />
                                    </div>
                                    <div className="div_equipe_dados">
                                        <div>
                                            <h2 className="sub_titulo_card_projeto_detalhes">João Silva</h2>
                                            <h2 className="adicional_metricas_detalhes_projetos">Tech Lead</h2>
                                        </div>
                                        <div className="div_equipe_tarefas">
                                            <h2 className="sub_titulo_card_projeto_detalhes">5 tarefas ativas</h2>
                                            <h2 className="sub_titulo_card_projeto_detalhes">12 concluidas</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="div_equipe_projeto">
                                    <div>
                                        <img src={imgPerfil} className="imagemEquipe" />
                                    </div>
                                    <div className="div_equipe_dados">
                                        <div>
                                            <h2 className="sub_titulo_card_projeto_detalhes">João Silva</h2>
                                            <h2 className="adicional_metricas_detalhes_projetos">Tech Lead</h2>
                                        </div>
                                        <div className="div_equipe_tarefas">
                                            <h2 className="sub_titulo_card_projeto_detalhes">5 tarefas ativas</h2>
                                            <h2 className="sub_titulo_card_projeto_detalhes">12 concluidas</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="div_equipe_projeto">
                                    <div>
                                        <img src={imgPerfil} className="imagemEquipe" />
                                    </div>
                                    <div className="div_equipe_dados">
                                        <div>
                                            <h2 className="sub_titulo_card_projeto_detalhes">João Silva</h2>
                                            <h2 className="adicional_metricas_detalhes_projetos">Tech Lead</h2>
                                        </div>
                                        <div className="div_equipe_tarefas">
                                            <h2 className="sub_titulo_card_projeto_detalhes">5 tarefas ativas</h2>
                                            <h2 className="sub_titulo_card_projeto_detalhes">12 concluidas</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ProjetosDetalhes;
