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
            <a href="/">Home</a>
            <a href="/projetos">Projetos</a>
            <a href="/perfil">Perfil</a>
            <a href="/">Repositório</a>
            <a href="/">Board</a>
          </div>

          <div className="div-other">
            <input
              type="search"
              placeholder="Buscar..."
              className="search-input"
            />
           <Link to="/login">Entrar</Link>
          </div>
        </nav>
      </header>
  );
};

export default NavbarHome;
