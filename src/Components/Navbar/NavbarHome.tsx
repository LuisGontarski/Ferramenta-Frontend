import "./NavbarHome.css";
import { NavLink, useLocation } from "react-router-dom";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuChartColumn, LuCalendar } from "react-icons/lu";
import { IoMdCheckboxOutline } from "react-icons/io";
import { TfiRulerAlt2 } from "react-icons/tfi";

const NavbarHome = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("id");

  return (
    <header className="headerNavBarHome">
      <a href="/" className="logo">
        ReProject
      </a>

      <nav className="navbarHome">
        <div className="div-menu">
          {projectId && (
            <>
              <NavLink
                to={`/projetosDetalhes?id=${projectId}`}
                className={({ isActive }) =>
                  isActive
                    ? "menu_lateral_item selecionado"
                    : "menu_lateral_item"
                }
              >
                <TfiRulerAlt2 size={"16px"} /> <span>Inicio</span>
              </NavLink>

              <NavLink
                to={`/kanban?id=${projectId}`}
                className={({ isActive }) =>
                  isActive
                    ? "menu_lateral_item selecionado"
                    : "menu_lateral_item"
                }
              >
                <LuChartColumn size={"16px"} /> <span>Kanban</span>
              </NavLink>

              <NavLink
                to={`/cronograma?id=${projectId}`}
                className={({ isActive }) =>
                  isActive
                    ? "menu_lateral_item selecionado"
                    : "menu_lateral_item"
                }
              >
                <LuCalendar size={"16px"} /> <span>Cronograma</span>
              </NavLink>

              <NavLink
                to={`/documentos?id=${projectId}`}
                className={({ isActive }) =>
                  isActive
                    ? "menu_lateral_item selecionado"
                    : "menu_lateral_item"
                }
              >
                <IoDocumentTextOutline size={"16px"} /> <span>Documentos</span>
              </NavLink>

              <NavLink
                to={`/requisitos?id=${projectId}`}
                className={({ isActive }) =>
                  isActive
                    ? "menu_lateral_item selecionado"
                    : "menu_lateral_item"
                }
              >
                <IoMdCheckboxOutline size={"16px"} /> <span>Requisitos</span>
              </NavLink>
            </>
          )}
        </div>

        <div className="div-other">
          <a href="/perfil" className="nav_perfil">
            <img
              className="img_perfil_navbar"
              src="/src/assets/desenvolvedor1.jpeg"
            />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default NavbarHome;
