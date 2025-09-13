import React, { useState } from "react";
import "./ProjetoModal.css";
import { IoCloseOutline } from "react-icons/io5";
import SelecionarUsuarios from "../../Components/Projeto/SelecionarUsuarios";

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

const ProjetoModal: React.FC<ProjetoModalProps> = ({ fecharModal }) => {
  const [novoNomeEquipe, setNovoNomeEquipe] = useState("");
  const [mostrarMembros, setMostrarMembros] = useState(false);
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<Usuario[]>(
    []
  );
  const [equipes, setEquipes] = useState<Equipe[]>([]);

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
    // Validação básica
    if (!equipes.length) {
      alert("Adicione pelo menos uma equipe.");
      return;
    }

    // Coletar dados do formulário
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

    // Preparar payload
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
      fechar(); // Fecha modal

      // <-- Adiciona este redirecionamento
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

          <button className="btn_salvar_modal" onClick={salvarProjeto}>
            Salvar Projeto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjetoModal;
