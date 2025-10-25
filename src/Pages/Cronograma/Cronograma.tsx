import "./Cronograma.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import React, { useState, useEffect, type JSX } from 'react';


interface Task {
	id: number;
	name: string;
	startDate: string;
	endDate: string;
	status: 'completed' | 'in-progress';
}



const Cronograma = () => {
	const [tasks] = useState<Task[]>([
		{ id: 1, name: "Planejamento Estratégico 2025", startDate: "2025-01-06", endDate: "2025-02-14", status: "completed" },
		{ id: 2, name: "Desenvolvimento do Produto Alpha", startDate: "2025-02-10", endDate: "2025-06-30", status: "completed" },
		{ id: 3, name: "Campanha de Marketing Q1", startDate: "2025-03-01", endDate: "2025-04-15", status: "completed" },
		{ id: 4, name: "Implementação Sistema ERP", startDate: "2025-05-01", endDate: "2025-10-31", status: "in-progress" },
		{ id: 5, name: "Expansão para Novos Mercados", startDate: "2025-07-15", endDate: "2026-02-28", status: "in-progress" },
		{ id: 6, name: "Desenvolvimento do Produto Beta", startDate: "2025-09-01", endDate: "2026-04-30", status: "in-progress" },
		{ id: 7, name: "Otimização de Processos", startDate: "2026-01-10", endDate: "2026-06-15", status: "in-progress" },
		{ id: 8, name: "Preparação para ISO 9001", startDate: "2026-03-01", endDate: "2026-09-30", status: "in-progress" },
		{ id: 9, name: "Planejamento Estratégico 2027", startDate: "2026-10-01", endDate: "2026-12-15", status: "in-progress" }
	]);

	const [tooltip, setTooltip] = useState<{ visible: boolean; content: string; x: number; y: number }>({
		visible: false,
		content: '',
		x: 0,
		y: 0
	});

	const config = {
		cellWidth: 30,
		startDate: new Date("2025-01-01"),
		endDate: new Date("2026-12-31")
	};

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR');
	};

	const calculateDatePosition = (date: string): number => {
		const startTime = config.startDate.getTime();
		const endTime = config.endDate.getTime();
		const dateTime = new Date(date).getTime();

		const totalWidth = (endTime - startTime) / (1000 * 60 * 60 * 24) * config.cellWidth;
		const position = ((dateTime - startTime) / (1000 * 60 * 60 * 24)) * config.cellWidth;

		return Math.max(0, Math.min(position, totalWidth));
	};

	const renderTimelineHeader = (): JSX.Element[] => {
		const headers: JSX.Element[] = [];
		const currentDate = new Date(config.startDate);
		const endDate = new Date(config.endDate);

		while (currentDate <= endDate) {
			const month = currentDate.getMonth();
			const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
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
						{`${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`}
					</div>
					<div className="days-container">
						{days}
					</div>
				</div>
			);

			currentDate.setMonth(month + 1);
			currentDate.setDate(1);
		}

		return headers;
	};

	const handleTaskBarHover = (task: Task, event: React.MouseEvent<HTMLDivElement>) => {
		const statusText = task.status === 'completed' ? 'Concluída' : 'Em Andamento';
		const content = `
      <strong>${task.name}</strong><br>
      Início: ${formatDate(task.startDate)}<br>
      Término: ${formatDate(task.endDate)}<br>
      Status: ${statusText}
    `;

		const rect = event.currentTarget.getBoundingClientRect();
		setTooltip({
			visible: true,
			content,
			x: rect.left + window.scrollX,
			y: rect.top + window.scrollY - 100
		});
	};

	const handleTaskBarLeave = () => {
		setTooltip(prev => ({ ...prev, visible: false }));
	};

	return (
		<>
			<div>
				<NavbarHome />
			</div>
			<div className="container_conteudos">
				<MenuLateral />
				<div className="container_vertical_conteudos">
					<div className="cronograma-container">
						<div className="gantt-container">
							<div className="tasks-column">
								<div className="tasks-header">Tarefas</div>
								<ul className="task-list">
									{tasks.map(task => (
										<li key={task.id} className="task-item">
											{task.name}
										</li>
									))}
								</ul>
							</div>

							<div className="timeline-column">
								<div className="timeline-header">
									{renderTimelineHeader()}
								</div>
								<div className="timeline-body">
									{tasks.map(task => {
										const startPos = calculateDatePosition(task.startDate);
										const endPos = calculateDatePosition(task.endDate);
										const width = Math.max(10, endPos - startPos);

										return (
											<div key={task.id} className="task-row">
												<div
													className={`task-bar ${task.status === 'completed' ? 'task-completed' : 'task-in-progress'}`}
													style={{
														left: `${startPos}px`,
														width: `${width}px`
													}}
													onMouseOver={(e) => handleTaskBarHover(task, e)}
													onMouseLeave={handleTaskBarLeave}
												/>
											</div>
										);
									})}
								</div>
							</div>
						</div>

						<div className="legend">
							<div className="legend-item">
								<div className="legend-color legend-completed"></div>
								<span>Tarefas Concluídas</span>
							</div>
							<div className="legend-item">
								<div className="legend-color legend-in-progress"></div>
								<span>Tarefas em Andamento</span>
							</div>
						</div>

						<div
							className={`tooltip ${tooltip.visible ? 'show' : ''}`}
							style={{
								left: `${tooltip.x}px`,
								top: `${tooltip.y}px`
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