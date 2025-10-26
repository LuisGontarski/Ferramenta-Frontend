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

interface Commit {
  id: string;
  message: string;
  url: string;
  data_commit: string;
  nome_autor_plataforma: string; // This field now comes from the backend
  avatar_url?: string | null; // GitHub avatar URL
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

  const [membrosDaEquipe, setMembrosDaEquipe] = useState<Membro[]>([]);

  const [sprints, setSprints] = useState<{ id: string; title: string }[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<string>("");

  const [burndownData, setBurndownData] = useState<any[]>([]); // Inicializa como array vazio
  const [loadingBurndown, setLoadingBurndown] = useState(false); // Estado de loading para o gráfico
  const [errorBurndown, setErrorBurndown] = useState<string | null>(null); // Estado de erro para o gráfico

  async function fetchBurndown(sprintId?: string) {
        const sprintIdToUse = sprintId || selectedSprint || localStorage.getItem("sprint_selecionada_id"); // Garante que temos um ID

        if (!sprintIdToUse) {
            console.warn("Nenhuma sprint selecionada para buscar o burndown.");
            setBurndownData([]); // Limpa os dados se não houver sprint
            setErrorBurndown("Nenhuma sprint selecionada.");
            return;
        }

        setLoadingBurndown(true);
        setErrorBurndown(null);
        console.log("Buscando burndown para sprint ID:", sprintIdToUse);

        try {
            const res = await fetch(`${BASE_URL}/sprint/${sprintIdToUse}/burndown`);
            if (!res.ok) {
                 const errorData = await res.json();
                 throw new Error(errorData.message || `Erro HTTP: ${res.status}`);
            }
            const data = await res.json();
            console.log("Dados do Burndown recebidos:", data);
            setBurndownData(Array.isArray(data) ? data : []); // Garante que seja um array
        } catch (error: any) {
            console.error("Erro ao buscar dados do Burndown:", error);
            setErrorBurndown(error.message || "Falha ao carregar gráfico Burndown.");
            setBurndownData([]); // Limpa os dados em caso de erro
        } finally {
            setLoadingBurndown(false);
        }
    }

    // Efeito para buscar o Burndown quando a sprint selecionada mudar
    useEffect(() => {
        fetchBurndown(); // Busca na montagem inicial e quando selectedSprint mudar
    }, [selectedSprint]);

  const [commits, setCommits] = useState<any[]>([]);
  const [numCommits, setNumCommits] = useState(0);

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
      console.log(
        `✅ ${commitsGitHub.length} commits carregados de ${repoFullName}`
      );
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
        if (!resMembros.ok)
          throw new Error(`Erro ao buscar membros: ${resMembros.status}`);
        const membros = await resMembros.json();
        setMembrosDaEquipe(membros);
      } catch (err) {
        console.error("Erro ao carregar membros da equipe:", err);
      }
    }

    async function fetchSprintSelecionada() {
      if (!id) return;
      try {
        console.log("🔄 Buscando sprint selecionada para projeto:", id);

        const response = await fetch(
          `${BASE_URL}/projects/${id}/sprint-selecionada`
        );

        if (!response.ok) {
          throw new Error(
            `Erro ao buscar sprint selecionada: ${response.status}`
          );
        }

        const data = await response.json();

        if (data.success && data.sprint_selecionada_id) {
          localStorage.setItem(
            "sprint_selecionada_id", // ← CORRIGIDO: sprint_selecionada_id
            data.sprint_selecionada_id
          );
          console.log(
            "✅ Sprint selecionada salva no localStorage:",
            data.sprint_selecionada_id
          );

          // Atualiza o estado selectedSprint também
          setSelectedSprint(data.sprint_selecionada_id);
        } else {
          console.log(
            "ℹ️ Nenhuma sprint selecionada encontrada para este projeto"
          );
          localStorage.removeItem("sprint_selecionada_id"); // ← CORRIGIDO
        }
      } catch (error) {
        console.error("❌ Erro ao buscar sprint selecionada:", error);
      }
    }

    async function fetchSprints() {
      try {
        const res = await fetch(`${BASE_URL}/sprint/${id}`);
        if (!res.ok) throw new Error(`Erro ao buscar sprints: ${res.status}`);
        const sprintsData = await res.json();

        const mappedSprints = sprintsData.map((s: any) => ({
          id: s.id.toString(),
          title: s.title,
        }));

        setSprints(mappedSprints);

        // PRIORIDADE: usa a sprint_selecionada_id do localStorage
        const sprintSelecionadaId = localStorage.getItem(
          "sprint_selecionada_id"
        );

        if (
          sprintSelecionadaId &&
          mappedSprints.some(
            (sprint: { id: string; title: string }) =>
              sprint.id === sprintSelecionadaId
          )
        ) {
          setSelectedSprint(sprintSelecionadaId);
          console.log(
            "✅ Sprint selecionada do localStorage:",
            sprintSelecionadaId
          );
        } else if (mappedSprints.length > 0) {
          // Se não houver sprint selecionada válida, usa a primeira
          setSelectedSprint(mappedSprints[0].id);
          localStorage.setItem("sprint_selecionada_id", mappedSprints[0].id);
          console.log("🔄 Usando primeira sprint:", mappedSprints[0].id);
        }
      } catch (err) {
        console.error("Erro ao buscar sprints:", err);
        setSprints([]);
        setSelectedSprint("");
      }
    }

    fetchMembrosDoProjeto();
    fetchSprintSelecionada();
    fetchSprints();

    async function fetchDadosDoProjeto() {
      if (!id) return; // 'id' deve vir do useParams() no componente
      try {
        localStorage.setItem("projeto_id", id); //

        // Busca detalhes do projeto
        const res = await fetch(`${BASE_URL}/projects/${id}`); //
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const projeto = await res.json(); //

        // Atualiza estados do projeto
        setNome(projeto.nome || "Nome não encontrado"); //
        setDescricao(projeto.descricao || "Descrição não encontrada"); //
        setStatus(projeto.status || "Status não definido"); //
        setGerenteProjeto(projeto.gerente_projeto || "-"); //

        const toDateInput = (v: string | null) =>
          v ? new Date(v).toISOString().slice(0, 10) : ""; //
        setDataInicio(toDateInput(projeto.data_inicio)); //
        setDataFim(toDateInput(projeto.data_fim_prevista || projeto.data_fim)); //

        const calcDuracao = (inicio: any, fim: any) => {
          if (!inicio || !fim) return 0;
          const d1 = new Date(inicio);
          const d2 = new Date(fim);
          if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
          const diffTime = Math.abs(d2.getTime() - d1.getTime());
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }; //

        setDuracao(
          calcDuracao(
            projeto.data_inicio,
            projeto.data_fim_prevista || projeto.data_fim
          )
        ); //

        // Busca membros do projeto
        const resMembros = await fetch(`${BASE_URL}/projects/${id}/users`); //
        if (!resMembros.ok)
          throw new Error(`Erro ao buscar membros: ${resMembros.status}`); //
        const membros: Membro[] = await resMembros.json(); //
        setMembrosDaEquipe(membros); //

        // Busca commits do backend se o repositório estiver definido
        if (projeto.github_repo) {
          //
          console.log("📦 Repositório encontrado:", projeto.github_repo); //
          localStorage.setItem("github_repo", projeto.github_repo); //
          try {
            const resCommits = await fetch(
              `${BASE_URL}/projects/${id}/commits`
            ); //
            if (!resCommits.ok)
              throw new Error(
                `Erro ao buscar commits do backend: ${resCommits.status}`
              );
            const commitsData: Commit[] = await resCommits.json();
            setCommits(commitsData.slice(0, 10)); // Limita a 10 no frontend //
            setNumCommits(commitsData.length); //
            console.log(
              `✅ ${commitsData.length} commits carregados do backend`
            ); //
          } catch (commitError) {
            console.error("❌ Erro ao buscar commits do backend:", commitError); //
            setCommits([]); //
            setNumCommits(0); //
          }
        } else {
          console.warn("⚠️ Campo github_repo não definido no projeto."); //
          setCommits([]); //
          setNumCommits(0); //
        }
      } catch (err) {
        console.error("Erro ao carregar dados da página:", err); //
        setNome("Erro ao carregar projeto"); // Define um estado de erro //
        // Considere adicionar um estado de erro para exibir uma mensagem ao usuário
        // setError("Falha ao carregar os dados do projeto.");
      }
    }
    fetchDadosDoProjeto();

    async function fetchTotalTarefas() {
      try {
        const res = await fetch(`${BASE_URL}/projects/${id}/tasks/count`);
        if (!res.ok)
          throw new Error(`Erro ao buscar total de tarefas: ${res.status}`);
        const data = await res.json();
        setTotalTarefas(data.total);
      } catch (err) {
        console.error("Erro ao buscar total de tarefas:", err);
      }
    }

    async function fetchTarefasEmProgresso() {
      try {
        const res = await fetch(
          `${BASE_URL}/projects/${id}/tasks/count?fase=Executar,Revisar`
        );
        if (!res.ok)
          throw new Error(`Erro ao buscar tarefas em progresso: ${res.status}`);
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
        const res = await fetch(
          `${BASE_URL}/projects/${id}/tasks/count?fase=Feito`
        );
        if (!res.ok)
          throw new Error(`Erro ao buscar tarefas concluídas: ${res.status}`);
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

  const handleSprintChange = async (sprintId: string) => {
    try {
      // Atualiza o estado local
      setSelectedSprint(sprintId);
      localStorage.setItem("sprint_selecionada_id", sprintId);
      console.log("✅ Sprint selecionada:", sprintId);

      // Chama o PATCH para atualizar no banco de dados
      const res = await fetch(`${BASE_URL}/projects/${id}/sprint-selecionada`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sprint_id: sprintId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro ao atualizar sprint selecionada: ${res.status}`);
      }

      const result = await res.json();
      console.log("✅ Sprint selecionada atualizada no banco:", result.message);

      // Recarregar o burndown com a nova sprint selecionada
      fetchBurndown(sprintId);
    } catch (err) {
      console.error("❌ Erro ao atualizar sprint selecionada:", err);
      // Opcional: reverter a seleção em caso de erro
      const previousSprint = localStorage.getItem("sprint_selecionada_id");
      setSelectedSprint(previousSprint || "");
    }
  };

  const handleExcluir = async () => {
    if (!window.confirm("Tem certeza?")) return;
    try {
      const res = await fetch(`${BASE_URL}/projects/${id}`, {
        method: "DELETE",
      });
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

  const progressoPercent =
    totalTarefas > 0 ? Math.round((totalConcluidas / totalTarefas) * 100) : 0;

  const max = 100; // valor máximo em percentual
  const gradientStyle = {
    background: `linear-gradient(to right, #155dfc 0%, #155dfc ${progressoPercent}%, #e0e0e0 ${progressoPercent}%)`,
  };

  const formatDDMMYYYY = (v: string | null): string => {
    if (!v) return "";
    const [year, month, day] = v.split("-");
    return `${day}/${month}/${year}`;
  };


const renderBurndownChart = () => {
        if (loadingBurndown) {
            return <p className="loading-message">Carregando gráfico Burndown...</p>; // Adicione estilo CSS se necessário
        }
        if (errorBurndown) {
            return <p className="error-message">Erro ao carregar Burndown: {errorBurndown}</p>; // Adicione estilo CSS
        }
        if (burndownData.length === 0) {
            return <p className="empty-message">Dados do Burndown indisponíveis para esta sprint.</p>; // Adicione estilo CSS
        }

        return (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={burndownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                    <XAxis dataKey="dia" />
                    <YAxis label={{ value: 'Story Points Restantes', angle: -90, position: 'insideLeft' }}/>
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone" // Curva suave
                        dataKey="planejado"
                        name="Planejado" // Nome na legenda
                        stroke="#8884d8" // Cor da linha planejada (ex: roxo)
                        strokeDasharray="5 5" // Linha tracejada
                        dot={false} // Sem pontos nos dados
                    />
                    <Line
                        type="monotone" // Curva suave
                        dataKey="real"
                        name="Real" // Nome na legenda
                        stroke="#82ca9d" // Cor da linha real (ex: verde)
                        strokeWidth={2} // Linha mais grossa
                        activeDot={{ r: 6 }} // Ponto maior ao passar o mouse
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    }

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
              <div className="container_botoes_titulo">
                {/* Select de Sprints */}
                {sprints.length > 0 && (
                  <div className="sprint-selector">
                    <label
                      htmlFor="sprint-select"
                      className="sprint-selector-label"
                    >
                      Sprint:
                    </label>
                    <select
                      id="sprint-select"
                      value={selectedSprint}
                      onChange={(e) => handleSprintChange(e.target.value)}
                      className="sprint-select"
                    >
                      {sprints.map((sprint) => (
                        <option key={sprint.id} value={sprint.id}>
                          {sprint.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {cargo === "Product Owner" && (
                  <button
                    className="btn_novo_projeto"
                    onClick={() => mostrarModal()}
                  >
                    <GrEdit size={"14px"} />
                    Editar projeto
                  </button>
                )}
              </div>

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
                <h2 className="valor_metricas_detalhes_projetos">
                  {progressoPercent}%
                </h2>
                <input
                  type="range"
                  className="custom-range"
                  max={max}
                  min={0}
                  value={progressoPercent}
                  style={gradientStyle}
                  readOnly
                />
              </div>
              <div className="div_informacoes_projeto_detalhes">
                <h2 className="titulo_metricas_detalhes_projetos">
                  Tarefas concluídas
                </h2>
                <h2 className="valor_metricas_detalhes_projetos">
                  {totalConcluidas}
                </h2>
                <h2 className="adicional_metricas_detalhes_projetos">
                  de {totalTarefas} tarefas
                </h2>
              </div>
              <div className="div_informacoes_projeto_detalhes">
                <h2 className="titulo_metricas_detalhes_projetos">
                  Em progresso
                </h2>
                <h2 className="valor_metricas_detalhes_projetos">
                  {totalEmProgresso}
                </h2>
                <h2 className="adicional_metricas_detalhes_projetos">
                  tarefas ativas
                </h2>
              </div>

              <div className="div_informacoes_projeto_detalhes">
                <h2 className="titulo_metricas_detalhes_projetos">
                  Cycle Time
                </h2>
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
              {renderBurndownChart()}
              {/* <ResponsiveContainer width="100%" height={300}>
                <LineChart data={burndownData}>
                  <Line
                    dataKey="planejado"
                    stroke="#3b82f6"
                    strokeDasharray="5 5"
                  />
                  <Line dataKey="real" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer> */}
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
              <h2 className="titulo_card_projeto_detalhes">
                Informações do Projeto
              </h2>
              <div className="div_datas_projeto">
                <h2 className="sub_titulo_card_projeto_detalhes">
                  Gerente do Projeto:
                </h2>
                <h2 className="sub_titulo_card_projeto_detalhes">
                  {gerenteProjeto}
                </h2>
              </div>
              <div className="div_datas_projeto">
                <h2 className="sub_titulo_card_projeto_detalhes">Status:</h2>
                <h2 className="sub_titulo_card_projeto_detalhes">{status}</h2>
              </div>
              <div className="div_datas_projeto">
                <h2 className="sub_titulo_card_projeto_detalhes">
                  Data de Início:
                </h2>
                <h2 className="sub_titulo_card_projeto_detalhes">
                  {formatDDMMYYYY(dataInicio)}
                </h2>
              </div>
              <div className="div_datas_projeto">
                <h2 className="sub_titulo_card_projeto_detalhes">
                  Data de Término:
                </h2>
                <h2 className="sub_titulo_card_projeto_detalhes">
                  {formatDDMMYYYY(dataFim)}
                </h2>
              </div>
              <div className="div_datas_projeto">
                <h2 className="sub_titulo_card_projeto_detalhes">Duração:</h2>
                <h2 className="sub_titulo_card_projeto_detalhes">
                  {duracao > 0 ? `${duracao} dias` : "-"}
                </h2>
              </div>
            </div>
            <div className="card_atualizacoes">
              <h2 className="titulo_homepage">
                Commits Recentes ({numCommits})
              </h2>

              {commits.length > 0 ? (
                commits.map((commit) => (
                  <div key={commit.id} className="div_atividades_recentes">
                    {" "}
                    {/* */}
                    <div className="container_projetos">
                      {" "}
                      {/* */}
                      <div>
                        <h2 className="texto_atividade_recente">
                          {" "}
                          {/* */}
                          {/* --- Display Platform Username --- */}
                          <span className="responsavel_atividade_recente">
                            {" "}
                            {/* */}
                            {commit.nome_autor_plataforma}
                          </span>{" "}
                          — {commit.message.split("\n")[0]}{" "}
                          {/* Show first line of commit message */} {/* */}
                        </h2>
                        <h2 className="texto_recente_atualizacao">
                          {" "}
                          {/* */}
                          {new Date(commit.data_commit).toLocaleString(
                            //
                            "pt-BR"
                          )}
                        </h2>
                      </div>
                    </div>
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver commit no GitHub"
                    >
                      {" "}
                      {/* */}
                      <FaChevronRight color="#71717A" /> {/* */}
                    </a>
                  </div>
                ))
              ) : (
                <p className="descricao_graficos_projetos">
                  {" "}
                  {/* */}
                  Nenhum commit encontrado ou o repositório não está vinculado.{" "}
                  {/* */}
                </p>
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
                          <img
                            src={membro.foto_perfil}
                            className="imagemEquipe"
                            alt={`Foto de ${membro.nome}`}
                          />
                        ) : (
                          // Placeholder com a inicial do nome
                          <div className="imagemEquipe avatar-iniciais">
                            {membro.nome.charAt(0).toUpperCase()}
                          </div>
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
