import { useParams } from "react-router-dom";
import Chat from "./Chat";

const ChatWrapper = () => {
  // Obtém o ID do projeto a partir da rota (/chat/:projeto_id)
  const { projeto_id } = useParams<{ projeto_id: string }>();

  // Obtém o ID do usuário logado do localStorage
  const usuario_id = localStorage.getItem("usuario_id");
  const usuario_nome = localStorage.getItem("usuario_nome") || "Usuário";

  console.log("Projeto ID:", projeto_id);
  console.log("Usuário ID:", usuario_id);
  console.log("Usuário Nome:", usuario_nome);

  // Verificações básicas
  if (!projeto_id) {
    return <div>Projeto não definido</div>;
  }

  if (!usuario_id) {
    return <div>Usuário não autenticado. Faça login novamente.</div>;
  }

  return (
    <div>
      <Chat
        usuario_id={usuario_id}
        usuario_nome={usuario_nome}
        projeto_id={projeto_id}
      />
    </div>
  );
};

export default ChatWrapper;
