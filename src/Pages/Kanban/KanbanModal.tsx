import React, { useState, useEffect } from "react";
import "./Kanban.css";
import axios from "axios";
import { toast } from "react-hot-toast";

export type Card = {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  user: string;
  date: string;
  type: "tarefa" | "bug" | "melhoria" | "feature" | "teste";
  points?: string;
  description?: string;
  notes?: string;
  columnId: number;
  sprintId: string;
  projetoId: string;
};

type SprintOption = { id: string; nome: string };
type User = { usuario_id: string; nome: string; email: string };
type Requisito = { requisito_id: string; descricao: string };

type KanbanModalProps = {
  onClose: () => void;
  projeto_id: string;
  sprints: SprintOption[];
  onTarefaCreated?: (novaTarefa: any) => void;
};

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const KanbanModal = ({
  onClose,
  projeto_id,
  sprints,
  onTarefaCreated,
}: KanbanModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    priority: "medium",
    user: "",
    date: "",
    data_entrega: "",
    type: "tarefa",
    points: "",
    description: "",
    notes: "",
    columnId: 0,
    sprintId: sprints.length > 0 ? sprints[0].id : "",
    requisitoId: "",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [requisitos, setRequisitos] = useState<Requisito[]>([]);

  // Buscar usuários do projeto
  useEffect(() => {
    if (!projeto_id) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${baseUrl}/projects/${projeto_id}/users`);
        const lista: User[] = Array.isArray(res.data) ? res.data : [];
        setUsers(lista);
        if (lista.length > 0) {
          setFormData((prev) => ({ ...prev, user: lista[0].usuario_id }));
        }
      } catch (err) {
        console.error("Erro ao buscar usuários do projeto:", err);
      }
    };

    fetchUsers();
  }, [projeto_id]);

  // Buscar requisitos do projeto
  useEffect(() => {
    if (!projeto_id) return;

    const fetchRequisitos = async () => {
      try {
        const res = await axios.get(`${baseUrl}/requisito/list2/${projeto_id}`);
        console.log("Resposta da API de requisitos:", res.data);

        const lista: Requisito[] = Array.isArray(res.data.requisitos)
          ? res.data.requisitos
          : [];
        setRequisitos(lista);

        // Removido: não setar requisitoId aqui
      } catch (err) {
        console.error("Erro ao buscar requisitos:", err);
        setRequisitos([]);
        setFormData((prev) => ({ ...prev, requisitoId: "" }));
      }
    };

    fetchRequisitos();
  }, [projeto_id]);

  const addCard = async () => {
    if (!formData.title.trim()) {
      // ✅ Validação com toast
      toast.error("O título é obrigatório");
      return;
    }
    if (!formData.sprintId) {
      // ✅ Validação com toast
      toast.error("Selecione uma sprint antes de criar a tarefa");
      return;
    }

    try {
      // ✅ Mostrar loading durante a criação
      const loadingToast = toast.loading("Criando tarefa...");

      const res = await axios.post(`${baseUrl}/tarefas`, {
        titulo: formData.title,
        descricao: formData.description,
        status: "Backlog",
        prioridade: formData.priority,
        tipo: formData.type,
        data_inicio: formData.date,
        data_entrega: formData.data_entrega,
        projeto_id: projeto_id,
        responsavel_id: formData.user,
        criador_id: localStorage.getItem("usuario_id"),
        story_points: formData.points,
        fase_tarefa: 0,
        sprint_id: formData.sprintId,
        requisito_id: formData.requisitoId || null,
      });

      if (res.status === 201 || res.status === 200) {
        const novaTarefa = res.data;
        if (onTarefaCreated) onTarefaCreated(novaTarefa);

        // ✅ Substituir loading por sucesso
        toast.success("Tarefa criada com sucesso!", {
          id: loadingToast,
        });

        onClose();
      }
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);

      // ✅ Notificação de erro moderna
      toast.error("Não foi possível criar a tarefa.");
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

        {/* Requisito */}
        <div className="div_inputs_modal">
          <label className="titulo_input">Requisito</label>
          <select
            className="input_modal"
            value={formData.requisitoId}
            onChange={(e) =>
              setFormData({ ...formData, requisitoId: e.target.value })
            }
          >
            <option value="">Não vincular</option>
            {requisitos.map((r) => (
              <option key={r.requisito_id} value={r.requisito_id}>
                {r.descricao.length > 50
                  ? r.descricao.substring(0, 50) + "..."
                  : r.descricao}
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

        {/* Data final prevista */}
        <div className="div_inputs_modal">
          <label className="titulo_input">Data Final Prevista</label>
          <input
            className="input_modal"
            type="date"
            value={formData.data_entrega}
            onChange={(e) =>
              setFormData({ ...formData, data_entrega: e.target.value })
            }
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
            <option value="feature">Feature</option>
            <option value="teste">Teste</option>
            <option value="retrabalho">Retrabalho</option>
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
