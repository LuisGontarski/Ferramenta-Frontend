import "./CardProjeto.css";
import { Link } from "react-router-dom";

type CardProjetoProps = {
  id: string;
  titulo: string;
  descricao: string;
  atualizadoEm: string;
  membros: number;
  branches: number;
  status: string;
};

const CardProjeto = (props: CardProjetoProps) => {
  return (
    <div className="card_projetos">
      <div>
        <h2 className="titulo_projeto">{props.titulo}</h2>
        <h2 className="descricao_projeto">{props.descricao}</h2>
      </div>

      <div className="container_informacoes">
        <div className="div_informacoes_projeto">
          <div className="div_icones">
            <i className="fas fa-clock"></i>
            <h2 className="sub_descricao_projeto">{props.atualizadoEm}</h2>
          </div>
          <div className="div_icones">
            <i className="fa-solid fa-user-group"></i>
            <h2 className="sub_descricao_projeto">{props.membros} membros</h2>
          </div>
        </div>

        <div className="div_informacoes_projeto">
          <div className="div_icones">
            <i className="fa-solid fa-code-branch"></i>
            <h2 className="sub_descricao_projeto">{props.branches} branches</h2>
          </div>
          <h2 className="sub_descricao_projeto">{props.status}</h2>
        </div>
      </div>

      <Link to={`/projetos/${props.id}`} className="btn_entrar_projetos">
        Entrar no Projeto
      </Link>
    </div>
  );
};

export default CardProjeto;
