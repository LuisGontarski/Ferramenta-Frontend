import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

// --- 1. ADICIONA 'commit_url' AO TIPO ---
type Card = {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  user: string;
  date: string;
  type: "Tarefa" | "Bug" | "melhoria" | "feature" | "teste" | "retrabalho";
  points?: string;
  description?: string;
  notes?: string;
  commit_url?: string; // <-- ADICIONADO AQUI
  columnId: number;
  sprintId: string;
  projetoId?: string;
};

// --- 2. ADICIONA 'onUpdateCard' ÀS PROPS ---
type KanbanCardModalProps = {
  card: Card;
  onClose: () => void;
  onUpdateCard: (updatedCard: Card) => void; // <-- ADICIONADO AQUI
  onDelete: (cardId: string) => void;
};

type Commit = {
  id: string;
  message: string;
  url: string;
  data_commit: string;
};

const KanbanCardModal = ({
  card,
  onClose,
  onUpdateCard,
  onDelete,
}: KanbanCardModalProps) => {
  const navigate = useNavigate();
  const [tempNotes, setTempNotes] = useState(card.notes || "");
  const [loading, setLoading] = useState(false);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedCommitUrl, setSelectedCommitUrl] = useState<string>(
    card.commit_url || ""
  );

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCardInfo = async () => {
      try {
        setLoading(true);
        const projetoId = localStorage.getItem("projeto_id");
        if (!projetoId) {
          console.warn("projeto_id não encontrado no localStorage");
          setCommits([]); // Garante que não haverá commits se não houver projeto
          return;
        }

        const res = await fetch(
          `${apiUrl}/tarefas/${card.id}/${projetoId}/observacao`
        );
        if (!res.ok) throw new Error("Erro ao buscar informações da tarefa");

        const data = await res.json();

        setTempNotes(data.observacao || "");
        setCommits(data.commits || []);
        // Pré-seleciona o commit se ele já estiver salvo na tarefa
        if (data.commit_url) {
          setSelectedCommitUrl(data.commit_url);
        }
      } catch (err) {
        console.error("Erro ao carregar observação e commits:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCardInfo();
  }, [card.id, apiUrl]);

  const saveCardNotes = async () => {
    try {
      setLoading(true);

      // ✅ Mostrar loading durante o salvamento
      const loadingToast = toast.loading("Salvando observação...");

      const response = await fetch(`${apiUrl}/tarefas/${card.id}/comentario`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comentario: tempNotes,
          commit_url: selectedCommitUrl,
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar observação");

      const updatedTask = await response.json();

      // Atualizar o card
      const updatedCard: Card = {
        ...card,
        notes: updatedTask.comentario,
        commit_url: updatedTask.commit_url,
      };
      onUpdateCard(updatedCard);

      // ✅ Substituir loading por sucesso
      toast.success("Observação salva com sucesso!", {
        id: loadingToast,
      });

      onClose();
    } catch (err) {
      console.error(err);

      // ✅ Notificação de erro moderna
      toast.error("Erro ao salvar observação!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async () => {
    if (
      !window.confirm(
        `Tem certeza que deseja excluir a tarefa "${card.title}"?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      // ✅ Mostrar loading durante a exclusão
      const loadingToast = toast.loading("Excluindo tarefa...");

      const response = await axios.delete(`${apiUrl}/tarefas/${card.id}`);

      if (response.status !== 200) {
        throw new Error("Falha ao excluir a tarefa no servidor.");
      }

      onDelete(card.id); // Avisa o componente pai para remover o card da tela

      // ✅ Substituir loading por sucesso
      toast.success("Tarefa excluída com sucesso!", {
        id: loadingToast,
      });

      onClose(); // Fecha o modal
    } catch (err) {
      console.error("Erro ao excluir o card:", err);

      // ✅ Notificação de erro moderna
      toast.error("Não foi possível excluir a tarefa.");
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
          <span className={`badge ${card.type}`}>{card.type}</span>
          <span className={`badge ${card.priority}`}>{card.priority}</span>
          <span className="badge storypoints">{card.points || 0}</span>
        </div>

        <div className="infos_principais">
          <p>
            <i className="bi bi-person"></i> <b>Responsável:</b> {card.user}
          </p>
          <p>
            <i className="bi bi-calendar-event"></i> <b>Data:</b>{" "}
            {formatDate(card.date)}
          </p>
        </div>

        <div className="secao">
          <label>
            <b>Descrição</b>
          </label>
          <p className="descricao_tarefa">{card.description || "-"}</p>
        </div>

        <div className="secao">
          <label>
            <b>Observação / História do Usuário</b>
          </label>
          <textarea
            className="textarea_tarefa"
            placeholder="Escreva observações sobre a tarefa..."
            value={tempNotes}
            onChange={(e) => setTempNotes(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="secao">
          <label>
            <b>Associar a commit</b>
          </label>
          <select
            className="select_commit"
            value={selectedCommitUrl}
            onChange={(e) => setSelectedCommitUrl(e.target.value)}
            disabled={loading || commits.length === 0}
          >
            <option value="">Nenhum commit selecionado</option>
            {commits.map((c) => (
              <option key={c.id} value={c.url}>
                {c.message.split("\n")[0]} (
                {new Date(c.data_commit).toLocaleDateString()})
              </option>
            ))}
          </select>

          {commits.length === 0 && (
            <p className="texto_vazio">Nenhum commit disponível.</p>
          )}
        </div>

        {card.commit_url && (
          <div className="secao">
            <label>
              <b>Commit Associado</b>
            </label>
            <p className="link_commit">
              <a
                href={card.commit_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver commit no GitHub
              </a>
            </p>
          </div>
        )}

        <div className="botoes_modal">
          <button
            className="btn_primario"
            onClick={saveCardNotes}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button
            className="btn_excluir_card" // Adicione um estilo para este botão se desejar
            onClick={handleDeleteCard}
            disabled={loading}
          >
            Excluir
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
