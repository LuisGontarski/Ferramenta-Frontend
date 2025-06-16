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
           <h2>Perfil</h2>
          </div>
        </nav>
      </header>
  );
};

export default NavbarHome;
