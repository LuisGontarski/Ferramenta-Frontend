import React, { useEffect, useState } from "react";
import "./Perfil.css";
import imgPerfil from "../../assets/desenvolvedor1.jpeg";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { getUserById } from "../../services/userDataService";
import { formatarDataParaDDMMYYYY } from "../../utils/dateUtils";
import AtividadesPerfil from "../../Components/AtividadesPerfil/AtividadesPerfil";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import toast from "react-hot-toast";

// Importando modal de edição
import PerfilEditar from "./PerfilEditar";

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    nome: "",
    cargo: "",
    email: "",
    github: "",
    foto_perfil: "",
    criado_em: "",
  });

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Commits");
  const [githubIntegrated, setGithubIntegrated] = useState(false);

  // controle do modal
  const [isEditOpen, setIsEditOpen] = useState(false);

  const carregarPerfil = async () => {
    setLoading(true);
    setFetchError(null);

    const usuarioId = localStorage.getItem("usuario_id");

    try {
      let response;
      if (usuarioId) {
        response = await getUserById(usuarioId);
      } else {
        response = {
          nome_usuario: "Usuário Padrão",
          cargo: "Cargo não definido",
          email: "email@exemplo.com",
          github: "",
          foto_perfil: "",
          criado_em: new Date().toISOString(),
        };
      }

      setUsuario({
        nome: response.nome_usuario || "Nome não informado",
        cargo: response.cargo || "Cargo não informado",
        email: response.email || "E-mail não informado",
        github: response.github || "",
        foto_perfil: response.foto_perfil || "",
        criado_em: response.criado_em || "",
      });

      setGithubIntegrated(!!response.github);
    } catch (error: any) {
      console.error("Erro ao buscar dados do usuário:", error);
      setFetchError(
        "Falha ao carregar os dados do perfil. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  const handleCategoriaClick = (categoria: string) => {
    setCategoriaSelecionada(categoria);
  };

  const handleRetryGithub = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github/login`;
  };

  const handleSavePerfil = async (usuarioEditado: typeof usuario) => {
    try {
      const loadingToast = toast.loading("Salvando perfil...");

      const usuarioId = localStorage.getItem("usuario_id");

      if (!usuarioId) {
        toast.error("Usuário não autenticado.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${usuarioId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome_usuario: usuarioEditado.nome,
            email: usuarioEditado.email,
            senha: "dummyPassword123",
            cargo: usuario.cargo,
            github: usuario.github,
            foto_perfil: usuario.foto_perfil,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil");
      }

      setUsuario(usuarioEditado);
      toast.success("Perfil atualizado com sucesso!", { id: loadingToast });
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      toast.error("Não foi possível atualizar o perfil.");
    }
  };

  if (loading) {
    return (
      <>
        <NavbarHome />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando perfil...</p>
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <NavbarHome />
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h3>Erro ao carregar perfil</h3>
          <p>{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Tentar Novamente
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarHome />
      <main className="container_conteudos">
        <MenuLateral />
        <div className="container_vertical_conteudos">
          {/* Header do Perfil */}
          <div className="perfil-header">
            <div className="perfil-info-card">
              <div className="perfil-avatar-section">
                {usuario.foto_perfil ? (
                  <img
                    src={usuario.foto_perfil}
                    alt={`Foto de perfil de ${usuario.nome}`}
                    className="perfil-avatar"
                  />
                ) : (
                  <div className="perfil-avatar-inicial">
                    {usuario.nome
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
                <div className="perfil-text-info">
                  <h1 className="perfil-nome">{usuario.nome}</h1>
                  <p className="perfil-cargo">{usuario.cargo}</p>
                </div>
              </div>

              <div className="perfil-details">
                <div className="perfil-detail-item">
                  <i className="fas fa-envelope perfil-detail-icon"></i>
                  <span className="perfil-detail-text">{usuario.email}</span>
                </div>
                <div className="perfil-detail-item">
                  <i className="fab fa-github perfil-detail-icon"></i>
                  <span className="perfil-detail-text">
                    {githubIntegrated ? usuario.github : "GitHub não integrado"}
                  </span>
                </div>
                <div className="perfil-detail-item">
                  <i className="fas fa-calendar perfil-detail-icon"></i>
                  <span className="perfil-detail-text">
                    Membro desde {formatarDataParaDDMMYYYY(usuario.criado_em)}
                  </span>
                </div>
              </div>

              <div className="perfil-actions">
                <button
                  className="btn-perfil btn-primary"
                  onClick={() => setIsEditOpen(true)}
                >
                  <i className="fas fa-edit"></i>
                  Editar Perfil
                </button>

                {!githubIntegrated && (
                  <button
                    className="btn-perfil btn-secondary"
                    onClick={handleRetryGithub}
                  >
                    <i className="fab fa-github"></i>
                    Conectar GitHub
                  </button>
                )}

                <button
                  className="btn-perfil btn-logout"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de edição */}
      {isEditOpen && (
        <PerfilEditar
          usuario={usuario}
          onClose={() => setIsEditOpen(false)}
          onSave={handleSavePerfil}
        />
      )}
    </>
  );
};

export default Perfil;
