import React, { useEffect, useState } from "react";
import "./Perfil.css";
import imgPerfil from "../../assets/desenvolvedor1.jpeg";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { getUserById } from "../../services/userDataService";
import { formatarDataParaDDMMYYYY } from "../../utils/dateUtils";
import AtividadesPerfil from "../../Components/AtividadesPerfil/AtividadesPerfil";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";

// Importando os gráficos já componentizados
import GraficoCommits from "../Perfil/GraficoCommit";
import GraficoHoras from "../Perfil/GraficoHora";
import GraficoTarefas from "../Perfil/GraficoTarefas";
import GraficoAtividadeSemanal from "../Perfil/GraficoAtividadeSemanal";

// Importando modal de edição
import PerfilEditar from "./PerfilEditar";

// Dados mockados
const dataCommits = [
  { projeto: "Projeto A", commits: 30, linhas: 500 },
  { projeto: "Projeto B", commits: 50, linhas: 800 },
  { projeto: "Projeto C", commits: 20, linhas: 300 },
];

const dataHoras = [
  { dia: "Seg", total: 8, produtivas: 6 },
  { dia: "Ter", total: 7, produtivas: 5 },
  { dia: "Qua", total: 9, produtivas: 7 },
  { dia: "Qui", total: 8, produtivas: 6 },
  { dia: "Sex", total: 6, produtivas: 4 },
];

const dataTarefas = [
  { status: "Concluídas", value: 50 },
  { status: "Em Progresso", value: 30 },
  { status: "Pendente", value: 20 },
];

const dataAtividadeSemanal = [
  { dia: "Seg", commits: 4, reviews: 2, reunioes: 1 },
  { dia: "Ter", commits: 3, reviews: 3, reunioes: 2 },
  { dia: "Qua", commits: 5, reviews: 2, reunioes: 1 },
  { dia: "Qui", commits: 4, reviews: 1, reunioes: 2 },
  { dia: "Sex", commits: 2, reviews: 3, reunioes: 1 },
  { dia: "Sab", commits: 1, reviews: 1, reunioes: 0 },
  { dia: "Dom", commits: 0, reviews: 0, reunioes: 0 },
];

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
      // aqui você pode chamar sua API de update
      await fetch(`${import.meta.env.VITE_API_URL}/users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioEditado),
      });

      setUsuario(usuarioEditado);
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      alert("Não foi possível atualizar o perfil.");
    }
  };

  if (loading) {
    return (
      <>
        <NavbarHome />
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          Carregando perfil...
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <NavbarHome />
        <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
          {fetchError}
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
          <div className="container_perfil">
            <div className="card_perfil">
              <div className="div_foto_perfil">
                {usuario.foto_perfil ? (
                  <img
                    src={usuario.foto_perfil}
                    alt={`Foto de perfil de ${usuario.nome}`}
                    className="foto_perfil"
                  />
                ) : (
                  <div className="avatar_iniciais_perfil">
                    {usuario.nome
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
                <h2 className="texto_foto_perfil">{usuario.nome}</h2>
                <h2 className="texto_cargo">{usuario.cargo}</h2>
              </div>
              <div className="container_icones_perfil">
                <div className="div_icones_perfil">
                  <i className="fa-regular fa-envelope icones_perfil"></i>
                  <h2 className="texto_dados">{usuario.email}</h2>
                </div>
                <div className="div_icones_perfil">
                  <i className="fa-brands fa-github icones_perfil"></i>
                  <h2 className="texto_dados">
                    {githubIntegrated
                      ? usuario.github
                      : "Não foi possível se integrar com GitHub!"}
                  </h2>
                </div>
                <div className="div_icones_perfil">
                  <i className="fa-regular fa-calendar icones_perfil"></i>
                  <h2 className="texto_dados">
                    {formatarDataParaDDMMYYYY(usuario.criado_em)}
                  </h2>
                </div>
              </div>

              <button
                className="btn_editar"
                onClick={() => setIsEditOpen(true)}
              >
                Editar Perfil
              </button>
              <button
                className="btn_excluir"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
              <button className="btn_excluir">Excluir Perfil</button>

              {!githubIntegrated && (
                <div style={{ marginTop: "15px", textAlign: "center" }}>
                  <button
                    className="proceed-button"
                    onClick={handleRetryGithub}
                  >
                    Tentar integrar com GitHub
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cards de atividades */}
          <div className="container_cards">
            <div className="container_sessoes_perfil">
              <div className="card_perfil">
                <h2 className="titulo_card">Atividades</h2>
                <div className="div_tipo_atividade">
                  {["Commits", "Tarefas", "Pull Requests", "Tempo"].map(
                    (categoria) => (
                      <h2
                        key={categoria}
                        className={`texto_categorias ${
                          categoriaSelecionada === categoria
                            ? "categoria_selecionada"
                            : ""
                        }`}
                        onClick={() => handleCategoriaClick(categoria)}
                      >
                        {categoria}
                      </h2>
                    )
                  )}
                </div>
                {/* Exemplo de atividades */}
                {categoriaSelecionada === "Commits" && (
                  <div className="container_atividades">
                    <AtividadesPerfil
                      id="1"
                      titulo="Refatoração do backend"
                      projeto="API de Pagamentos"
                      realizadoEm="há 1 hora"
                      icone="fa-solid fa-code-commit"
                      cor="#2563eb"
                      backgroundCor="#dbeafe"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gráficos separados */}
          <div className="container_graficos">
            <GraficoCommits data={dataCommits} />
            <GraficoHoras data={dataHoras} />
            <GraficoTarefas data={dataTarefas} />
            <GraficoAtividadeSemanal data={dataAtividadeSemanal} />
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
