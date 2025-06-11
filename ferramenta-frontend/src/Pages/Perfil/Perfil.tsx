import React, { useEffect, useState } from "react";
import "./Perfil.css";
import imgPerfil from "../../assets/desenvolvedor1.jpeg";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { getUserById } from "../../services/userDataService";
import { formatarDataParaDDMMYYYY } from "../../utils/dateUtils";
import AtividadesPerfil from "../../Components/AtividadesPerfil/AtividadesPerfil";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";

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

const abrirModalEditar = () => {
  const modal = document.getElementById("editar_modal");
  if (modal) {
    modal.classList.remove("sumir");
  }
};

const fecharModalEditar = () => {
  const modal = document.getElementById("editar_modal");
  if (modal) {
    modal.classList.add("sumir");
  }
};

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

  const carregarPerfil = async () => {
    setLoading(true);
    setFetchError(null);
    const usuarioId = localStorage.getItem("usuario_id");
    console.log("ID do usuário:", usuarioId);

    if (!usuarioId) {
      console.error("ID do usuário não encontrado no localStorage.");
      setFetchError(
        "ID do usuário não encontrado. Não foi possível carregar o perfil."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await getUserById(usuarioId);

      setUsuario({
        nome: response.nome_usuario || "Nome não informado",
        cargo: response.cargo || "Cargo não informado",
        email: response.email || "E-mail não informado",
        github: response.github || "GitHub não informado",
        foto_perfil: response.foto_perfil || "",
        criado_em: response.criado_em || "",
      });
    } catch (error: any) {
      console.error("Erro ao buscar dados do usuário:", error.message || error);
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

  const handleCategoriaClick = (categoria: string) => {
    setCategoriaSelecionada(categoria);
  };

  return (
    <>
      <NavbarHome />
      <main className="container_conteudos">
        <MenuLateral />
        <div className="container_vertical_conteudos">
          <div className="container_perfil">
            <div className="card_perfil">
              <div className="div_foto_perfil">
                <img
                  src={usuario.foto_perfil || imgPerfil}
                  alt={`Foto de perfil de ${usuario.nome}`}
                  className="foto_perfil"
                />
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
                  <h2 className="texto_dados">{usuario.github}</h2>
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
                id="btn_editar"
                onClick={abrirModalEditar}
              >
                Editar Perfil
              </button>
              <button
                className="btn_excluir"
                id="btn_excluir"
                onClick={() => {
                  window.location.href = "";
                }}
              >
                Logout
              </button>
              <button className="btn_excluir" id="btn_excluir">
                Excluir Perfil
              </button>
            </div>
          </div>

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
                    {/* demais atividades commits */}
                  </div>
                )}

                {categoriaSelecionada === "Tarefas" && (
                  <div className="container_atividades">
                    <AtividadesPerfil
                      id="1"
                      titulo="Finalizar relatório semanal"
                      projeto="Equipe de Marketing"
                      realizadoEm="há 30 minutos"
                      icone="fa-solid fa-check"
                      cor="#16a34a"
                      backgroundCor="#dcfce7"
                    />
                    {/* demais tarefas */}
                  </div>
                )}

                {categoriaSelecionada === "Pull Requests" && (
                  <div className="container_atividades">
                    <AtividadesPerfil
                      id="1"
                      titulo="Merge da feature de autenticação"
                      projeto="App Mobile"
                      realizadoEm="há 20 minutos"
                      icone="fa-solid fa-code-pull-request"
                      cor="#9333ea"
                      backgroundCor="#f3e8ff"
                    />
                    {/* demais pull requests */}
                  </div>
                )}

                {categoriaSelecionada === "Tempo" && (
                  <div className="container_atividades">
                    <AtividadesPerfil
                      id="1"
                      titulo="2 horas de planejamento"
                      projeto="Sprint Atual"
                      realizadoEm="há 1 hora"
                      icone="fa-solid fa-clock"
                      cor="#d97706"
                      backgroundCor="#fef3c7"
                    />
                    {/* demais atividades de tempo */}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="container_graficos">
            <div className="grafico">
              <h3>Commits por Projeto</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataCommits}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="projeto" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="commits" fill="#8884d8" />
                  <Bar dataKey="linhas" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grafico">
              <h3>Horas Trabalhadas por Dia</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataHoras}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" />
                  <Line type="monotone" dataKey="produtivas" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grafico">
              <h3>Tarefas por Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataTarefas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grafico">
              <h3>Atividade Semanal</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dataAtividadeSemanal}>
  <defs>
    <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
    </linearGradient>
    <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
    </linearGradient>
    <linearGradient id="colorReunioes" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
      <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
    </linearGradient>
  </defs>
  <XAxis dataKey="dia" />
  <YAxis />
  <CartesianGrid strokeDasharray="3 3" />
  <Tooltip />
  <Legend />
  <Area
    type="monotone"
    dataKey="commits"
    stroke="#8884d8"
    fillOpacity={1}
    fill="url(#colorCommits)"
  />
  <Area
    type="monotone"
    dataKey="reviews"
    stroke="#82ca9d"
    fillOpacity={1}
    fill="url(#colorReviews)"
  />
  <Area
    type="monotone"
    dataKey="reunioes"
    stroke="#ffc658"
    fillOpacity={1}
    fill="url(#colorReunioes)"
  />
</AreaChart>

              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Perfil;
