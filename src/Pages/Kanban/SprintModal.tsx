import { useState } from "react";
import "./Kanban.css";
import axios from "axios";

type Sprint = {
  id: string;
  title: string;
};

type SprintModalProps = {
  onClose: () => void;
  projeto_id: string;
  onSprintCreated: (sprint: { id: string; title: string }) => void;
};

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SprintModal = ({
  onClose,
  projeto_id,
  onSprintCreated,
}: SprintModalProps) => {
  const [newSprintName, setNewSprintName] = useState("");
  const [storyPoints, setStoryPoints] = useState("");
  const [diasSprint, setDiasSprint] = useState(""); 

  const addSprint = async () => {
  const nome_sprint = newSprintName.trim();
  const pontos = storyPoints.trim();
  const dias = diasSprint.trim();

  if (!nome_sprint) return;

  try {
    const res = await axios.post(`${baseUrl}/sprint`, {
      nome: nome_sprint,
      projeto_id: projeto_id,
      story_points: pontos ? parseInt(pontos) : null,
      dias_sprint: dias ? parseInt(dias) : 0, // ✅ envia os dias
    });

    console.log("Sprint criada:", res.data);

    const novaSprint: Sprint = {
      id: res.data.sprint_id,
      title: res.data.nome,
    };

    onSprintCreated(novaSprint);
    setNewSprintName("");
    setStoryPoints("");
    setDiasSprint("");
    onClose();
  } catch (err) {
    console.error("Erro ao criar sprint:", err);
    alert("Não foi possível criar a sprint.");
  }
};


  return (
    <div className="modal_overlay">
      <div className="modal">
        <div>
          <h2 className="titulo_modal">Criar Sprint</h2>
          <h2 className="descricao_modal">
            Crie uma nova sprint para poder separar as tarefas
          </h2>
        </div>
        <div className="div_inputs_modal">
          <label className="titulo_input">Nome da sprint</label>
          <input
            className="input_modal"
            placeholder="Nome da sprint"
            type="text"
            value={newSprintName}
            onChange={(e) => setNewSprintName(e.target.value)}
          />

          <label className="titulo_input">Story Points</label>
          <input
            className="input_modal"
            placeholder="Quantidade de pontos"
            type="number"
            value={storyPoints}
            onChange={(e) => setStoryPoints(e.target.value)}
          />

          <label className="titulo_input">Dias da Sprint</label>
          <input
            className="input_modal"
            placeholder="Quantidade de dias da sprint"
            type="number"
            value={diasSprint}
            onChange={(e) => setDiasSprint(e.target.value)}
          />
        </div>

        <div className="modal_actions">
          <button className="btn_cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button onClick={addSprint} className="btn_salvar">
            Criar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SprintModal;
