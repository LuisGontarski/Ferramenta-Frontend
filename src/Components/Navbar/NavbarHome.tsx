import "./NavbarHome.css";
import { NavLink, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  IoBookOutline,
  IoChatboxOutline,
  IoDocumentTextOutline,
  IoNewspaperOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
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
  const location = useLocation(); // ← ADICIONAR
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<UserDTO>({
    usuario_id: "",
    nome_usuario: "",
    cargo: "",
    email: "",
    github: "",
    foto_perfil: "",
  });

  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);

  // Função para buscar notificações (agora reutilizável)
  const buscarNotificacoesNaoLidas = async () => {
    try {
      const usuarioId = localStorage.getItem("usuario_id");
      if (!usuarioId) return;

      const response = await axios.get(
        `${API_URL}/notificacoes/contar-nao-lidas?usuario_id=${usuarioId}`
      );

      if (response.data.success) {
        setNotificacoesNaoLidas(response.data.totalNaoLidas);
      }
    } catch (err) {
      console.error("Erro ao buscar notificações não lidas:", err);
    }
  };

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

  // SOLUÇÃO #4: Atualizar notificações quando a rota muda
  useEffect(() => {
    buscarNotificacoesNaoLidas();
  }, [location.pathname]); // ← Atualiza sempre que a URL muda

  const handleNotificacaoClick = () => {
    navigate("/notificacoes-historico");
  };

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
              <NavLink
                to={`/chat/${projectId}`}
                className={({ isActive }) =>
                  isActive
                    ? "menu_lateral_item selecionado"
                    : "menu_lateral_item"
                }
              >
                <IoChatboxOutline size={"16px"} /> <span>Chat</span>
              </NavLink>

              <NavLink
                to={`/historico/${projectId}`}
                className={({ isActive }) =>
                  isActive
                    ? "menu_lateral_item selecionado"
                    : "menu_lateral_item"
                }
              >
                <IoBookOutline size={"16px"} /> <span>Histórico</span>
              </NavLink>

              <NavLink
                to={`/relatorio/projeto/${projectId}`}
                className={({ isActive }) =>
                  isActive
                    ? "menu_lateral_item selecionado"
                    : "menu_lateral_item"
                }
              >
                <IoNewspaperOutline size={"16px"} /> <span>Relatório</span>
              </NavLink>
            </>
          )}
        </div>

        <div className="div-other">
          {/* Ícone de Notificações - Estilo Gmail */}
          <button
            className="notificacao-btn"
            onClick={handleNotificacaoClick}
            title="Notificações"
          >
            <IoNotificationsOutline size={"24px"} />
            {notificacoesNaoLidas > 0 && (
              <span className="notificacao-badge">
                {notificacoesNaoLidas > 99 ? "99+" : notificacoesNaoLidas}
              </span>
            )}
          </button>

          {/* Avatar do usuário */}
          <a href="/perfil" className="nav_perfil">
            {renderAvatar()}
          </a>
        </div>
      </nav>
    </header>
  );
};

export default NavbarHome;
