import React, { useState } from "react";
import "./ProjetoModal.css";
import { IoCloseOutline } from "react-icons/io5";
import { FaUsers, FaGitAlt, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import SelecionarUsuarios from "../../Components/Projeto/SelecionarUsuarios";
import { getUserById } from "../../services/userDataService";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

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

  function removerEquipe(index: number) {
    const novasEquipes = equipes.filter((_, i) => i !== index);
    setEquipes(novasEquipes);
  }

  async function salvarProjeto() {
    if (!equipes.length) {
      toast.error("Adicione pelo menos uma equipe.");
      return;
    }

    const tituloInput = document.querySelector<HTMLInputElement>(
      'input[placeholder="Digite o título do projeto"]'
    )!.value;
    const descricaoInput = document.querySelector<HTMLTextAreaElement>(
      'textarea[placeholder="Descreva o objetivo do projeto..."]'
    )!.value;
    const dataInicioInput =
      document.querySelector<HTMLInputElement>('input[type="date"]')!?.value;
    const dataFimInput =
      document.querySelectorAll<HTMLInputElement>('input[type="date"]')[1]
        ?.value;

    if (!tituloInput || !descricaoInput || !dataInicioInput || !dataFimInput) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    let repoName = repoSelecionado;
    const usuarioId = localStorage.getItem("usuario_id");
    if (!usuarioId) {
      toast.error("Usuário não encontrado.");
      return;
    }

    const user = await getUserById(usuarioId);
    const nomeGitHub = user.github;

    if (modoRepo === "novo") {
      if (!novoRepo.trim()) {
        toast.error("Digite o nome do novo repositório.");
        return;
      }

      const access_token = localStorage.getItem("github_token");
      if (!access_token) {
        toast.error("Token do GitHub não encontrado.");
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
          toast.error(erro.message || "Erro ao criar repositório no GitHub.");
          return;
        }

        const repoData = await repoResponse.json();
        repoName = repoData.repository.name;
      } catch (error) {
        console.error(error);
        toast.error("Erro ao criar repositório no GitHub.");
        return;
      }
    }

    const fullRepoName =
      nomeGitHub && repoName ? `${nomeGitHub}/${repoName}` : repoName;

    const payload = {
      criador_id: usuarioId,
      nome: tituloInput,
      descricao: descricaoInput,
      data_inicio: dataInicioInput,
      data_fim: dataFimInput,
      equipes: equipes.map((e) => ({
        nome: e.nome,
        usuarios: e.usuarios.map((u) => u.usuario_id),
      })),
      status: document.querySelector<HTMLSelectElement>("#projeto-status-select")!?.value || "Ativo",
      github_repo: fullRepoName || null,
    };

    try {
      const loadingToast = toast.loading("Criando projeto...");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const erro = await response.json();
        toast.error(erro.message || "Erro ao criar projeto.");
        return;
      }

      toast.success("Projeto criado com sucesso!", {
        id: loadingToast,
      });

      fechar();
      window.location.href = "/projetos";
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar projeto.");
    }
  }

  return (
    <div
      className="projeto-modal-container"
      id="card_modal"
      style={{ opacity: 0, pointerEvents: "none" }}
    >
      <div
        className="projeto-modal-content"
        id="modal_adicionar_projeto"
        style={{ transform: "translateY(10px)", opacity: 0 }}
      >
        <div className="projeto-modal-header">
          <div className="projeto-modal-title-section">
            <h2>Criar Novo Projeto</h2>
            <p className="projeto-modal-subtitle">
              Preencha as informações abaixo para criar um novo projeto
            </p>
          </div>
          <button className="projeto-modal-close-btn" onClick={fechar}>
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className="projeto-modal-body">
          {/* Informações Básicas */}
          <div className="projeto-modal-section">
            <div className="projeto-modal-section-header">
              <FaInfoCircle className="section-icon" />
              <h3>Informações Básicas</h3>
            </div>
            <div className="projeto-modal-grid">
              <div className="projeto-modal-input-group">
                <label>Título do Projeto *</label>
                <input
                  type="text"
                  className="projeto-modal-input"
                  placeholder="Digite o título do projeto"
                />
              </div>

              <div className="projeto-modal-input-group full-width">
                <label>Descrição *</label>
                <textarea
                  className="projeto-modal-textarea"
                  placeholder="Descreva o objetivo do projeto..."
                  rows={3}
                ></textarea>
              </div>

              <div className="projeto-modal-input-group">
                <label>Data de Início *</label>
                <div className="projeto-modal-input-with-icon">
                  <FaCalendarAlt className="input-icon" />
                  <input type="date" className="projeto-modal-input" />
                </div>
              </div>

              <div className="projeto-modal-input-group">
                <label>Data de Término *</label>
                <div className="projeto-modal-input-with-icon">
                  <FaCalendarAlt className="input-icon" />
                  <input type="date" className="projeto-modal-input" />
                </div>
              </div>
            </div>
          </div>

          {/* Gestão de Equipes */}
          <div className="projeto-modal-section">
            <div className="projeto-modal-section-header">
              <FaUsers className="section-icon" />
              <h3>Gestão de Equipes</h3>
            </div>

            <div className="projeto-modal-team-creation">
              <div className="projeto-modal-input-group">
                <label>Nome da Equipe *</label>
                <div className="projeto-modal-input-with-button">
                  <input
                    type="text"
                    className="projeto-modal-input"
                    placeholder="Digite o nome da equipe"
                    value={novoNomeEquipe}
                    onChange={(e) => setNovoNomeEquipe(e.target.value)}
                  />
                  <button
                    className="projeto-modal-add-btn"
                    onClick={iniciarSelecaoMembros}
                    disabled={!novoNomeEquipe.trim()}
                  >
                    <FaUsers size={14} />
                    Adicionar Membros
                  </button>
                </div>
              </div>
            </div>

            {mostrarMembros && (
              <div className="projeto-modal-members-selection">
                <SelecionarUsuarios onSelecionar={setUsuariosSelecionados} />
                <div className="projeto-modal-confirm-section">
                  <p>{usuariosSelecionados.length} membro(s) selecionado(s)</p>
                  <button
                    className="projeto-modal-confirm-btn"
                    onClick={confirmarEquipe}
                    disabled={usuariosSelecionados.length === 0}
                  >
                    Confirmar Equipe
                  </button>
                </div>
              </div>
            )}

            {equipes.length > 0 && (
              <div className="projeto-modal-teams-list">
                <h4>Equipes Adicionadas ({equipes.length})</h4>
                {equipes.map((equipe, idx) => (
                  <div key={idx} className="projeto-modal-team-card">
                    <div className="projeto-modal-team-header">
                      <strong>{equipe.nome}</strong>
                      <button
                        className="projeto-modal-remove-btn"
                        onClick={() => removerEquipe(idx)}
                      >
                        <IoCloseOutline size={16} />
                      </button>
                    </div>
                    <div className="projeto-modal-members-grid">
                      {equipe.usuarios.map((u) => (
                        <div
                          key={u.usuario_id}
                          className="projeto-modal-member-tag"
                        >
                          {u.nome_usuario}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Configuração do Repositório */}
          <div className="projeto-modal-section">
            <div className="projeto-modal-section-header">
              <FaGitAlt className="section-icon" />
              <h3>Repositório GitHub</h3>
            </div>

            <div className="projeto-modal-repo-options">
              <div className="projeto-modal-radio-group">
                <label className="projeto-modal-radio">
                  <input
                    type="radio"
                    name="repoOption"
                    value="existente"
                    checked={modoRepo === "existente"}
                    onChange={() => setModoRepo("existente")}
                  />
                  <span className="radio-custom"></span>
                  Usar repositório existente
                </label>
                <label className="projeto-modal-radio">
                  <input
                    type="radio"
                    name="repoOption"
                    value="novo"
                    checked={modoRepo === "novo"}
                    onChange={() => setModoRepo("novo")}
                  />
                  <span className="radio-custom"></span>
                  Criar novo repositório
                </label>
              </div>

              {modoRepo === "existente" && (
                <div className="projeto-modal-input-group">
                  <label>Selecionar Repositório</label>
                  <select
                    className="projeto-modal-input"
                    value={repoSelecionado}
                    onChange={(e) => setRepoSelecionado(e.target.value)}
                  >
                    <option value="">Selecione um repositório</option>
                    {repositorios.map((repo: Repositorio) => (
                      <option key={repo.name} value={repo.name}>
                        {repo.name} {repo.language && `(${repo.language})`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {modoRepo === "novo" && (
                <div className="projeto-modal-new-repo">
                  <div className="projeto-modal-grid">
                    <div className="projeto-modal-input-group">
                      <label>Nome do Repositório *</label>
                      <input
                        type="text"
                        className="projeto-modal-input"
                        placeholder="Digite o nome do repositório"
                        value={novoRepo}
                        onChange={(e) => setNovoRepo(e.target.value)}
                      />
                    </div>

                    <div className="projeto-modal-input-group full-width">
                      <label>Descrição</label>
                      <textarea
                        className="projeto-modal-textarea"
                        placeholder="Descrição do repositório (opcional)"
                        value={descricaoRepo}
                        onChange={(e) => setDescricaoRepo(e.target.value)}
                        rows={2}
                      ></textarea>
                    </div>

                    <div className="projeto-modal-input-group">
                      <label>Visibilidade</label>
                      <div className="projeto-modal-visibility-options">
                        <label className="projeto-modal-radio">
                          <input
                            type="radio"
                            name="privacidadeRepo"
                            value="public"
                            checked={!privadoRepo}
                            onChange={() => setPrivadoRepo(false)}
                          />
                          <span className="radio-custom"></span>
                          Público
                        </label>
                        <label className="projeto-modal-radio">
                          <input
                            type="radio"
                            name="privacidadeRepo"
                            value="private"
                            checked={privadoRepo}
                            onChange={() => setPrivadoRepo(true)}
                          />
                          <span className="radio-custom"></span>
                          Privado
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status do Projeto */}
          <div className="projeto-modal-section">
            <div className="projeto-modal-input-group">
              <label>Status do Projeto</label>
              <select id="projeto-status-select" className="projeto-modal-input">
                <option>Ativo</option>
                <option>Concluído</option>
                <option>Arquivado</option>
              </select>
            </div>
          </div>

          {/* Botão de Ação */}
          <div className="projeto-modal-actions">
            <button className="projeto-modal-cancel-btn" onClick={fechar}>
              Cancelar
            </button>
            <button className="projeto-modal-save-btn" onClick={salvarProjeto}>
              Criar Projeto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjetoModal;
