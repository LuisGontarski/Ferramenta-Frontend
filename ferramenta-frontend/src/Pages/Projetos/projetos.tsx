import { useState } from "react";
import "./projetos.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import CardProjeto from "../../Components/CardProjeto/CardProjeto";

const Projetos = () => {
  const categorias = ["Todos", "Ativos", "Concluídos", "Arquivados"];
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");

  function abrirModal() {
    var modal = document.getElementById('card_modal');
    if (modal) modal.style.display = 'flex';
  }

  function fecharModal() {
    var modal = document.getElementById('card_modal');
    if (modal) modal.style.display = 'none';
  }

  return (
    <>
      <div>
        <NavbarHome />
      </div>

      <div className="container_modal sumir" id="card_modal">
          <div className="modal_adicionar_projeto">
            <div className="div_titulo_modal">
              <h1>Criar novo projeto</h1>
              <h2 onClick={fecharModal}>X</h2>
            </div>
            <h2>Preencha as informações abaixo para criar um novo projeto. Clique em salvar quando terminar.</h2>
            <div>
              <h2>Nome do projeto</h2>
              <input type="text" name="" id="" />
            </div>
            <div>
              <h2>Descrição</h2>
              <input type="text" name="" id="" />
            </div>
            <div>
              <div>
                <h2>Data de Início</h2>
                <input type="date" name="" id="" />
              </div>
              <div>
                <h2>Data de Término</h2>
                <input type="date" name="" id="" />
              </div>
            </div>
            <div>
                <h2>Membros da equipe</h2>
                <div className="container_membros">
                  <div className="card_membros_equipe">
                    <input type="checkbox" name="" id="" />
                      <div className="img_perfil"></div>            
                    <div>
                      <h2>João Silva</h2>
                      <h2>Desenvolvedor Frontend</h2>
                    </div>
                  </div>
                  <div className="card_membros_equipe">
                    <input type="checkbox" name="" id="" />
                      <div className="img_perfil"></div>            
                    <div>
                      <h2>João Silva</h2>
                      <h2>Desenvolvedor Frontend</h2>
                    </div>
                  </div>
                  <div className="card_membros_equipe">
                    <input type="checkbox" name="" id="" />
                      <div className="img_perfil"></div>            
                    <div>
                      <h2>João Silva</h2>
                      <h2>Desenvolvedor Frontend</h2>
                    </div>
                  </div>
                  <div className="card_membros_equipe">
                    <input type="checkbox" name="" id="" />
                      <div className="img_perfil"></div>            
                    <div>
                      <h2>João Silva</h2>
                      <h2>Desenvolvedor Frontend</h2>
                    </div>
                  </div>
                  <div className="card_membros_equipe">
                    <input type="checkbox" name="" id="" />
                      <div className="img_perfil"></div>            
                    <div>
                      <h2>João Silva</h2>
                      <h2>Desenvolvedor Frontend</h2>
                    </div>
                  </div>
                  <div className="card_membros_equipe">
                    <input type="checkbox" name="" id="" />
                      <div className="img_perfil"></div>            
                    <div>
                      <h2>João Silva</h2>
                      <h2>Desenvolvedor Frontend</h2>
                    </div>
                  </div>
                  <div className="card_membros_equipe">
                    <input type="checkbox" name="" id="" />
                      <div className="img_perfil"></div>            
                    <div>
                      <h2>João Silva</h2>
                      <h2>Desenvolvedor Frontend</h2>
                    </div>
                  </div>
                </div>
            </div>
            <div>
            <h2>Repositório (Opcional)</h2>
            <button className="btn_conectar">
              <h2>Conectar com GitHub</h2>
              <i className="fa-brands fa-github"></i>
              </button>
            </div>
          </div>
        </div>

      <main className="mainProjetos">
        <div className="div_titulo_projetos">
          <h1>Projetos</h1>
          <button className="btn_novo_projeto" onClick={abrirModal}>Novo projeto</button>
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
