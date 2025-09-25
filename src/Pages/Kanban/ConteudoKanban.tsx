import "./Kanban.css";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import KanbanModal from "./KanbanModal";
import KanbanCardModal from "./KanbanCardModal";
import SprintModal from "./SprintModal";
import { useEffect } from "react";
import axios from "axios";

const initialColumns = [
  { id: 0, title: "Backlog", locked: true },
  { id: 1, title: "Para Fazer" },
  { id: 2, title: "Planejar" },
  { id: 3, title: "Executar" },
  { id: 4, title: "Revisar" },
  { id: 5, title: "Feito" },
];

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const usuario_id = localStorage.getItem("usuario_id");

type Sprint = {
  id: string;
  title: string;
};

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

type Project = {
  projeto_id: number;
  nome: string;
};

const ConteudoKanban = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<string>(
    sprints.length > 0 ? sprints[0].id.toString() : ""
  );
  const [showNewSprintModal, setShowNewSprintModal] = useState(false);

  const [cards, setCards] = useState<Card[]>([
    {
      id: Date.now(),
      title: "Implementar autenticação",
      priority: "high",
      user: "João",
      date: "2023-10-01",
      type: "tarefa",
      points: "5",
      description: "Adicionar login com JWT",
      columnId: 1,
      sprintId: "1",
    },
  ]);

  const [draggedCardId, setDraggedCardId] = useState<number | null>(null);
  const [editingColId, setEditingColId] = useState<number | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingColTitle, setEditingColTitle] = useState("");

  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [formData, setFormData] = useState<Omit<Card, "id">>({
    title: "",
    priority: "medium",
    user: "",
    date: "",
    type: "tarefa",
    points: "",
    description: "",
    notes: "",
    columnId: 1,
    sprintId: "1",
  });

  const deleteColumn = (colId: number) => {
    const col = columns.find((c) => c.id === colId);
    if (!col) return;
    if ((col as any).locked) {
      alert("A coluna Backlog não pode ser excluída.");
      return;
    }
    const backlogId = columns.find((c) => c.locked)?.id ?? 0;
    setCards((prev) =>
      prev.map((cd) =>
        cd.columnId === colId ? { ...cd, columnId: backlogId } : cd
      )
    );
    setColumns((prev) => prev.filter((c) => c.id !== colId));
  };

  const confirmEditColumn = () => {
    if (editingColId === null) return;
    const t = editingColTitle.trim();
    if (!t) return;
    setColumns((prev) =>
      prev.map((c) => (c.id === editingColId ? { ...c, title: t } : c))
    );
    setEditingColId(null);
    setEditingColTitle("");
  };

  const cancelEditColumn = () => {
    setEditingColId(null);
    setEditingColTitle("");
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // modal de detalhes do card
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const selectedCard = cards.find((c) => c.id === selectedCardId) || null;
  const [tempNotes, setTempNotes] = useState("");

  const openCardModal = (cardId: number) => {
    setSelectedCardId(cardId);
    const found = cards.find((c) => c.id === cardId);
    setTempNotes(found?.notes || "");
    setShowCardModal(true);
  };

  const startEditColumn = (colId: number, currentTitle: string) => {
    setEditingColId(colId);
    setEditingColTitle(currentTitle);
  };

  const deleteSprint = (id: string) => {};

  const handleDropOnColumn = (colId: number) => {
    if (draggedCardId === null) return;

    const card = cards.find((c) => c.id === draggedCardId);
    if (!card) return;

    // pega o título da coluna destino
    const newColumn = columns.find((c) => c.id === colId);
    if (!newColumn) return;

    // Atualiza localmente
    setCards((prev) =>
      prev.map((c) => (c.id === draggedCardId ? { ...c, columnId: colId } : c))
    );

    // Atualiza no backend com o nome da fase
    updateTarefaFase(card.id.toString(), newColumn.title);

    setDraggedCardId(null);
  };
  const addColumn = () => {
    const t = newColumnTitle.trim();
    if (!t) return;
    const newCol = { id: Date.now(), title: t };
    setColumns((prev) => [...prev, newCol]);
    setNewColumnTitle("");
  };

  const handleDragStart = (cardId: number) => setDraggedCardId(cardId);
  const handleDragEnd = () => setDraggedCardId(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");

  const updateTarefaFase = async (tarefaId: string, novaFase: string) => {
    try {
      await axios.patch(`${baseUrl}/tarefas/${tarefaId}`, {
        fase_tarefa: novaFase,
      });
      // opcional: atualizar estado local
      console.log("Fase da tarefa atualizada com sucesso");
      setCards((prev) =>
        prev.map((c) =>
          c.id === Number(tarefaId) ? { ...c, columnId: Number(novaFase) } : c
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar fase da tarefa:", err);
    }
  };

  // 1️⃣ Buscar projetos do usuário (roda só uma vez)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${baseUrl}/projects/user/${usuario_id}`);
        setProjects(res.data); // backend retorna array de projetos
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
      }
    };

    if (usuario_id) {
      fetchProjects();
    }
  }, [usuario_id]);

  // 2️⃣ Buscar sprints sempre que mudar o projeto selecionado
  useEffect(() => {
    const fetchSprints = async () => {
      if (!selectedProject) {
        setSprints([]);
        setSelectedSprint("");
        return;
      }

      try {
        console.log("Buscando sprints do projeto:", selectedProject);
        const res = await axios.get(`${baseUrl}/sprint/${selectedProject}`);

        const mappedSprints = res.data.map(
          (s: { id: number; title: string }) => ({
            id: s.id.toString(), // transforma id para string
            title: s.title,
          })
        );

        console.log("Sprints carregadas:", mappedSprints);

        setSprints(mappedSprints);
        if (mappedSprints.length > 0) {
          setSelectedSprint(mappedSprints[0].id); // seleciona a primeira sprint por padrão
        }
      } catch (err) {
        console.error("Erro ao buscar sprints:", err);
        setSprints([]);
        setSelectedSprint("");
      }
    };

    fetchSprints();
  }, [selectedProject]);

  useEffect(() => {
    const fetchTarefas = async () => {
      if (!selectedSprint) {
        setCards([]);
        return;
      }

      try {
        const res = await axios.get(
          `${baseUrl}/tarefas/sprint/${selectedSprint}`
        );

        // Mapeia fase_tarefa para columnId
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
          columnId: columnMap[t.fase_tarefa] ?? 1, // mapeia fase salva
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

  const [users, setUsers] = useState<{ usuario_id: string; nome: string }[]>(
    []
  );

  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedProject) {
        setUsers([]);
        return;
      }

      try {
        const res = await axios.get(
          `${baseUrl}/projects/${selectedProject}/users`
        );
        setUsers(res.data); // backend deve retornar {usuario_id, nome}[]
      } catch (err) {
        console.error("Erro ao buscar usuários do projeto:", err);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [selectedProject]);

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
            <select
              className="select_project"
              value={selectedProject}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedProject(value);
                setSelectedSprint(""); // limpa sprint selecionada
                setCards([]); // limpa cards do projeto anterior
              }}
            >
              <option value="">Selecione um projeto</option>
              {projects.map((sp) => (
                <option key={sp.projeto_id} value={sp.projeto_id}>
                  {sp.nome}
                </option>
              ))}
            </select>
            <select
              className="select_sprint"
              value={selectedSprint}
              onChange={(e) => setSelectedSprint(e.target.value)}
              disabled={!selectedProject} // mantém desabilitado se não houver projeto
            >
              {sprints.length === 0 && (
                <option value="">Selecione uma sprint</option>
              )}
              {sprints.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.title}
                </option>
              ))}
            </select>
            <button
              className="input_nova_sprint"
              onClick={() => setShowNewSprintModal(true)}
              disabled={!selectedProject}
              title={!selectedProject ? "Selecione um projeto primeiro" : ""}
            >
              <HiPlus size={"14px"} /> Nova Sprint
            </button>

            {showNewSprintModal && (
              <SprintModal
                projeto_id={selectedProject}
                onClose={() => setShowNewSprintModal(false)}
                onSprintCreated={(novaSprint) => {
                  setSprints((prev) => [...prev, novaSprint]);
                  setSelectedSprint(novaSprint.id); // já seleciona a nova sprint
                }}
              />
            )}
            {sprints.length > 0 && (
              <button
                className="input_excluir_sprint"
                onClick={() => deleteSprint(selectedSprint)}
              >
                <FaRegTrashAlt size={"14px"} /> Excluir Sprint
              </button>
            )}
          <button
            onClick={() => setShowNewCardModal(true)}
            className="button_adicionar_card_kanban"
            disabled={!selectedSprint}
            title={!selectedSprint ? "Selecione uma sprint primeiro" : ""}
          >
            <HiPlus size={"14px"} /> Novo Card
          </button>
          </div>

          {/* Modal fora do botão */}
          {showNewCardModal && (
            <KanbanModal
              onClose={() => setShowNewCardModal(false)}
              projeto_id={selectedProject}
              sprints={sprints.map((s) => ({
                id: s.id.toString(),
                nome: s.title,
              }))}
              // ✅ callback para atualizar o estado do pai
              onTarefaCreated={(novaTarefa: any) => {
                const columnMap: { [key: string]: number } = {
                  Backlog: 0,
                  "Para Fazer": 1,
                  Planejar: 2,
                  Executar: 3,
                  Revisar: 4,
                  Feito: 5,
                };

                const usuario = users.find(
                  (u) => u.usuario_id === novaTarefa.responsavel_id
                );

                const newCard: Card = {
                  id: novaTarefa.tarefa_id,
                  title: novaTarefa.titulo,
                  priority: novaTarefa.prioridade || "medium",
                  user: usuario?.nome || "-", // ✅ nome aparece imediatamente
                  date: novaTarefa.data_inicio?.split("T")[0] || "",
                  type: novaTarefa.tipo || "tarefa",
                  points: novaTarefa.story_points?.toString() || "",
                  description: novaTarefa.descricao || "",
                  notes: novaTarefa.notes || "",
                  columnId: columnMap[novaTarefa.fase_tarefa] ?? 1,
                  sprintId: novaTarefa.sprint_id?.toString() || "",
                };

                setCards((prev) => [...prev, newCard]); // só precisa dessa
              }}
            />
          )}
        </div>

      </div>
        <div className="kanban_container">
          <div className="kanban">
            {columns.map((col, idx) => (
              <div
                key={col.id}
                className="kanban_column"
                data-id={col.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropOnColumn(col.id)}
              >
                <div className="kanban_title">
                  {editingColId === col.id ? (
                    <>
                      <input
                        className="edit_input"
                        value={editingColTitle}
                        onChange={(e) => setEditingColTitle(e.target.value)}
                      />
                      <button
                        className="button_small"
                        onClick={confirmEditColumn}
                      >
                        Salvar
                      </button>
                      <button
                        className="button_small"
                        onClick={cancelEditColumn}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <h2>{col.title}</h2>
                      <div className="column_actions">
                        <span
                          className="button_icon"
                          title="Renomear"
                          onClick={() => startEditColumn(col.id, col.title)}
                        >
                          <FiEdit2 />
                        </span>
                        {!col.locked && (
                          <span
                            className="button_icon"
                            title="Excluir"
                            onClick={() => deleteColumn(col.id)}
                          >
                            <FaRegTrashCan />
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="kanban_cards">
                  {cards
                    .filter(
                      (cd) =>
                        cd.columnId === col.id && cd.sprintId === selectedSprint
                    )
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
                          <div className={`badge ${card.priority}`}>
                            {card.priority === "high"
                              ? "Alta"
                              : card.priority === "medium"
                              ? "Média"
                              : "Baixa"}
                          </div>
                          <span className="card_type">{card.type}</span>
                          <span className="card_points">
                            {card.points || "-"}
                          </span>
                        </div>

                        <p className="card_title">{card.title}</p>

                        <div className="card_infos">
                          <div className="div_responsavel_card_kanban">
                            <span className="card_user">{card.user}</span>
                            <span className="card_date">
                              {formatDate(card.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                  {showCardModal && selectedCard && (
                    <KanbanCardModal
                      card={selectedCard}
                      onClose={() => {
                        setShowCardModal(false);
                        setSelectedCardId(null);
                        setTempNotes("");
                      }}
                    />
                  )}
                </div>
              </div>
            ))}

            <div className="kanban_column add_column_btn">
              {newColumnTitle ? (
                <div className="add_column_form">
                  <input
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="Nome da coluna"
                  />
                  <button onClick={addColumn}>Salvar</button>
                  <button onClick={() => setNewColumnTitle("")}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  className="btn_add_col"
                  onClick={() => setNewColumnTitle("Nova coluna")}
                >
                  + Nova Coluna
                </button>
              )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default ConteudoKanban;
