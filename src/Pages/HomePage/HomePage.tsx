import "./HomePage.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import desenvolvedor1 from "../../Assets/desenvolvedor1.jpeg";
import desenvolvedor2 from "../../Assets/desenvolvedor2.jpeg";
import desenvolvedor3 from "../../Assets/desenvolvedor3.jpeg";
import { FaChevronRight } from "react-icons/fa6";
import { MdAccessTime } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import { NavLink } from "react-router-dom";
const value = 5.5;
const max = 10;
const params = new URLSearchParams(window.location.search);
const accessToken = params.get("access_token");

if (accessToken) {
	localStorage.setItem("access_token", accessToken);
}

const fillPercent = (value / max) * 100;

const gradientStyle = {
	background: `linear-gradient(to right, #155DFC 0%, #155DFC ${fillPercent}%, #e0e0e0 ${fillPercent}%)`
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
				<MenuLateral />
				<div className="container_vertical_conteudos">
					<div className="container_dashboard">
						<div className="container_metricas_dashboard">
							<div className="card_atualizacoes">
								<h2 className="titulo_metricas_dashboard">Projetos ativos</h2>
								<h2 className="numero_metricas_dashboard">12</h2>
								<h2 className="adicional_metricas_dashboard metricas_ganhos">+2 desde o mês passado</h2>
							</div>
							<div className="card_atualizacoes">
								<h2 className="titulo_metricas_dashboard">Commits Esta Semana</h2>
								<h2 className="numero_metricas_dashboard">106</h2>
								<h2 className="adicional_metricas_dashboard metricas_ganhos">+15% desde a semana passada</h2>
							</div>
							<div className="card_atualizacoes">
								<h2 className="titulo_metricas_dashboard">Issues Abertas</h2>
								<h2 className="numero_metricas_dashboard">37</h2>
								<h2 className="adicional_metricas_dashboard">-4 desde ontem</h2>
							</div>
							<div className="card_atualizacoes">
								<h2 className="titulo_metricas_dashboard">Produtividade</h2>
								<h2 className="numero_metricas_dashboard">94%</h2>
								<h2 className="adicional_metricas_dashboard metricas_perdas">-5% esta semana</h2>
							</div>
						</div>

						<div className="card_atualizacoes">
							<h2 className="titulo_grafico_dashboard">Atividade Semanal</h2>
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
									<CartesianGrid stroke="#e5e7eb" strokeOpacity={0.6} strokeDasharray="4 4" />

									<XAxis
										dataKey="dia"
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#6b7280", fontSize: 12 }}
									/>
									<YAxis
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#6b7280", fontSize: 12 }}
									/>

									<Tooltip
										contentStyle={{
											borderRadius: "10px",
											border: "1px solid #e5e7eb",
											boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
											fontSize: "12px"
										}}
									/>
									<Legend wrapperStyle={{ fontSize: "12px", color: "#6b7280" }} />

									<Line
										type="monotone"
										dataKey="commits"
										stroke="#3b82f6"
										strokeWidth={2.5}
										dot={{ r: 5, fill: "#3b82f6" }}
										activeDot={{ r: 7 }}
									/>
									<Line
										type="monotone"
										dataKey="issues"
										stroke="#10b981"
										strokeWidth={2.5}
										dot={{ r: 5, fill: "#10b981" }}
										activeDot={{ r: 7 }}
									/>
								</LineChart>
							</ResponsiveContainer>

						</div>

						<div className="card_atualizacoes">
							<div className="div_titulo_projetos">
								<div>
									<h2 className="titulo_projetos">Projetos Recentes</h2>
									<h2 className="descricao_projetos">Você tem 12 projetos ativos no momento.</h2>
								</div>
								<NavLink to={'/projetos'} className="div_ver_projetos">
									<span className="texto_ver_projetos">Ver todos</span>
									<FaChevronRight color="black" size={'12px'} />
								</NavLink>
							</div>
							<div className="div_card_dois_projetos_recentes">
								<div className="div_projetos">
									<div className="container_projetos">
										<div className="card_projetos_recentes">
											<div>
												<h2 className="texto_projetos">Projeto AllLuga</h2>
												<h2 className="texto_atualizacao">Sistema completo de alugueis de todos os itens</h2>
											</div>
											<div className="div_progresso_projeto">
												<div className="div_dois_projetos_recentes">
													<h2 className="texto_progresso">Progresso</h2>
													<h2 className="texto_progresso">55%</h2>
												</div>
												<input type="range" className="custom-range" max={max} min={0} value={value} style={gradientStyle} />
											</div>
											<div className="div_icones_projetos">
												<div className="div_items_icones">
													<MdAccessTime size={'16px'} color="grey" />
													<h2 className="texto_atualizacao">Atualizado há 2 horas</h2>
												</div>
												<div className="div_items_icones">
													<GoPeople size={'16px'} color="grey" />
													<h2 className="texto_atualizacao">6 membros</h2>
												</div>
											</div>
											<NavLink to={'/ProjetosDetalhes'} className="btn_entrar_projeto">Acessar projeto</NavLink>
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
											<div className="div_progresso_projeto">
												<div className="div_dois_projetos_recentes">
													<h2 className="texto_progresso">Progresso</h2>
													<h2 className="texto_progresso">55%</h2>
												</div>
												<input type="range" className="custom-range" max={max} min={0} value={value} style={gradientStyle} />
											</div>
											<div className="div_icones_projetos">
												<div className="div_items_icones">
													<MdAccessTime size={'16px'} color="grey" />
													<h2 className="texto_atualizacao">Atualizado há 2 horas</h2>
												</div>
												<div className="div_items_icones">
													<GoPeople size={'16px'} color="grey" />
													<h2 className="texto_atualizacao">3 membros</h2>
												</div>
											</div>
											<NavLink to={'/ProjetosDetalhes'} className="btn_entrar_projeto">Acessar projeto</NavLink>
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
											<div className="div_progresso_projeto">
												<div className="div_dois_projetos_recentes">
													<h2 className="texto_progresso">Progresso</h2>
													<h2 className="texto_progresso">55%</h2>
												</div>
												<input type="range" className="custom-range" max={max} min={0} value={value} style={gradientStyle} />
											</div>
											<div className="div_icones_projetos">
												<div className="div_items_icones">
													<MdAccessTime size={'16px'} color="grey" />
													<h2 className="texto_atualizacao">Atualizado há 2 horas</h2>
												</div>
												<div className="div_items_icones">
													<GoPeople size={'16px'} color="grey" />
													<h2 className="texto_atualizacao">7 membros</h2>
												</div>
											</div>
											<NavLink to={'/ProjetosDetalhes'} className="btn_entrar_projeto">Acessar projeto</NavLink>
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
											<div className="div_progresso_projeto">
												<div className="div_dois_projetos_recentes">
													<h2 className="texto_progresso">Progresso</h2>
													<h2 className="texto_progresso">55%</h2>
												</div>
												<input type="range" className="custom-range" max={max} min={0} value={value} style={gradientStyle} />
											</div>
											<div className="div_icones_projetos">
												<div className="div_items_icones">
													<MdAccessTime size={'16px'} color="grey" />
													<h2 className="texto_atualizacao">Atualizado há 2 horas</h2>
												</div>
												<div className="div_items_icones">
													<GoPeople size={'16px'} color="grey" />
													<h2 className="texto_atualizacao">4 membros</h2>
												</div>
											</div>
											<NavLink to={'/ProjetosDetalhes'} className="btn_entrar_projeto">Acessar projeto</NavLink>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="card_atualizacoes">
							<h2 className="titulo_projetos">Atividades Recentes</h2>
							<div className="div_atividades_recentes">
								<div className="container_projetos">
									<img src={desenvolvedor1} className="img_atividade_recente" />
									<div>
										<h2 className="texto_atividade_recente"><span className="responsavel_atividade_recente">João Silva</span> fez commit em <span className="projeto_atividade_recente">E-commerce Platform</span></h2>
										<h2 className="texto_recente_atualizacao">2 horas atrás</h2>
									</div>
								</div>
								<FaChevronRight color="grey" />
							</div>
							<div className="div_atividades_recentes">
								<div className="container_projetos">
									<img src={desenvolvedor2} className="img_atividade_recente" />
									<div>
										<h2 className="texto_atividade_recente"><span className="responsavel_atividade_recente">João Silva</span> fez commit em <span className="projeto_atividade_recente">E-commerce Platform</span></h2>
										<h2 className="texto_recente_atualizacao">2 horas atrás</h2>
									</div>
								</div>
								<FaChevronRight color="grey" />
							</div>
							<div className="div_atividades_recentes">
								<div className="container_projetos">
									<img src={desenvolvedor3} className="img_atividade_recente" />
									<div>
										<h2 className="texto_atividade_recente"><span className="responsavel_atividade_recente">João Silva</span> fez commit em <span className="projeto_atividade_recente">E-commerce Platform</span></h2>
										<h2 className="texto_recente_atualizacao">2 horas atrás</h2>
									</div>
								</div>
								<FaChevronRight color="grey" />
							</div>
						</div>
					</div>
				</div>

			</main>
		</>
	);
};

export default HomePage;
