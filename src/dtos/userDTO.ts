export interface UserDTO {
  usuario_id?: string;    // Opcional (não enviado na criação)
  nome_usuario: string;   // Obrigatório
  email: string;          // Obrigatório
  senha?: string;         // Opcional (obrigatório na criação, mas não em outros contextos)
  cargo?: string;         // Opcional
  github?: string;        // Opcional
  foto_perfil?: string;   // Opcional
  criado_em?: string;     // Opcional (não enviado na criação)
}

export interface ResponseUserDTO {
  message: string;
  usuario_id: string; // O backend SEMPRE retorna o ID do usuário criado
  token?: string;     // Opcional: se o backend enviar um token para auto-login
  cargo?: string;
  github_token?: string;
}