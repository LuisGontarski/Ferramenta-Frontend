import { useState } from "react";
import "./ProjetosDetalhes.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import imgPerfil from "../../assets/img_perfil.jpeg";

const ProjetosDetalhes = () => {
  return (
    <>
      <div>
        <NavbarHome />
      </div>
      <main className="mainProjetosDetalhes">
        <div className="div_titulo_projeto_detalhes">
            <div className="div_kanban_projeto_detalhes">
                <div>
                    <h1>Projeto 1</h1>
                    <h2>Sistema de gestão de projetos com interface moderna e funcionalidades avançadas</h2>
                </div>
                <button className="btn_kanban">Kanban</button>
            </div>
            <div className="container_informacoes_projeto_detalhes">
                <div className="div_informacoes_projeto_detalhes">
                    <h2>Progresso Geral</h2>
                    <h2>65%</h2>
                    <input type="range" max={10} min={0} value={6} />
                </div>
                <div className="div_informacoes_projeto_detalhes">
                    <h2>Tarefas concluídas</h2>
                    <h2>29</h2>
                    <h2>de 45 tarefas</h2>
                </div>
                <div className="div_informacoes_projeto_detalhes">
                    <h2>Em progresso</h2>
                    <h2>12</h2>
                    <h2>tarefas ativas</h2>
                </div>
                <div className="div_informacoes_projeto_detalhes">
                    <h2>Membros da Equipe</h2>
                    <h2>4</h2>
                    <h2>membros ativos</h2>
                </div>
            </div>
            <div className="div_filtro">
                <h2>Visão geral</h2>
                <h2>Equipe</h2>
            </div>
            <div className="div_informacoes_projeto_detalhes">
                <h2>Informações do Projeto</h2>
                <div className="div_datas_projeto">
                    <h2>Status:</h2>
                    <h2>Em Andamento</h2>
                </div>
                <div className="div_datas_projeto">
                    <h2>Data de Início:</h2>
                    <h2>14/01/2024</h2>
                </div>
                <div className="div_datas_projeto">
                    <h2>Data de Término:</h2>
                    <h2>29/06/2024</h2>
                </div>
                <div className="div_datas_projeto">
                    <h2>Duração:</h2>
                    <h2>5 meses</h2>
                </div>
            </div>
            <div className="div_informacoes_projeto_detalhes">
                <h2>Atividade Recente</h2>
                <div>
                    <h2>João Silva completou a tarefa Implementar autenticação</h2>
                    <h2>2 horas atrás</h2>
                </div>
                <div>
                    <h2>João Silva completou a tarefa Implementar autenticação</h2>
                    <h2>2 horas atrás</h2>
                </div>
                <div>
                    <h2>João Silva completou a tarefa Implementar autenticação</h2>
                    <h2>2 horas atrás</h2>
                </div>
                <div>
                    <h2>João Silva completou a tarefa Implementar autenticação</h2>
                    <h2>2 horas atrás</h2>
                </div>
            </div>
            <div className="div_informacoes_projeto_detalhes">
                <h2>Equipe do projeto</h2>
                <div className="div_equipe_projeto">
                    <div>
                        <img src={imgPerfil} className="imagemEquipe"/>
                    </div>
                    <div className="div_equipe_dados">
                        <div>
                            <h2>João Silva</h2>
                            <h2>Tech Lead</h2>
                        </div>
                        <div className="div_equipe_tarefas">
                            <h2>5 tarefas ativas</h2>
                            <h2>12 concluidas</h2>
                        </div>
                    </div>
                </div>
                <div className="div_equipe_projeto">
                    <div>
                        <img src={imgPerfil} className="imagemEquipe"/>
                    </div>
                    <div className="div_equipe_dados">
                        <div>
                            <h2>João Silva</h2>
                            <h2>Tech Lead</h2>
                        </div>
                        <div className="div_equipe_tarefas">
                            <h2>5 tarefas ativas</h2>
                            <h2>12 concluidas</h2>
                        </div>
                    </div>
                </div>
                <div className="div_equipe_projeto">
                    <div>
                        <img src={imgPerfil} className="imagemEquipe"/>
                    </div>
                    <div className="div_equipe_dados">
                        <div>
                            <h2>João Silva</h2>
                            <h2>Tech Lead</h2>
                        </div>
                        <div className="div_equipe_tarefas">
                            <h2>5 tarefas ativas</h2>
                            <h2>12 concluidas</h2>
                        </div>
                    </div>
                </div>
                <div className="div_equipe_projeto">
                    <div>
                        <img src={imgPerfil} className="imagemEquipe"/>
                    </div>
                    <div className="div_equipe_dados">
                        <div>
                            <h2>João Silva</h2>
                            <h2>Tech Lead</h2>
                        </div>
                        <div className="div_equipe_tarefas">
                            <h2>5 tarefas ativas</h2>
                            <h2>12 concluidas</h2>
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
