import { useState } from "react";
import "./projetos.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import CardProjeto from "../../Components/CardProjeto/CardProjeto";

const Projetos = () => {
  const categorias = ["Todos", "Ativos", "Concluídos", "Arquivados"];
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");

  return (
    <>
      <div>
        <NavbarHome />
      </div>

      <main className="mainProjetos">
        <div className="div_titulo_projetos">
          <h1>Projetos</h1>
          <button className="btn_novo_projeto">Novo projeto</button>
        </div>

        <input type="text" className="input_pesquisa_projetos" />

        <div className="divCategorias">
          {categorias.map((categoria) => (
            <h2
              key={categoria}
              className={`texto_categoria ${
                categoriaSelecionada === categoria ? "categoria_selecionada" : ""
              }`}
              onClick={() => setCategoriaSelecionada(categoria)}
            >
              {categoria}
            </h2>
          ))}
        </div>

        <div className="container_projetos">
          <CardProjeto
            id="1"
            titulo="Projeto 1"
            descricao="Esse projeto consiste no desenvolvimento de um aplicativo de academia"
            atualizadoEm="Atualizado há 2 dias"
            membros={5}
            branches={3}
            status="Ativo"
          />
        </div>
      </main>
    </>
  );
};

export default Projetos;
