import React from "react";

type Props = {
  tipo: "Funcional" | "Não Funcional";
  setTipo: (tipo: "Funcional" | "Não Funcional") => void;
  prioridade: "Alta" | "Média" | "Baixa";
  setPrioridade: (prioridade: "Alta" | "Média" | "Baixa") => void;
  descricao: string;
  setDescricao: (desc: string) => void;
  criterioAceite: string;
  setCriterioAceite: (crit: string) => void;
  fecharModal: () => void;
  onSubmit: () => void;
  editandoRequisito: boolean;
  requisitoId?: string; // UUID real do requisito ao editar
};

const RequisitoModal = ({
  tipo,
  setTipo,
  prioridade,
  setPrioridade,
  descricao,
  setDescricao,
  criterioAceite,
  setCriterioAceite,
  fecharModal,
  onSubmit,
  editandoRequisito,
  requisitoId,
}: Props) => {
  const handleSubmit = async () => {
    if (descricao.trim() === "") {
      alert("A descrição não pode estar vazia.");
      return;
    }

    const projeto_id = localStorage.getItem("projeto_id");
    if (!projeto_id) {
      alert("Projeto não selecionado.");
      return;
    }

    const requisitoData = {
      projeto_id,
      tipo,
      prioridade,
      descricao,
      criterio_aceite: criterioAceite || "",
    };

    try {
      let response;

      if (editandoRequisito && requisitoId) {
        // Edição usando PUT com UUID real
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/requisito/update/${requisitoId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requisitoData),
          }
        );
      } else {
        // Criação de novo requisito
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/requisito/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requisitoData),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao salvar requisito");
      }

      const data = await response.json();
      console.log(
        editandoRequisito ? "Requisito atualizado:" : "Requisito criado:",
        data
      );

      onSubmit(); // Atualiza lista no frontend
      fecharModal();
    } catch (error) {
      console.error(error);
      alert(
        editandoRequisito
          ? "Falha ao atualizar requisito"
          : "Falha ao criar requisito"
      );
    }
  };

  return (
    <div className="modal_overlay">
      <div className="modal_conteudo modal_mostrar">
        <h3>{editandoRequisito ? "Editar Requisito" : "Novo Requisito"}</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Tipo:</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as any)}
            >
              <option value="Funcional">Funcional</option>
              <option value="Não Funcional">Não Funcional</option>
            </select>
          </div>

          <div className="form-group">
            <label>Prioridade:</label>
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value as any)}
            >
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Descrição do Requisito:</label>
            <textarea
              placeholder="Descreva o requisito detalhadamente..."
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="form-group full-width">
            <label>Critério de Aceite:</label>
            <textarea
              placeholder="Condições para considerar o requisito atendido..."
              rows={2}
              value={criterioAceite}
              onChange={(e) => setCriterioAceite(e.target.value)}
            />
          </div>
        </div>

        <div className="botoes_form">
          <button onClick={fecharModal}>Cancelar</button>
          <button onClick={handleSubmit}>
            {editandoRequisito ? "Atualizar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequisitoModal;
