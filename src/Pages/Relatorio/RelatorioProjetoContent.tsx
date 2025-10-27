import { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { handleGerarRelatorioProjeto } from "../../services/relatorioService"; // <-- Ajuste o caminho se necessário
import { toast } from "react-hot-toast"; // Adicione se não estiver importado

// Tipos para o relatório
type Projeto = {
  projeto_id: string;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim_prevista: string;
  status: string;
  equipe_nome: string;
  criador_nome: string;
  sprint_atual_nome: string;
};

type MembroEquipe = {
  usuario_id: string;
  nome_usuario: string;
  email: string;
  cargo: string;
  github: string;
};

type ResumoTarefas = {
  total_tarefas: number;
  tarefas_concluidas: number;
  tarefas_andamento: number;
  tarefas_pendentes: number;
  total_story_points: number;
  story_points_concluidos: number;
  cycle_time_medio: number;
};

type TarefaPorPrioridade = {
  prioridade: string;
  quantidade: number;
  story_points: number;
};

type TarefaPorStatus = {
  status: string;
  quantidade: number;
};

type CommitRecente = {
  commit_id: string;
  hash_commit: string;
  mensagem: string;
  data_commit: string;
  url_commit: string;
  nome_usuario: string;
};

type DocumentoRecente = {
  documento_id: string;
  nome_arquivo: string;
  tipo_arquivo: string;
  tamanho_arquivo: number;
  criado_em: string;
};

type Metricas = {
  velocidade: {
    velocidade_media: number;
    velocidade_minima: number;
    velocidade_maxima: number;
    sprints_analisadas: number;
  };
  tempos_entrega: {
    lead_time_medio_dias: number;
    cycle_time_medio_dias: number;
    lead_time_mediano_dias: number;
    cycle_time_mediano_dias: number;
    total_tarefas_medidas: number;
  };
  taxas_conclusao: {
    taxa_conclusao_tarefas: number;
    taxa_conclusao_requisitos: number;
    tarefas_entregues_no_prazo: number;
  };
  qualidade: {
    tarefas_reabertas: number;
    commits_por_tarefa: number;
  };
  distribuicao_trabalho: {
    membros_com_tarefas: number;
    total_membros_equipe: number;
    media_tarefas_por_membro: number;
    max_tarefas_por_membro: number;
  };
  sprints_concluidas: any[];
  throughput_semanal: any[];
};

type RelatorioProjeto = {
  projeto: Projeto;
  equipe: MembroEquipe[];
  resumo_tarefas: ResumoTarefas;
  resumo_requisitos: any;
  resumo_commits: any;
  resumo_documentos: any;
  resumo_sprints: any;
  sprint_atual: any;
  resumo_mensagens: any;
  historico_tarefas: any;
  historico_requisitos: any;
  tarefas_por_prioridade: TarefaPorPrioridade[];
  tarefas_por_status: TarefaPorStatus[];
  commits_recentes: CommitRecente[];
  documentos_recentes: DocumentoRecente[];
  metricas_detalhadas: Metricas;
};

type RelatorioProjetoProps = {
  projeto_id: string;
  usuario_id: string;
  relatorio: RelatorioProjeto | null;
  setRelatorio: (relatorio: RelatorioProjeto) => void;
  carregando: boolean;
  setCarregando: (carregando: boolean) => void;
  erro: string | null;
  setErro: (erro: string | null) => void;
};

const API_URL = import.meta.env.VITE_API_URL;

const RelatorioProjetoContent = ({
  projeto_id,
  usuario_id,
  relatorio,
  setRelatorio,
  carregando,
  setCarregando,
  erro,
  setErro,
}: RelatorioProjetoProps) => {
  // Estados para controles de UI
  const [abaAtiva, setAbaAtiva] = useState<string>("overview");
  const [exportando, setExportando] = useState(false);

  // Ref para o conteúdo a ser exportado
  const contentRef = useRef<HTMLDivElement>(null);

  // Buscar relatório completo
  const buscarRelatorio = async () => {
    setCarregando(true);
    setErro(null);

    try {
      console.log(`📊 Buscando relatório para projeto: ${projeto_id}`);

      const response = await axios.get(
        `${API_URL}/projects/${projeto_id}/full-report`
      );

      setRelatorio(response.data);
      console.log("✅ Relatório carregado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao buscar relatório:", error);
      setErro("Não foi possível carregar o relatório do projeto");
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

  const formatarBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatarDias = (dias: number) => {
    return `${dias?.toFixed(1) || "0"} dias`;
  };

  // Função para exportar para PDF (captura de tela)
  const exportarParaPDF = async () => {
    if (!contentRef.current || !relatorio) return;

    setExportando(true);

    try {
      // Capturar o conteúdo como imagem
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Melhor qualidade
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      // Criar PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Adicionar imagem ao PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Adicionar metadados
      pdf.setProperties({
        title: `Relatório do Projeto - ${relatorio.projeto.nome}`,
        subject: "Relatório completo do projeto",
        author: "Sistema de Gestão de Projetos",
        keywords: "relatório, projeto, métricas, tarefas",
        creator: "Sistema de Gestão de Projetos",
      });

      // Salvar o PDF
      pdf.save(
        `relatorio-projeto-${relatorio.projeto.nome}-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      setErro("Erro ao exportar relatório para PDF");
    } finally {
      setExportando(false);
    }
  };

  // Função alternativa para gerar PDF com conteúdo estruturado
  const gerarPDFBackend = async () => {
    if (!relatorio) {
        toast.error("Não há dados de relatório para gerar o PDF.");
        return;
    }
    setExportando(true); // Indica que a exportação está em andamento
    // Chama a função do serviço, passando o projeto_id
    await handleGerarRelatorioProjeto(projeto_id, relatorio.projeto.nome);
    setExportando(false); // Finaliza o estado de exportação
  };

  // Renderizar loading
  if (carregando) {
    return (
      <div className="rp-container">
        <div className="rp-card">
          <div className="rp-loading">
            <div className="rp-spinner"></div>
            <p>Gerando relatório completo...</p>
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
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { projeto, metricas_detalhadas } = relatorio;

  return (
    <div className="rp-container">
      <div className="rp-card" ref={contentRef}>
        {/* Cabeçalho */}
        <div className="rp-header">
          <div className="rp-header-content">
            <h2 className="rp-title">Relatório do Projeto</h2>
            <h2 className="rp-subtitle">
              {projeto.nome} - Análise completa e métricas
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

            {/* Menu dropdown para exportação */}
            <div className="rp-export-dropdown">
              <button
                className="rp-btn-export"
                disabled={exportando || !relatorio}
              >
                {exportando ? "⏳" : "📄"} Exportar PDF
              </button>
              <div className="rp-export-options">
                <button
                  onClick={exportarParaPDF}
                  disabled={exportando}
                  className="rp-export-option"
                >
                  📷 Captura da Tela
                </button>
                <button
                  onClick={gerarPDFBackend}
                  disabled={exportando}
                  className="rp-export-option"
                >
                  📊 PDF Estruturado
                </button>
              </div>
            </div>
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
            className={`rp-tab ${
              abaAtiva === "metrics" ? "rp-tab-active" : ""
            }`}
            onClick={() => setAbaAtiva("metrics")}
          >
            📈 Métricas
          </button>
          <button
            className={`rp-tab ${abaAtiva === "team" ? "rp-tab-active" : ""}`}
            onClick={() => setAbaAtiva("team")}
          >
            👥 Equipe
          </button>
          <button
            className={`rp-tab ${
              abaAtiva === "activities" ? "rp-tab-active" : ""
            }`}
            onClick={() => setAbaAtiva("activities")}
          >
            🔄 Atividades
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="rp-content">
          {abaAtiva === "overview" && (
            <div className="rp-tab-content">
              {/* Cards de Resumo */}
              <div className="rp-summary-grid">
                <div className="rp-metric-card">
                  <h3>📋 Tarefas</h3>
                  <div className="rp-metric-value">
                    {relatorio.resumo_tarefas.total_tarefas}
                  </div>
                  <div className="rp-metric-details">
                    <span>
                      ✅ {relatorio.resumo_tarefas.tarefas_concluidas}{" "}
                      concluídas
                    </span>
                    <span>
                      🔄 {relatorio.resumo_tarefas.tarefas_andamento} em
                      andamento
                    </span>
                    <span>
                      ⏳ {relatorio.resumo_tarefas.tarefas_pendentes} pendentes
                    </span>
                  </div>
                </div>

                <div className="rp-metric-card">
                  <h3>🎯 Story Points</h3>
                  <div className="rp-metric-value">
                    {relatorio.resumo_tarefas.total_story_points}
                  </div>
                  <div className="rp-metric-details">
                    <span>
                      ✅ {relatorio.resumo_tarefas.story_points_concluidos}{" "}
                      concluídos
                    </span>
                    <span>
                      📊{" "}
                      {relatorio.resumo_tarefas.total_story_points -
                        relatorio.resumo_tarefas.story_points_concluidos}{" "}
                      restantes
                    </span>
                  </div>
                </div>

                <div className="rp-metric-card">
                  <h3>👥 Equipe</h3>
                  <div className="rp-metric-value">
                    {relatorio.equipe?.length || 0}
                  </div>
                  <div className="rp-metric-details">
                    <span>
                      👤{" "}
                      {metricas_detalhadas?.distribuicao_trabalho
                        ?.membros_com_tarefas || 0}{" "}
                      com tarefas
                    </span>
                    <span>
                      📝 Média:{" "}
                      {metricas_detalhadas?.distribuicao_trabalho?.media_tarefas_por_membro?.toFixed(
                        1
                      ) || 0}{" "}
                      tarefas/membro
                    </span>
                  </div>
                </div>

                <div className="rp-metric-card">
                  <h3>⚡ Velocidade</h3>
                  <div className="rp-metric-value">
                    {metricas_detalhadas?.velocidade?.velocidade_media?.toFixed(
                      1
                    ) || 0}
                  </div>
                  <div className="rp-metric-details">
                    <span>📈 SP/sprint</span>
                    <span>
                      🔄{" "}
                      {metricas_detalhadas?.velocidade?.sprints_analisadas || 0}{" "}
                      sprints analisadas
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
                    <strong>Sprint Atual:</strong>
                    <span>{projeto.sprint_atual_nome || "Nenhuma"}</span>
                  </div>
                </div>
              </div>

              {/* Tarefas por Prioridade */}
              <div className="rp-tasks-section">
                <h3>🎯 Tarefas por Prioridade</h3>
                <div className="rp-priorities-list">
                  {relatorio.tarefas_por_prioridade?.map(
                    (item: TarefaPorPrioridade) => (
                      <div key={item.prioridade} className="rp-priority-item">
                        <div className="rp-priority-header">
                          <span
                            className={`rp-badge rp-priority-badge rp-priority-${item.prioridade?.toLowerCase()}`}
                          >
                            {item.prioridade}
                          </span>
                          <span className="rp-priority-count">
                            {item.quantidade} tarefas
                          </span>
                        </div>
                        <div className="rp-priority-details">
                          <span>{item.story_points} story points</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {abaAtiva === "metrics" && metricas_detalhadas && (
            <div className="rp-tab-content">
              <div className="rp-metrics-grid">
                <div className="rp-detailed-metric">
                  <h4>⏱️ Tempos de Entrega</h4>
                  <div className="rp-metrics-list">
                    <div className="rp-metric-item">
                      <span>Lead Time Médio:</span>
                      <strong>
                        {formatarDias(
                          metricas_detalhadas.tempos_entrega
                            .lead_time_medio_dias
                        )}
                      </strong>
                    </div>
                    <div className="rp-metric-item">
                      <span>Cycle Time Médio:</span>
                      <strong>
                        {formatarDias(
                          metricas_detalhadas.tempos_entrega
                            .cycle_time_medio_dias
                        )}
                      </strong>
                    </div>
                    <div className="rp-metric-item">
                      <span>Tarefas Medidas:</span>
                      <strong>
                        {
                          metricas_detalhadas.tempos_entrega
                            .total_tarefas_medidas
                        }
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="rp-detailed-metric">
                  <h4>📈 Taxas de Conclusão</h4>
                  <div className="rp-metrics-list">
                    <div className="rp-metric-item">
                      <span>Tarefas:</span>
                      <strong>
                        {formatarPorcentagem(
                          metricas_detalhadas.taxas_conclusao
                            .taxa_conclusao_tarefas
                        )}
                      </strong>
                    </div>
                    <div className="rp-metric-item">
                      <span>Requisitos:</span>
                      <strong>
                        {formatarPorcentagem(
                          metricas_detalhadas.taxas_conclusao
                            .taxa_conclusao_requisitos
                        )}
                      </strong>
                    </div>
                    <div className="rp-metric-item">
                      <span>No Prazo:</span>
                      <strong>
                        {formatarPorcentagem(
                          metricas_detalhadas.taxas_conclusao
                            .tarefas_entregues_no_prazo
                        )}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="rp-detailed-metric">
                  <h4>🔄 Velocidade da Equipe</h4>
                  <div className="rp-metrics-list">
                    <div className="rp-metric-item">
                      <span>Média:</span>
                      <strong>
                        {metricas_detalhadas.velocidade.velocidade_media.toFixed(
                          1
                        )}{" "}
                        SP
                      </strong>
                    </div>
                    <div className="rp-metric-item">
                      <span>Mínima:</span>
                      <strong>
                        {metricas_detalhadas.velocidade.velocidade_minima} SP
                      </strong>
                    </div>
                    <div className="rp-metric-item">
                      <span>Máxima:</span>
                      <strong>
                        {metricas_detalhadas.velocidade.velocidade_maxima} SP
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="rp-detailed-metric">
                  <h4>📊 Distribuição de Trabalho</h4>
                  <div className="rp-metrics-list">
                    <div className="rp-metric-item">
                      <span>Membros Ativos:</span>
                      <strong>
                        {
                          metricas_detalhadas.distribuicao_trabalho
                            .membros_com_tarefas
                        }
                        /
                        {
                          metricas_detalhadas.distribuicao_trabalho
                            .total_membros_equipe
                        }
                      </strong>
                    </div>
                    <div className="rp-metric-item">
                      <span>Média Tarefas/Membro:</span>
                      <strong>
                        {metricas_detalhadas.distribuicao_trabalho.media_tarefas_por_membro.toFixed(
                          1
                        )}
                      </strong>
                    </div>
                    <div className="rp-metric-item">
                      <span>Máximo Tarefas/Membro:</span>
                      <strong>
                        {
                          metricas_detalhadas.distribuicao_trabalho
                            .max_tarefas_por_membro
                        }
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === "team" && (
            <div className="rp-tab-content">
              <h3>👥 Membros da Equipe</h3>
              <div className="rp-team-grid">
                {relatorio.equipe?.map((membro: MembroEquipe) => (
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

          {abaAtiva === "activities" && (
            <div className="rp-tab-content">
              <div className="rp-activities-grid">
                <div className="rp-activity-section">
                  <h3>🔨 Commits Recentes</h3>
                  <div className="rp-commits-list">
                    {relatorio.commits_recentes?.map(
                      (commit: CommitRecente) => (
                        <div key={commit.commit_id} className="rp-commit-item">
                          <div className="rp-commit-header">
                            <span className="rp-commit-hash">
                              {commit.hash_commit.substring(0, 8)}
                            </span>
                            <span className="rp-commit-date">
                              {formatarData(commit.data_commit)}
                            </span>
                          </div>
                          <div className="rp-commit-message">
                            {commit.mensagem}
                          </div>
                          <div className="rp-commit-author">
                            por {commit.nome_usuario}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="rp-activity-section">
                  <h3>📎 Documentos Recentes</h3>
                  <div className="rp-documents-list">
                    {relatorio.documentos_recentes?.map(
                      (documento: DocumentoRecente) => (
                        <div
                          key={documento.documento_id}
                          className="rp-document-item"
                        >
                          <div className="rp-document-name">
                            {documento.nome_arquivo}
                          </div>
                          <div className="rp-document-details">
                            <span>{documento.tipo_arquivo}</span>
                            <span>
                              {formatarBytes(documento.tamanho_arquivo)}
                            </span>
                            <span>{formatarData(documento.criado_em)}</span>
                          </div>
                        </div>
                      )
                    )}
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
