import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="headerNavBar">
      <a href="/" className="logoNavbar">
        Logo
      </a>

      <nav className="navbarNav">
        <div className="div-menu">
          <a href="/">Home</a>
          <a href="/">Projetos</a>
          <a href="/">Repositório</a>
          <a href="/">Board</a>
        </div>

        <div className="div-perfil">
          <span>L</span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
