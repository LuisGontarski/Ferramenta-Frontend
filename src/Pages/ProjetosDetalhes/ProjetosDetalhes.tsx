import { useState, useEffect } from "react";
import "./ProjetosDetalhes.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import { FaChevronRight } from "react-icons/fa6";
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

	const [totalTarefas, setTotalTarefas] = useState<number>(0);

	const [totalConcluidas, setTotalConcluidas] = useState<number>(0);

	const [totalEmProgresso, setTotalEmProgresso] = useState<number>(0);

	const [cycleTime, setCycleTime] = useState<number | null>(null);


	const [showModal, setShowModal] = useState(false);
	const [nome, setNome] = useState("Carregando...");
	const [descricao, setDescricao] = useState("Carregando...");
	const [dataInicio, setDataInicio] = useState("");
	const [dataFim, setDataFim] = useState("");
	const [status, setStatus] = useState("Carregando...");
	const [duracao, setDuracao] = useState(0);
	const [gerenteProjeto, setGerenteProjeto] = useState("Carregando...");

	
	const [burndownData, setBurndownData] = useState([
  { dia: "Dia 1", planejado: 100, real: 100 },
  { dia: "Dia 2", planejado: 90, real: 95 },
]);


	useEffect(() => {
  async function fetchBurndown() {
    const sprintId = "24c873a0-de8c-496c-b76d-935b65489c3a";
    const res = await fetch(`${BASE_URL}/sprint/${sprintId}/burndown`);
    const data = await res.json();
	console.log("Burndown Data:", data);

    setBurndownData(data);
  }
  fetchBurndown();
}, []); // ✅ Correto

	const [commits, setCommits] = useState<any[]>([]);
	const [numCommits, setNumCommits] = useState(0);

	const [membrosDaEquipe, setMembrosDaEquipe] = useState<Membro[]>([]);

	async function fetchCommits(repoFullName: string) {
		try {
			const res = await fetch(
				`https://api.github.com/repos/${repoFullName}/commits?per_page=30`
			);
			if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
			const commitsGitHub = await res.json();

			if (!Array.isArray(commitsGitHub)) {
				console.error("Resposta inesperada da API:", commitsGitHub);
				return;
			}

			setCommits(commitsGitHub.slice(0, 10));
			setNumCommits(commitsGitHub.length);
			console.log(`✅ ${commitsGitHub.length} commits carregados de ${repoFullName}`);
		} catch (err) {
			console.error("❌ Erro ao buscar commits:", err);
			setCommits([]);
			setNumCommits(0);
		}
	}

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

				if (projeto.github_repo) {
					console.log("📦 Repositório encontrado:", projeto.github_repo);
					localStorage.setItem("github_repo", projeto.github_repo);
					fetchCommits(projeto.github_repo);
				} else {
					console.warn("⚠️ Campo github_repo não definido no projeto.");
					setCommits([]);
					setNumCommits(0);
				}

			} catch (err) {
				console.error("Erro ao carregar dados da página:", err);
				setNome("Erro ao carregar projeto");
			}
		}
		fetchDadosDoProjeto();

		async function fetchTotalTarefas() {
			try {
				const res = await fetch(`${BASE_URL}/projects/${id}/tasks/count`);
				if (!res.ok) throw new Error(`Erro ao buscar total de tarefas: ${res.status}`);
				const data = await res.json();
				setTotalTarefas(data.total);
			} catch (err) {
				console.error("Erro ao buscar total de tarefas:", err);
			}
		}

		async function fetchTarefasEmProgresso() {
			try {
				const res = await fetch(`${BASE_URL}/projects/${id}/tasks/count?fase=Executar,Revisar`);
				if (!res.ok) throw new Error(`Erro ao buscar tarefas em progresso: ${res.status}`);
				const data = await res.json();
				setTotalEmProgresso(data.total);
			} catch (err) {
				console.error(err);
			}
		}

		fetchTarefasEmProgresso();

		async function fetchCycleTime() {
    if (!id) return;
    try {
      const res = await fetch(`${BASE_URL}/projects/${id}/cycle-time`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = await res.json();
      setCycleTime(data.cycleTime);
    } catch (err) {
      console.error("Erro ao buscar cycle time:", err);
      setCycleTime(null);
    }
  }
  fetchCycleTime();


		// Total de tarefas concluídas
		async function fetchTarefasConcluidas() {
			try {
				const res = await fetch(`${BASE_URL}/projects/${id}/tasks/count?fase=Feito`);
				if (!res.ok) throw new Error(`Erro ao buscar tarefas concluídas: ${res.status}`);
				const data = await res.json();
				setTotalConcluidas(data.total);
			} catch (err) {
				console.error("Erro ao buscar tarefas concluídas:", err);
			}
		}

		fetchTotalTarefas().then(fetchTarefasConcluidas);
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
								<h2 className="titulo_metricas_detalhes_projetos">Tarefas concluídas</h2>
								<h2 className="valor_metricas_detalhes_projetos">{totalConcluidas}</h2>
								<h2 className="adicional_metricas_detalhes_projetos">
									de {totalTarefas} tarefas
								</h2>
							</div>
							<div className="div_informacoes_projeto_detalhes">
								<h2 className="titulo_metricas_detalhes_projetos">
									Em progresso
								</h2>
								<h2 className="valor_metricas_detalhes_projetos">{totalEmProgresso}</h2>
								<h2 className="adicional_metricas_detalhes_projetos">
									tarefas ativas
								</h2>
							</div>

							<div className="div_informacoes_projeto_detalhes">
  <h2 className="titulo_metricas_detalhes_projetos">Cycle Time</h2>
  <h2 className="valor_metricas_detalhes_projetos">
    {cycleTime !== null ? `${cycleTime} dias` : "Carregando..."}
  </h2>
  <h2 className="adicional_metricas_detalhes_projetos">
    tempo médio por tarefa
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
								<LineChart data={burndownData}>
  <Line dataKey="planejado" stroke="#3b82f6" strokeDasharray="5 5" />
  <Line dataKey="real" stroke="#10b981" strokeWidth={2} />
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
							<div className="container_kpi">
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
							<h2 className="titulo_homepage">Commits Recentes ({numCommits})</h2>

							{commits.length > 0 ? (
								commits.map((commit) => (
									<div key={commit.sha} className="div_atividades_recentes">
										<div className="container_projetos">
											<img
												src={
													commit.author?.avatar_url ||
													"https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
												}
												className="img_atividade_recente"
												alt={commit.commit.author.name}
											/>
											<div>
												<h2 className="texto_atividade_recente">
													<span className="responsavel_atividade_recente">
														{commit.commit.author.name}
													</span>{" "}
													— {commit.commit.message}
												</h2>
												<h2 className="texto_recente_atualizacao">
													{new Date(commit.commit.author.date).toLocaleString("pt-BR")}
												</h2>
											</div>
										</div>
										<FaChevronRight color="#71717A" />
									</div>
								))
							) : (
								<p className="descricao_graficos_projetos">Nenhum commit encontrado.</p>
							)}
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