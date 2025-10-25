import "./HomePage.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import { NavLink } from "react-router-dom";
import {
  FaProjectDiagram,
  FaTrello,
  FaCodeBranch,
  FaCalendarAlt,
  FaChartBar,
  FaFileAlt,
  FaTasks,
  FaComments,
  FaHistory,
  FaRocket,
  FaUsers,
  FaSync,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaRegCheckCircle,
} from "react-icons/fa";

const HomePage = () => {
  const features = [
    {
      icon: <FaProjectDiagram className="homepage-feature-icon" />,
      title: "Criação de Projetos",
      description:
        "Organize e gerencie múltiplos projetos com equipes, prazos e metas bem definidas.",
      color: "#1D4ED8",
    },
    {
      icon: <FaTrello className="homepage-feature-icon" />,
      title: "Kanban Integrado",
      description:
        "Fluxo visual intuitivo com boards personalizáveis para acompanhar todo o progresso.",
      color: "#059669",
    },
    {
      icon: <FaCodeBranch className="homepage-feature-icon" />,
      title: "Integração com GitHub",
      description:
        "Sincronização automática com repositórios Git e acompanhamento em tempo real.",
      color: "#7C3AED",
    },
    {
      icon: <FaCalendarAlt className="homepage-feature-icon" />,
      title: "Cronograma Inteligente",
      description:
        "Planejamento visual com datas, dependências e milestones do projeto.",
      color: "#DC2626",
    },
    {
      icon: <FaChartBar className="homepage-feature-icon" />,
      title: "Relatórios Detalhados",
      description:
        "Gere insights valiosos com relatórios personalizados de performance.",
      color: "#D97706",
    },
    {
      icon: <FaFileAlt className="homepage-feature-icon" />,
      title: "Documentação Centralizada",
      description:
        "Armazene e version toda a documentação do projeto em um só lugar.",
      color: "#DB2777",
    },
    {
      icon: <FaTasks className="homepage-feature-icon" />,
      title: "Gestão de Requisitos",
      description:
        "Organize requisitos funcionais e não funcionais com rastreabilidade.",
      color: "#0891B2",
    },
    {
      icon: <FaComments className="homepage-feature-icon" />,
      title: "Chat em Tempo Real",
      description:
        "Comunicação instantânea com sua equipe através de chat integrado.",
      color: "#65A30D",
    },
    {
      icon: <FaHistory className="homepage-feature-icon" />,
      title: "Histórico Completo",
      description:
        "Acompanhe todo histórico de alterações e evolução do projeto.",
      color: "#475569",
    },
  ];

  const benefits = [
    "Aumente a produtividade da equipe",
    "Visualize suas tarefas com clareza",
    "Melhore a visibilidade do progresso dos projetos",
    "Centralize toda a comunicação do time",
  ];

  return (
    <>
      <div>
        <NavbarHome />
      </div>

      <main className="homepage-container">
        <MenuLateral />
        <div className="homepage-content">
          {/* Hero Section */}
          <section className="homepage-hero-section">
            <div className="homepage-hero-content">
              <div className="homepage-hero-text">
                <div className="homepage-hero-badge">
                  <FaCheckCircle className="homepage-badge-icon" />
                  Plataforma All-in-One para Gestão de Projetos
                </div>
                <h1 className="homepage-hero-title">
                  Gerencie projetos com
                  <span className="homepage-highlight"> eficiência</span> e
                  <span className="homepage-highlight"> colaboração</span>
                </h1>
                <p className="homepage-hero-description">
                  Una sua equipe, ferramentas e processos em uma plataforma
                  integrada. Do planejamento à entrega, temos tudo que você
                  precisa para o sucesso do seu projeto.
                </p>

                <div className="homepage-benefits-list">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="homepage-benefit-item">
                      <FaCheckCircle className="homepage-benefit-icon" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="homepage-hero-actions">
                  <NavLink
                    to="/projetos"
                    className="homepage-btn homepage-btn-primary"
                  >
                    <FaRocket className="homepage-btn-icon" />
                    Começar Agora
                    <FaArrowRight className="homepage-btn-arrow" />
                  </NavLink>
                </div>
              </div>

              <div className="homepage-hero-visual">
                <div className="homepage-hero-cards">
                  <div className="homepage-hero-card homepage-card-1">
                    <FaTrello className="homepage-card-icon" />
                    <span>Quadro Kanban</span>
                  </div>
                  <div className="homepage-hero-card homepage-card-2">
                    <FaCodeBranch className="homepage-card-icon" />
                    <span>Integração com Git</span>
                  </div>
                  <div className="homepage-hero-card homepage-card-3">
                    <FaChartBar className="homepage-card-icon" />
                    <span>Métricas</span>
                  </div>
                  <div className="homepage-hero-card homepage-card-4">
                    <FaComments className="homepage-card-icon" />
                    <span>Chat em tempo real</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="homepage-features-section">
            <div className="homepage-section-header">
              <h2 className="homepage-section-title">
                Tudo que sua equipe precisa em um só lugar
              </h2>
              <p className="homepage-section-description">
                Integre todas as ferramentas do seu fluxo de trabalho e aumente
                a produtividade da equipe
              </p>
            </div>

            <div className="homepage-features-grid">
              {features.map((feature, index) => (
                <div key={index} className="homepage-feature-card">
                  <div
                    className="homepage-feature-icon-container"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <div
                      className="homepage-feature-icon-wrapper"
                      style={{ color: feature.color }}
                    >
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="homepage-feature-title">{feature.title}</h3>
                  <p className="homepage-feature-description">
                    {feature.description}
                  </p>
                  <div className="homepage-feature-link">
                    <FaRegCheckCircle className="homepage-feature-arrow" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default HomePage;
