import "./Kanban.css";
import { useState, useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import KanbanModal from "./KanbanModal";
import KanbanCardModal from "./KanbanCardModal";
import SprintModal from "./SprintModal";
import axios from "axios";
import { useParams } from "react-router-dom";

const initialColumns = [
  { id: 0, title: "Backlog", locked: true },
  { id: 1, title: "Para Fazer" },
  { id: 2, title: "Planejar" },
  { id: 3, title: "Executar" },
  { id: 4, title: "Revisar" },
  { id: 5, title: "Feito" },
];

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Sprint = {
  id: string;
  title: string;
};

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
  commit_url?: string;
  columnId: number;
  sprintId: string;
};

const ConteudoKanban = () => {
  const { id: projectId } = useParams<{ id: string }>();

  const [columns, setColumns] = useState(initialColumns);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<string>("");
  const [showNewSprintModal, setShowNewSprintModal] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [users, setUsers] = useState<{ usuario_id: string; nome: string }[]>([]);

  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const cargo = localStorage.getItem("cargo");

  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [tempNotes, setTempNotes] = useState("");

  const selectedCard = cards.find((c) => c.id === selectedCardId) || null;

  const handleUpdateCard = (updatedCard: Card) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === updatedCard.id ? updatedCard : card
      )
    );
  };

  // Buscar sprints
  useEffect(() => {
    const fetchSprints = async () => {
      if (!projectId) return;

      try {
        const res = await axios.get(`${baseUrl}/sprint/${projectId}`);
        const mappedSprints = res.data.map((s: { id: number; title: string }) => ({
          id: s.id.toString(),
          title: s.title,
        }));

        setSprints(mappedSprints);
        if (mappedSprints.length > 0) setSelectedSprint(mappedSprints[0].id);
      } catch (err) {
        console.error("Erro ao buscar sprints:", err);
        setSprints([]);
        setSelectedSprint("");
      }
    };

    fetchSprints();
  }, [projectId]);

  // Buscar tarefas
  useEffect(() => {
    const fetchTarefas = async () => {
      if (!selectedSprint) {
        setCards([]);
        return;
      }

      try {
        const res = await axios.get(`${baseUrl}/tarefas/sprint/${selectedSprint}`);

        const columnMap: { [key: string]: number } = {
          Backlog: 0,
          "Para Fazer": 1,
          Planejar: 2,
          Executar: 3,
          Revisar: 4,
          Feito: 5,
        };

        const mappedCards = res.data.map((t: any) => ({
          id: t.tarefa_id,
          title: t.titulo,
          priority: t.prioridade || "medium",
          user: t.responsavel_nome || "-",
          date: t.data_inicio ? t.data_inicio.split("T")[0] : "",
          type: t.tipo || "tarefa",
          points: t.story_points?.toString() || "",
          description: t.descricao || "",
          notes: t.notes || "",
          commit_url: t.commit_url || "",
          columnId: columnMap[t.fase_tarefa] ?? 0,
          sprintId: t.sprint_id,
        }));

        setCards(mappedCards);
      } catch (err) {
        console.error("Erro ao obter tarefas da sprint:", err);
        setCards([]);
      }
    };

    fetchTarefas();
  }, [selectedSprint]);

  // Buscar usuários
  useEffect(() => {
    const fetchUsers = async () => {
      if (!projectId) {
        setUsers([]);
        return;
      }

      try {
        const res = await axios.get(`${baseUrl}/projects/${projectId}/users`);
        setUsers(res.data);
      } catch (err) {
        console.error("Erro ao buscar usuários do projeto:", err);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [projectId]);

  const addColumn = () => {
    const t = newColumnTitle.trim();
    if (!t) return;
    const newCol = { id: Date.now(), title: t };
    setColumns((prev) => [...prev, newCol]);
    setNewColumnTitle("");
  };

  const handleDropOnColumn = (colId: number) => {
    if (draggedCardId === null) return;
    const card = cards.find((c) => c.id === draggedCardId);
    if (!card) return;

    const newColumn = columns.find((c) => c.id === colId);
    if (!newColumn) return;

    setCards((prev) =>
      prev.map((c) => (c.id === draggedCardId ? { ...c, columnId: colId } : c))
    );

    updateTarefaFase(card.id.toString(), newColumn.title);
    setDraggedCardId(null);
  };

  const updateTarefaFase = async (tarefaId: string, novaFase: string) => {
    try {
      await axios.patch(`${baseUrl}/tarefas/${tarefaId}`, { fase_tarefa: novaFase });
      console.log("Fase da tarefa atualizada com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar fase da tarefa:", err);
    }
  };

  const openCardModal = (cardId: string) => { // <-- Corrigido para string
    setSelectedCardId(cardId);
    const found = cards.find((c) => c.id === cardId);
    setTempNotes(found?.notes || "");
    setShowCardModal(true);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleDragStart = (cardId: string) => setDraggedCardId(cardId);
  const handleDragEnd = () => setDraggedCardId(null);

  const deleteSprint = async (id: string) => {
    if (!id) return;
    const confirmar = window.confirm("Tem certeza que deseja excluir esta sprint?");
    if (!confirmar) return;

    try {
      await axios.delete(`${baseUrl}/sprint/${id}`);

      setSprints((prev) => prev.filter((s) => s.id !== id));
      setSelectedSprint((prev) => (prev === id ? (sprints[0]?.id || "") : prev));
      setCards((prev) => prev.filter((c) => c.sprintId !== id));

      console.log("Sprint excluída com sucesso:", id);
    } catch (err) {
      console.error("Erro ao excluir sprint:", err);
      alert("Erro ao excluir sprint.");
    }
  };

  return (
    <div className="container_vertical_conteudos">
      <div className="card_kanban">
        <div className="div_titulo_requisitos">
          <div className="div_titulo_documentos">
            <h2 className="titulo_documentos">Kanban do Projeto</h2>
            <h2 className="subtitulo_documentos">
              Visualização e acompanhamento das tarefas em andamento.
            </h2>
          </div>
        </div>

        <div className="div_acoes_kanban">
          <div className="sprint_selector">
            {sprints.length > 0 && (
              <select
                className="select_sprint"
                value={selectedSprint}
                onChange={(e) => setSelectedSprint(e.target.value)}
                disabled={!projectId}
              >
                {sprints.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.title}
                  </option>
                ))}
              </select>
            )}

            {cargo === "Product Owner" && (
              <button
                className="input_nova_sprint"
                onClick={() => setShowNewSprintModal(true)}
                disabled={!projectId}
                title={!projectId ? "Projeto não encontrado" : ""}
              >
                <HiPlus size={"14px"} /> Nova Sprint
              </button>
            )}

            {showNewSprintModal && (
              <SprintModal
                projeto_id={projectId || ""}
                onClose={() => setShowNewSprintModal(false)}
                onSprintCreated={(novaSprint) => {
                  setSprints((prev) => [...prev, novaSprint]);
                  setSelectedSprint(novaSprint.id);
                }}
              />
            )}

            {sprints.length > 0 && cargo === "Product Owner" && (
              <>
                <button
                  className="input_excluir_sprint"
                  onClick={() => deleteSprint(selectedSprint)}
                >
                  <FaRegTrashAlt size={"14px"} /> Excluir Sprint
                </button>

                <button
                  onClick={() => setShowNewCardModal(true)}
                  className="button_adicionar_card_kanban"
                  disabled={!selectedSprint}
                  title={!selectedSprint ? "Selecione uma sprint primeiro" : ""}
                >
                  <HiPlus size={"14px"} /> Novo Card
                </button>
              </>
            )}
          </div>

          {showNewCardModal && (
            <KanbanModal
              onClose={() => setShowNewCardModal(false)}
              projeto_id={projectId || ""}
              sprints={sprints.map((s) => ({ id: s.id.toString(), nome: s.title }))}
              onTarefaCreated={(novaTarefa: any) => {
                const columnMap: { [key: string]: number } = {
                  Backlog: 0,
                  "Para Fazer": 1,
                  Planejar: 2,
                  Executar: 3,
                  Revisar: 4,
                  Feito: 5,
                };
                const usuario = users.find((u) => u.usuario_id === novaTarefa.responsavel_id);
                const newCard: Card = {
                  id: novaTarefa.tarefa_id,
                  title: novaTarefa.titulo,
                  priority: novaTarefa.prioridade || "medium",
                  user: usuario?.nome || "-",
                  date: novaTarefa.data_inicio?.split("T")[0] || "",
                  type: novaTarefa.tipo || "tarefa",
                  points: novaTarefa.story_points?.toString() || "",
                  description: novaTarefa.descricao || "",
                  notes: novaTarefa.notes || "",
                  columnId: columnMap[novaTarefa.fase_tarefa] ?? 1,
                  sprintId: novaTarefa.sprint_id?.toString() || "",
                };
                setCards((prev) => [...prev, newCard]);
              }}
            />
          )}
        </div>
      </div>

      <div className="kanban_container">
        <div className="kanban">
          {columns.map((col) => (
            <div
              key={col.id}
              className="kanban_column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropOnColumn(col.id)}
            >
              <div className="kanban_title">
                <h2>{col.title}</h2>
              </div>

              <div className="kanban_cards">
                {cards
                  .filter((cd) => cd.columnId === col.id && cd.sprintId === selectedSprint)
                  .map((card) => (
                    <div
                      key={card.id}
                      className="kanban_card"
                      draggable
                      onDragStart={() => handleDragStart(card.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => openCardModal(card.id)}
                    >
                      <div className="card_tags">
                        <div className="div_separadora_tags">
                          <div className={`badge ${card.priority}`}>
                            {card.priority === "high"
                              ? "Alta"
                              : card.priority === "medium"
                                ? "Média"
                                : "Baixa"}
                          </div>
                          <span className={`card_type ${card.type}`}>{card.type}</span>
                        </div>
                        <span className="card_points">{card.points || "-"}</span>
                      </div>
                      <p className="card_title">{card.title}</p>
                      <div className="card_infos">
                        <div className="div_responsavel_card_kanban">
                          <span className="card_user">{card.user}</span>
                          <span className="card_date">{formatDate(card.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCardModal && selectedCard && (
        <KanbanCardModal
          card={selectedCard}
          onClose={() => {
            setShowCardModal(false);
            setSelectedCardId(null);
            setTempNotes("");
          }}
          // --- ALTERAÇÃO FINAL: PASSANDO A PROP ---
          onUpdateCard={handleUpdateCard}
        />
      )}
    </div>
  );
}

export default ConteudoKanban;
