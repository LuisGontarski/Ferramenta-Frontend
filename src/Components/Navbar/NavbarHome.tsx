import "./NavbarHome.css";
import { Link } from "react-router-dom";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuChartColumn, LuCalendar } from "react-icons/lu";
import { IoMdCheckboxOutline } from "react-icons/io";

const NavbarHome = () => {
  return (
      <header className="headerNavBarHome">
        <a href="/" className="logo">
          ReProject
        </a>

        <nav className="navbarHome">
          <div className="div-menu">
            <a href="/kanban"><LuChartColumn /> <span>Kanban</span></a>
            <a href="/cronograma"><LuCalendar /> <span>Cronograma</span></a>
            <a href="/documentos"><IoDocumentTextOutline /> <span>Documentos</span></a>
            <a href="/requisitos"><IoMdCheckboxOutline /> <span>Requisitos</span></a>
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
