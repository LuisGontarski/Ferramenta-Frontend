import React from "react";
import "./Navbar.css";

const Navbar = () => {
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

        <div className="div-perfil">
          <span>L</span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
