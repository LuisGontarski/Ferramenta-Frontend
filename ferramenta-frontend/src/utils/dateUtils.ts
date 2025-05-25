export const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses são 0-indexados
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatarDataParaDDMMYYYY = (timestamp: string) => {
  if (!timestamp) {
    return 'Data não informada';
  }
  try {
    const dataObj = new Date(timestamp);
    if (isNaN(dataObj.getTime())) {
      return 'Data inválida';
    }

    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return 'Erro na data';
  }
};