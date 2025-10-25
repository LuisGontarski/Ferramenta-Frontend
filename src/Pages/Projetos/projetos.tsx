import { useState, useEffect } from "react";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import { HiPlus } from "react-icons/hi";
import { LuSearch } from "react-icons/lu";
import { MdAccessTime } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { NavLink } from "react-router-dom";
import { IoIosGitBranch } from "react-icons/io";
import ProjetoModal from "./ProjetoModal";
import "./Projetos.css";

export interface Projeto {
  projeto_id: string;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  atualizadoEm: string;
  total_membros: number;
  branches: number;
  status: string;
}

export const BASE_URL = import.meta.env.VITE_API_URL;

const value = 5.5;
const max = 10;
const fillPercent = (value / max) * 100;
const gradientStyle = {
  background: `linear-gradient(to right, #155DFC ${fillPercent}%, #e0e0e0 ${fillPercent}%)`,
};

const Projetos = () => {
  const categorias = ["Todos", "Ativo", "Concluído", "Arquivado"];
  const cargo = localStorage.getItem("cargo");
  const usuario_id = localStorage.getItem("usuario_id");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true); // Estado de loading

  const [projetos, setProjetos] = useState<Projeto[]>([]);

  // Fetch projetos do backend
  useEffect(() => {
    async function fetchProjetos() {
      if (!usuario_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/projects/user/${usuario_id}`);

        if (!res.ok) {
          throw new Error(
            `Erro na requisição: ${res.status} ${res.statusText}`
          );
        }

        const data = await res.json();

        // Verifica se veio um array
        if (!Array.isArray(data)) {
          console.error("Formato de dados inesperado:", data);
          setProjetos([]);
          return;
        }

        const projetosFormatados = data.map((p: any) => ({
          projeto_id: p.projeto_id,
          titulo: p.nome,
          descricao: p.descricao,
          data_inicio: p.data_inicio,
          data_fim: p.data_fim_prevista,
          atualizadoEm: new Date(
            p.atualizado_em || p.criado_em
          ).toLocaleDateString(),
          total_membros: p.total_membros || 0, // Placeholder
          branches: 0, // Placeholder
          status: p.status || "Ativo",
        }));

        setProjetos(projetosFormatados);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        setProjetos([]); // evita undefined
      } finally {
        setLoading(false); // Para o loading independente do resultado
      }
    }

    fetchProjetos();
  }, [usuario_id]);

  const projetosFiltrados = projetos.filter((projeto) => {
    const nomeCorresponde = projeto.titulo
      .toLowerCase()
      .includes(busca.toLowerCase());
    const categoriaCorresponde =
      categoriaSelecionada === "Todos" ||
      projeto.status.toLowerCase() === categoriaSelecionada.toLowerCase();
    return nomeCorresponde && categoriaCorresponde;
  });

  function abrirModal() {
    const modal = document.getElementById("card_modal");
    const conteudo_modal = document.getElementById("modal_adicionar_projeto");

    if (modal) {
      modal.style.opacity = "1";
      modal.style.pointerEvents = "auto";
      if (conteudo_modal) {
        conteudo_modal.style.opacity = "1";
        conteudo_modal.style.transform = "translateY(0)";
      }
    }
  }

  // Se estiver carregando, mostra o loading
  if (loading) {
    return (
      <>
        <NavbarHome />
        <main className="projetos-container">
          <MenuLateral />
          <div className="projetos-content">
            <div className="projetos-loading-container">
              <div className="projetos-loading-spinner"></div>
              <p className="projetos-loading-text">
                Aguarde enquanto carrega os projetos...
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <NavbarHome />

      <main className="projetos-container">
        <MenuLateral />
        <div className="projetos-content">
          <div className="projetos-main-content">
            <div className="projetos-header">
              <div>
                <h1 className="projetos-title">Projetos</h1>
                <p className="projetos-subtitle">
                  Gerencie todos os seus projetos em um só lugar
                </p>
              </div>

              {cargo === "Product Owner" && (
                <button className="projetos-new-btn" onClick={abrirModal}>
                  <HiPlus size={"14px"} />
                  Novo projeto
                </button>
              )}
            </div>

            <div className="projetos-filters">
              <div className="projetos-search-container">
                <LuSearch className="projetos-search-icon" />
                <input
                  type="text"
                  className="projetos-search-input"
                  placeholder="Pesquise por projetos"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <div className="projetos-categories">
                {categorias.map((categoria) => (
                  <div
                    key={categoria}
                    className={`projetos-category ${
                      categoriaSelecionada === categoria
                        ? "projetos-category-selected"
                        : ""
                    }`}
                    onClick={() => setCategoriaSelecionada(categoria)}
                  >
                    {categoria}
                  </div>
                ))}
              </div>
            </div>

            <div className="projetos-grid">
              {projetosFiltrados.length > 0 ? (
                projetosFiltrados.map((projeto) => (
                  <div key={projeto.projeto_id} className="projetos-card">
                    <div>
                      <h2 className="projetos-card-title">{projeto.titulo}</h2>
                      <p className="projetos-card-description">
                        {projeto.descricao}
                      </p>
                    </div>

                    <div className="projetos-progress-container">
                      <div className="projetos-progress-header">
                        <span className="projetos-progress-label">
                          Progresso
                        </span>
                        <span className="projetos-progress-value">55%</span>
                      </div>
                      <input
                        type="range"
                        className="projetos-progress-bar"
                        max={max}
                        min={0}
                        defaultValue={value}
                        readOnly
                      />
                    </div>

                    <div className="projetos-metadata">
                      <div className="projetos-meta-row">
                        <div className="projetos-meta-item">
                          <MdAccessTime className="projetos-meta-icon" />
                          <span className="projetos-meta-text">
                            {projeto.atualizadoEm}
                          </span>
                        </div>
                        <div className="projetos-meta-item">
                          <GoPeople className="projetos-meta-icon" />
                          <span className="projetos-meta-text">
                            {projeto.total_membros} membros
                          </span>
                        </div>
                      </div>
                      <div className="projetos-meta-row">
                        <div className="projetos-meta-item">
                          <span className="projetos-meta-text">
                            Status: {projeto.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <NavLink
                      to={`/ProjetosDetalhes/${projeto.projeto_id}`}
                      className="projetos-action-btn"
                    >
                      Entrar no Projeto
                    </NavLink>
                  </div>
                ))
              ) : (
                <div className="projetos-empty">Nenhum projeto encontrado.</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal sempre presente */}
      <ProjetoModal />
    </>
  );
};

export default Projetos;
