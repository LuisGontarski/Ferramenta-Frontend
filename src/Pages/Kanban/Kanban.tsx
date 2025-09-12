import "./Kanban.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { useState } from "react";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";

const initialColumns = [
    { id: 0, title: "Backlog", locked: true }, 
    { id: 1, title: "Para Fazer" },
    { id: 2, title: "Planejar" },
    { id: 3, title: "Executar" },
    { id: 4, title: "Revisar" },
    { id: 5, title: "Feito" },
];

const users = ["João", "Maria", "Ana", "Carlos", "Gustavo"];

type Sprint = {
    id: number;
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
    sprintId: number;
};

const Kanban = () => {
    const [columns, setColumns] = useState(initialColumns);
    const [sprints, setSprints] = useState<Sprint[]>([{ id: 1, title: "Sprint 1" }]);
    const [selectedSprint, setSelectedSprint] = useState<number>(1);

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
            sprintId: 1,
        },
    ]);

    const [showNewCardModal, setShowNewCardModal] = useState(false);
    const [formData, setFormData] = useState<Omit<Card, "id">>({
        title: "",
        priority: "medium",
        user: users[0],
        date: "",
        type: "tarefa",
        points: "",
        description: "",
        notes: "",
        columnId: 1,
        sprintId: 1,
    });

    const [showNewSprintModal, setShowNewSprintModal] = useState(false);
    const [newSprintName, setNewSprintName] = useState("");

    const [newColumnTitle, setNewColumnTitle] = useState("");
    const [editingColId, setEditingColId] = useState<number | null>(null);
    const [editingColTitle, setEditingColTitle] = useState("");

    // DnD
    const [draggedCardId, setDraggedCardId] = useState<number | null>(null);

    // modal de detalhes do card
    const [showCardModal, setShowCardModal] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const selectedCard = cards.find((c) => c.id === selectedCardId) || null;
    const [tempNotes, setTempNotes] = useState("");

    // Criar card
    const addCard = () => {
        if (!formData.title.trim()) return;
        const newCard: Card = { id: Date.now(), ...formData, sprintId: selectedSprint };
        setCards((prev) => [...prev, newCard]);
        setFormData({
            title: "",
            priority: "medium",
            user: users[0],
            date: "",
            type: "tarefa",
            points: "",
            description: "",
            notes: "",
            columnId: 1,
            sprintId: selectedSprint,
        });
        setShowNewCardModal(false);
    };

    // Criar coluna
    const addColumn = () => {
        const t = newColumnTitle.trim();
        if (!t) return;
        const newCol = { id: Date.now(), title: t };
        setColumns((prev) => [...prev, newCol]);
        setNewColumnTitle("");
    };

    // Editar coluna
    const startEditColumn = (colId: number, currentTitle: string) => {
        setEditingColId(colId);
        setEditingColTitle(currentTitle);
    };

    const confirmEditColumn = () => {
        if (editingColId === null) return;
        const t = editingColTitle.trim();
        if (!t) return;
        setColumns((prev) => prev.map((c) => (c.id === editingColId ? { ...c, title: t } : c)));
        setEditingColId(null);
        setEditingColTitle("");
    };

    const cancelEditColumn = () => {
        setEditingColId(null);
        setEditingColTitle("");
    };

    // Excluir coluna
    const deleteColumn = (colId: number) => {
        const col = columns.find((c) => c.id === colId);
        if (!col) return;
        if ((col as any).locked) {
            alert("A coluna Backlog não pode ser excluída.");
            return;
        }
        const backlogId = columns.find((c) => c.locked)?.id ?? 0;
        setCards((prev) =>
            prev.map((cd) => (cd.columnId === colId ? { ...cd, columnId: backlogId } : cd))
        );
        setColumns((prev) => prev.filter((c) => c.id !== colId));
    };

    // Criar sprint
    const addSprint = () => {
        const t = newSprintName.trim();
        if (!t) return;
        const newSprint = { id: Date.now(), title: t };
        setSprints((prev) => [...prev, newSprint]);
        setSelectedSprint(newSprint.id);
        setNewSprintName("");
        setShowNewSprintModal(false);
    };

    // Excluir sprint
    const deleteSprint = (id: number) => {
        setSprints((prev) => prev.filter((s) => s.id !== id));
        setCards((prev) => prev.filter((c) => c.sprintId !== id));

        if (selectedSprint === id) {
            const remaining = sprints.filter((s) => s.id !== id);
            setSelectedSprint(remaining.length > 0 ? remaining[0].id : 0);
        }
    };

    // DnD handlers
    const handleDragStart = (cardId: number) => setDraggedCardId(cardId);
    const handleDragEnd = () => setDraggedCardId(null);
    const handleDropOnColumn = (colId: number) => {
        if (draggedCardId === null) return;
        setCards((prev) => prev.map((c) => (c.id === draggedCardId ? { ...c, columnId: colId } : c)));
        setDraggedCardId(null);
    };

    // abrir modal de card
    const openCardModal = (cardId: number) => {
        setSelectedCardId(cardId);
        const found = cards.find((c) => c.id === cardId);
        setTempNotes(found?.notes || "");
        setShowCardModal(true);
    };
    const saveCardNotes = () => {
        if (!selectedCard) return;
        setCards((prev) => prev.map((c) => (c.id === selectedCard.id ? { ...c, notes: tempNotes } : c)));
        setShowCardModal(false);
    };

    return (
        <>
            <NavbarHome />
            <div className="container_conteudos">
                <MenuLateral />
                <div className="container_vertical_conteudos">
                    <div className="card_kanban">
                        <div className="div_titulo_requisitos">
                            <div className="div_titulo_documentos">
                                <h2 className="titulo_documentos">Kanban do Projeto</h2>
                                <h2 className="subtitulo_documentos">
                                    Visualização e acompanhamento das tarefas em andamento.
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowNewCardModal(true)}
                                className="button_adicionar_arquivo"
                            >
                                + Novo Card
                            </button>
                        </div>

                        <div className="div_acoes_kanban">
                            <div className="sprint_selector">
                                <select
                                className="select_sprint"
                                    value={selectedSprint}
                                    onChange={(e) => setSelectedSprint(Number(e.target.value))}
                                >
                                    {sprints.map((sp) => (
                                        <option key={sp.id} value={sp.id}>
                                            {sp.title}
                                        </option>
                                    ))}
                                </select>
                                <button className="input_button" onClick={() => setShowNewSprintModal(true)}>+ Nova Sprint</button>
                                {sprints.length > 0 && (
                                    <button className="input_button" onClick={() => deleteSprint(selectedSprint)}>🗑️ Excluir Sprint</button>
                                )}
                            </div>

                            <div className="add_column">
                                <input
                                className="input_button"
                                    type="text"
                                    placeholder="Adicionar nova coluna"
                                    value={newColumnTitle}
                                    onChange={(e) => setNewColumnTitle(e.target.value)}
                                />
                                <button className="input_button" onClick={addColumn}>+ Adicionar Coluna</button>
                            </div>
                        </div>
                        

                        <div className="kanban_container">
                            <div className="kanban">
                                {columns.map((col) => (
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
                                                    <button className="button_small" onClick={confirmEditColumn}>
                                                        Salvar
                                                    </button>
                                                    <button className="button_small" onClick={cancelEditColumn}>
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
                                                        <div className={`badge ${card.priority}`}>
                                                            <span>
                                                                {card.priority === "high"
                                                                    ? "Alta"
                                                                    : card.priority === "medium"
                                                                        ? "Média"
                                                                        : "Baixa"}
                                                            </span>
                                                        </div>
                                                         <span className="card_type"> {card.type}</span>
                                                            <span className="card_points"> {card.points || "-"}</span>
                                                        <p className="card_title">{card.title}</p>
                                                       
                                                        <div className="card_infos">
                                                            <div className="div_responsavel_card_kanban">
                                                                <span className="card_user"> {card.user}</span>
                                                                <span className="card_date"> {card.date || "-"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {showNewSprintModal && (
                    <div className="modal_overlay">
                        <div className="modal">
                            <h2>Criar Sprint</h2>
                            <input
                                type="text"
                                placeholder="Nome da Sprint"
                                value={newSprintName}
                                onChange={(e) => setNewSprintName(e.target.value)}
                            />
                            <div className="modal_actions">
                                <button onClick={addSprint}>Criar</button>
                                <button onClick={() => setShowNewSprintModal(false)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Novo Card */}
                {showNewCardModal && (
                    <div className="modal_overlay">
                        <div className="modal">
                            <div>
                                <h2 className="titulo_modal">Criar card</h2>
                                <h2 className="descricao_modal">Adicione as informações abaixo para criar os cards</h2>
                            </div>
                            <div className="div_inputs_modal">
                                <label className="titulo_input">Nome da tarefa</label>
                                <input
                                className="input_modal"
                                    type="text"
                                    placeholder="Título"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="div_inputs_modal">
                                <label className="titulo_input">Responsável pela tarefa</label>
                                <select
                                    className="input_modal"
                                    value={formData.user}
                                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                                >
                                    {users.map((u, i) => (
                                        <option key={i} value={u}>
                                            {u}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="div_inputs_modal">
                                <label className="titulo_input">Descrição da tarefa</label>
                                <textarea
                                className="input_modal_descricao"
                                    placeholder="Descrição"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>


                            <div className="div_inputs_modal">
                                <label className="titulo_input">Data de entrega</label>
                                <input
                                    className="input_modal"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            <div className="div_inputs_modal">
                                <label className="titulo_input">Prioridade da tarefa</label>
                                <select
                                    className="input_modal"
                                    value={formData.priority}
                                    onChange={(e) =>
                                        setFormData({ ...formData, priority: e.target.value as Card["priority"] })
                                    }
                                >
                                    <option value="high">Alta</option>
                                    <option value="medium">Média</option>
                                    <option value="low">Baixa</option>
                                </select>
                            </div>

                            <div className="div_inputs_modal">
                                <label className="titulo_input">Tipo da tarefa</label>
                                <select
                                className="input_modal"
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData({ ...formData, type: e.target.value as Card["type"] })
                                }
                            >
                                <option value="tarefa">Tarefa</option>
                                <option value="bug">Bug</option>
                                <option value="melhoria">Melhoria</option>
                                <option value="pesquisa">Pesquisa</option>
                            </select>
                            </div>

                            <div className="div_inputs_modal">
                                <label className="titulo_input">Story points</label>
                                <input
                                className="input_modal"
                                type="number"
                                placeholder="Story Points / Horas"
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                            />
                            </div>

                            <div className="div_inputs_modal">
                                <label className="titulo_input">Fase da tarefa</label>
                                <select
                                className="input_modal"
                                value={formData.columnId}
                                onChange={(e) => setFormData({ ...formData, columnId: Number(e.target.value) })}
                            >
                                {columns.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.title}
                                    </option>
                                ))}
                            </select>
                            </div>

                            

                            

                           <div className="div_inputs_modal">
                                <label className="titulo_input">Selecione a sprint</label>
                                <select
                                value={formData.sprintId}
                                onChange={(e) => setFormData({ ...formData, sprintId: Number(e.target.value) })}
                            >
                                {sprints.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.title}
                                    </option>
                                ))}
                            </select>

                            </div>
                            
                            <div className="modal_actions">
                                <button onClick={() => setShowNewCardModal(false)} className="btn_cancelar">Cancelar</button>
                                <button onClick={addCard} className="btn_salvar">Criar</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Detalhes do Card */}
                {showCardModal && selectedCard && (
                    <div className="modal_overlay">
                        <div className="modal">
                            <h2>{selectedCard.title}</h2>
                            <p>
                                <b>Tipo:</b> {selectedCard.type} • <b>Prioridade:</b> {selectedCard.priority}
                            </p>
                            <p>
                                <b>Atribuído a:</b> {selectedCard.user} • <b>Data:</b>{" "}
                                {selectedCard.date || "-"}
                            </p>
                            <p>
                                <b>Story Points/Horas:</b> {selectedCard.points || "-"}
                            </p>
                            <p style={{ whiteSpace: "pre-wrap" }}>
                                <b>Descrição:</b> {selectedCard.description || "-"}
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
                                <button onClick={() => setShowCardModal(false)}>Fechar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Kanban;
