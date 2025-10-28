// src/services/relatorioService.ts
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

// Tipo simplificado para o relatório
export type RelatorioSimples = {
  projeto: {
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
  equipe: Array<{
    usuario_id: string;
    nome_usuario: string;
    email: string;
    cargo: string;
    github: string;
  }>;
  metricas: {
    // Velocidade
    velocidade_media: number;
    sprints_analisadas: number;

    // Tarefas
    total_tarefas: number;
    tarefas_concluidas: number;
    tarefas_andamento: number;
    tarefas_pendentes: number;
    taxa_conclusao_tarefas: number;

    // Story Points
    total_story_points: number;
    story_points_concluidos: number;
    taxa_conclusao_sp: number;

    // Tempos
    lead_time_medio_dias: number;
    cycle_time_medio_dias: number;

    // Qualidade
    tarefas_reabertas: number;
    taxa_entrega_prazo: number;

    // Distribuição
    total_membros: number;
    membros_ativos: number;
    media_tarefas_por_membro: number;
  };
  dados_graficos: {
    // Para gráfico de pizza - Status das tarefas
    tarefas_por_status: Array<{
      status: string;
      quantidade: number;
      cor: string;
    }>;

    // Para gráfico de barras - Velocidade por sprint
    velocidade_sprints: Array<{
      sprint_nome: string;
      story_points_concluidos: number;
    }>;

    // Para gráfico de linha - Throughput semanal
    throughput_semanal: Array<{
      semana: string;
      tarefas_concluidas: number;
    }>;

    // Para gráfico de barras - Tarefas por prioridade
    tarefas_por_prioridade: Array<{
      prioridade: string;
      quantidade: number;
      cor: string;
    }>;
  };
};

// Buscar relatório simplificado (GET)
export const buscarRelatorioSimples = async (
  projeto_id: string
): Promise<RelatorioSimples> => {
  try {
    const response = await axios.get(
      `${API_URL}/relatorio/projeto/${projeto_id}`
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || "Erro ao buscar relatório");
    }
  } catch (error: any) {
    console.error("Erro ao buscar relatório:", error);

    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Não foi possível carregar o relatório");
    }
  }
};

// Gerar PDF via backend (POST com dados)
export const gerarRelatorioPDF = async (
  projeto_id: string,
  nome_projeto: string = "projeto"
) => {
  const loadingToast = toast.loading("Gerando relatório em PDF...");

  try {
    // Primeiro busca os dados do relatório
    const relatorioData = await buscarRelatorioSimples(projeto_id);

    // Envia os dados para gerar o PDF
    const response = await axios.post(
      `${API_URL}/relatorio/projeto/pdf-from-data`,
      relatorioData,
      {
        responseType: "blob",
        timeout: 60000,
      }
    );

    // Verifica se é um PDF
    if (response.data.type !== "application/pdf") {
      console.error("A resposta não é um PDF:", response.data.type);
      const errorText = await new Response(response.data).text();
      throw new Error(
        `Servidor não retornou um PDF: ${errorText.substring(0, 100)}`
      );
    }

    // Cria o blob e faz download
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Nome do arquivo
    const fileName = `relatorio-${nome_projeto.replace(/\s+/g, "_")}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    link.setAttribute("download", fileName);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Relatório gerado! Download iniciado.", {
      id: loadingToast,
      duration: 5000,
    });

    return true;
  } catch (error: any) {
    console.error("Erro ao gerar PDF:", error);

    let errorMessage = "Erro ao gerar relatório em PDF";
    if (error.message) {
      errorMessage = error.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    toast.error(errorMessage, {
      id: loadingToast,
    });

    throw error;
  }
};

// Função legada mantida para compatibilidade (gera PDF diretamente sem dados no frontend)
export const handleGerarRelatorioProjeto = async (
  projetoId: string | null,
  nomeProjeto: string = "projeto"
) => {
  const idProjetoParaRelatorio =
    projetoId || localStorage.getItem("projeto_id");

  console.log(
    "Gerando relatório completo para Projeto ID:",
    idProjetoParaRelatorio
  );

  if (!idProjetoParaRelatorio) {
    toast.error("ID do projeto não encontrado para gerar o relatório.");
    return;
  }

  const loadingToast = toast.loading(
    "Gerando relatório completo do projeto..."
  );

  try {
    const response = await fetch(`${API_URL}/relatorio/projeto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projeto_id: idProjetoParaRelatorio }),
    });

    if (!response.ok) {
      let errorMessage = `Erro na API: ${response.status}`;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage =
            errorData.error ||
            `Erro ${response.status}: ${
              errorData.message || "Erro desconhecido no backend"
            }`;
        } else {
          const textError = await response.text();
          errorMessage = textError || errorMessage;
        }
      } catch (e) {
        errorMessage = (await response.text()) || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const blob = await response.blob();

    // Verifica se é um PDF
    if (blob.type !== "application/pdf") {
      console.error("A resposta da API não foi um PDF, mas sim:", blob.type);
      const errorText = await blob.text();
      console.error("Conteúdo recebido (não PDF):", errorText);
      throw new Error(
        "O servidor não retornou um PDF. Verifique os logs do backend. Conteúdo recebido: " +
          errorText.substring(0, 100) +
          "..."
      );
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const fileName = `relatorio-${nomeProjeto.replace(/\s+/g, "_")}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    link.setAttribute("download", fileName);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Relatório gerado! Iniciando download...", {
      id: loadingToast,
      duration: 5000,
    });
  } catch (error: any) {
    console.error("Erro ao gerar relatório:", error);
    toast.error(
      `Erro ao gerar relatório: ${error.message || "Verifique o console."}`,
      {
        id: loadingToast,
      }
    );
  }
};

// Função para exportar dados brutos (útil para debug)
export const exportarDadosRelatorio = async (projeto_id: string) => {
  try {
    const relatorioData = await buscarRelatorioSimples(projeto_id);

    // Cria um blob JSON para download
    const dataStr = JSON.stringify(relatorioData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `dados-relatorio-${projeto_id}-${
        new Date().toISOString().split("T")[0]
      }.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
    throw error;
  }
};
