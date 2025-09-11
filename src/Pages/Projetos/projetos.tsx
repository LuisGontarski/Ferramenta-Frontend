import { useState, type SetStateAction } from "react";
import "./projetos.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import { HiPlus } from "react-icons/hi";
import { LuSearch } from "react-icons/lu";
import { MdAccessTime } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { NavLink } from "react-router-dom";
import { IoIosGitBranch } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";
import { projectService } from "../../services/projectService";

const value = 5.5;
const max = 10;
const fillPercent = (value / max) * 100;
const gradientStyle = {
  background: `linear-gradient(to right, #155DFC ${fillPercent}%, #e0e0e0 ${fillPercent}%)`,
};

const Projetos = () => {
  const categorias = ["Todos", "Ativo", "Concluído", "Arquivado"];
  const cargo = localStorage.getItem("cargo");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [nomeRepositorio, setNomeRepositorio] = useState("");
  const [numeroCommits, setNumeroCommits] = useState("");
  type Repositorio = { id: number; name: string; full_name: string };
  const [repositorios, setRepositorios] = useState<Repositorio[]>([]);
  const [repositorioSelecionado, setRepositorioSelecionado] = useState("");
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novaDataInicio, setNovaDataInicio] = useState("");
  const [novaDataTermino, setNovaDataTermino] = useState("");
  const [novoStatus, setNovoStatus] = useState("Ativo");
  const [novoNomeRepositorio, setNovoNomeRepositorio] = useState("");
  const [novaDescricaoRepositorio, setNovaDescricaoRepositorio] = useState("");
  const [repositorioPrivado, setRepositorioPrivado] = useState(false);
  const [criandoRepositorio, setCriandoRepositorio] = useState(true);

  const [equipes, setEquipes] = useState<
    { id: number; nome: string; membros: string[] }[]
  >([]);

  type Projeto = {
    titulo: string;
    descricao: string;
    data_inicio: string;
    data_fim: string;
    atualizadoEm: string;
    membros: number;
    branches: number;
    status: string;
  };

  const [projetos, setProjetos] = useState<Projeto[]>([
    {
      titulo: "Projeto 1",
      descricao:
        "Esse projeto consiste no desenvolvimento de um aplicativo de academia",
      data_inicio: "2023-01-01",
      data_fim: "2023-02-01",
      atualizadoEm: "Atualizado há 2 dias",
      membros: 5,
      branches: 3,
      status: "Ativo",
    },
    {
      titulo: "Projeto 2",
      descricao:
        "Esse projeto consiste no desenvolvimento de um aplicativo de academia",
      data_inicio: "2023-01-01",
      data_fim: "2023-02-01",
      atualizadoEm: "Atualizado há 2 dias",
      membros: 5,
      branches: 3,
      status: "Concluído",
    },
    {
      titulo: "Projeto 3",
      descricao:
        "Esse projeto consiste no desenvolvimento de um aplicativo de academia",
      data_inicio: "2023-01-01",
      data_fim: "2023-02-01",
      atualizadoEm: "Atualizado há 2 dias",
      membros: 5,
      branches: 3,
      status: "Ativo",
    },
    {
      titulo: "Projeto 4",
      descricao:
        "Esse projeto consiste no desenvolvimento de um aplicativo de academia",
      data_inicio: "2023-01-01",
      data_fim: "2023-02-01",
      atualizadoEm: "Atualizado há 2 dias",
      membros: 5,
      branches: 3,
      status: "Arquivado",
    },
    {
      titulo: "Projeto 5",
      descricao:
        "Esse projeto consiste no desenvolvimento de um aplicativo de academia",
      data_inicio: "2023-01-01",
      data_fim: "2023-02-01",
      atualizadoEm: "Atualizado há 2 dias",
      membros: 5,
      branches: 3,
      status: "Concluído",
    },
  ]);

  const [busca, setBusca] = useState("");

  const projetosFiltrados = projetos.filter((projeto) => {
    const nomeCorresponde = projeto.titulo
      .toLowerCase()
      .includes(busca.toLowerCase());
    const categoriaCorresponde =
      categoriaSelecionada === "Todos" ||
      projeto.status.toLowerCase() === categoriaSelecionada.toLowerCase();
    return nomeCorresponde && categoriaCorresponde;
  });

  const criarProjeto = async () => {
    if (!novoTitulo.trim() || !novaDescricao.trim()) {
      alert("Preencha título e descrição");
      return;
    }

    const novoProjeto: Projeto = {
      titulo: novoTitulo,
      descricao: novaDescricao,
      data_inicio: novaDataInicio,
      data_fim: novaDataTermino,
      atualizadoEm: "Agora",
      membros: 0,
      branches: 0,
      status: novoStatus,
    };

    try {
      // Chama o service para criar no backend
      const projetoCriado = await projectService.create(novoProjeto);

      // Atualiza o estado com o projeto que veio do backend
      setProjetos((prev) => [projetoCriado, ...prev]);

      // Reseta campos e fecha modal
      fecharModal();
      setNovoTitulo("");
      setNovaDescricao("");
      setNovaDataInicio("");
      setNovaDataTermino("");
      setNovoStatus("Ativo");
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      alert("Erro ao criar projeto. Tente novamente.");
    }
  };

  const [novoNomeEquipe, setNovoNomeEquipe] = useState("");

  const adicionarEquipe = () => {
    if (novoNomeEquipe.trim() === "") return;

    const novaEquipe = {
      id: Date.now(),
      nome: novoNomeEquipe,
      membros: [],
    };
    setEquipes([...equipes, novaEquipe]);
    setNovoNomeEquipe("");
  };

  const toggleMembroNaEquipe = (idEquipe: number, membro: string) => {
    setEquipes((prev) =>
      prev.map((equipe) =>
        equipe.id === idEquipe
          ? {
            ...equipe,
            membros: equipe.membros.includes(membro)
              ? equipe.membros.filter((m) => m !== membro)
              : [...equipe.membros, membro],
          }
          : equipe
      )
    );
  };

  const membrosDisponiveis = [
    "João Silva",
    "Maria Souza",
    "Carlos Oliveira",
    "Ana Lima",
  ];

  const handleSelectChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setRepositorioSelecionado(e.target.value);
    console.log("Repositório selecionado:", e.target.value);
  };

  function abrirModal() {
    const modal = document.getElementById("card_modal");
    const conteudo_modal = document.getElementById("modal_adicionar_projeto");

    if (modal) {
      modal.style.opacity = "1";
      modal.style.pointerEvents = "auto";
      if (conteudo_modal) {
        conteudo_modal.style.opacity = "1";
        conteudo_modal.style.transform = "translateY(0)";
      }
    }

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      console.error("Access token não encontrado.");
      return;
    }

    fetch("https://ferramenta-backend.onrender.com/api/github/repos", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro na requisição: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Repos retornados:", data);
        setRepositorios(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar repositórios:", error);
      });
  }

  function fecharModal() {
    const modal = document.getElementById("card_modal");
    const conteudo_modal = document.getElementById("modal_adicionar_projeto");

    if (modal) {
      modal.style.opacity = "0";
      modal.style.pointerEvents = "none";
      if (conteudo_modal) {
        conteudo_modal.style.transform = "translateY(10px)";
      }
    }
  }

  const removerEquipe = (id: number) => {
    setEquipes((prev) => prev.filter((equipe) => equipe.id !== id));
  };

  return (
    <>
      <div>
        <NavbarHome />
      </div>

      <div className="container_modal sumir" id="card_modal">
        <div className="modal_adicionar_projeto" id="modal_adicionar_projeto">
          <div>
            <div className="div_titulo_modal">
              <h1 className="titulo_modal">Criar novo projeto</h1>
              <IoCloseOutline
                onClick={fecharModal}
                size={"24px"}
                color="black"
                className="icone_fechar_modal_projetos"
              />
            </div>
            <h2 className="descricao_modal">
              Preencha as informações abaixo para criar um novo projeto.
            </h2>
          </div>
          <div className="div_inputs_modal">
            <h2 className="titulo_input">Nome do projeto</h2>
            <input
              type="text"
              className="input_modal"
              placeholder="Digite o nome do projeto"
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
            />
          </div>
          <div className="div_inputs_modal">
            <h2 className="titulo_input">Descrição</h2>
            <textarea
              className="input_modal_descricao"
              placeholder="Descreva o objetivo do projeto"
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
            ></textarea>
          </div>
          <div className="container_data">
            <div className="div_data">
              <h2 className="titulo_input">Data de Início</h2>
              <input type="date" name="" id="" className="input_modal" />
            </div>
            <div className="div_data">
              <h2 className="titulo_input">Data de Término</h2>
              <input type="date" name="" id="" className="input_modal" />
            </div>
          </div>
          <div className="div_inputs_modal">
            <h2 className="titulo_input">Equipes</h2>
            <div className="container_criacao_equipe">
              <input
                type="text"
                placeholder="Nome da nova equipe (ex: Frontend)"
                value={novoNomeEquipe}
                onChange={(e) => setNovoNomeEquipe(e.target.value)}
                className="input_modal"
              />
              <button
                onClick={adicionarEquipe}
                className="btn_adicionar_equipe_projeto"
              >
                Adicionar Equipe
              </button>
            </div>

            {equipes.map((equipe) => (
              <div key={equipe.id} className="card_equipe_criada">
                <FaRegTrashCan
                  className="icone_lixo_equipe"
                  onClick={() => removerEquipe(equipe.id)}
                />
                <h3 className="nome_equipe_criada">{equipe.nome}</h3>
                <div className="container_membros">
                  {membrosDisponiveis.map((membro) => (
                    <label key={membro} className="checkbox_equipe_label">
                      <input
                        type="checkbox"
                        checked={equipe.membros.includes(membro)}
                        onChange={() => toggleMembroNaEquipe(equipe.id, membro)}
                        className="hidden"
                        id={`membro-${equipe.id}-${membro}`}
                      />
                      <span
                        className={`checkbox_custom ${equipe.membros.includes(membro) ? "checked" : ""
                          }`}
                      ></span>
                      <div className="img_perfil"></div>
                      <div>
                        <h2 className="titulo_input">{membro}</h2>
                        <h2 className="descricao_membros">
                          Desenvolvedor Front-end
                        </h2>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="div_criar_repositorio">
            <button
              type="button"
              role="radio"
              aria-checked={criandoRepositorio}
              className={`radio-toggle ${criandoRepositorio ? "selected" : ""}`}
              onClick={() => setCriandoRepositorio(true)}
            >
              <span className="dot-outer">
                <span className="dot-inner" />
              </span>
              <span className="radio-label">Criar repositório novo</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={!criandoRepositorio}
              className={`radio-toggle ${!criandoRepositorio ? "selected" : ""
                }`}
              onClick={() => setCriandoRepositorio(false)}
            >
              <span className="dot-outer">
                <span className="dot-inner" />
              </span>
              <span className="radio-label">
                Selecionar repositório existente
              </span>
            </button>
          </div>

          {!criandoRepositorio && (
            <div className="div_inputs_modal">
              <h2 className="titulo_input">Selecione um repositório</h2>
              <select
                className="input_modal"
                value={repositorioSelecionado}
                onChange={handleSelectChange}
              >
                <option value="">Selecione</option>
                {repositorios.map((repo) => (
                  <option key={repo.id} value={repo.full_name}>
                    {repo.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {criandoRepositorio && (
            <>
              <div className="div_inputs_modal">
                <h2 className="titulo_input">Nome do repositório</h2>
                <input
                  type="text"
                  placeholder="Nome do repositório"
                  value={novoNomeRepositorio}
                  onChange={(e) => setNovoNomeRepositorio(e.target.value)}
                  className="input_modal"
                />
              </div>
              <div className="div_inputs_modal">
                <h2 className="titulo_input">Descrição</h2>
                <input
                  type="text"
                  placeholder="Descrição do repositório"
                  value={novaDescricaoRepositorio}
                  onChange={(e) => setNovaDescricaoRepositorio(e.target.value)}
                  className="input_modal"
                />
              </div>
              <div
                className={`repositorio_privado ${repositorioPrivado ? "ativo" : ""
                  }`}
              >
                <input
                  type="checkbox"
                  checked={repositorioPrivado}
                  onChange={(e) => setRepositorioPrivado(e.target.checked)}
                  className="hidden"
                  id="checkboxPrivado"
                />
                <label
                  htmlFor="checkboxPrivado"
                  className="checkbox_privado_label"
                >
                  <span
                    className={`checkbox_custom ${repositorioPrivado ? "checked" : ""
                      }`}
                  ></span>
                  <div className="textos_privado">
                    <span className="titulo_privado">Repositório privado</span>
                    <span className="descricao_privado">
                      Apenas membros da equipe poderão acessar este repositório
                    </span>
                  </div>
                </label>
              </div>
            </>
          )}

          <button className="btn_criar_projeto" onClick={criarProjeto}>
            Criar Projeto
          </button>
        </div>
      </div>
      <main className="container_conteudos">
        <MenuLateral />
        <div className="container_vertical_conteudos">
          <div className="container_conteudo_projetos">
            <div className="div_titulo_pagina_projetos">
              <div>
                <h1 className="titulo_projetos">Projetos</h1>
                <p className="descricao_titulo_projetos">
                  Gerencie todos os seus projetos em um só lugar
                </p>
              </div>
              {cargo === "Product Owner" && (
                <button className="btn_novo_projeto" onClick={abrirModal}>
                  <HiPlus size={"14px"} />
                  Novo projeto
                </button>
              )}
            </div>
            <div className="div_titulo_projetos">
              <div className="div_input_icone_projetos">
                <LuSearch className="icone_busca_input" />
                <input
                  type="text"
                  className="input_pesquisa_projetos"
                  placeholder="Pesquise por projetos"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <div className="divCategorias">
                {categorias.map((categoria) => (
                  <h2
                    key={categoria}
                    className={`texto_projetos_categoria ${categoriaSelecionada === categoria
                        ? "categoria_projetos_selecionada"
                        : ""
                      }`}
                    onClick={() => setCategoriaSelecionada(categoria)}
                  >
                    {categoria}
                  </h2>
                ))}
              </div>
            </div>

            <div>
              <div className="container_card_projetos">
                {projetosFiltrados.length > 0 ? (
                  projetosFiltrados.map((projeto) => (
                    <div
                      key={projeto.titulo}
                      className="card_projetos_recentes"
                    >
                      <div>
                        <h2 className="texto_projetos">{projeto.titulo}</h2>
                        <h2 className="texto_atualizacao">
                          {projeto.descricao}
                        </h2>
                      </div>
                      <div className="div_progresso_projeto">
                        <div className="div_dois_projetos_recentes">
                          <h2 className="texto_progresso">Progresso</h2>
                          <h2 className="texto_progresso">55%</h2>
                        </div>
                        <input
                          type="range"
                          className="custom-range"
                          max={max}
                          min={0}
                          defaultValue={value} // só visual
                          style={gradientStyle}
                          readOnly
                        />
                      </div>
                      <div className="div_icones_projetos">
                        <div className="div_items_icones">
                          <MdAccessTime size={"16px"} color="#71717A" />
                          <h2 className="texto_atualizacao">
                            {projeto.atualizadoEm}
                          </h2>
                        </div>
                        <div className="div_items_icones">
                          <GoPeople size={"16px"} color="#71717A" />
                          <h2 className="texto_atualizacao">
                            {projeto.membros} membros
                          </h2>
                        </div>
                      </div>
                      <div className="div_icones_projetos">
                        <div className="div_items_icones">
                          <IoIosGitBranch size={"16px"} color="#71717A" />
                          <h2 className="texto_atualizacao">
                            {projeto.branches} branches
                          </h2>
                        </div>
                        <div className="div_items_icones">
                          <h2 className="texto_atualizacao">
                            {projeto.status}
                          </h2>
                        </div>
                      </div>
                      <NavLink
                        to={`/ProjetosDetalhes?id=${111}`}
                        className="btn_entrar_projeto"
                      >
                        Entrar no Projeto
                      </NavLink>
                    </div>
                  ))
                ) : (
                  <p>Nenhum projeto encontrado.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Projetos;
