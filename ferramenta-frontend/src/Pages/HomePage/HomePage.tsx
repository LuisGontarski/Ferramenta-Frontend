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
                <li><a href="/">Projetos</a></li>
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
      </main>
    </>
  );
};

export default HomePage;
