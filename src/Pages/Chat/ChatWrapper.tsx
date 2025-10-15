import { useParams } from "react-router-dom";
import Chat from "./Chat";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";

const ChatWrapper = () => {
  const { projeto_id } = useParams<{ projeto_id: string }>();
  const usuario_id = localStorage.getItem("usuario_id");
  const usuario_nome = localStorage.getItem("usuario_nome") || "Usuário";

  if (!projeto_id) return <div>Projeto não definido</div>;
  if (!usuario_id)
    return <div>Usuário não autenticado. Faça login novamente.</div>;

  return (
    <>
      <NavbarHome />
      <div className="container_conteudos">
        <MenuLateral />
        <Chat
          usuario_id={usuario_id}
          usuario_nome={usuario_nome}
          projeto_id={projeto_id}
        />
      </div>
    </>
  );
};

export default ChatWrapper;
