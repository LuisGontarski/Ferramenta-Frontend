// Components/MenuLateral/SidebarMenu.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./MenuLateral.css"; // crie esse arquivo ou reutilize o estilo existente
import img from "../../Assets/pulse.png";
import calendario from "../../Assets/calendar.png";

const MenuLateral = () => {
  return (
    <div className="menu_lateral">
      <Link to="/">
        <div className="div_menu_lateral">
          <img src={img} className="icone_menu" alt="Dashboard" />
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
        <img src={calendario} className="icone_menu" alt="Cronograma" />
        <h2 className="nome_nav_menu_lateral">Cronograma</h2>
      </div>
    </div>
  );
};

export default MenuLateral;
