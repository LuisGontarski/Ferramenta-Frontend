export const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses são 0-indexados
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};