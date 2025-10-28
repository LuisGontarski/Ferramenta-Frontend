// RelatorioProjetoContent.tsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  buscarRelatorioSimples,
  gerarRelatorioPDF,
  type RelatorioSimples,
} from "../../services/relatorioService";
import { toast } from "react-hot-toast";

// Importar componentes de gráfico (usando Chart.js ou similar)
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

type RelatorioProjetoProps = {
  projeto_id: string;
  usuario_id: string;
  relatorio: RelatorioSimples | null;
  setRelatorio: (relatorio: RelatorioSimples) => void;
  carregando: boolean;
  setCarregando: (carregando: boolean) => void;
  erro: string | null;
  setErro: (erro: string | null) => void;
};

// Cores para os gráficos
const CORES_GRAFICO = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const RelatorioProjetoContent = ({
  projeto_id,
  relatorio,
  setRelatorio,
  carregando,
  setCarregando,
  erro,
  setErro,
}: RelatorioProjetoProps) => {
  const [abaAtiva, setAbaAtiva] = useState<string>("overview");
  const [exportando, setExportando] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Buscar relatório simplificado
  const buscarRelatorio = async () => {
    setCarregando(true);
    setErro(null);

    try {
      console.log(
        `📊 Buscando relatório simplificado para projeto: ${projeto_id}`
      );
      const dados = await buscarRelatorioSimples(projeto_id);
      setRelatorio(dados);
      console.log("✅ Relatório carregado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao buscar relatório:", error);
      setErro("Não foi possível carregar o relatório do projeto");
      toast.error("Erro ao carregar relatório");
    } finally {
      setCarregando(false);
    }
  };

  // Carregar relatório ao montar o componente
  useEffect(() => {
    buscarRelatorio();
  }, [projeto_id]);

  // Funções auxiliares para formatação
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarPorcentagem = (valor: number) => {
    return `${(valor * 100).toFixed(1)}%`;
  };

  const formatarDias = (dias: number) => {
    return `${dias?.toFixed(1) || "0"} dias`;
  };

  // Função para gerar PDF via backend
  const gerarPDFBackend = async () => {
    if (!relatorio) {
      toast.error("Não há dados de relatório para gerar o PDF.");
      return;
    }

    setExportando(true);
    try {
      await gerarRelatorioPDF(projeto_id, relatorio.projeto.nome);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar PDF");
    } finally {
      setExportando(false);
    }
  };

  // Renderizar loading
  if (carregando) {
    return (
      <div className="rp-container">
        <div className="rp-card">
          <div className="rp-loading">
            <div className="rp-spinner"></div>
            <p>Carregando relatório...</p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar erro
  if (erro) {
    return (
      <div className="rp-container">
        <div className="rp-card">
          <div className="rp-error">
            <p>❌ {erro}</p>
            <button onClick={buscarRelatorio} className="rp-btn-retry">
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar se não há relatório
  if (!relatorio) {
    return (
      <div className="rp-container">
        <div className="rp-card">
          <div className="rp-empty">
            <p>📊 Nenhum relatório disponível</p>
            <button onClick={buscarRelatorio} className="rp-btn-generate">
              Carregar Relatório
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { projeto, metricas, dados_graficos, equipe } = relatorio;

  return (
    <div className="rp-container">
      <div className="rp-card" ref={contentRef}>
        {/* Cabeçalho */}
        <div className="rp-header">
          <div className="rp-header-content">
            <h2 className="rp-title">Relatório do Projeto</h2>
            <h2 className="rp-subtitle">
              {projeto.nome} - Métricas e Análises
            </h2>
          </div>

          {/* Botões de Ação */}
          <div className="rp-actions">
            <button
              onClick={buscarRelatorio}
              className="rp-btn-update"
              disabled={carregando}
            >
              {carregando ? "🔄" : "↻"} Atualizar
            </button>

            <button
              onClick={gerarPDFBackend}
              disabled={exportando || !relatorio}
              className="rp-btn-export"
            >
              {exportando ? "⏳" : "📄"} Exportar PDF
            </button>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="rp-tabs">
          <button
            className={`rp-tab ${
              abaAtiva === "overview" ? "rp-tab-active" : ""
            }`}
            onClick={() => setAbaAtiva("overview")}
          >
            📊 Visão Geral
          </button>
          <button
            className={`rp-tab ${abaAtiva === "charts" ? "rp-tab-active" : ""}`}
            onClick={() => setAbaAtiva("charts")}
          >
            📈 Gráficos
          </button>
          <button
            className={`rp-tab ${abaAtiva === "team" ? "rp-tab-active" : ""}`}
            onClick={() => setAbaAtiva("team")}
          >
            👥 Equipe
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="rp-content">
          {abaAtiva === "overview" && (
            <div className="rp-tab-content">
              {/* Cards de Métricas Principais */}
              <div className="rp-summary-grid">
                <div className="rp-metric-card rp-metric-highlight">
                  <h3>🎯 Progresso do Projeto</h3>
                  <div className="rp-metric-value">
                    {formatarPorcentagem(metricas.taxa_conclusao_tarefas)}
                  </div>
                  <div className="rp-metric-details">
                    <span>
                      {metricas.tarefas_concluidas} de {metricas.total_tarefas}{" "}
                      tarefas
                    </span>
                    <span>
                      {metricas.story_points_concluidos} de{" "}
                      {metricas.total_story_points} SP
                    </span>
                  </div>
                </div>

                <div className="rp-metric-card">
                  <h3>⚡ Velocidade</h3>
                  <div className="rp-metric-value">
                    {metricas.velocidade_media?.toFixed(1) || 0}
                  </div>
                  <div className="rp-metric-details">
                    <span>SP por sprint</span>
                    <span>
                      {metricas.sprints_analisadas} sprints analisadas
                    </span>
                  </div>
                </div>

                <div className="rp-metric-card">
                  <h3>⏱️ Tempos Médios</h3>
                  <div className="rp-metric-value">
                    {formatarDias(metricas.cycle_time_medio_dias)}
                  </div>
                  <div className="rp-metric-details">
                    <span>Cycle Time</span>
                    <span>
                      Lead Time: {formatarDias(metricas.lead_time_medio_dias)}
                    </span>
                  </div>
                </div>

                <div className="rp-metric-card">
                  <h3>📊 Qualidade</h3>
                  <div className="rp-metric-value">
                    {formatarPorcentagem(metricas.taxa_entrega_prazo)}
                  </div>
                  <div className="rp-metric-details">
                    <span>Entregas no prazo</span>
                    <span>{metricas.tarefas_reabertas} tarefas reabertas</span>
                  </div>
                </div>
              </div>

              {/* Informações do Projeto */}
              <div className="rp-info-section">
                <h3>📋 Informações do Projeto</h3>
                <div className="rp-info-grid">
                  <div className="rp-info-item">
                    <strong>Status:</strong>
                    <span
                      className={`rp-status rp-status-${projeto.status?.toLowerCase()}`}
                    >
                      {projeto.status}
                    </span>
                  </div>
                  <div className="rp-info-item">
                    <strong>Data Início:</strong>
                    <span>{formatarData(projeto.data_inicio)}</span>
                  </div>
                  <div className="rp-info-item">
                    <strong>Previsão Término:</strong>
                    <span>{formatarData(projeto.data_fim_prevista)}</span>
                  </div>
                  <div className="rp-info-item">
                    <strong>Equipe:</strong>
                    <span>{projeto.equipe_nome || "Não definida"}</span>
                  </div>
                  <div className="rp-info-item">
                    <strong>Criador:</strong>
                    <span>{projeto.criador_nome}</span>
                  </div>
                  <div className="rp-info-item">
                    <strong>Membros Ativos:</strong>
                    <span>
                      {metricas.membros_ativos} de {metricas.total_membros}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === "charts" && (
            <div className="rp-tab-content">
              <div className="rp-charts-grid">
                {/* Gráfico de Pizza - Status das Tarefas */}
                <div className="rp-chart-card">
                  <h3>📊 Distribuição de Tarefas por Status</h3>
                  <div className="rp-chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dados_graficos.tarefas_por_status}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ status, quantidade }) => `${quantidade}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="quantidade"
                        >
                          {dados_graficos.tarefas_por_status.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.cor ||
                                  CORES_GRAFICO[index % CORES_GRAFICO.length]
                                }
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gráfico de Barras - Velocidade por Sprint */}
                <div className="rp-chart-card">
                  <h3>📈 Velocidade por Sprint</h3>
                  <div className="rp-chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dados_graficos.velocidade_sprints}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="sprint_nome" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="story_points_concluidos"
                          name="Story Points"
                          fill="#0088FE"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gráfico de Linha - Throughput Semanal */}
                <div className="rp-chart-card">
                  <h3>📅 Throughput Semanal</h3>
                  <div className="rp-chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dados_graficos.throughput_semanal}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="semana" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="tarefas_concluidas"
                          name="Tarefas Concluídas"
                          stroke="#00C49F"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gráfico de Barras - Tarefas por Prioridade */}
                <div className="rp-chart-card">
                  <h3>🎯 Tarefas por Prioridade</h3>
                  <div className="rp-chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dados_graficos.tarefas_por_prioridade}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="prioridade" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="quantidade" name="Quantidade">
                          {dados_graficos.tarefas_por_prioridade.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.cor ||
                                  CORES_GRAFICO[index % CORES_GRAFICO.length]
                                }
                              />
                            )
                          )}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === "team" && (
            <div className="rp-tab-content">
              <h3>👥 Membros da Equipe ({equipe.length})</h3>
              <div className="rp-team-grid">
                {equipe.map((membro) => (
                  <div key={membro.usuario_id} className="rp-member-card">
                    <div className="rp-member-avatar">
                      {membro.nome_usuario.charAt(0).toUpperCase()}
                    </div>
                    <div className="rp-member-info">
                      <h4>{membro.nome_usuario}</h4>
                      <p>{membro.cargo || "Sem cargo definido"}</p>
                      <p className="rp-member-email">{membro.email}</p>
                      {membro.github && (
                        <p className="rp-member-github">🐙 {membro.github}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatorioProjetoContent;
