import { useParams } from "react-router-dom";
import Chat from "./Chat";

const ChatWrapper = () => {
  // Pega o projeto_id da rota, ex: /chat/123e4567-e89b-12d3-a456-426614174000
  const { projeto_id } = useParams<{ projeto_id: string }>();

  // Aqui você pode pegar o usuário logado do seu contexto/auth
  const usuario_id = "89017ccf-58ee-4c91-95f6-17c9ca80f00f"; // substituir pelo ID real do usuário logado
  const usuario_nome = "Gustavo"; // substituir pelo nome real do usuário logado

  if (!projeto_id) {
    return <div>Projeto não definido</div>;
  }

  return (
    <Chat
      usuario_id={usuario_id}
      usuario_nome={usuario_nome}
      projeto_id={projeto_id}
    />
  );
};

export default ChatWrapper;
