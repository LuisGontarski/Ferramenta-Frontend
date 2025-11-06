import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import HistoricoTarefaModal from "../Historico/HistoricoTarefaModal"; // Importe o modal de histórico

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
  const [tempNotes, setTempNotes] = useState(card.notes || "");
  const [loading, setLoading] = useState(false);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedCommitUrl, setSelectedCommitUrl] = useState<string>(
    card.commit_url || ""
  );

  // Estados para o modal de histórico
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);

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
    const loadingToast = toast.loading("Salvando observação...");

    try {
      setLoading(true);

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

      const updatedCard: Card = {
        ...card,
        notes: updatedTask.comentario,
        commit_url: updatedTask.commit_url,
      };
      onUpdateCard(updatedCard);

      toast.success("Observação salva com sucesso!", {
        id: loadingToast,
      });

      onClose();
    } catch (err) {
      console.error(err);

      toast.error("Erro ao salvar observação!", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async () => {
    // ✅ Confirm personalizado com toast
    const userConfirmed = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <div className="custom-toast confirm-toast">
            <div className="toast-content">
              <h3>Confirmar Exclusão</h3>
              <p>
                Tem certeza que deseja excluir a tarefa{" "}
                <strong>"{card.title}"</strong>?
              </p>
              <div className="toast-buttons">
                <button
                  className="btn-confirm-yes"
                  onClick={() => {
                    resolve(true);
                    toast.dismiss(t.id);
                  }}
                >
                  Sim, Excluir
                </button>
                <button
                  className="btn-confirm-no"
                  onClick={() => {
                    resolve(false);
                    toast.dismiss(t.id);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ),
        {
          duration: Infinity, // Fica aberto até o usuário responder
        }
      );
    });

    if (!userConfirmed) {
      return;
    }

    const loadingToast = toast.loading("Excluindo tarefa...");

    try {
      setLoading(true);

      const response = await axios.delete(`${apiUrl}/tarefas/${card.id}`);

      if (response.status !== 200) {
        throw new Error("Falha ao excluir a tarefa no servidor.");
      }

      onDelete(card.id);

      toast.success("Tarefa excluída com sucesso!", {
        id: loadingToast,
      });

      onClose();
    } catch (err: any) {
      console.error("Erro ao excluir o card:", err);

      const errorMessage =
        err.response?.data?.message || "Não foi possível excluir a tarefa.";

      toast.error(errorMessage, {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenHistorico = () => {
    setShowHistoricoModal(true);
  };

  const handleCloseHistorico = () => {
    setShowHistoricoModal(false);
  };

  const handleClose = () => onClose();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div className="modal_overlay">
        <div className="modal_detalhes_tarefa">
          <h2 className="titulo_tarefa">{card.title}</h2>

          <button className="btn_fechar" onClick={handleClose}>
            <i className="bi bi-x"></i>
          </button>

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

          {/* Botão Histórico */}
          <div className="secao">
            <button
              className="btn_historico"
              onClick={handleOpenHistorico}
              disabled={loading}
            >
              <i className="bi bi-clock-history"></i> Ver Histórico
            </button>
          </div>

          <div className="botoes_modal">
            <button
              className="btn_primario"
              onClick={saveCardNotes}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              className="btn_excluir_card"
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

      {/* Modal de Histórico */}
      <HistoricoTarefaModal
        tarefa_id={card.id}
        tarefa_titulo={card.title}
        isOpen={showHistoricoModal}
        onClose={handleCloseHistorico}
      />
    </>
  );
};

export default KanbanCardModal;
