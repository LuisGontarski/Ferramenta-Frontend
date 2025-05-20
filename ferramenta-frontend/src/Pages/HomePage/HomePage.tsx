import "./HomePage.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";

const HomePage = () => {
  return (
    <>
      <div>
        <NavbarHome />
      </div>

      <main className="main">
        <div className="first-container">
          <h1>Seja Bem-vindo:</h1>
          <h1>Ferramenta</h1>

          <button>Começar</button>
        </div>
        
        <div className="second-container">
            <ul className="list">
                <li><a href="/projetos">Projetos</a></li>
                <li><a href="/">Repositório</a></li>
                <li><a href="/">Tarefas</a></li>
                <li><a href="/">Gráficos</a></li>
                <li><a href="/">Comunicação</a></li>
                <li><a href="/">Métricas</a></li>
            </ul>
        </div>

        <div className="third-container">
            <picture>
                <img src="" alt="/" />
            </picture>
        </div>
        <div className="container_projetos_atualizacoes">
          <div className="card_atualizacoes">
              <h2 className="titulo_projetos">Projetos Recentes</h2>
              <h2 className="descricao_projetos">Você tem 12 projetos ativos no momento.</h2>
              <div className="div_projetos">
                <div className="container_projetos">
                  <i className="fa-solid fa-chart-column icone_projetos"></i>
                  <div>
                    <h2 className="texto_projetos">Projeto AllLuga</h2>
                    <h2 className="texto_atualizacao">Atualizado há 2 horas</h2>
                  </div>
                </div>
                <i className="fa-solid fa-arrow-right"></i>
              </div>
              <div className="div_projetos">
                <div className="container_projetos">
                  <i className="fa-solid fa-chart-column icone_projetos"></i>
                  <div>
                    <h2 className="texto_projetos">Projeto AllLuga</h2>
                    <h2 className="texto_atualizacao">Atualizado há 2 horas</h2>
                  </div>
                </div>
                <i className="fa-solid fa-arrow-right"></i>
              </div>
              <div className="div_projetos">
                <div className="container_projetos">
                  <i className="fa-solid fa-chart-column icone_projetos"></i>
                  <div>
                    <h2 className="texto_projetos">Projeto AllLuga</h2>
                    <h2 className="texto_atualizacao">Atualizado há 2 horas</h2>
                  </div>
                </div>
                <i className="fa-solid fa-arrow-right"></i>
              </div>
              <div className="div_projetos">
                <div className="container_projetos">
                  <i className="fa-solid fa-chart-column icone_projetos"></i>
                  <div>
                    <h2 className="texto_projetos">Projeto AllLuga</h2>
                    <h2 className="texto_atualizacao">Atualizado há 2 horas</h2>
                  </div>
                </div>
                <i className="fa-solid fa-arrow-right"></i>
              </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
