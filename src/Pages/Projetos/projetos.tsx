import { useState, useEffect } from "react";
import "./projetos.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import { HiPlus } from "react-icons/hi";
import { LuSearch } from "react-icons/lu";
import { MdAccessTime } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { NavLink } from "react-router-dom";
import { IoIosGitBranch } from "react-icons/io";
import ProjetoModal from "./ProjetoModal";

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

  const [projetos, setProjetos] = useState<Projeto[]>([]);

  // Fetch projetos do backend
  useEffect(() => {
    async function fetchProjetos() {
      if (!usuario_id) return;

      try {
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

  return (
    <>
      <NavbarHome />

      <main className="container_conteudos">
        <MenuLateral />
        <div className="container_vertical_conteudos">
          <div className="container_conteudo_projetos">
            <div className="div_titulo_pagina_projetos">
              <div>
                <h1 className="titulo_projetos">Projetos</h1>
                <p className="descricao_titulo_projetos">
                  Gerencie todos os seus projetos em um só lugar
                </p>
              </div>

              {cargo === "Product Owner" && (
                <button className="btn_novo_projeto" onClick={abrirModal}>
                  <HiPlus size={"14px"} />
                  Novo projeto
                </button>
              )}
            </div>

            <div className="div_titulo_projetos">
              <div className="div_input_icone_projetos">
                <LuSearch className="icone_busca_input" />
                <input
                  type="text"
                  className="input_pesquisa_projetos"
                  placeholder="Pesquise por projetos"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <div className="divCategorias">
                {categorias.map((categoria) => (
                  <h2
                    key={categoria}
                    className={`texto_projetos_categoria ${
                      categoriaSelecionada === categoria
                        ? "categoria_projetos_selecionada"
                        : ""
                    }`}
                    onClick={() => setCategoriaSelecionada(categoria)}
                  >
                    {categoria}
                  </h2>
                ))}
              </div>
            </div>

            <div className="container_card_projetos">
              {projetosFiltrados.length > 0 ? (
                projetosFiltrados.map((projeto) => (
                  <div
                    key={projeto.projeto_id}
                    className="card_projetos_recentes"
                  >
                    <div>
                      <h2 className="texto_projetos">{projeto.titulo}</h2>
                      <h2 className="texto_atualizacao">{projeto.descricao}</h2>
                    </div>

                    <div className="div_progresso_projeto">
                      <div className="div_dois_projetos_recentes">
                        <h2 className="texto_progresso">Progresso</h2>
                        <h2 className="texto_progresso">55%</h2>
                      </div>
                      <input
                        type="range"
                        className="custom-range"
                        max={max}
                        min={0}
                        defaultValue={value}
                        style={gradientStyle}
                        readOnly
                      />
                    </div>

                    <div className="div_icones_projetos">
                      <div className="div_items_icones">
                        <MdAccessTime size={"16px"} color="#71717A" />
                        <h2 className="texto_atualizacao">
                          {projeto.atualizadoEm}
                        </h2>
                      </div>
                      <div className="div_items_icones">
                        <GoPeople size={"16px"} color="#71717A" />
                        <h2 className="texto_atualizacao">
                          {projeto.total_membros} membros
                        </h2>
                      </div>
                    </div>

                    <div className="div_icones_projetos">
                      <div className="div_items_icones">
                        <IoIosGitBranch size={"16px"} color="#71717A" />
                        <h2 className="texto_atualizacao">
                          {projeto.branches} branches
                        </h2>
                      </div>
                      <div className="div_items_icones">
                        <h2 className="texto_atualizacao">{projeto.status}</h2>
                      </div>
                    </div>

                    <NavLink
                      to={`/ProjetosDetalhes/${projeto.projeto_id}`}
                      className="btn_entrar_projeto"
                    >
                      Entrar no Projeto
                    </NavLink>
                  </div>
                ))
              ) : (
                <p>Nenhum projeto encontrado.</p>
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
