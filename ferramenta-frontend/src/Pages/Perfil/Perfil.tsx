import "./Perfil.css";
import imgPerfil from "../../assets/img_perfil.jpeg";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { getUserById } from "../../services/userDataService";
import { useEffect, useState } from "react";

const dataCommits = [
  { projeto: 'Projeto A', commits: 30, linhas: 500 },
  { projeto: 'Projeto B', commits: 50, linhas: 800 },
  { projeto: 'Projeto C', commits: 20, linhas: 300 },
];

const dataHoras = [
  { dia: 'Seg', total: 8, produtivas: 6 },
  { dia: 'Ter', total: 7, produtivas: 5 },
  { dia: 'Qua', total: 9, produtivas: 7 },
  { dia: 'Qui', total: 8, produtivas: 6 },
  { dia: 'Sex', total: 6, produtivas: 4 },
];

const dataTarefas = [
  { status: 'Concluídas', value: 50 },
  { status: 'Em Progresso', value: 30 },
  { status: 'Pendente', value: 20 },
];


const dataAtividadeSemanal = [
  { dia: 'Seg', commits: 4, reviews: 2, reunioes: 1 },
  { dia: 'Ter', commits: 3, reviews: 3, reunioes: 2 },
  { dia: 'Qua', commits: 5, reviews: 2, reunioes: 1 },
  { dia: 'Qui', commits: 4, reviews: 1, reunioes: 2 },
  { dia: 'Sex', commits: 2, reviews: 3, reunioes: 1 },
  { dia: 'Sab', commits: 1, reviews: 1, reunioes: 0 },
  { dia: 'Dom', commits: 0, reviews: 0, reunioes: 0 },
];

const coresTarefas = ['#0088FE', '#00C49F', '#FFBB28'];



const abrirModalEditar = () => {
  const modal = document.getElementById("editar_modal");
  if (modal) {
    modal.classList.remove("sumir");
  }
}

const fecharModalEditar = () => {
  const modal = document.getElementById("editar_modal");
  if (modal) {
    modal.classList.add("sumir");
  }
}

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    nome: "",
    cargo: "",
    email: "",
    github: "",
    foto_perfil: "",
    criado_em: "",
  });
  
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Commits");

  const carregarPerfil = async () => {
    const usuarioId = localStorage.getItem("usuario_id");
    if (!usuarioId) {
      console.error("ID do usuário não encontrado no localStorage.");
      return;
    }

    try {
      const response = await getUserById("b3e4688e-4383-4100-b016-de4931b23e27");
      console.log("Dados do usuário:", response);
      // Aqui você pode atualizar o estado com os dados, ex:
      setUsuario({
        nome: response.nome_usuario,
        cargo: response.cargo || "Cargo não informado",
        email: response.email,
        github: response.github || "",
        foto_perfil: response.foto_perfil || "",
        criado_em: response.criado_em || "",
      });
    } catch (error: any) {
      console.error("Erro ao buscar dados do usuário:", error.message || error);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  const handleCategoriaClick = (categoria: string) => {
    setCategoriaSelecionada(categoria);
  };

  return (
    <>
      <div>
        <NavbarHome />
      </div>
      <div className="container_perfil">
        <div className="card_perfil">
          <div className="div_foto_perfil">
            <img src={imgPerfil} alt="testes" className="foto_perfil" />
            <h2 className="texto_foto_perfil">
              {usuario.nome || "Nome não informado"}
            </h2>
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
              <h2 className="texto_dados">{usuario.criado_em}</h2>
            </div>
          </div>

          <button className="btn_editar" id="btn_editar" onClick={abrirModalEditar}>
            Editar Perfil
          </button>
          <button className="btn_excluir" id="btn_excluir">
            Excluir Perfil
          </button>
        </div>

        <div className="container_cards">
            <div className="container_sessoes_perfil">
              <div className="card_perfil">
                <h2 className="titulo_card">Atividades</h2>
                <div className="div_tipo_atividade">
                {["Commits", "Tarefas", "Pull Requests", "Tempo"].map((categoria) => (
                  <h2
                    key={categoria}
                    className={`texto_categorias ${
                      categoriaSelecionada === categoria ? "categoria_selecionada" : ""
                    }`}
                    onClick={() => handleCategoriaClick(categoria)}
                  >
                    {categoria}
                  </h2>
                ))}
              </div>
                {categoriaSelecionada === "Commits" && (
                <div className="container_atividades">
                  <div className="card_atividades">
                    <i className="fa-solid fa-code-commit"></i>
                    <div>
                      <h2 className="textos_atividades">Implementação do módulo de relatórios financeiros</h2>
                      <div className="div_descricao_atividade">
                        <h2 className="descricao_atividade">Sistema de Gestão Financeira</h2>
                        <i className="fa-solid fa-circle icone_descricao_atividade"></i>
                        <h2 className="descricao_atividade">há 25 minutos</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {categoriaSelecionada === "Tarefas" && (
                <div className="container_atividades">
                  <div className="card_atividades">
                    <i className="fa-regular fa-circle-check"></i>
                    <div>
                      <h2 className="textos_atividades">Otimizar consultas de banco de dados</h2>
                      <div className="div_descricao_atividade">
                        <h2 className="descricao_atividade">Sistema de Gestão Financeira</h2>
                        <i className="fa-solid fa-circle icone_descricao_atividade"></i>
                        <h2 className="descricao_atividade">há 25 minutos</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {categoriaSelecionada === "Pull Requests" && (
                <div className="container_atividades">
                  <div className="card_atividades">
                    <i className="fa-solid fa-code-pull-request"></i>
                    <div>
                      <h2 className="textos_atividades">Implementação da API de pagamentos</h2>
                      <div className="div_descricao_atividade">
                        <h2 className="descricao_atividade">Sistema de Gestão Financeira</h2>
                        <i className="fa-solid fa-circle icone_descricao_atividade"></i>
                        <h2 className="descricao_atividade">há 25 minutos</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {categoriaSelecionada === "Tempo" && (
                <div className="container_atividades">
                  <div className="card_atividades">
                    <i className="fa-regular fa-clock icone_tempo_perfil"></i>
                    <div>
                      <h2 className="textos_atividades">Desenvolvimento do módulo de relatórios</h2>
                      <div className="div_descricao_atividade">
                        <h2 className="descricao_atividade">Sistema de Gestão Financeira</h2>
                        <i className="fa-solid fa-circle icone_descricao_atividade"></i>
                        <h2 className="descricao_atividade">há 25 minutos</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
        </div>
      </div>
      <div className="container_graficos">

  <h2 className="titulo_graficos">📊 Gráficos de Desempenho</h2>

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
    <h3>Status das Tarefas</h3>
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
    <h3>Padrão de Atividade Semanal</h3>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={dataAtividadeSemanal}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dia" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="commits" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="reviews" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="reunioes" stackId="3" stroke="#ffc658" fill="#ffc658" />
      </AreaChart>
    </ResponsiveContainer>
  </div>

</div>


      <div className="container_editar sumir" id="editar_modal">
        <div className="card_editar">
          <h2 onClick={fecharModalEditar}>X</h2>
          <h2 className="titulo_input">Nome</h2>
          <input type="text" className="input_modal" />
          <h2 className="titulo_input">Cargo</h2>
          <input type="text" className="input_modal" />
          <h2 className="titulo_input">E-mail</h2>
          <input type="text" className="input_modal" />
          <h2 className="titulo_input">GitHub</h2>
          <input type="text" className="input_modal" />
          <button className="btn_conectar">Salvar</button>
        </div>
      </div>
    </>
  );
};

export default Perfil;
