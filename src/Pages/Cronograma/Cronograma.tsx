import "./Cronograma.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import React, { useState, useEffect, type JSX } from "react";

interface Tarefa {
  tarefa_id: string;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  tipo: string;
  data_inicio: string;
  data_entrega: string;
  story_points: number;
  fase_tarefa: string;
  data_criacao: string;
  projeto_id: string;
  responsavel_id: string;
  criador_id: string;
  requisito_id: string | null;
  sprint_id: string;
  sprint_nome: string;
  responsavel_nome: string;
  criador_nome: string;
}

interface ApiResponse {
  success: boolean;
  projeto_id: string;
  total: number;
  tarefas: Tarefa[];
}

const Cronograma = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: string;
    x: number;
    y: number;
  }>({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  // 🔄 BUSCAR TAREFAS DA API
  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        setLoading(true);
        setError(null);

        const projetoId = localStorage.getItem("projeto_id");

        if (!projetoId) {
          throw new Error("ID do projeto não encontrado no localStorage");
        }

        const baseUrl = import.meta.env.VITE_API_URL;

        if (!baseUrl) {
          throw new Error("URL da API não configurada no .env");
        }

        const response = await fetch(`${baseUrl}/tarefas/projeto/${projetoId}`);

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success) {
          setTarefas(data.tarefas);
          console.log(
            `✅ ${data.tarefas.length} tarefas carregadas para o projeto ${projetoId}`
          );
        } else {
          throw new Error("Falha ao buscar tarefas");
        }
      } catch (err) {
        console.error("❌ Erro ao buscar tarefas:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchTarefas();
  }, []);

  const config = {
    cellWidth: 30,
    startDate: new Date("2025-10-01"),
    endDate: new Date("2026-12-31"),
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const calculateDatePosition = (date: string): number => {
    const startTime = config.startDate.getTime();
    const endTime = config.endDate.getTime();
    const dateTime = new Date(date).getTime();

    const totalWidth =
      ((endTime - startTime) / (1000 * 60 * 60 * 24)) * config.cellWidth;
    const position =
      ((dateTime - startTime) / (1000 * 60 * 60 * 24)) * config.cellWidth;

    return Math.max(0, Math.min(position, totalWidth));
  };

  const renderTimelineHeader = (): JSX.Element[] => {
    const headers: JSX.Element[] = [];
    const currentDate = new Date(config.startDate);
    const endDate = new Date(config.endDate);

    while (currentDate <= endDate) {
      const month = currentDate.getMonth();
      const monthName = currentDate.toLocaleString("pt-BR", { month: "long" });
      const year = currentDate.getFullYear();
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

      const days: JSX.Element[] = [];
      for (let day = 1; day <= lastDayOfMonth; day++) {
        days.push(
          <div key={day} className="day-cell">
            {day}
          </div>
        );
      }

      headers.push(
        <div key={`${month}-${year}`} className="month-container">
          <div className="month-name">
            {`${
              monthName.charAt(0).toUpperCase() + monthName.slice(1)
            } ${year}`}
          </div>
          <div className="days-container">{days}</div>
        </div>
      );

      currentDate.setMonth(month + 1);
      currentDate.setDate(1);
    }

    return headers;
  };

  const handleTaskBarHover = (
    tarefa: Tarefa,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const content = `
      <strong>${tarefa.titulo}</strong><br>
      Responsável: ${tarefa.responsavel_nome}<br>
      Fase: ${tarefa.fase_tarefa}<br>
      Status: ${tarefa.status}<br>
      Início: ${formatDate(tarefa.data_inicio)}<br>
      Término: ${formatDate(tarefa.data_entrega)}<br>
      Sprint: ${tarefa.sprint_nome}<br>
      Story Points: ${tarefa.story_points}
    `;

    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      content,
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 160,
    });
  };

  const handleTaskBarLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // 🎯 OBTER CLASSE CSS BASEADA NA FASE_TAREFA
  const getTaskPhaseClass = (faseTarefa: string): string => {
    const phaseMap: { [key: string]: string } = {
      Feito: "task-completed",
      Feita: "task-completed",
      Concluída: "task-completed",
      Concluido: "task-completed",
      Done: "task-completed",
      Executar: "task-in-progress",
      "Em Execução": "task-in-progress",
      "In Progress": "task-in-progress",
      Revisar: "task-review",
      Revisão: "task-review",
      Review: "task-review",
      "Para Fazer": "task-todo",
      "To Do": "task-todo",
      Backlog: "task-backlog",
    };

    return phaseMap[faseTarefa] || "task-backlog";
  };

  // 🎯 RESUMIR TEXTO PARA CABER NA BARRA
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <>
        <NavbarHome />
        <div className="container_conteudos">
          <MenuLateral />
          <div className="container_vertical_conteudos">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando tarefas do cronograma...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarHome />
        <div className="container_conteudos">
          <MenuLateral />
          <div className="container_vertical_conteudos">
            <div className="error-container">
              <div className="error-icon">❌</div>
              <h3>Erro ao carregar cronograma</h3>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="retry-button"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <NavbarHome />
      </div>
      <div className="container_conteudos">
        <MenuLateral />
        <div className="container_vertical_conteudos">
          <div className="cronograma-container">
            <h1>Cronograma do Projeto</h1>

            <div className="gantt-container">
              <div className="tasks-column">
                <div className="tasks-header">Tarefas</div>
                <ul className="task-list">
                  {tarefas.map((tarefa) => (
                    <li key={tarefa.tarefa_id} className="task-item">
                      {tarefa.titulo}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="timeline-column">
                <div className="timeline-header">{renderTimelineHeader()}</div>
                <div className="timeline-body">
                  {tarefas.map((tarefa) => {
                    const startPos = calculateDatePosition(tarefa.data_inicio);
                    const endPos = calculateDatePosition(tarefa.data_entrega);
                    const width = Math.max(10, endPos - startPos);
                    const canShowText = width > 80;

                    return (
                      <div key={tarefa.tarefa_id} className="task-row">
                        <div
                          className={`task-bar ${getTaskPhaseClass(
                            tarefa.fase_tarefa
                          )}`}
                          style={{
                            left: `${startPos}px`,
                            width: `${width}px`,
                          }}
                          onMouseOver={(e) => handleTaskBarHover(tarefa, e)}
                          onMouseLeave={handleTaskBarLeave}
                        >
                          {canShowText &&
                            truncateText(tarefa.sprint_nome + ' - ' + tarefa.titulo, Math.floor(width / 8))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="legend">
              <div className="legend-item">
                <div className="legend-color legend-completed"></div>
                <span>Feito/Concluído</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-in-progress"></div>
                <span>Executar</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-review"></div>
                <span>Revisar</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-todo"></div>
                <span>Para Fazer</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-backlog"></div>
                <span>Backlog</span>
              </div>
            </div>

            <div
              className={`tooltip ${tooltip.visible ? "show" : ""}`}
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
              }}
              dangerouslySetInnerHTML={{ __html: tooltip.content }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Cronograma;
