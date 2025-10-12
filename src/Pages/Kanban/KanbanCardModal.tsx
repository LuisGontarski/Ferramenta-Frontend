import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Card = {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  user: string;
  date: string;
  type: "tarefa" | "bug" | "melhoria" | "feature" | "teste" | "retrabalho";
  points?: string;
  description?: string;
  notes?: string;
  columnId: number;
  sprintId: string;
  projetoId?: string; // 🔹 adiciona isso se precisar passar o id do projeto
};

type KanbanCardModalProps = {
  card: Card;
  onClose: () => void;
};

type Commit = {
  id: string;
  message: string;
  url: string;
  data_commit: string;
};

const KanbanCardModal = ({ card, onClose }: KanbanCardModalProps) => {
  const navigate = useNavigate();
  const [tempNotes, setTempNotes] = useState(card.notes || "");
  const [loading, setLoading] = useState(false);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<string>("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // 🔹 Buscar observação + commits do backend ao abrir o modal
  useEffect(() => {
    const fetchCardInfo = async () => {
      try {
        setLoading(true);
        const projetoId = localStorage.getItem("projeto_id"); // 🔸 ou passe via props
        if (!projetoId) {
          console.warn("projeto_id não encontrado no localStorage");
          return;
        }

        const res = await fetch(
          `${apiUrl}/tarefas/${card.id}/${projetoId}/observacao`
        );
        if (!res.ok) throw new Error("Erro ao buscar informações da tarefa");

        const data = await res.json();

        // 🔹 Atualiza observação e commits do modal
        setTempNotes(data.observacao || "");
        setCommits(data.commits || []);
      } catch (err) {
        console.error("Erro ao carregar observação e commits:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCardInfo();
  }, [card.id, apiUrl]);

  // 🔹 Salvar observação
  const saveCardNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/tarefas/${card.id}/comentario`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comentario: tempNotes,
          commit_id: selectedCommit,
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar observação");

      alert("Observação salva com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar observação!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => onClose();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="modal_overlay">
      <div className="modal_detalhes_tarefa">
        <h2 className="titulo_tarefa">{card.title}</h2>

        <div className="header_badges">
          <span className={`badge tipo_${card.type}`}>{card.type}</span>
          <span className={`badge prioridade_${card.priority}`}>{card.priority}</span>
          <span className="badge storypoints">⚡ {card.points || 0}</span>
        </div>

        <div className="infos_principais">
          <p><i className="bi bi-person"></i> <b>Responsável:</b> {card.user}</p>
          <p><i className="bi bi-calendar-event"></i> <b>Data:</b> {formatDate(card.date)}</p>
        </div>

        <div className="secao">
          <label><b>Descrição</b></label>
          <p className="descricao_tarefa">{card.description || "-"}</p>
        </div>

        <div className="secao">
          <label><b>Observação / História do Usuário</b></label>
          <textarea
            className="textarea_tarefa"
            placeholder="Escreva observações sobre a tarefa..."
            value={tempNotes}
            onChange={(e) => setTempNotes(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="secao">
  <label><b>Associar a commit</b></label>
  <select
    className="select_commit"
    value={selectedCommit}
    onChange={(e) => setSelectedCommit(e.target.value)}
    disabled={loading || commits.length === 0}
  >
    <option value="">Selecione um commit</option>
    {commits.map((c) => (
      <option key={c.id} value={c.id}>
        {c.message} ({new Date(c.data_commit).toLocaleDateString()})
      </option>
    ))}
  </select>

  {/* 🔗 Mostra o link do commit selecionado */}
  {selectedCommit && (
    <p className="link_commit">
      <a
        href={commits.find((c) => c.id === selectedCommit)?.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Ver commit no GitHub
      </a>
    </p>
  )}

  {commits.length === 0 && (
    <p className="texto_vazio">Nenhum commit disponível.</p>
  )}
</div>


        <div className="botoes_modal">
          <button
            className="btn_primario"
            onClick={saveCardNotes}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button className="btn_secundario" onClick={handleClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanbanCardModal;
