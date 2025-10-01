import "./NavbarHome.css";
import { NavLink, useParams } from "react-router-dom";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuChartColumn, LuCalendar } from "react-icons/lu";
import { IoMdCheckboxOutline } from "react-icons/io";
import { TfiRulerAlt2 } from "react-icons/tfi";
import { useEffect, useState } from "react";
import axios from "axios";
import type { UserDTO } from "../../dtos/userDTO";

const API_URL = import.meta.env.VITE_API_URL;

const NavbarHome = () => {
  const { id, projeto_id } = useParams();
  const projectId = id || projeto_id;

  const [usuario, setUsuario] = useState<UserDTO>({
    id: "",
    nome_usuario: "",
    cargo: "",
    email: "",
    github: "",
    foto_perfil: "",
  });

  useEffect(() => {
    const usuarioId = localStorage.getItem("usuario_id");
    if (!usuarioId) return;

    const carregarUsuario = async () => {
      try {
        const response = await axios.get<UserDTO>(
          `${API_URL}/user/${usuarioId}`
        );
        setUsuario(response.data);
      } catch (err) {
        console.error("Erro ao carregar usuário no Navbar:", err);
      }
    };

    carregarUsuario();
  }, []);

  const renderAvatar = () => {
    if (usuario.foto_perfil) {
      return (
        <img
          className="img_perfil_navbar"
          src={usuario.foto_perfil}
          alt={`Foto de perfil de ${usuario.nome_usuario}`}
        />
      );
    } else {
      const inicial = usuario.nome_usuario
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return <div className="avatar_iniciais_navbar">{inicial}</div>;
    }
  };

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
                to={`/projetosDetalhes/${projectId}`}
                className={({ isActive }) =>
                  isActive
                    ? "menu_lateral_item selecionado"
                    : "menu_lateral_item"
                }
              >
                <TfiRulerAlt2 size={"16px"} /> <span>Inicio</span>
              </NavLink>
              <NavLink
                to={`/kanban/${projectId}`}
                className={({ isActive }) =>
                  isActive
                    ? "menu_lateral_item selecionado"
                    : "menu_lateral_item"
                }
              >
                <LuChartColumn size={"16px"} /> <span>Kanban</span>
              </NavLink>
              <NavLink
                to={`/cronograma/${projectId}`}
                className={({ isActive }) =>
                  isActive
                    ? "menu_lateral_item selecionado"
                    : "menu_lateral_item"
                }
              >
                <LuCalendar size={"16px"} /> <span>Cronograma</span>
              </NavLink>
              <NavLink
                to={`/documentos/${projectId}`}
                className={({ isActive }) =>
                  isActive
                    ? "menu_lateral_item selecionado"
                    : "menu_lateral_item"
                }
              >
                <IoDocumentTextOutline size={"16px"} /> <span>Documentos</span>
              </NavLink>
              <NavLink
                to={`/requisitos/${projectId}`}
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
            {renderAvatar()}
          </a>
        </div>
      </nav>
    </header>
  );
};

export default NavbarHome;
