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
        </div>
      </div>
    </div>
  );
};

export default RelatorioProjetoContent;
