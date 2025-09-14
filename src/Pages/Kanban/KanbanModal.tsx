import React, { useState, useEffect } from "react";
import "./Kanban.css";
import axios from "axios";

const initialColumns = [
  { id: 0, title: "Backlog", locked: true },
  { id: 1, title: "Para Fazer" },
  { id: 2, title: "Planejar" },
  { id: 3, title: "Executar" },
  { id: 4, title: "Revisar" },
  { id: 5, title: "Feito" },
];

export type Card = {
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
  projetoId: string;
};

type SprintOption = { id: string; nome: string };
type User = { usuario_id: string; nome: string; email: string };

type KanbanModalProps = {
  onClose: () => void;
  projeto_id: string;
  sprints: SprintOption[];
  onTarefaCreated?: (novaTarefa: any) => void;
};

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const KanbanModal = ({ onClose, projeto_id, sprints, onTarefaCreated }: KanbanModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    priority: "medium",
    user: "",
    date: "",
    type: "tarefa",
    points: "",
    description: "",
    notes: "",
    columnId: 1,
    sprintId: sprints.length > 0 ? sprints[0].id : "",
  });

  const [columns] = useState(initialColumns);
  const [users, setUsers] = useState<User[]>([]);

  // Buscar usuários vinculados ao projeto apenas quando projetoId mudar e for válido
  useEffect(() => {
    if (!projeto_id) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${baseUrl}/projects/${projeto_id}/users`);
        if (Array.isArray(res.data)) {
          setUsers(res.data);
          if (res.data.length > 0) {
            setFormData((prev) => ({ ...prev, user: res.data[0].usuario_id }));
          }
        } else {
          console.error("Dados de usuários inválidos:", res.data);
        }
      } catch (err) {
        console.error("Erro ao buscar usuários do projeto:", err);
      }
    };

    fetchUsers();
  }, [projeto_id]);

  const addCard = async () => {
    if (!formData.title.trim()) {
      alert("O título é obrigatório");
      return;
    }
    if (!formData.sprintId) {
      alert("Selecione uma sprint antes de criar a tarefa");
      return;
    }

    try {
      const selectedColumn = columns.find((c) => c.id === formData.columnId);

      const res = await axios.post(`${baseUrl}/tarefas`, {
        titulo: formData.title,
        descricao: formData.description,
        status: selectedColumn?.title || "Backlog",
        prioridade: formData.priority,
        tipo: formData.type,
        data_inicio: formData.date,
        projeto_id: projeto_id,
        responsavel_id: formData.user,
        criador_id: localStorage.getItem("usuario_id"),
        story_points: formData.points,
        fase_tarefa: formData.columnId,
        sprint_id: formData.sprintId,
      });

      if (res.status === 201 || res.status === 200) {
        const novaTarefa = res.data;

        if (onTarefaCreated) {
          onTarefaCreated(novaTarefa); // ✅ avisa o pai
        }

        onClose();
      }

      console.log("Tarefa criada:", res.data);
      onClose();
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
      alert("Não foi possível criar a tarefa.");
    }
  };

  return (
    <div className="modal_overlay">
      <div className="modal">
        <div>
          <h2 className="titulo_modal">Criar Card</h2>
          <h2 className="descricao_modal">
            Adicione as informações abaixo para criar os cards
          </h2>
        </div>

        {/* Nome da tarefa */}
        <div className="div_inputs_modal">
          <label className="titulo_input">Nome da tarefa</label>
          <input
            className="input_modal"
            type="text"
            placeholder="Título"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        {/* Descrição */}
        <div className="div_inputs_modal">
          <label className="titulo_input">Descrição da tarefa</label>
          <textarea
            className="input_modal_descricao"
            placeholder="Descrição"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* Responsável */}
        <div className="div_inputs_modal">
          <label className="titulo_input">Responsável</label>
          <select
            className="input_modal"
            value={formData.user}
            disabled={users.length === 0}
            onChange={(e) => setFormData({ ...formData, user: e.target.value })}
          >
            {users.map((u) => (
              <option key={u.usuario_id} value={u.usuario_id}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Data de início */}
        <div className="div_inputs_modal">
          <label className="titulo_input">Data de início</label>
          <input
            className="input_modal"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        {/* Prioridade */}
        <div className="div_inputs_modal">
          <label className="titulo_input">Prioridade</label>
          <select
            className="input_modal"
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value as Card["priority"],
              })
            }
          >
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>

        {/* Tipo */}
        <div className="div_inputs_modal">
          <label className="titulo_input">Tipo</label>
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

        {/* Story points */}
        <div className="div_inputs_modal">
          <label className="titulo_input">Story points</label>
          <input
            className="input_modal"
            type="number"
            placeholder="Story Points / Horas"
            value={formData.points}
            onChange={(e) =>
              setFormData({ ...formData, points: e.target.value })
            }
          />
        </div>

        {/* Fase */}
        <div className="div_inputs_modal">
          <label className="titulo_input">Fase</label>
          <select
            className="input_modal"
            value={formData.columnId}
            onChange={(e) =>
              setFormData({ ...formData, columnId: Number(e.target.value) })
            }
          >
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Sprint */}
        <div className="div_inputs_modal">
          <label className="titulo_input">Sprint</label>
          <select
            className="input_modal"
            value={formData.sprintId}
            disabled={sprints.length === 0}
            onChange={(e) =>
              setFormData({ ...formData, sprintId: e.target.value })
            }
          >
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Ações */}
        <div className="modal_actions">
          <button onClick={onClose} className="btn_cancelar">
            Cancelar
          </button>
          <button
            onClick={addCard}
            className="btn_salvar"
            disabled={!formData.sprintId || users.length === 0}
            style={{
              opacity: !formData.sprintId || users.length === 0 ? 0.6 : 1,
              cursor:
                !formData.sprintId || users.length === 0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanbanModal;
