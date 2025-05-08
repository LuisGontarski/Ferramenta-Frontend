import "./NavbarHome.css";
import { Link } from "react-router-dom";

const NavbarHome = () => {
  return (
      <header className="header">
        <a href="/" className="logo">
          Logo
        </a>

        <nav className="navbar">
          <div className="div-menu">
            <a href="/">Home</a>
            <a href="/">Projetos</a>
            <a href="/">Repositório</a>
            <a href="/">Board</a>
          </div>

          <div className="div-other">
            <input
              type="search"
              placeholder="Buscar..."
              className="search-input"
            />
            <a href="/"><Link to="/login">Entrar</Link></a>
          </div>
        </nav>
      </header>
  );
};

export default NavbarHome;
