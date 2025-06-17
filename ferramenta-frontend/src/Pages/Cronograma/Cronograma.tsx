import "./Cronograma.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { useState } from "react";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";

const Cronograma = () => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const cargo = localStorage.getItem("cargo");

    const abrirModal = () => setMostrarModal(true);
    
    const fecharModal = () => {
        setNewTask({ name: "", start: "", end: "" });
        setMostrarModal(false);
    };


    const [tasks, setTasks] = useState([
        {
            name: "Planejamento",
            start: "2025-01-06",
            end: "2025-02-15",
        },
        {
            name: "Desenvolvimento",
            start: "2025-02-15",
            end: "2025-05-31",
        },
        {
            name: "Testes",
            start: "2025-06-01",
            end: "2025-06-30",
        },
        {
            name: "Implementação",
            start: "2025-07-01",
            end: "2025-07-30",
        },
    ]);

    const [newTask, setNewTask] = useState({
        name: "",
        start: "",
        end: "",
    });

    const dateRange = {
        start: "2025-01-01",
        end: "2025-12-31",
    };

    const handleAddTask = () => {
        if (newTask.name && newTask.start && newTask.end) {
            if (new Date(newTask.start) > new Date(newTask.end)) {
                alert("A data de início deve ser anterior à data de término");
                return;
            }
            
            setTasks([...tasks, newTask]);
            setNewTask({
                name: "",
                start: "",
                end: "",
            });
        } else {
            alert("Preencha todos os campos obrigatórios");
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
                                <button onClick={abrirModal} className="button_adicionar_arquivo">+ Adicionar Data</button>
                            )}
                            
                        </div>
                        
                        {mostrarModal && (
                            <div className="modal_overlay">
                                <div className="modal_conteudo">
                                <h3>Nova Tarefa</h3>
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
                                    min="2025-01-01"
                                    max="2025-12-31"
                                />
                                <input
                                    type="date"
                                    value={newTask.end}
                                    onChange={(e) => setNewTask({ ...newTask, end: e.target.value })}
                                    min="2025-01-01"
                                    max="2025-12-31"
                                />
                                <div className="botoes_form">
                                    <button onClick={handleAddTask}>Adicionar</button>
                                    <button onClick={fecharModal}>Cancelar</button>
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cronograma;