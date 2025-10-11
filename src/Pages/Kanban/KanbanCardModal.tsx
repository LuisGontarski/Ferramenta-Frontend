import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Card = {
	id: string;
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

type KanbanCardModalProps = {
	card: Card;
	onClose: () => void;
};

type Commit = {
	id: string;
	message: string;
	url: string;
	data_commit: string;
};

const KanbanCardModal = ({ card, onClose }: KanbanCardModalProps) => {
	const navigate = useNavigate();
	const [tempNotes, setTempNotes] = useState(card.notes || "");
	const [loading, setLoading] = useState(false);
	const [commits, setCommits] = useState<Commit[]>([]);
	const [selectedCommit, setSelectedCommit] = useState<string>("");

	const apiUrl = import.meta.env.VITE_API_URL;

	// 🔹 Carrega observação e commits
	useEffect(() => {
		const fetchObservacao = async () => {
			try {
				setLoading(true);

				// Pega o projeto_id do localStorage
				const projetoId = localStorage.getItem("projeto_id");

				const response = await fetch(
					`${apiUrl}/tarefas/${card.id}/${projetoId}/observacao`
				);

				if (!response.ok) throw new Error("Erro ao buscar dados da tarefa");

				const data = await response.json();

				// Atualiza estado com observação e commits
				setTempNotes(data.observacao || "");
				setCommits(data.commits || []);
			} catch (err) {
				console.error("Erro ao carregar observação e commits:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchObservacao();
	}, [card.id, apiUrl]);

	// 🔹 Salva observação
	const saveCardNotes = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${apiUrl}/tarefas/${card.id}/comentario`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					comentario: tempNotes,
					commit_id: selectedCommit, // envia commit selecionado
				}),
			});

			if (!response.ok) throw new Error("Erro ao salvar observação");

			alert("Observação salva com sucesso!");
			onClose();
		} catch (err) {
			console.error(err);
			alert("Erro ao salvar observação!");
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		onClose();
		navigate("/kanban");
	};

	const formatDate = (dateStr: string) => {
		if (!dateStr) return "-";
		const [year, month, day] = dateStr.split("-");
		return `${day}/${month}/${year}`;
	};

	return (
		<div className="modal_overlay">
			<div className="modal">
				<h2>{card.title}</h2>
				{card.priority}
				<div className="div_flex_tarefa">
					<div className="div_titulo_card_tarefa">
						<b>Tipo</b> {card.type}
					</div>
					<div className="div_titulo_card_tarefa">
						<b>Story Points/Horas:</b> {card.points || "-"}
					</div>
				</div>
				<div className="div_flex_tarefa">
					<div className="div_titulo_card_tarefa">
						<b>Responsável</b> {card.user}
					</div>
					<div className="div_titulo_card_tarefa">
						<b>Data:</b> {formatDate(card.date)}
					</div>
				</div>
				<p style={{ whiteSpace: "pre-wrap", display: "flex", flexDirection: "column" }}>
					<b>Descrição</b> 
					{card.description || "-"}
				</p>

				<label>
					<b>Observações</b>
				</label>
				<textarea
					style={{ padding: "10px", borderRadius: "4px", borderColor: "#ccc", fontSize: "14px" }}
					placeholder="Escreva observações aqui…"
					value={tempNotes}
					onChange={(e) => setTempNotes(e.target.value)}
					disabled={loading}
				/>

				<label>Associar a commit</label>
				<select
					value={selectedCommit}
					onChange={(e) => setSelectedCommit(e.target.value)}
					disabled={loading || commits.length === 0}
				>
					<option value="">Selecione um commit</option>
					{commits.map((c) => (
						<option key={c.id} value={c.id}>
							{c.message} ({new Date(c.data_commit).toLocaleDateString()})
						</option>
					))}
				</select>

				<div className="modal_actions">
					<button onClick={saveCardNotes} disabled={loading}>
						{loading ? "Salvando..." : "Salvar"}
					</button>
					<button onClick={handleClose}>Fechar</button>
				</div>
			</div>
		</div>
	);
};

export default KanbanCardModal;
