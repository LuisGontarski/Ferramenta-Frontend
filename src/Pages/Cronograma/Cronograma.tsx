import "./Cronograma.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { useState, useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import { HiPlus } from "react-icons/hi";

const Cronograma = () => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalFeriado, setMostrarModalFeriado] = useState(false);
    const [mostrarModalSprint, setMostrarModalSprint] = useState(false);
    const cargo = localStorage.getItem("cargo");

    const abrirModal = () => setMostrarModal(true);
    const abrirModalFeriado = () => setMostrarModalFeriado(true);
    const abrirModalSprint = () => setMostrarModalSprint(true);

    const handleDeleteTask = (taskIndex: number) => {
        if (window.confirm("Tem certeza que deseja excluir esta tarefa do cronograma?")) {
            const updatedSprints = sprints.map(sprint => {
                if (sprint.id === currentSprintId) {
                    return {
                        ...sprint,
                        tasks: sprint.tasks.filter((_, index) => index !== taskIndex)
                    };
                }
                return sprint;
            });
            setSprints(updatedSprints);
        }
    };


    const fecharModal = () => {
        setNewTask({ name: "", start: "", end: "" });
        setMostrarModal(false);
    };

    const fecharModalFeriado = () => {
        setNewHoliday({ name: "", date: "" });
        setMostrarModalFeriado(false);
    };

    const fecharModalSprint = () => {
        setNewSprint({ name: "" });
        setMostrarModalSprint(false);
    };

    // Estado para gerenciar múltiplos cronogramas (sprints)
    const [sprints, setSprints] = useState([
        {
            id: 1,
            name: "Sprint 1",
            tasks: [
                {
                    name: "Planejamento",
                    start: "2025-01-06",
                    end: "2025-01-20",
                },
                {
                    name: "Desenvolvimento",
                    start: "2025-01-21",
                    end: "2025-02-10",
                },
                {
                    name: "Testes",
                    start: "2025-02-11",
                    end: "2025-02-17",
                },
            ],
            holidays: [
                { name: "Ano Novo", date: "2025-01-01" },
            ]
        },
        {
            id: 2,
            name: "Sprint 2",
            tasks: [
                {
                    name: "Planejamento",
                    start: "2025-02-18",
                    end: "2025-02-25",
                },
                {
                    name: "Desenvolvimento",
                    start: "2025-02-26",
                    end: "2025-03-20",
                },
                {
                    name: "Testes",
                    start: "2025-03-21",
                    end: "2025-03-28",
                },
            ],
            holidays: [
                { name: "Carnaval", date: "2025-03-04" },
            ]
        },
        {
            id: 3,
            name: "Sprint 3",
            tasks: [
                {
                    name: "Planejamento",
                    start: "2025-03-29",
                    end: "2025-04-05",
                },
                {
                    name: "Desenvolvimento",
                    start: "2025-04-06",
                    end: "2025-04-30",
                },
                {
                    name: "Testes",
                    start: "2025-05-01",
                    end: "2025-05-07",
                },
            ],
            holidays: [
                { name: "Sexta-feira Santa", date: "2025-04-18" },
                { name: "Tiradentes", date: "2025-04-21" },
                { name: "Dia do Trabalho", date: "2025-05-01" },
            ]
        }
    ]);

    const [currentSprintId, setCurrentSprintId] = useState(1);

    // Estado para nova sprint
    const [newSprint, setNewSprint] = useState({
        name: "",
    });

    // Estado para nova tarefa
    const [newTask, setNewTask] = useState({
        name: "",
        start: "",
        end: "",
    });

    // Estado para novo feriado
    const [newHoliday, setNewHoliday] = useState({
        name: "",
        date: "",
    });

    // Obter a sprint atual
    const currentSprint = sprints.find(sprint => sprint.id === currentSprintId) || sprints[0];
    const tasks = currentSprint.tasks;
    const holidays = currentSprint.holidays;

    // Função para calcular dias úteis (excluindo finais de semana e feriados)
    const calcularDiasUteis = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let count = 0;

        // Converter feriados para objetos Date para comparação
        const feriadosDates = holidays.map(holiday => new Date(holiday.date).toDateString());

        const current = new Date(start);
        while (current <= end) {
            // Verificar se não é fim de semana (sábado = 6, domingo = 0)
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                // Verificar se não é feriado
                if (!feriadosDates.includes(current.toDateString())) {
                    count++;
                }
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
    };

    // Função para calcular dias totais
    const calcularDiasTotais = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o dia final
    };

    // Definir o intervalo de datas baseado nas tarefas da sprint atual
    const getDateRange = () => {
        if (tasks.length === 0) {
            return { start: "2025-01-01", end: "2025-12-31" };
        }

        let startDate = new Date(tasks[0].start);
        let endDate = new Date(tasks[0].end);

        tasks.forEach(task => {
            const taskStart = new Date(task.start);
            const taskEnd = new Date(task.end);

            if (taskStart < startDate) startDate = taskStart;
            if (taskEnd > endDate) endDate = taskEnd;
        });

        // Adicionar uma margem de 15 dias antes e depois
        startDate.setDate(startDate.getDate() - 15);
        endDate.setDate(endDate.getDate() + 15);

        return {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
        };
    };

    const dateRange = getDateRange();

    const handleAddTask = () => {
        if (newTask.name && newTask.start && newTask.end) {
            if (new Date(newTask.start) > new Date(newTask.end)) {
                alert("A data de início deve ser anterior à data de término");
                return;
            }

            const updatedSprints = sprints.map(sprint => {
                if (sprint.id === currentSprintId) {
                    return {
                        ...sprint,
                        tasks: [...sprint.tasks, newTask]
                    };
                }
                return sprint;
            });

            setSprints(updatedSprints);
            setNewTask({
                name: "",
                start: "",
                end: "",
            });
            fecharModal();
        } else {
            alert("Preencha todos os campos obrigatórios");
        }
    };

    const handleAddHoliday = () => {
        if (newHoliday.name && newHoliday.date) {
            const updatedSprints = sprints.map(sprint => {
                if (sprint.id === currentSprintId) {
                    return {
                        ...sprint,
                        holidays: [...sprint.holidays, newHoliday]
                    };
                }
                return sprint;
            });

            setSprints(updatedSprints);
            setNewHoliday({
                name: "",
                date: "",
            });
            fecharModalFeriado();
        } else {
            alert("Preencha todos os campos obrigatórios");
        }
    };

    const handleAddSprint = () => {
        if (newSprint.name) {
            const newSprintId = Math.max(...sprints.map(s => s.id), 0) + 1;
            const newSprintObj = {
                id: newSprintId,
                name: newSprint.name,
                tasks: [],
                holidays: []
            };

            setSprints([...sprints, newSprintObj]);
            setCurrentSprintId(newSprintId);
            setNewSprint({ name: "" });
            fecharModalSprint();
        } else {
            alert("Preencha o nome da sprint");
        }
    };

    const handleDeleteSprint = (sprintId: number) => {
        if (sprints.length <= 1) {
            alert("Não é possível excluir a única sprint existente");
            return;
        }

        if (window.confirm("Tem certeza que deseja excluir esta sprint?")) {
            const updatedSprints = sprints.filter(sprint => sprint.id !== sprintId);
            setSprints(updatedSprints);

            // Se a sprint atual foi excluída, selecione a primeira sprint disponível
            if (currentSprintId === sprintId) {
                setCurrentSprintId(updatedSprints[0].id);
            }
        }
    };

    const totalDays = (new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24);

    const getPosition = (date: string | number | Date) => {
        const daysFromStart = (new Date(date).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24);
        return (daysFromStart / totalDays) * 100;
    };

    const getWidth = (start: string | number | Date, end: string | number | Date) => {
        const startPos = getPosition(start);
        const endPos = getPosition(end);
        return Math.max(endPos - startPos, 1);
    };

    // Função para determinar em qual fase um feriado ocorre
    const getHolidayPhase = (holidayDate: string) => {
        const date = new Date(holidayDate);

        for (const task of tasks) {
            const start = new Date(task.start);
            const end = new Date(task.end);

            if (date >= start && date <= end) {
                return task.name;
            }
        }

        return "Fora do cronograma";
    };

    const renderHeader = () => {
        const months = [];
        const monthNames = [
            "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
            "Jul", "Ago", "Set", "Out", "Nov", "Dez"
        ];

        const monthWidths: any[] = [];
        let currentDate = new Date(dateRange.start);

        for (let i = 0; i < 12; i++) {
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const daysInMonth = (new Date(nextMonth).getTime() - new Date(currentDate).getTime()) / (1000 * 60 * 60 * 24);
            monthWidths.push((daysInMonth / totalDays) * 100);
            currentDate = nextMonth;
        }

        return (
            <div className="gantt-header">
                <div className="gantt-header-task-name">Tarefa</div>
                <div className="gantt-header-months">
                    {monthNames.map((month, index) => (
                        <div
                            key={index}
                            className="gantt-header-month"
                            style={{ width: `${monthWidths[index]}%` }}
                        >
                            {month}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <div>
                <NavbarHome />
            </div>
            <div className="container_conteudos">
                <MenuLateral />
                <div className="container_vertical_conteudos">
                    <div className="card_cronograma">
                        <div className="div_titulo_requisitos">
                            <div className="div_titulo_documentos">
                                <h2 className="titulo_documentos">Cronograma do Projeto</h2>
                                <h2 className="subtitulo_documentos">Planejamento das etapas e prazos do projeto.</h2>
                            </div>
                            {cargo === "Scrum Master" && (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select
                                        id="sprint-select"
                                        className="select_sprint"
                                        value={currentSprintId}
                                        onChange={(e) => setCurrentSprintId(Number(e.target.value))}
                                    >
                                        {sprints.map(sprint => (
                                            <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                                        ))}
                                    </select>
                                    <button onClick={abrirModalSprint} className="button_adicionar_arquivo"><HiPlus size={"14px"} /> Nova Sprint</button>
                                    {cargo === "Scrum Master" && sprints.length > 1 && (
                                        <button
                                            onClick={() => handleDeleteSprint(currentSprintId)}
                                            style={{
                                                backgroundColor: "#fc1515",
                                                color: "white",
                                                fontWeight: 500,
                                                fontSize: "14px",
                                                border: "none",
                                                padding: "0.6rem",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: "0.8rem",
                                                alignItems: "center",
                                                boxShadow: "0 2px 4px 0 rgb(0 0 0 / 0.05)"
                                            }}
                                        > <FaRegTrashAlt size={"14px"} /> Excluir Sprint
                                        </button>
                                    )}
                                    <button onClick={abrirModal} className="button_adicionar_arquivo"><HiPlus size={"14px"} /> Adicionar Fase</button>
                                    <button onClick={abrirModalFeriado} className="button_adicionar_arquivo"><HiPlus size={"14px"} /> Adicionar Feriado</button>
                                </div>
                            )}
                        </div>

                        {mostrarModal && (
                            <div className={`modal_overlay_cronograma ${mostrarModal ? "ativo" : ""}`}>
                                <div className="modal_conteudo_cronograma">
                                    <h3>Nova Tarefa para {currentSprint.name}</h3>
                                    <input
                                        type="text"
                                        placeholder="Nome da tarefa"
                                        value={newTask.name}
                                        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                                    />
                                    <input
                                        type="date"
                                        value={newTask.start}
                                        onChange={(e) => setNewTask({ ...newTask, start: e.target.value })}

                                    />
                                    <input
                                        type="date"
                                        value={newTask.end}
                                        onChange={(e) => setNewTask({ ...newTask, end: e.target.value })}

                                    />
                                    <div className="botoes_form">
                                        <button onClick={handleAddTask}>Adicionar</button>
                                        <button onClick={fecharModal}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {mostrarModalFeriado && (
                            <div className={`modal_overlay_cronograma ${mostrarModalFeriado ? "ativo" : ""}`}>
                                <div className="modal_conteudo_cronograma">
                                    <h3>Novo Feriado para {currentSprint.name}</h3>
                                    <input
                                        type="text"
                                        placeholder="Nome do feriado"
                                        value={newHoliday.name}
                                        onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                                    />
                                    <input
                                        type="date"
                                        value={newHoliday.date}
                                        onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}

                                    />
                                    <div className="botoes_form">
                                        <button onClick={handleAddHoliday}>Adicionar</button>
                                        <button onClick={fecharModalFeriado}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {mostrarModalSprint && (
                            <div className={`modal_overlay_cronograma ${mostrarModalSprint ? "ativo" : ""}`}>
                                <div className="modal_conteudo">
                                    <h3>Nova Sprint</h3>
                                    <input
                                        type="text"
                                        placeholder="Nome da sprint"
                                        value={newSprint.name}
                                        onChange={(e) => setNewSprint({ name: e.target.value })}
                                    />
                                    <div className="botoes_form">
                                        <button onClick={handleAddSprint}>Adicionar</button>
                                        <button onClick={fecharModalSprint}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {mostrarModalSprint && (
                            <div className={`modal_overlay_cronograma ${mostrarModalSprint ? "ativo" : ""}`}>
                                <div className="modal_conteudo_cronograma">
                                    <h3>Nova Sprint</h3>
                                    <input
                                        type="text"
                                        placeholder="Nome da sprint"
                                        value={newSprint.name}
                                        onChange={(e) => setNewSprint({ name: e.target.value })}
                                    />
                                    <div className="botoes_form">
                                        <button onClick={handleAddSprint}>Adicionar</button>
                                        <button onClick={fecharModalSprint}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Diagrama de Gantt */}
                        <div className="gantt-container">
                            {renderHeader()}
                            <div className="gantt-body">
                                {tasks.map((task, index) => (
                                    <div key={index} className="gantt-row">
                                        <div className="gantt-task-name">{task.name}</div>
                                        <div className="gantt-bars-container">
                                            <div
                                                className="gantt-bar"
                                                style={{
                                                    left: `${getPosition(task.start)}%`,
                                                    width: `${getWidth(task.start, task.end)}%`,
                                                }}
                                            >
                                                <div className="gantt-bar-label">
                                                    {task.name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tabela de Dias de Trabalho por Fase */}
                        <div style={{ marginTop: '30px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '500' }}>Dias de Trabalho por Fase</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Fase</th>
                                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Dias Totais</th>
                                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Dias Úteis</th>
                                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Feriados na Fase</th>
                                        {cargo === "Scrum Master" && (
                                            <th style={{ padding: '10px', border: '1px solid #ddd', width: '90px' }}>Ações</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task, index) => {
                                        const diasTotais = calcularDiasTotais(task.start, task.end);
                                        const diasUteis = calcularDiasUteis(task.start, task.end);
                                        const feriadosNaFase = holidays.filter(
                                            holiday => getHolidayPhase(holiday.date) === task.name
                                        ).length;

                                        return (
                                            <tr key={index}>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{task.name}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{diasTotais}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{diasUteis}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{feriadosNaFase}</td>
                                                {cargo === "Scrum Master" && (
                                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                        <button
                                                            onClick={() => handleDeleteTask(index)}
                                                            style={{
                                                                backgroundColor: "#fc1515",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: "4px",
                                                                padding: "5px 10px",
                                                                cursor: "pointer",
                                                                width: '100%',
                                                            }}
                                                        >
                                                            Excluir
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}

                                    <tr style={{ fontWeight: 'bold' }}>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>TOTAL</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                            {tasks.reduce((total, task) => total + calcularDiasTotais(task.start, task.end), 0)}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                            {tasks.reduce((total, task) => total + calcularDiasUteis(task.start, task.end), 0)}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                            {holidays.length}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Tabela de Feriados */}
                        <div style={{ marginTop: '30px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '500' }}>Feriados Cadastrados</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Data</th>
                                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Nome do Feriado</th>
                                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Fase do Projeto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {holidays.map((holiday, index) => (
                                        <tr key={index}>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                {new Date(holiday.date).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                {holiday.name}
                                            </td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                {getHolidayPhase(holiday.date)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Cronograma;