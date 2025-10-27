import { useParams } from "react-router-dom";
import { useState } from "react";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import RelatorioProjetoContent from "./RelatorioProjetoContent"; // Corrigido o import
import "./RelatorioProjeto.css";

const RelatorioProjetoWrapper = () => {
  const { projeto_id } = useParams<{ projeto_id: string }>();
  const usuario_id = localStorage.getItem("usuario_id") || "";

  const [relatorio, setRelatorio] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Validações com mensagens mais amigáveis
  if (!projeto_id) {
    return (
      <div className="erro_container">
        <NavbarHome />
        <div className="container_conteudos">
          <MenuLateral />
          <div className="mensagem_erro">
            <h2>Projeto não encontrado</h2>
            <p>O projeto solicitado não está disponível ou não existe.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!usuario_id) {
    return (
      <div className="erro_container">
        <NavbarHome />
        <div className="container_conteudos">
          <MenuLateral />
          <div className="mensagem_erro">
            <h2>Usuário não autenticado</h2>
            <p>Faça login novamente para acessar o relatório do projeto.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavbarHome />
      <div className="container_conteudos">
        <MenuLateral />
        <RelatorioProjetoContent
          projeto_id={projeto_id}
          usuario_id={usuario_id}
          relatorio={relatorio}
          setRelatorio={setRelatorio}
          carregando={carregando}
          setCarregando={setCarregando}
          erro={erro}
          setErro={setErro}
        />
      </div>
    </>
  );
};

export default RelatorioProjetoWrapper;
