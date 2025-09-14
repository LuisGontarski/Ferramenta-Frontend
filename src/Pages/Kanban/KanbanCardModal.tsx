import { useState } from "react";
import "./Kanban.css";
import { useNavigate } from "react-router-dom";

type Card = {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  user: string;
  date: string;
  type: "tarefa" | "bug" | "melhoria" | "pesquisa";
  points?: string;
  description?: string;
  notes?: string;
  columnId: number;
  sprintId: string;
};

type KanbanCardModalProps = {
  card: Card;
  onClose: () => void;
};

const KanbanCardModal = ({ card, onClose }: KanbanCardModalProps) => {
  const navigate = useNavigate();
  const [tempNotes, setTempNotes] = useState(card.notes || "");

  const saveCardNotes = () => {
    // Aqui você poderia chamar uma função do pai para salvar as notas, se quiser
    console.log("Notas salvas:", tempNotes);
    onClose(); // fecha o modal
  };

  const handleClose = () => {
    onClose();
    navigate("/kanban"); // opcional, se quiser navegar
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="modal_overlay">
      <div className="modal">
        <h2>{card.title}</h2>
        <p>
          <b>Tipo:</b> {card.type} • <b>Prioridade:</b> {card.priority}
        </p>
        <p>
          <b>Atribuído a:</b> {card.user} • <b>Data:</b> {formatDate(card.date)}
        </p>
        <p>
          <b>Story Points/Horas:</b> {card.points || "-"}
        </p>
        <p style={{ whiteSpace: "pre-wrap" }}>
          <b>Descrição:</b> {card.description || "-"}
        </p>

        <label style={{ marginTop: 12, display: "block" }}>
          <b>Observações</b>
        </label>
        <textarea
          placeholder="Escreva observações aqui…"
          value={tempNotes}
          onChange={(e) => setTempNotes(e.target.value)}
        />

        <div className="modal_actions">
          <button onClick={saveCardNotes}>Salvar</button>
          <button onClick={handleClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default KanbanCardModal;
