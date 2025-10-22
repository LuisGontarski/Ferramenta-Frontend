import "./Requisitos.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { useState, useEffect } from "react";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import { LuPencil } from "react-icons/lu";
import { FiClock, FiTrash2 } from "react-icons/fi";
import RequisitoModal from "./RequisitoModal";

type Alteracao = {
  data: string;
  usuario: string;
  descricao: string;
};

type Requisito = {
  requisito_id: string; // ID exibido no frontend
  tipo: "Funcional" | "Não Funcional";
  prioridade: "Alta" | "Média" | "Baixa";
  descricao: string;
  status: "Registrado" | "Em andamento" | "Finalizado";
  criterioAceite?: string;
  historico: Alteracao[];
};

const API_URL = import.meta.env.VITE_API_URL;

const Requisitos = () => {
  const [requisitosFuncionais, setRequisitosFuncionais] = useState<Requisito[]>(
    []
  );
  const [requisitosNaoFuncionais, setRequisitosNaoFuncionais] = useState<
    Requisito[]
  >([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState<Requisito | null>(
    null
  );
  const [editandoRequisito, setEditandoRequisito] = useState<Requisito | null>(
    null
  );
  const cargo = localStorage.getItem("cargo") || "Usuário";

  // Campos do formulário
  const [tipo, setTipo] = useState<"Funcional" | "Não Funcional">("Funcional");
  const [prioridade, setPrioridade] = useState<"Alta" | "Média" | "Baixa">(
    "Baixa"
  );
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState<
    "Registrado" | "Em andamento" | "Finalizado"
  >("Registrado");
  const [criterioAceite, setCriterioAceite] = useState("");

  // Carregar requisitos do backend e gerar IDs RF/RNF
  const carregarRequisitos = async () => {
    const projeto_id = localStorage.getItem("projeto_id");
    if (!projeto_id) return;

    try {
      const res = await fetch(`${API_URL}/requisito/list/${projeto_id}`);
      const data = await res.json();

      const reqFuncionais: Requisito[] = [];
      const reqNaoFuncionais: Requisito[] = [];

      let countFuncional = 1;
      let countNaoFuncional = 1;

      (data.requisitos || []).forEach((req: any) => {
        let novoReq: Requisito = {
          ...req,
          criterioAceite: req.criterio_aceite || "-",
          historico: req.historico || [],
          requisito_id: "",
        };

        if (req.tipo === "Funcional") {
          novoReq.requisito_id = `RF${countFuncional
            .toString()
            .padStart(3, "0")}`;
          countFuncional++;
          reqFuncionais.push(novoReq);
        } else {
          novoReq.requisito_id = `RNF${countNaoFuncional
            .toString()
            .padStart(3, "0")}`;
          countNaoFuncional++;
          reqNaoFuncionais.push(novoReq);
        }
      });

      setRequisitosFuncionais(reqFuncionais);
      setRequisitosNaoFuncionais(reqNaoFuncionais);
    } catch (error) {
      console.error("Erro ao carregar requisitos:", error);
    }
  };

  useEffect(() => {
    carregarRequisitos();
  }, []);

  const abrirModalNovo = () => {
    setEditandoRequisito(null);
    setTipo("Funcional");
    setPrioridade("Baixa");
    setDescricao("");
    setStatus("Registrado");
    setCriterioAceite("");
    setMostrarModal(true);
  };

  const abrirModalEditar = (requisito: Requisito) => {
    setEditandoRequisito(requisito);
    setTipo(requisito.tipo);
    setPrioridade(requisito.prioridade);
    setDescricao(requisito.descricao);
    setStatus(requisito.status);
    setCriterioAceite(requisito.criterioAceite || "");
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setEditandoRequisito(null);
  };

  const adicionarEntradaHistorico = (
    requisito: Requisito,
    descricao: string
  ) => {
    const novaEntrada: Alteracao = {
      data: new Date().toLocaleString(),
      usuario: cargo,
      descricao,
    };
    const requisitoAtualizado: Requisito = {
      ...requisito,
      historico: [...requisito.historico, novaEntrada],
    };

    if (requisito.tipo === "Funcional") {
      setRequisitosFuncionais((prev) =>
        prev.map((r) =>
          r.requisito_id === requisito.requisito_id ? requisitoAtualizado : r
        )
      );
    } else {
      setRequisitosNaoFuncionais((prev) =>
        prev.map((r) =>
          r.requisito_id === requisito.requisito_id ? requisitoAtualizado : r
        )
      );
    }

    return requisitoAtualizado;
  };

  const mudarStatus = (
    requisito: Requisito,
    novoStatus: Requisito["status"]
  ) => {
    const requisitoAtualizado = adicionarEntradaHistorico(
      requisito,
      `Status alterado: ${requisito.status} → ${novoStatus}`
    );
    const atualizadoComStatus = { ...requisitoAtualizado, status: novoStatus };

    if (requisito.tipo === "Funcional") {
      setRequisitosFuncionais((prev) =>
        prev.map((r) =>
          r.requisito_id === requisito.requisito_id ? atualizadoComStatus : r
        )
      );
    } else {
      setRequisitosNaoFuncionais((prev) =>
        prev.map((r) =>
          r.requisito_id === requisito.requisito_id ? atualizadoComStatus : r
        )
      );
    }
  };

  const excluirRequisito = (requisito: Requisito) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o requisito "${requisito.descricao.substring(
          0,
          50
        )}"...?`
      )
    ) {
      if (requisito.tipo === "Funcional") {
        setRequisitosFuncionais((prev) =>
          prev.filter((r) => r.requisito_id !== requisito.requisito_id)
        );
      } else {
        setRequisitosNaoFuncionais((prev) =>
          prev.filter((r) => r.requisito_id !== requisito.requisito_id)
        );
      }
    }
  };

  const renderTabela = (titulo: string, requisitos: Requisito[]) => (
    <>
      <h3 className="subtitulo_requisitos">{titulo}</h3>
      <div className="tabela_container">
        <table className="tabela_requisitos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Prioridade</th>
              <th>Descrição</th>
              <th>Critério de Aceite</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {requisitos.length === 0 ? (
              <tr>
                <td colSpan={7} className="linha-vazia">
                  Nada registrado ainda.
                </td>
              </tr>
            ) : (
              requisitos.map((req) => (
                <tr key={req.requisito_id}>
                  <td>{req.requisito_id}</td>
                  <td className={`prioridade ${req.prioridade.toLowerCase()}`}>
                    {req.prioridade}
                  </td>
                  <td>{req.descricao}</td>
                  <td>{req.criterioAceite}</td>
                  <td>{req.tipo}</td>
                  <td>
                    <select
                      value={req.status}
                      onChange={(e) =>
                        mudarStatus(req, e.target.value as Requisito["status"])
                      }
                    >
                      <option value="Registrado">Registrado</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>
                  </td>
                  <td>
                    <div className="acoes-botoes">
                      <button
                        onClick={() => abrirModalEditar(req)}
                        title="Editar requisito"
                      >
                        <LuPencil />
                      </button>
                      <button
                        onClick={() => setMostrarHistorico(req)}
                        title="Ver histórico"
                      >
                        <FiClock />
                      </button>
                      {(cargo === "Scrum Master" ||
                        cargo === "Product Owner") && (
                        <button
                          onClick={() => excluirRequisito(req)}
                          title="Excluir requisito"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <>
      <NavbarHome />
      <div className="container_conteudos">
        <MenuLateral />
        <div className="container_vertical_conteudos requisitos_container">
          <div className="card_documentos">
            <div className="div_titulo_requisitos">
              <div className="div_titulo_documentos">
                <h2 className="titulo_documentos">
                  Documentação de Requisitos
                </h2>
                <h2 className="subtitulo_documentos">
                  Requisitos funcionais e não funcionais definidos para o
                  projeto.
                </h2>
              </div>
              {(cargo === "Scrum Master" || cargo === "Product Owner") && (
                <button
                  onClick={abrirModalNovo}
                  className="button_adicionar_arquivo"
                >
                  + Adicionar Requisito
                </button>
              )}
            </div>

            {renderTabela("Requisitos Funcionais", requisitosFuncionais)}
            {renderTabela("Requisitos Não Funcionais", requisitosNaoFuncionais)}

            {mostrarModal && (
              <RequisitoModal
                tipo={tipo}
                setTipo={setTipo}
                prioridade={prioridade}
                setPrioridade={setPrioridade}
                descricao={descricao}
                setDescricao={setDescricao}
                criterioAceite={criterioAceite}
                setCriterioAceite={setCriterioAceite}
                fecharModal={fecharModal}
                onSubmit={() => {}}
                editandoRequisito={!!editandoRequisito}
              />
            )}

            {mostrarHistorico && (
              <div className="modal_overlay">
                <div className="modal_conteudo modal_mostrar modal-historico">
                  <h3>
                    Histórico do Requisito {mostrarHistorico.requisito_id}
                  </h3>
                  <p>
                    <strong>Descrição:</strong> {mostrarHistorico.descricao}
                  </p>
                  <div className="historico-container">
                    {mostrarHistorico.historico.length === 0 ? (
                      <p className="sem-historico">
                        Nenhuma alteração registrada.
                      </p>
                    ) : (
                      <ul className="lista_historico">
                        {mostrarHistorico.historico.map((alt, i) => (
                          <li key={i} className="item-historico">
                            <div className="historico-data">{alt.data}</div>
                            <div className="historico-usuario">
                              {alt.usuario}
                            </div>
                            <div className="historico-descricao">
                              {alt.descricao}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="botoes_form">
                    <button onClick={() => setMostrarHistorico(null)}>
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Requisitos;
