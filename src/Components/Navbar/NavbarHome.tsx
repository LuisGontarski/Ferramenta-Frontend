import "./NavbarHome.css";
import { NavLink, useSearchParams } from "react-router-dom";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuChartColumn, LuCalendar } from "react-icons/lu";
import { IoMdCheckboxOutline } from "react-icons/io";
import { TfiRulerAlt2 } from "react-icons/tfi";

const NavbarHome = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id"); // pega o valor do ?id=111

  const isInProject = Boolean(id);

  return (
    <header className="headerNavBarHome">
      <a href="/" className="logo">
        ReProject
      </a>

      <nav className="navbarHome">
        <div className="div-menu">
          {isInProject && (
            <>
              <NavLink
                to={`/projetosDetalhes?id=${id}`}
                className={({ isActive }) =>
                  isActive ? "menu_lateral_item selecionado" : "menu_lateral_item"
                }
              >
                <TfiRulerAlt2 size="16px" /> <span>Inicio</span>
              </NavLink>

              <NavLink
                to={`/kanban?id=${id}`}
                className={({ isActive }) =>
                  isActive ? "menu_lateral_item selecionado" : "menu_lateral_item"
                }
              >
                <LuChartColumn size="16px" /> <span>Kanban</span>
              </NavLink>

              <NavLink
                to={`/cronograma?id=${id}`}
                className={({ isActive }) =>
                  isActive ? "menu_lateral_item selecionado" : "menu_lateral_item"
                }
              >
                <LuCalendar size="16px" /> <span>Cronograma</span>
              </NavLink>

              <NavLink
                to={`/documentos?id=${id}`}
                className={({ isActive }) =>
                  isActive ? "menu_lateral_item selecionado" : "menu_lateral_item"
                }
              >
                <IoDocumentTextOutline size="16px" /> <span>Documentos</span>
              </NavLink>

              <NavLink
                to={`/requisitos?id=${id}`}
                className={({ isActive }) =>
                  isActive ? "menu_lateral_item selecionado" : "menu_lateral_item"
                }
              >
                <IoMdCheckboxOutline size="16px" /> <span>Requisitos</span>
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
