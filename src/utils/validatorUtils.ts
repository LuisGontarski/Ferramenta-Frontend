// --- Funções de Validação Individuais ---

/**
 * Verifica se um valor é obrigatório (não vazio).
 * @param value O valor a ser verificado.
 * @param fieldName O nome do campo para a mensagem de erro (opcional).
 * @returns Uma string de erro se inválido, ou null se válido.
 */
export const validateRequired = (value: string, fieldName: string = "Este campo"): string | null => {
  if (!value || value.trim() === "") {
    return `${fieldName} é obrigatório.`;
  }
  return null;
};

/**
 * Valida o formato de um endereço de e-mail.
 * @param email O e-mail a ser validado.
 * @returns Uma string de erro se o formato for inválido, ou null se válido ou vazio.
 * (A verificação de "obrigatório" deve ser feita separadamente se necessário).
 */
export const validateEmailFormat = (email: string): string | null => {
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    return "Formato de e-mail inválido.";
  }
  return null;
};

/**
 * Valida o comprimento mínimo de uma senha.
 * @param password A senha a ser validada.
 * @param minLength O comprimento mínimo exigido (padrão é 6).
 * @returns Uma string de erro se o comprimento for inválido, ou null se válido ou vazio.
 * (A verificação de "obrigatório" deve ser feita separadamente).
 */
export const validatePasswordLength = (password: string, minLength: number = 6): string | null => {
  if (password && password.length < minLength) {
    return `Senha deve ter no mínimo ${minLength} caracteres.`;
  }
  return null;
};

/**
 * Verifica se a senha e a confirmação de senha coincidem.
 * @param password A senha.
 * @param confirmPassword A confirmação da senha.
 * @returns Uma string de erro se não coincidirem, ou null se coincidirem ou se a confirmação estiver vazia.
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (password && confirmPassword && password !== confirmPassword) {
    return "As senhas não coincidem.";
  }
  return null;
};