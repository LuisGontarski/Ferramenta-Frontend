import { useEffect, useState, type SetStateAction } from "react";
import "./projetos.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import CardProjeto from "../../Components/CardProjeto/CardProjeto";
import { getGithubCommitCount } from "../../services/githubCommitService";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";

const Projetos = () => {
  const categorias = ["Todos", "Ativos", "Concluídos", "Arquivados"];
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [nomeRepositorio, setNomeRepositorio] = useState("");
  const [numeroCommits, setNumeroCommits] = useState("");
  type Repositorio = { id: number; name: string; full_name: string };
  const [repositorios, setRepositorios] = useState<Repositorio[]>([]);
  const [repositorioSelecionado, setRepositorioSelecionado] = useState("");

  const [equipes, setEquipes] = useState<
  { id: number; nome: string; membros: string[] }[]
>([]);

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

  
  const handleSelectChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setRepositorioSelecionado(e.target.value);
    console.log("Repositório selecionado:", e.target.value);
  };

  function abrirModal() {
  const modal = document.getElementById("card_modal");
  if (modal) modal.style.display = "flex";

  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    console.error("Access token não encontrado.");
    return;
  }

  fetch("https://ferramenta-backend.onrender.com/api/github/repos", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Repos retornados:", data);
      setRepositorios(data); // <- Atualiza o select com os repositórios reais
    })
    .catch((error) => {
      console.error("Erro ao buscar repositórios:", error);
    });
}


  function fecharModal() {
    var modal = document.getElementById("card_modal");
    if (modal) modal.style.display = "none";
  }

  const buscarRepositorio = async () => {
    if (!nomeUsuario || !nomeRepositorio) {
      console.warn("Informe o nome do usuário e do repositório.");
      return;
    }

    try {
      const data = await getGithubCommitCount({
        user: nomeUsuario,
        repo_name: nomeRepositorio,
      });

      console.log("Quantidade de commits:", data.quant_commits);
      setNumeroCommits(String(data.quant_commits));
    } catch (error: any) {
      console.error("Erro ao buscar commits:", error.message || error);
    }
  };

  return (
    <>
      <div>
        <NavbarHome />
      </div>

      <div className="container_modal sumir" id="card_modal">
        <div className="modal_adicionar_projeto">
          <div>
            <div className="div_titulo_modal">
              <h1 className="titulo_modal">Criar novo projeto</h1>
              <h2 onClick={fecharModal}>
                <i className="fa-solid fa-xmark"></i>
              </h2>
            </div>
            <h2 className="descricao_modal">
              Preencha as informações abaixo para criar um novo projeto. Clique
              em salvar quando terminar.
            </h2>
          </div>
          <div className="div_inputs_modal">
            <h2 className="titulo_input">Nome do projeto</h2>
            <input
              type="text"
              name=""
              id=""
              className="input_modal"
              placeholder="Digite o nome do projeto"
            />
          </div>
          <div className="div_inputs_modal">
            <h2 className="titulo_input">Descrição</h2>
            <input
              type="text"
              name=""
              id=""
              className="input_modal"
              placeholder="Descreva o objetivo do projeto"
            />
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
    <button onClick={adicionarEquipe}>Adicionar Equipe</button>
  </div>

  {equipes.map((equipe) => (
    <div key={equipe.id} className="card_equipe_criada">
      <h3>{equipe.nome}</h3>
      <div className="container_membros">
        {membrosDisponiveis.map((membro) => (
          <label key={membro} className="card_membros_equipe">
            <input
              type="checkbox"
              checked={equipe.membros.includes(membro)}
              onChange={() => toggleMembroNaEquipe(equipe.id, membro)}
            />
            <div className="img_perfil"></div>
            <div>
              <h2 className="titulo_input">{membro}</h2>
              <h2 className="descricao_membros">Função desconhecida</h2>
            </div>
          </label>
        ))}
      </div>
    </div>
  ))}
</div>
          <div className="div_inputs_modal">
            <h2 className="titulo_input">Repositório</h2>
            <div>
              <h2>Selecione um repositório:</h2>
              <select value={repositorioSelecionado} onChange={handleSelectChange}>
                <option value="">-- Selecione --</option>
                {repositorios.map((repo) => (
                  <option key={repo.id} value={repo.name}>
                    {repo.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h2>Ou crie um novo repositório para o projeto</h2>
              <h2>Nome</h2>
              <input type="text" name="" id="" className="input_modal" />
              <h2>Descrição</h2>
              <input type="text" name="" id="" className="input_modal"/>
              <h2>Privado?</h2>
              <input type="checkbox" name="" id=""/>
            </div>
            <button>Criar novo repositório</button>
            <button className="btn_conectar">Criar Projeto</button>
          </div>
        </div>
      </div>
      <main className="container_conteudos">
        <MenuLateral />
        <div className="container_vertical_conteudos">
          <div className="container_dashboard">
            <div className="div_titulo_projetos">
              <input type="text" className="input_pesquisa_projetos" />
              <button className="btn_novo_projeto" onClick={abrirModal}> Novo projeto </button>
            </div>

            <div className="divCategorias">
              {categorias.map((categoria) => (
                <h2
                  key={categoria}
                  className={`texto_categoria ${
                    categoriaSelecionada === categoria
                      ? "categoria_selecionada"
                      : ""
                  }`}
                  onClick={() => setCategoriaSelecionada(categoria)}
                >
                  {categoria}
                </h2>
              ))}
            </div>

            <div className="container_projetos">
              <CardProjeto
                id="1"
                titulo="Projeto 1"
                descricao="Esse projeto consiste no desenvolvimento de um aplicativo de academia"
                atualizadoEm="Atualizado há 2 dias"
                membros={5}
                branches={3}
                status="Ativo"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Projetos;
