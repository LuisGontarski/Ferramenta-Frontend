import "./Cronograma.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { useState } from "react";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
    
const Cronograma = () => {
    // Estado para armazenar as tarefas do projeto
    const [tasks, setTasks] = useState([
        {
            name: "Planejamento",
            start: "2025-01-01",
            end: "2025-01-15",
        },
        {
            name: "Desenvolvimento",
            start: "2025-02-01",
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
            end: "2025-07-15",
        },
    ]);

    // Estado para controlar a adição de novas tarefas
    const [newTask, setNewTask] = useState({
        name: "",
        start: "",
        end: "",
    });

    // Intervalo de datas visível (todo o ano de 2025)
    const dateRange = {
        start: "2025-01-01",
        end: "2025-12-31",
    };

    // Função para adicionar nova tarefa
    const handleAddTask = () => {
        if (newTask.name && newTask.start && newTask.end) {
            // Verifica se a data de início é antes da data de fim
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

    // Calcula o total de dias no período
    const totalDays = (new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24);

    // Função para calcular a posição da barra no gráfico
    const getPosition = (date: string | number | Date) => {
        const daysFromStart = (new Date(date).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24);
        return (daysFromStart / totalDays) * 100;
    };

    // Função para calcular a largura da barra
    const getWidth = (start: string | number | Date, end: string | number | Date) => {
        const startPos = getPosition(start);
        const endPos = getPosition(end);
        return Math.max(endPos - startPos, 1); // Mínimo de 1% de largura
    };

    // Gerar cabeçalho com meses
    const renderHeader = () => {
        const months = [];
        const monthNames = [
            "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
            "Jul", "Ago", "Set", "Out", "Nov", "Dez"
        ];
        
        // Calcula a largura proporcional de cada mês
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
                    <h1>Cronograma do Projeto 2025</h1>
                    
                    {/* Formulário para adicionar novas tarefas */}
                    <div className="add-task-form">
                        <h3>Adicionar Nova Tarefa</h3>
                        <div className="form-group">
                            <label>Nome da Tarefa:</label>
                            <input
                                type="text"
                                value={newTask.name}
                                onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Data Início:</label>
                            <input
                                type="date"
                                value={newTask.start}
                                onChange={(e) => setNewTask({...newTask, start: e.target.value})}
                                min="2025-01-01"
                                max="2025-12-31"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Data Fim:</label>
                            <input
                                type="date"
                                value={newTask.end}
                                onChange={(e) => setNewTask({...newTask, end: e.target.value})}
                                min="2025-01-01"
                                max="2025-12-31"
                                required
                            />
                        </div>
                        <button onClick={handleAddTask}>Adicionar Tarefa</button>
                    </div>
                    
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
        </>
    );
};

export default Cronograma;