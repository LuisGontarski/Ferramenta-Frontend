import React, { useState } from "react";
import "./ProjetoModal.css";
import { IoCloseOutline } from "react-icons/io5";
import SelecionarUsuarios from "../../Components/Projeto/SelecionarUsuarios";
import { useEffect } from "react";

interface ProjetoModalProps {
  fecharModal?: () => void;
}

interface Usuario {
  usuario_id: string;
  nome_usuario: string;
  github: string;
}

interface Equipe {
  nome: string;
  usuarios: Usuario[];
}

interface Repositorio {
  name: string;
  url: string;
  language?: string;
  updated_at?: string;
}

const ProjetoModal: React.FC<ProjetoModalProps> = ({ fecharModal }) => {
  const [novoNomeEquipe, setNovoNomeEquipe] = useState("");
  const [mostrarMembros, setMostrarMembros] = useState(false);
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<Usuario[]>(
    []
  );
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [repositorios, setRepositorios] = useState<Repositorio[]>([]);
  const [repoSelecionado, setRepoSelecionado] = useState("");
  const [modoRepo, setModoRepo] = useState<"existente" | "novo">("existente");
  const [novoRepo, setNovoRepo] = useState("");
  const [descricaoRepo, setDescricaoRepo] = useState("");
  const [privadoRepo, setPrivadoRepo] = useState(false);

  useEffect(() => {
    const usuarioId = localStorage.getItem("usuario_id");
    if (!usuarioId) return;

    const buscarRepositorios = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${usuarioId}/repos`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao buscar repositórios: ${errorText}`);
        }

        const data = await response.json();

        // Se o backend retorna o JSON completo dos repositórios
        setRepositorios(
          data.map((repo: any) => ({
            name: repo.name,
            url: repo.html_url,
            language: repo.language,
            updated_at: repo.updated_at,
          }))
        );
      } catch (error) {
        console.error("Erro ao carregar repositórios:", error);
      }
    };

    buscarRepositorios();
  }, []);

  function fechar() {
    const modal = document.getElementById("card_modal");
    const conteudo_modal = document.getElementById("modal_adicionar_projeto");

    if (modal) {
      modal.style.opacity = "0";
      modal.style.pointerEvents = "none";
      if (conteudo_modal) {
        conteudo_modal.style.transform = "translateY(10px)";
        conteudo_modal.style.opacity = "0";
      }
    }

    setNovoNomeEquipe("");
    setMostrarMembros(false);
    setUsuariosSelecionados([]);
    setEquipes([]);
    if (fecharModal) fecharModal();
  }

  function iniciarSelecaoMembros() {
    if (!novoNomeEquipe.trim()) return;
    setMostrarMembros(true);
  }

  function confirmarEquipe() {
    if (!novoNomeEquipe.trim() || usuariosSelecionados.length === 0) return;

    setEquipes([
      ...equipes,
      { nome: novoNomeEquipe.trim(), usuarios: usuariosSelecionados },
    ]);
    setNovoNomeEquipe("");
    setUsuariosSelecionados([]);
    setMostrarMembros(false);
  }

  async function salvarProjeto() {
    if (!equipes.length) {
      alert("Adicione pelo menos uma equipe.");
      return;
    }

    const tituloInput = document.querySelector<HTMLInputElement>(
      'input[placeholder="Digite o título"]'
    )!.value;
    const descricaoInput = document.querySelector<HTMLTextAreaElement>(
      'textarea[placeholder="Digite a descrição"]'
    )!.value;
    const dataInicioInput =
      document.querySelector<HTMLInputElement>('input[type="date"]')!?.value;
    const dataFimInput =
      document.querySelectorAll<HTMLInputElement>('input[type="date"]')[1]
        ?.value;

    if (!tituloInput || !descricaoInput || !dataInicioInput || !dataFimInput) {
      alert("Preencha todos os campos.");
      return;
    }

    let repoName = repoSelecionado; // Caso seja repositório existente

    // Caso seja criar novo repositório
    if (modoRepo === "novo") {
      if (!novoRepo.trim()) {
        alert("Digite o nome do novo repositório.");
        return;
      }

      const access_token = localStorage.getItem("github_token");
      if (!access_token) {
        alert("Token do GitHub não encontrado.");
        return;
      }

      try {
        const repoResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/github/create/repo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_token,
              name: novoRepo,
              description: descricaoRepo,
              isPrivate: privadoRepo,
            }),
          }
        );

        if (!repoResponse.ok) {
          const erro = await repoResponse.json();
          alert(erro.message || "Erro ao criar repositório no GitHub.");
          return;
        }

        const repoData = await repoResponse.json();
        repoName = repoData.repository.name; // nome do repositório criado
      } catch (error) {
        console.error(error);
        alert("Erro ao criar repositório no GitHub.");
        return;
      }
    }

    // Agora envia o payload para criar o projeto
    const payload = {
      criador_id: localStorage.getItem("usuario_id"),
      nome: tituloInput,
      descricao: descricaoInput,
      data_inicio: dataInicioInput,
      data_fim: dataFimInput,
      equipes: equipes.map((e) => ({
        nome: e.nome,
        usuarios: e.usuarios.map((u) => u.usuario_id),
      })),
      status:
        document.querySelector<HTMLSelectElement>("select")!?.value || "Ativo",
      github_repo: repoName || null,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const erro = await response.json();
        alert(erro.message || "Erro ao criar projeto.");
        return;
      }

      alert("Projeto criado com sucesso!");
      fechar();
      window.location.href = "/projetos";
    } catch (error) {
      console.error(error);
      alert("Erro ao criar projeto.");
    }
  }

  return (
    <div
      className="container_modal"
      id="card_modal"
      style={{ opacity: 0, pointerEvents: "none" }}
    >
      <div
        className="modal_conteudo"
        id="modal_adicionar_projeto"
        style={{ transform: "translateY(10px)", opacity: 0 }}
      >
        <div className="modal_header">
          <h2>Novo Projeto</h2>
          <button className="btn_fechar_modal" onClick={fechar}>
            <IoCloseOutline size={20} />
          </button>
        </div>

        <div className="modal_body">
          <label>Título do Projeto</label>
          <input
            type="text"
            className="input_modal"
            placeholder="Digite o título"
          />

          <label>Descrição</label>
          <textarea
            className="input_modal"
            placeholder="Digite a descrição"
          ></textarea>

          <label>Data Início</label>
          <input type="date" className="input_modal" />

          <label>Data Término</label>
          <input type="date" className="input_modal" />

          <label>Equipe</label>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="text"
              className="input_modal"
              placeholder="Digite o nome da equipe"
              value={novoNomeEquipe}
              onChange={(e) => setNovoNomeEquipe(e.target.value)}
            />
            <button
              className="btn_adicionar_equipe"
              onClick={iniciarSelecaoMembros}
              disabled={!novoNomeEquipe.trim()}
            >
              Adicionar
            </button>
          </div>

          {mostrarMembros && (
            <div>
              <SelecionarUsuarios onSelecionar={setUsuariosSelecionados} />
              <button
                className="btn_adicionar_equipe"
                style={{ marginTop: "0.5rem" }}
                onClick={confirmarEquipe}
              >
                Confirmar Seleção
              </button>
            </div>
          )}

          {equipes.length > 0 && (
            <div className="container_equipes">
              {equipes.map((equipe, idx) => (
                <div key={idx} className="card_equipe">
                  <strong>{equipe.nome}</strong>
                  <div className="grid_membros">
                    {equipe.usuarios.map((u) => (
                      <div key={u.usuario_id} className="membro_item">
                        {u.nome_usuario}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <label>Status</label>
          <select className="input_modal">
            <option>Ativo</option>
            <option>Concluído</option>
            <option>Arquivado</option>
          </select>

          {/* Opções de escolha */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <input
                type="radio"
                name="repoOption"
                value="existente"
                checked={modoRepo === "existente"}
                onChange={() => setModoRepo("existente")}
              />
              Usar repositório existente
            </label>

            <label
              style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <input
                type="radio"
                name="repoOption"
                value="novo"
                checked={modoRepo === "novo"}
                onChange={() => setModoRepo("novo")}
              />
              Criar novo repositório
            </label>
          </div>

          {/* Se escolheu repositório existente */}
          {modoRepo === "existente" && (
            <select
              className="input_modal"
              value={repoSelecionado}
              onChange={(e) => setRepoSelecionado(e.target.value)}
            >
              <option value="">Selecione um repositório</option>
              {repositorios.map((repo: Repositorio) => (
                <option key={repo.name} value={repo.name}>
                  {repo.name}
                </option>
              ))}
            </select>
          )}

          {/* Se escolheu criar novo repositório */}
          {modoRepo === "novo" && (
            <div className="container_novo_repo">
              <label>Nome do repositório</label>
              <input
                type="text"
                className="input_modal"
                placeholder="Digite o nome do novo repositório"
                value={novoRepo}
                onChange={(e) => setNovoRepo(e.target.value)}
              />

              <label>Descrição do repositório</label>
              <textarea
                className="input_modal"
                placeholder="Digite uma descrição (opcional)"
                value={descricaoRepo}
                onChange={(e) => setDescricaoRepo(e.target.value)}
              ></textarea>

              <label>Visibilidade</label>
              <div
                style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <input
                    type="radio"
                    name="privacidadeRepo"
                    value="public"
                    checked={!privadoRepo}
                    onChange={() => setPrivadoRepo(false)}
                  />
                  Público
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <input
                    type="radio"
                    name="privacidadeRepo"
                    value="private"
                    checked={privadoRepo}
                    onChange={() => setPrivadoRepo(true)}
                  />
                  Privado
                </label>
              </div>
            </div>
          )}

          <button className="btn_salvar_modal" onClick={salvarProjeto}>
            Salvar Projeto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjetoModal;
