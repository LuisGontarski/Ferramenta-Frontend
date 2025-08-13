import "./AtividadesPerfil.css";

type AtividadesPerfilProps = {
  id: string;
  titulo: string;
  projeto: string;
  realizadoEm: string;
  icone: string;
  cor: string;
  backgroundCor: string;      
};

const AtividadesPerfil = (props: AtividadesPerfilProps) => {
  return (
    <div className="card_atividades">
      <i className={`${props.icone} icone_tempo_perfil`} style={{ color: props.cor , backgroundColor: props.backgroundCor }}></i>
      <div>
        <h2 className="textos_atividades">{props.titulo}</h2>
        <div className="div_descricao_atividade">
          <h2 className="descricao_atividade">{props.projeto}</h2>
          <i className="fa-solid fa-circle icone_descricao_atividade"></i>
          <h2 className="descricao_atividade">{props.realizadoEm}</h2>
        </div>
      </div>
    </div>
  );
};

export default AtividadesPerfil;
