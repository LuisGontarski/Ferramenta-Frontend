const API_URL = import.meta.env.VITE_API_URL;

export const handleGerarRelatorio = async () => {
  const usuarioId = localStorage.getItem("usuario_id");

  console.log("Usuário ID:", usuarioId); // Log para verificar o valor

  if (!usuarioId) {
    alert("Usuário não encontrado no localStorage");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/relatorio/commits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario_id: usuarioId }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Abre o PDF em uma nova aba
    window.open(url, "_blank");
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    alert("Erro ao gerar relatório. Verifique o console.");
  }
};
