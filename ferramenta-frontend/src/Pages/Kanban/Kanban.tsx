import "./Kanban.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { useEffect, useState } from "react";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";

const Kanban = () => {
    const [showModal, setShowModal] = useState(false);
    const [cards, setCards] = useState([
        {
            title: "Implementar autenticação",
            priority: "high",
            user: "João",
            date: "01/10/2023"
        }
    ]);
    const [formData, setFormData] = useState({
        title: "",
        priority: "medium",
        user: "",
        date: ""
    });

    useEffect(() => {
        const draggableCards = document.querySelectorAll('.kanban_card');
        const columns = document.querySelectorAll('.kanban_cards');

        draggableCards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                if (e.currentTarget) {
                    (e.currentTarget as HTMLElement).classList.add('dragging');
                }
            });

            card.addEventListener('dragend', (e) => {
                if (e.currentTarget) {
                    (e.currentTarget as HTMLElement).classList.remove('dragging');
                }
            });
        });

        columns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (e.currentTarget) {
                    (e.currentTarget as HTMLElement).classList.add('cards_hover');
                }
            });

            column.addEventListener('dragleave', (e) => {
                if (e.currentTarget) {
                    (e.currentTarget as HTMLElement).classList.remove('cards_hover');
                }
            });

            column.addEventListener('drop', (e) => {
                (e.currentTarget as HTMLElement).classList.remove('cards_hover');
                const draggingCard = document.querySelector('.kanban_card.dragging');
                if (draggingCard && e.currentTarget instanceof HTMLElement) {
                    e.currentTarget.appendChild(draggingCard as HTMLElement);
                }
            })
        });

        return () => {
            draggableCards.forEach(card => {
                card.removeEventListener('dragstart', () => {});
                card.removeEventListener('dragend', () => {});
            });

            columns.forEach(column => {
                column.removeEventListener('dragover', () => {});
                column.removeEventListener('dragleave', () => {});
            });
        };
    }, [cards]);

    const addCard = () => {
        setCards(prev => [...prev, formData]);
        setFormData({ title: "", priority: "medium", user: "", date: "" });
        setShowModal(false);
    };

    return (
        <>
            <div>
                <NavbarHome />
            </div>
            <div className="container_conteudos">
                <MenuLateral />
                <div className="container_vertical_conteudos">
                    <div className="kanban_container">
                    <button onClick={() => setShowModal(true)} className="add_card_button">
                        + Novo Card
                    </button>

                    <div className="kanban">
                        <div className="kanban_column" data-id="1">
                            <div className="kanban_title">
                                <h2>To Do</h2>
                            </div>
                            <div className="kanban_cards">
                                {cards.map((card, index) => (
                                    <div key={index} className="kanban_card" draggable="true">
                                        <div className={`badge ${card.priority}`}>
                                            <span>{card.priority === "high" ? "Alta" : card.priority === "medium" ? "Média" : "Baixa"}</span>
                                        </div>
                                        <p className="card_title">{card.title}</p>
                                        <div className="card_infos">
                                            <span className="card_user">Usuário: {card.user}</span>
                                            <span className="card_date">Data: {card.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="kanban_column" data-id="2">
                            <div className="kanban_title"><h2>Fazendo</h2></div>
                            <div className="kanban_cards"></div>
                        </div>

                        <div className="kanban_column" data-id="3">
                            <div className="kanban_title"><h2>Finalizado</h2></div>
                            <div className="kanban_cards"></div>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {showModal && (
                <div className="modal_overlay">
                    <div className="modal">
                        <h2>Novo Card</h2>
                        <input
                            type="text"
                            placeholder="Título"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Usuário"
                            value={formData.user}
                            onChange={e => setFormData({ ...formData, user: e.target.value })}
                        />
                        <input
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                        <select
                            value={formData.priority}
                            onChange={e => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="high">Alta</option>
                            <option value="medium">Média</option>
                            <option value="low">Baixa</option>
                        </select>
                        <div className="modal_actions">
                            <button onClick={addCard}>Criar</button>
                            <button onClick={() => setShowModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Kanban;
