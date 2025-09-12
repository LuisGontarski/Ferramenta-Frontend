import React from "react";
import "./ProjetoModal.css";
import { IoCloseOutline } from "react-icons/io5";
import { useState } from "react";
import SelecionarUsuarios from "../../Components/Projeto/SelecionarUsuarios";

interface ProjetoModalProps {
  fecharModal?: () => void; // Opcional, caso queira usar função externa
}

interface Usuario {
  usuario_id: string; // mudou para string por ser UUID
  nome_usuario: string;
  github: string;
}

const ProjetoModal: React.FC<ProjetoModalProps> = ({ fecharModal }) => {
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
    // Caso tenha função externa
    if (fecharModal) fecharModal();
  }

  const [novoNomeEquipe, setNovoNomeEquipe] = useState("");
  const [mostrarMembros, setMostrarMembros] = useState(false);

  const [usuariosSelecionados, setUsuariosSelecionados] = useState<Usuario[]>(
    []
  );

  function adicionarMembros() {
    if (!novoNomeEquipe.trim()) return; // não faz nada se input vazio
    setMostrarMembros(true); // mostra o componente de membros
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
              onClick={adicionarMembros}
              disabled={!novoNomeEquipe.trim()} // desabilita se input vazio
            >
              Adicionar
            </button>
          </div>

          {mostrarMembros && (
            <SelecionarUsuarios onSelecionar={setUsuariosSelecionados} />
          )}

          <label>Status</label>
          <select className="input_modal">
            <option>Ativo</option>
            <option>Concluído</option>
            <option>Arquivado</option>
          </select>

          <button className="btn_salvar_modal" onClick={fechar}>
            Salvar Projeto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjetoModal;
