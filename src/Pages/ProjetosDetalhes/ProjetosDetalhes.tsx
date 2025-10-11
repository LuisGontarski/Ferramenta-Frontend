import { useState, useEffect } from "react";
import "./ProjetosDetalhes.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import imgPerfil from "../../assets/desenvolvedor1.jpeg";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import { FaChevronRight } from "react-icons/fa6";
import desenvolvedor1 from "../../assets/desenvolvedor1.jpeg";
import desenvolvedor2 from "../../assets/desenvolvedor2.jpeg";
import desenvolvedor3 from "../../assets/desenvolvedor3.jpeg";
import { GrEdit } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import {
	ResponsiveContainer,
	CartesianGrid,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
	Legend,
	Line,
	AreaChart,
	Area,
	BarChart,
	Bar,
} from "recharts";

const BASE_URL = import.meta.env.VITE_API_URL;

// --- Interface para a tipagem dos membros ---
interface Membro {
    usuario_id: string;
    nome: string;
    email: string;
    foto_perfil?: string;
}

// Dados estáticos para os gráficos e outras seções
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
	{ dia: "Dia 15", planejado: 0, real: 10 },
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

const cargo = localStorage.getItem("cargo");

const ProjetosDetalhes = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);
	const [nome, setNome] = useState("Carregando...");
	const [descricao, setDescricao] = useState("Carregando...");
	const [dataInicio, setDataInicio] = useState("");
	const [dataFim, setDataFim] = useState("");
	const [status, setStatus] = useState("Carregando...");
	const [duracao, setDuracao] = useState(0);
	const [gerenteProjeto, setGerenteProjeto] = useState("Carregando...");
	
	const [membrosDaEquipe, setMembrosDaEquipe] = useState<Membro[]>([]);

	// --- Efeito para buscar APENAS os membros do projeto ---
	useEffect(() => {
		async function fetchMembrosDoProjeto() {
			if (!id) return;
			try {
				localStorage.setItem("projeto_id", id);

				const resMembros = await fetch(`${BASE_URL}/projects/${id}/users`);
				if (!resMembros.ok) throw new Error(`Erro ao buscar membros: ${resMembros.status}`);
				const membros = await resMembros.json();
				setMembrosDaEquipe(membros);

			} catch (err) {
				console.error("Erro ao carregar membros da equipe:", err);
			}
		}
		fetchMembrosDoProjeto();
		async function fetchDadosDoProjeto() {
			if (!id) return;
			try {
				localStorage.setItem("projeto_id", id);

				const res = await fetch(`${BASE_URL}/projects/${id}`);
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const projeto = await res.json();

				setNome(projeto.nome || "Nome não encontrado");
				setDescricao(projeto.descricao || "Descrição não encontrada");
				setStatus(projeto.status || "Status não definido");
				setGerenteProjeto(projeto.gerente_projeto || "-");
				
				const toDateInput = (v: string | null) => v ? new Date(v).toISOString().slice(0, 10) : "";
				setDataInicio(toDateInput(projeto.data_inicio));
				setDataFim(toDateInput(projeto.data_fim_prevista || projeto.data_fim));

				const calcDuracao = (inicio: any, fim: any) => {
					if (!inicio || !fim) return 0;
					const d1 = new Date(inicio);
					const d2 = new Date(fim);
					if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
					const diffTime = Math.abs(d2.getTime() - d1.getTime());
					return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
				};

				setDuracao(calcDuracao(projeto.data_inicio, projeto.data_fim_prevista || projeto.data_fim));
				
				const resMembros = await fetch(`${BASE_URL}/projects/${id}/users`);
				if (!resMembros.ok) throw new Error(`Erro ao buscar membros: ${resMembros.status}`);
				const membros = await resMembros.json();
				setMembrosDaEquipe(membros);

			} catch (err) {
				console.error("Erro ao carregar dados da página:", err);
				setNome("Erro ao carregar projeto");
			}
		}
		fetchDadosDoProjeto();
	}, [id]);
    
    // --- Lógica do Modal (mantida como estava) ---
	const handleSalvar = async () => {
		// Esta função agora usará os dados estáticos do estado se não forem alterados no modal
		try {
			const res = await fetch(`${BASE_URL}/projects/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nome,
					descricao,
					status,
					data_inicio: dataInicio,
					data_fim_prevista: dataFim,
				}),
			});
			if (!res.ok) throw new Error("Falha ao salvar");
			alert("Projeto atualizado!");
			setShowModal(false);
		} catch (err) {
			console.error("Erro ao atualizar projeto:", err);
		}
	};
	const handleExcluir = async () => {
		if (!window.confirm("Tem certeza?")) return;
		try {
			const res = await fetch(`${BASE_URL}/projects/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Falha ao excluir");
			alert("Projeto excluído!");
			navigate("/projetos");
		} catch (err) {
			console.error("Erro ao excluir projeto:", err);
		}
	};
	const mostrarModal = () => {
		let modal = document.getElementById("modal_editar");
		const conteudo_modal = document.getElementById("modal_editar_projeto");

		if (modal) {
			modal.style.opacity = "1";
			modal.style.pointerEvents = "auto";
			if (conteudo_modal) {
				conteudo_modal.style.opacity = "1";
				conteudo_modal.style.transform = "translateY(0)";
			}
		}
	};
	function fecharModal() {
		const modal = document.getElementById("modal_editar");
		const conteudo_modal = document.getElementById("modal_editar_projeto");

		if (modal) {
			modal.style.opacity = "0";
			modal.style.pointerEvents = "none";
			if (conteudo_modal) {
				conteudo_modal.style.transform = "translateY(10px)";
			}
		}
	}

	const value = 6.5;
	const max = 10;
	const fillPercent = (value / max) * 100;
	const gradientStyle = {
		background: `linear-gradient(to right, #155dfc 0%, #155dfc ${fillPercent}%, #e0e0e0 ${fillPercent}%)`,
	};

	const formatDDMMYYYY = (v: string | null): string => {
		if (!v) return "";
		const [year, month, day] = v.split("-");
		return `${day}/${month}/${year}`;
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
								<h1 className="titulo_projetos">{nome}</h1>
								<p className="descricao_titulo_projetos">{descricao}</p>
							</div>
							{cargo === "Product Owner" && (
								<button
									className="btn_novo_projeto"
									onClick={() => mostrarModal()}
								>
									<GrEdit size={"14px"} />
									Editar projeto
								</button>
							)}

							<div className="modal-overlay sumir" id="modal_editar">
								<div className="modal-content" id="modal_editar_projeto">
									<div>
										<h2 className="titulo_modal">Editar Projeto</h2>
										<h2 className="descricao_modal">
											Modifique as informações abaixo para atualizar os dados do
											seu projeto
										</h2>
									</div>
									<div className="div_inputs_modal">
										<label className="titulo_input">Nome do Projeto</label>
										<input
											className="input_modal"
											type="text"
											value={nome}
											onChange={(e) => setNome(e.target.value)}
										/>
									</div>

									<div className="div_inputs_modal">
										<label className="titulo_input">Descrição</label>
										<textarea
											className="input_modal_descricao"
											rows={3}
											value={descricao}
											onChange={(e) => setDescricao(e.target.value)}
										/>
									</div>

									<div className="div_inputs_modal">
										<label className="titulo_input">Data de Início</label>
										<input
											className="input_modal"
											type="date"
											value={dataInicio} // estado: dataInicio
											onChange={(e) => setDataInicio(e.target.value)}
										/>
									</div>

									<div className="div_inputs_modal">
										<label className="titulo_input">Data de Fim</label>
										<input
											className="input_modal"
											type="date"
											value={dataFim} // estado: dataFim
											onChange={(e) => setDataFim(e.target.value)}
										/>
									</div>

									<div className="div_inputs_modal">
										<label className="titulo_input">Status</label>
										<select
											className="input_modal"
											value={status}
											onChange={(e) => setStatus(e.target.value)}
										>
											<option>Concluído</option>
											<option>Ativo</option>
											<option>Arquivado</option>
										</select>
									</div>

									<div className="modal-actions">
										<div className="div_btn_excluir_cancelar">
											<button
												className="btn_cancelar"
												onClick={() => fecharModal()}
											>
												Cancelar
											</button>
											<button className="btn_excluir" onClick={handleExcluir}>
												Excluir
											</button>
										</div>
										<button className="btn_salvar" onClick={handleSalvar}>
											Salvar
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className="container_informacoes_projeto_detalhes">
							<div className="div_informacoes_projeto_detalhes">
								<h2 className="titulo_metricas_detalhes_projetos">
									Progresso Geral
								</h2>
								<h2 className="valor_metricas_detalhes_projetos">65%</h2>
								<input
									type="range"
									className="custom-range"
									max={max}
									min={0}
									value={value}
									style={gradientStyle}
								/>
							</div>
							<div className="div_informacoes_projeto_detalhes">
								<h2 className="titulo_metricas_detalhes_projetos">
									Tarefas concluídas
								</h2>
								<h2 className="valor_metricas_detalhes_projetos">29</h2>
								<h2 className="adicional_metricas_detalhes_projetos">
									de 45 tarefas
								</h2>
							</div>
							<div className="div_informacoes_projeto_detalhes">
								<h2 className="titulo_metricas_detalhes_projetos">
									Em progresso
								</h2>
								<h2 className="valor_metricas_detalhes_projetos">12</h2>
								<h2 className="adicional_metricas_detalhes_projetos">
									tarefas ativas
								</h2>
							</div>
							<div className="div_informacoes_projeto_detalhes">
								<h2 className="titulo_metricas_detalhes_projetos">
									Membros da Equipe
								</h2>
								<h2 className="valor_metricas_detalhes_projetos">4</h2>
								<h2 className="adicional_metricas_detalhes_projetos">
									membros ativos
								</h2>
							</div>
						</div>

						<div className="card_atualizacoes">
							<div>
								<h2 className="titulo_projetos">
									Burndown Chart (Progresso vs Planejado)
								</h2>
								<p className="descricao_graficos_projetos">
									Visualização do trabalho restante ao longo do tempo.
								</p>
							</div>
							<ResponsiveContainer width="100%" height={300}>
								<LineChart
									data={data}
									margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
								>
									<CartesianGrid
										stroke="#e5e7eb"
										strokeOpacity={0.4}
										strokeDasharray="4 4"
									/>

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
											fontSize: "12px",
										}}
									/>
									<Legend
										wrapperStyle={{ fontSize: "12px", color: "#6b7280" }}
									/>

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
									Visualização do tempo médio que as tarefas levam desde o
									início até a entrega.
								</p>
								<ResponsiveContainer width="100%" height={200}>
									<AreaChart data={leadTimeData}>
										<defs>
											<linearGradient
												id="colorLeadTime"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="5%"
													stopColor="#10b981"
													stopOpacity={0.4}
												/>
												<stop
													offset="95%"
													stopColor="#10b981"
													stopOpacity={0}
												/>
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
										<XAxis dataKey="semana" />
										<YAxis />
										<Tooltip />
										<Area
											type="monotone"
											dataKey="leadtime"
											stroke="#10b981"
											fill="url(#colorLeadTime)"
										/>
									</AreaChart>
								</ResponsiveContainer>
								<p className="valor_final">Média de 3.2 dias</p>
							</div>

							<div className="card_atualizacoes bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-100">
								<h2 className="titulo_projetos">Velocidade da Equipe</h2>
								<p className="descricao_graficos_projetos">
									Visualização do tempo médio que as tarefas levam desde o
									início até a entrega.
								</p>
								<ResponsiveContainer width="100%" height={200}>
									<BarChart data={velocidadeData}>
										<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
										<XAxis dataKey="sprint" />
										<YAxis />
										<Tooltip />
										<Bar
											dataKey="pontos"
											fill="#3b82f6"
											radius={[6, 6, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
								<p className="valor_final">Média de 27.5 pts</p>
							</div>
							<div className="card_atualizacoes ultimo_grafico_metricas bg-purple-50 rounded-xl p-4 shadow-sm border border-purple-100">
								<h2 className="titulo_projetos">
									Throughput - Entregas por Semana
								</h2>
								<p className="descricao_graficos_projetos">
									Número médio de tarefas concluídas por semana, medindo a
									produtividade da equipe.
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
							<div className="container_kpi">
								<div className="div_informacoes_projeto_detalhes">
									<h2 className="titulo_metricas_detalhes_projetos">
										Custo por Feature
									</h2>
									<h2 className="valor_metricas_detalhes_projetos">R$ 1.250</h2>
									<h2 className="adicional_metricas_detalhes_projetos">
										média por funcionalidade
									</h2>
								</div>

								<div className="div_informacoes_projeto_detalhes">
									<h2 className="titulo_metricas_detalhes_projetos">
										Taxa de Retrabalho
									</h2>
									<h2 className="valor_metricas_detalhes_projetos">12%</h2>
									<h2 className="adicional_metricas_detalhes_projetos">
										tarefas retornadas
									</h2>
								</div>

								<div className="div_informacoes_projeto_detalhes">
									<h2 className="titulo_metricas_detalhes_projetos">
										Cycle Time
									</h2>
									<h2 className="valor_metricas_detalhes_projetos">2.8 dias</h2>
									<h2 className="adicional_metricas_detalhes_projetos">
										tempo médio por tarefa
									</h2>
								</div>

								<div className="div_informacoes_projeto_detalhes">
									<h2 className="titulo_metricas_detalhes_projetos">
										Taxa de bugs
									</h2>
									<h2 className="valor_metricas_detalhes_projetos">
										1.5 bugs/função
									</h2>
									<h2 className="adicional_metricas_detalhes_projetos">
										Taxa de Bugs por Funcionalidade
									</h2>
								</div>
							</div>
						</div>

						<div className="div_informacoes_projeto_detalhes">
							<h2 className="titulo_card_projeto_detalhes">Informações do Projeto</h2>
							<div className="div_datas_projeto">
								<h2 className="sub_titulo_card_projeto_detalhes">Gerente do Projeto:</h2>
								<h2 className="sub_titulo_card_projeto_detalhes">{gerenteProjeto}</h2>
							</div>
							<div className="div_datas_projeto">
								<h2 className="sub_titulo_card_projeto_detalhes">Status:</h2>
								<h2 className="sub_titulo_card_projeto_detalhes">{status}</h2>
							</div>
							<div className="div_datas_projeto">
								<h2 className="sub_titulo_card_projeto_detalhes">Data de Início:</h2>
								<h2 className="sub_titulo_card_projeto_detalhes">{formatDDMMYYYY(dataInicio)}</h2>
							</div>
							<div className="div_datas_projeto">
								<h2 className="sub_titulo_card_projeto_detalhes">Data de Término:</h2>
								<h2 className="sub_titulo_card_projeto_detalhes">{formatDDMMYYYY(dataFim)}</h2>
							</div>
							<div className="div_datas_projeto">
								<h2 className="sub_titulo_card_projeto_detalhes">Duração:</h2>
								<h2 className="sub_titulo_card_projeto_detalhes">{duracao > 0 ? `${duracao} dias` : "-"}</h2>
							</div>
						</div>
						<div className="card_atualizacoes">
							<h2 className="titulo_homepage">Atividades Recentes</h2>
							<div className="div_atividades_recentes">
								<div className="container_projetos">
									<img src={desenvolvedor1} className="img_atividade_recente" />
									<div>
										<h2 className="texto_atividade_recente">
											<span className="responsavel_atividade_recente">
												João Silva
											</span>{" "}
											completou a tarefa{" "}
											<span className="projeto_atividade_recente">
												Implementar autenticação
											</span>
										</h2>
										<h2 className="texto_recente_atualizacao">2 horas atrás</h2>
									</div>
								</div>
								<FaChevronRight color="#71717A" />
							</div>
							<div className="div_atividades_recentes">
								<div className="container_projetos">
									<img src={desenvolvedor2} className="img_atividade_recente" />
									<div>
										<h2 className="texto_atividade_recente">
											<span className="responsavel_atividade_recente">
												João Silva
											</span>{" "}
											completou a tarefa{" "}
											<span className="projeto_atividade_recente">
												Implementar autenticação
											</span>
										</h2>
										<h2 className="texto_recente_atualizacao">2 horas atrás</h2>
									</div>
								</div>
								<FaChevronRight color="#71717A" />
							</div>
							<div className="div_atividades_recentes">
								<div className="container_projetos">
									<img src={desenvolvedor3} className="img_atividade_recente" />
									<div>
										<h2 className="texto_atividade_recente">
											<span className="responsavel_atividade_recente">
												João Silva
											</span>{" "}
											completou a tarefa{" "}
											<span className="projeto_atividade_recente">
												Implementar autenticação
											</span>
										</h2>
										<h2 className="texto_recente_atualizacao">2 horas atrás</h2>
									</div>
								</div>
								<FaChevronRight color="#71717A" />
							</div>
						</div>
						<div className="div_informacoes_projeto_detalhes">
							<h2 className="titulo_card_projeto_detalhes">
								Equipe do projeto
							</h2>
							<div className="container_equipe_projeto">
								{membrosDaEquipe.length > 0 ? (
									membrosDaEquipe.map((membro) => (
										<div className="div_equipe_projeto" key={membro.usuario_id}>
											<div>
												{membro.foto_perfil ? (
													<img src={membro.foto_perfil} className="imagemEquipe" alt={`Foto de ${membro.nome}`} />
												) : (
                                                    // Placeholder com a inicial do nome
													<div className="imagemEquipe avatar-iniciais">{membro.nome.charAt(0).toUpperCase()}</div>
												)}
											</div>
											<div className="div_equipe_dados">
												<div>
													<h2 className="sub_titulo_card_projeto_detalhes">
														{membro.nome}
													</h2>
													<h2 className="adicional_metricas_detalhes_projetos">
														Tech Lead
													</h2>
												</div>
												<div className="div_equipe_tarefas">
													<h2 className="sub_titulo_card_projeto_detalhes">
														5 tarefas ativas
													</h2>
													<h2 className="sub_titulo_card_projeto_detalhes">
														12 concluidas
													</h2>
												</div>
											</div>
										</div>
									))
								) : (
									<p>Nenhum membro encontrado para este projeto.</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default ProjetosDetalhes;