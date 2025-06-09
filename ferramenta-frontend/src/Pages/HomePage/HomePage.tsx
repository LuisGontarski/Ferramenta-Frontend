import "./HomePage.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import img from "../../Assets/pulse.png";
import calendario from "../../Assets/calendar.png";
import { Link } from "react-router-dom";
import desenvolvedor1 from "../../Assets/desenvolvedor1.jpeg";
import desenvolvedor2 from "../../Assets/desenvolvedor2.jpeg";
import desenvolvedor3 from "../../Assets/desenvolvedor3.jpeg";  
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
    const value = 5.5;
const max = 10;

const fillPercent = (value / max) * 100;

const gradientStyle = {
  background: `linear-gradient(to right, #4facfe 0%, #00f2fe ${fillPercent}%, #e0e0e0 ${fillPercent}%)`
};

  const data = [
    { dia: "Seg", commits: 12, issues: 3 },
    { dia: "Ter", commits: 18, issues: 5 },
    { dia: "Qua", commits: 10, issues: 2 },
    { dia: "Qui", commits: 22, issues: 6 },
    { dia: "Sex", commits: 17, issues: 4 },
    { dia: "Sáb", commits: 6, issues: 1 },
    { dia: "Dom", commits: 9, issues: 2 },
  ];

const HomePage = () => {
  return (
    <>
      <div>
        <NavbarHome />
      </div>

      <main className="container_conteudos">
        <div className="menu_lateral">
          <Link to="/">
            <div className="div_menu_lateral">
              <img src={img} className="icone_menu"/>
              <h2 className="nome_nav_menu_lateral">Dashboard</h2>
            </div>
          </Link>
          <Link to="/projetos">
            <div className="div_menu_lateral">
              <i className="fa-regular fa-folder icone_menu"></i>
              <h2 className="nome_nav_menu_lateral">Projetos</h2>
            </div>
          </Link>
          <div className="div_menu_lateral">
            <img src={calendario} className="icone_menu" />
            <h2 className="nome_nav_menu_lateral">Cronograma</h2>
          </div>
        </div>
        <div className="container_vertical_conteudos">
          <div className="container_dashboard">
            <div className="container_metricas_dashboard">
              <div className="card_atualizacoes">
                <h2 className="titulo_metricas_dashboard">Projetos ativos</h2>
                <h2 className="numero_metricas_dashboard">12</h2>
                <h2 className="adicional_metricas_dashboard">+2 desde o mês passado</h2>
              </div>
              <div className="card_atualizacoes">
                <h2 className="titulo_metricas_dashboard">Commits Esta Semana</h2>
                <h2 className="numero_metricas_dashboard">106</h2>
                <h2 className="adicional_metricas_dashboard">+15% desde a semana passada</h2>
              </div>
              <div className="card_atualizacoes">
                <h2 className="titulo_metricas_dashboard">Issues Abertas</h2>
                <h2 className="numero_metricas_dashboard">37</h2>
                <h2 className="adicional_metricas_dashboard">-8 desde ontem</h2>
              </div>
              <div className="card_atualizacoes">
                <h2 className="titulo_metricas_dashboard">Produtividade</h2>
                <h2 className="numero_metricas_dashboard">94%</h2>
                <h2 className="adicional_metricas_dashboard">+5% esta semana</h2>
              </div>
            </div>

            <div className="card_atualizacoes">
              <h2 className="titulo_metricas_dashboard">Atividade Semanal</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="commits" stroke="#8884d8" />
                  <Line type="monotone" dataKey="issues" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card_atualizacoes">
                <h2 className="titulo_projetos">Projetos Recentes</h2>
                <h2 className="descricao_projetos">Você tem 12 projetos ativos no momento.</h2>
                <div className="div_card_dois_projetos_recentes">
                  <div className="div_projetos">
                    <div className="container_projetos">
                      <div className="card_projetos_recentes">
                        <div>
                          <h2 className="texto_projetos">Projeto AllLuga</h2>
                          <h2 className="texto_atualizacao">Sistema completo de alugueis de todos os itens</h2>
                        </div>
                        <div>
                          <div className="div_dois_projetos_recentes">
                            <h2 className="texto_progresso">Progresso</h2>
                            <h2 className="texto_progresso">55%</h2>
                          </div>
                          <input type="range" className="custom-range" max={max} min={0} value={value} style={gradientStyle}/>
                        </div>
                        <h2 className="texto_atualizacao">Atualizado há 2 horas</h2>
                        <button className="btn_entrar_projeto">Acessar projeto</button>
                      </div>
                    </div>
                  </div>
                  <div className="div_projetos">
                    <div className="container_projetos">
                      <div className="card_projetos_recentes">
                        <div>
                          <h2 className="texto_projetos">Projeto AllLuga</h2>
                          <h2 className="texto_atualizacao">Sistema completo de alugueis de todos os itens</h2>
                        </div>
                        <div>
                          <div className="div_dois_projetos_recentes">
                            <h2 className="texto_progresso">Progresso</h2>
                            <h2 className="texto_progresso">55%</h2>
                          </div>
                          <input type="range" className="custom-range" max={max} min={0} value={value} style={gradientStyle}/>
                        </div>
                        <h2 className="texto_atualizacao">Atualizado há 2 horas</h2>
                        <button className="btn_entrar_projeto">Acessar projeto</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="div_card_dois_projetos_recentes">
                  <div className="div_projetos">
                    <div className="container_projetos">
                      <div className="card_projetos_recentes">
                        <div>
                          <h2 className="texto_projetos">Projeto AllLuga</h2>
                          <h2 className="texto_atualizacao">Sistema completo de alugueis de todos os itens</h2>
                        </div>
                        <div>
                          <div className="div_dois_projetos_recentes">
                            <h2 className="texto_progresso">Progresso</h2>
                            <h2 className="texto_progresso">55%</h2>
                          </div>
                          <input type="range" className="custom-range" max={max} min={0} value={value} style={gradientStyle}/>
                        </div>
                        <h2 className="texto_atualizacao">Atualizado há 2 horas</h2>
                        <button className="btn_entrar_projeto">Acessar projeto</button>
                      </div>
                    </div>
                  </div>
                  <div className="div_projetos">
                    <div className="container_projetos">
                      <div className="card_projetos_recentes">
                        <div>
                          <h2 className="texto_projetos">Projeto AllLuga</h2>
                          <h2 className="texto_atualizacao">Sistema completo de alugueis de todos os itens</h2>
                        </div>
                        <div>
                          <div className="div_dois_projetos_recentes">
                            <h2 className="texto_progresso">Progresso</h2>
                            <h2 className="texto_progresso">55%</h2>
                          </div>
                          <input type="range" className="custom-range" max={max} min={0} value={value} style={gradientStyle}/>
                        </div>
                        <h2 className="texto_atualizacao">Atualizado há 2 horas</h2>
                        <button className="btn_entrar_projeto">Acessar projeto</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            <div className="card_atualizacoes">
                <h2 className="titulo_projetos">Atividades Recentes</h2>
                <div className="div_atividades_recentes">
                  <div className="container_projetos">
                    <img src={desenvolvedor1} className="img_atividade_recente"/>
                    <div>
                      <h2 className="texto_projetos">João Silva fez commit em E-commerce Platform</h2>
                      <h2 className="texto_atualizacao">2 horas atrás</h2>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
                <div className="div_atividades_recentes">
                  <div className="container_projetos">
                    <img src={desenvolvedor2} className="img_atividade_recente"/>
                    <div>
                      <h2 className="texto_projetos">Marcos Santos criou uma nova issue em CRM System</h2>
                      <h2 className="texto_atualizacao">4 horas atrás</h2>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
                <div className="div_atividades_recentes">
                  <div className="container_projetos">
                    <img src={desenvolvedor3} className="img_atividade_recente"/>
                    <div>
                      <h2 className="texto_projetos">Pedro Costa concluiu a tarefa Analytics Dashboard</h2>
                      <h2 className="texto_atualizacao">1 dia atrás</h2>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
            </div>
          </div>
        </div>
        
      </main>
    </>
  );
};

export default HomePage;
