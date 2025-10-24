import { useParams } from "react-router-dom";
import { useState } from "react";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import HistoricoProjeto from "./HistoricoProjeto";
import "./HistoricoProjeto.css";

const HistoricoProjetoWrapper = () => {
  const { projeto_id } = useParams<{ projeto_id: string }>();
  const usuario_id = localStorage.getItem("usuario_id") || "";
  
  const [historicos, setHistoricos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  if (!projeto_id) return <div>Projeto não definido</div>;
  if (!usuario_id) return <div>Usuário não autenticado. Faça login novamente.</div>;

  return (
    <>
      <NavbarHome />
      <div className="container_conteudos">
        <MenuLateral />
        <HistoricoProjeto
          projeto_id={projeto_id}
          usuario_id={usuario_id}
          historicos={historicos}
          setHistoricos={setHistoricos}
          carregando={carregando}
          setCarregando={setCarregando}
          erro={erro}
          setErro={setErro}
        />
      </div>
    </>
  );
};

export default HistoricoProjetoWrapper;