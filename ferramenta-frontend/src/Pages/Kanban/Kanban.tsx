import "./Kanban.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { useEffect } from "react";

const Kanban = () => {

    useEffect(() => {
        const cards = document.querySelectorAll('.kanban_card');
        const columns = document.querySelectorAll('.kanban_cards');

        cards.forEach(card => {
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

        // Limpeza (boas práticas)
        return () => {
            cards.forEach(card => {
                card.removeEventListener('dragstart', () => {});
                card.removeEventListener('dragend', () => {});
            });

            columns.forEach(column => {
                column.removeEventListener('dragover', () => {});
                column.removeEventListener('dragleave', () => {});
            });
        };

    }, []);  // Executa apenas uma vez após montar o componente

    return (
        <>
            <div>
                <NavbarHome />
                <div className="kanban_container">
                    <div className="kanban">
                        <div className="kanban_column" data-id="1">
                            <div className="kanban_title">
                                <h2>To Do</h2>
                            </div>
                            <div className="kanban_cards">
                                <div className="kanban_card" draggable="true">
                                    <div className="badge high">
                                        <span>Alta</span>
                                    </div>
                                    <p className="card_title">
                                        Implementar autenticação
                                    </p>
                                    <div className="card_infos">
                                        <span className="card_user">Usuário: João</span>
                                        <span className="card_date">Data: 01/10/2023</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="kanban_column" data-id="2">
                            <div className="kanban_title">
                                <h2>Fazendo</h2>
                            </div>
                            <div className="kanban_cards">
                                <div className="kanban_card" draggable="true">
                                    <div className="badge medium">
                                        <span>Alta</span>
                                    </div>
                                    <p className="card_title">
                                        Implementar autenticação
                                    </p>
                                    <div className="card_infos">
                                        <span className="card_user">Usuário: João</span>
                                        <span className="card_date">Data: 01/10/2023</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="kanban_column" data-id="3">
                            <div className="kanban_title">
                                <h2>Finalizado</h2>
                            </div>
                            <div className="kanban_cards">
                                <div className="kanban_card" draggable="true">
                                    <div className="badge low">
                                        <span>Alta</span>
                                    </div>
                                    <p className="card_title">
                                        Implementar autenticação
                                    </p>
                                    <div className="card_infos">
                                        <span className="card_user">Usuário: João</span>
                                        <span className="card_date">Data: 01/10/2023</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Kanban;
