// src/services/relatorioService.ts
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

// Adicione um parâmetro opcional para o nome do projeto para um nome de arquivo melhor
export const handleGerarRelatorioProjeto = async (projetoId: string | null, nomeProjeto: string = 'projeto') => {

  const idProjetoParaRelatorio = projetoId || localStorage.getItem("projeto_id");

  console.log("Gerando relatório completo para Projeto ID:", idProjetoParaRelatorio);

  if (!idProjetoParaRelatorio) {
    toast.error("ID do projeto não encontrado para gerar o relatório.");
    return;
  }

  // Mantenha o toast de loading aqui
  const loadingToast = toast.loading("Gerando relatório completo do projeto...");

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
               errorMessage = errorData.error || `Erro ${response.status}: ${errorData.message || 'Erro desconhecido no backend'}`;
           } else {
               // Se não for JSON, tenta ler como texto
               const textError = await response.text();
               errorMessage = textError || errorMessage;
           }
       } catch (e) {
            // Se falhar ao ler o corpo do erro, usa a mensagem de status
            errorMessage = await response.text() || errorMessage; // Fallback para texto
       }
       throw new Error(errorMessage);
    }

    const blob = await response.blob();

    // Verificação crucial: O backend realmente enviou um PDF?
    if (blob.type !== "application/pdf") {
        console.error("A resposta da API não foi um PDF, mas sim:", blob.type);
        // Tenta ler o blob como texto para ver a mensagem de erro
        const errorText = await blob.text();
        console.error("Conteúdo recebido (não PDF):", errorText);
        // Informa o usuário sobre o problema específico
        throw new Error("O servidor não retornou um PDF. Verifique os logs do backend. Conteúdo recebido: " + errorText.substring(0, 100) + "...");
    }

    const url = window.URL.createObjectURL(blob);

    // --- Lógica de Download ---
    const link = document.createElement('a'); // Cria um link temporário
    link.href = url;

    // Sugere um nome para o arquivo (usando o nome do projeto e data)
    const fileName = `relatorio-${nomeProjeto.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.pdf`;
    link.setAttribute('download', fileName); // Atributo 'download' força o download

    document.body.appendChild(link); // Adiciona o link ao corpo do documento
    link.click(); // Simula o clique no link para iniciar o download

    // Limpeza: remove o link e revoga a URL do objeto blob
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    // --- Fim da Lógica de Download ---

    // Atualiza o toast para sucesso e informa sobre o download
    toast.success("Relatório gerado! Iniciando download...", {
      id: loadingToast,
      duration: 5000 // Aumenta a duração para dar tempo de ver a mensagem
    });

    // Remove a tentativa de abrir em nova aba:
    // window.open(url, "_blank"); // Não é mais necessário

  } catch (error: any) {
    console.error("Erro ao gerar relatório:", error);
    // Exibe a mensagem de erro específica no toast
    toast.error(`Erro ao gerar relatório: ${error.message || 'Verifique o console.'}`, {
        id: loadingToast // Substitui o toast de loading pelo de erro
    });
  }
};