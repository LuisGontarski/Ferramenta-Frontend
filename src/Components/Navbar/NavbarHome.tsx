import "./NavbarHome.css";
import { Link } from "react-router-dom";

const NavbarHome = () => {
  return (
      <header className="headerNavBarHome">
        <a href="/" className="logo">
          ReProject
        </a>

        <nav className="navbarHome">
          <div className="div-menu">
            <a href="/kanban">Kanban</a>
            <a href="/cronograma">Cronograma</a>
            <a href="/documentos">Documentos</a>
            <a href="/requisitos">Requisitos</a>
          </div>

          <div className="div-other">
            <a href="/perfil" className="nav_perfil">
              <img className="img_perfil_navbar" src="/src/assets/desenvolvedor1.jpeg"></img>
            </a>
          </div>
        </nav>
      </header>
  );
};

export default NavbarHome;
