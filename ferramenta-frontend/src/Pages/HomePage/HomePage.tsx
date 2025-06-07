import "./HomePage.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import img from "../../Assets/pulse.png";
import calendario from "../../Assets/calendar.png";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <div>
        <NavbarHome />
      </div>

      <main className="container_conteudos">
        <div className="menu_lateral">
          <Link to="/">
            <div className="div_menu_lateral">
              <img src={img} className="icone_menu"/>
              <h2 className="nome_nav_menu_lateral">Dashboard</h2>
            </div>
          </Link>
          <Link to="/projetos">
            <div className="div_menu_lateral">
              <i className="fa-regular fa-folder icone_menu"></i>
              <h2 className="nome_nav_menu_lateral">Projetos</h2>
            </div>
          </Link>
          <div className="div_menu_lateral">
            <img src={calendario} className="icone_menu" />
            <h2 className="nome_nav_menu_lateral">Cronograma</h2>
          </div>
        </div>
        <div className="container_vertical_conteudos">
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
        </div>
        
      </main>
    </>
  );
};

export default HomePage;
