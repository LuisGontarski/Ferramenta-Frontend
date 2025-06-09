import { useState } from "react";
import "./ProjetosDetalhes.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import imgPerfil from "../../assets/desenvolvedor1.jpeg";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";

const ProjetosDetalhes = () => {
    const value = 6.5;
    const max = 10;

    const fillPercent = (value / max) * 100;

    const gradientStyle = {
      background: `linear-gradient(to right, #4facfe 0%, #00f2fe ${fillPercent}%, #e0e0e0 ${fillPercent}%)`
    };

  return (
    <>
      <div>
        <NavbarHome />
      </div>
      <main className="container_conteudos">
        <MenuLateral />
        <div className="container_vertical_conteudos">
            <div className="container_dashboard">
                <div className="div_kanban_projeto_detalhes">
                    <div>
                        <h1>Projeto 1</h1>
                        <h2>Sistema de gestão de projetos com interface moderna e funcionalidades avançadas</h2>
                    </div>
                    <button className="btn_kanban">Kanban</button>
                </div>
                <div className="container_informacoes_projeto_detalhes">
                    <div className="div_informacoes_projeto_detalhes">
                        <h2 className="titulo_metricas_detalhes_projetos">Progresso Geral</h2>
                        <h2 className="valor_metricas_detalhes_projetos">65%</h2>
                        <input type="range" className="custom-range" max={max} min={0} value={value} style={gradientStyle}/>
                    </div>
                    <div className="div_informacoes_projeto_detalhes">
                        <h2 className="titulo_metricas_detalhes_projetos">Tarefas concluídas</h2>
                        <h2 className="valor_metricas_detalhes_projetos">29</h2>
                        <h2 className="adicional_metricas_detalhes_projetos">de 45 tarefas</h2>
                    </div>
                    <div className="div_informacoes_projeto_detalhes">
                        <h2 className="titulo_metricas_detalhes_projetos">Em progresso</h2>
                        <h2 className="valor_metricas_detalhes_projetos">12</h2>
                        <h2 className="adicional_metricas_detalhes_projetos">tarefas ativas</h2>
                    </div>
                    <div className="div_informacoes_projeto_detalhes">
                        <h2 className="titulo_metricas_detalhes_projetos">Membros da Equipe</h2>
                        <h2 className="valor_metricas_detalhes_projetos">4</h2>
                        <h2 className="adicional_metricas_detalhes_projetos">membros ativos</h2>
                    </div>
                </div>
                <div className="div_informacoes_projeto_detalhes">
                    <h2 className="titulo_card_projeto_detalhes">Informações do Projeto</h2>
                    <div className="div_datas_projeto">
                        <h2 className="sub_titulo_card_projeto_detalhes">Status:</h2>
                        <h2 className="sub_titulo_card_projeto_detalhes">Em Andamento</h2>
                    </div>
                    <div className="div_datas_projeto">
                        <h2 className="sub_titulo_card_projeto_detalhes">Data de Início:</h2>
                        <h2 className="sub_titulo_card_projeto_detalhes">14/01/2024</h2>
                    </div>
                    <div className="div_datas_projeto">
                        <h2 className="sub_titulo_card_projeto_detalhes">Data de Término:</h2>
                        <h2 className="sub_titulo_card_projeto_detalhes">29/06/2024</h2>
                    </div>
                    <div className="div_datas_projeto">
                        <h2 className="sub_titulo_card_projeto_detalhes">Duração:</h2>
                        <h2 className="sub_titulo_card_projeto_detalhes">5 meses</h2>
                    </div>
                </div>
                <div className="div_informacoes_projeto_detalhes">
                    <h2 className="titulo_card_projeto_detalhes">Atividade Recente</h2>
                    <div className="container_atividade_recente_card">
                        <div>
                            <h2 className="sub_titulo_card_projeto_detalhes">João Silva completou a tarefa Implementar autenticação</h2>
                            <h2 className="adicional_metricas_detalhes_projetos">2 horas atrás</h2>
                        </div>
                        <div>
                            <h2 className="sub_titulo_card_projeto_detalhes">João Silva completou a tarefa Implementar autenticação</h2>
                            <h2 className="adicional_metricas_detalhes_projetos">2 horas atrás</h2>
                        </div>
                        <div>
                            <h2 className="sub_titulo_card_projeto_detalhes">João Silva completou a tarefa Implementar autenticação</h2>
                            <h2 className="adicional_metricas_detalhes_projetos">2 horas atrás</h2>
                        </div>
                        <div>
                            <h2 className="sub_titulo_card_projeto_detalhes">João Silva completou a tarefa Implementar autenticação</h2>
                            <h2 className="adicional_metricas_detalhes_projetos">2 horas atrás</h2>
                        </div>
                    </div>
                </div>
                <div className="div_informacoes_projeto_detalhes">
                    <h2 className="titulo_card_projeto_detalhes">Equipe do projeto</h2>
                    <div className="div_equipe_projeto">
                        <div>
                            <img src={imgPerfil} className="imagemEquipe"/>
                        </div>
                        <div className="div_equipe_dados">
                            <div>
                                <h2 className="sub_titulo_card_projeto_detalhes">João Silva</h2>
                                <h2 className="adicional_metricas_detalhes_projetos">Tech Lead</h2>
                            </div>
                            <div className="div_equipe_tarefas">
                                <h2 className="sub_titulo_card_projeto_detalhes">5 tarefas ativas</h2>
                                <h2 className="sub_titulo_card_projeto_detalhes">12 concluidas</h2>
                            </div>
                        </div>
                    </div>
                    <div className="div_equipe_projeto">
                        <div>
                            <img src={imgPerfil} className="imagemEquipe"/>
                        </div>
                        <div className="div_equipe_dados">
                            <div>
                                <h2 className="sub_titulo_card_projeto_detalhes">João Silva</h2>
                                <h2 className="adicional_metricas_detalhes_projetos">Tech Lead</h2>
                            </div>
                            <div className="div_equipe_tarefas">
                                <h2 className="sub_titulo_card_projeto_detalhes">5 tarefas ativas</h2>
                                <h2 className="sub_titulo_card_projeto_detalhes">12 concluidas</h2>
                            </div>
                        </div>
                    </div>
                    <div className="div_equipe_projeto">
                        <div>
                            <img src={imgPerfil} className="imagemEquipe"/>
                        </div>
                        <div className="div_equipe_dados">
                            <div>
                                <h2 className="sub_titulo_card_projeto_detalhes">João Silva</h2>
                                <h2 className="adicional_metricas_detalhes_projetos">Tech Lead</h2>
                            </div>
                            <div className="div_equipe_tarefas">
                                <h2 className="sub_titulo_card_projeto_detalhes">5 tarefas ativas</h2>
                                <h2 className="sub_titulo_card_projeto_detalhes">12 concluidas</h2>
                            </div>
                        </div>
                    </div>
                    <div className="div_equipe_projeto">
                        <div>
                            <img src={imgPerfil} className="imagemEquipe"/>
                        </div>
                        <div className="div_equipe_dados">
                            <div>
                                <h2 className="sub_titulo_card_projeto_detalhes">João Silva</h2>
                                <h2 className="adicional_metricas_detalhes_projetos">Tech Lead</h2>
                            </div>
                            <div className="div_equipe_tarefas">
                                <h2 className="sub_titulo_card_projeto_detalhes">5 tarefas ativas</h2>
                                <h2 className="sub_titulo_card_projeto_detalhes">12 concluidas</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </>
  );
};

export default ProjetosDetalhes;
