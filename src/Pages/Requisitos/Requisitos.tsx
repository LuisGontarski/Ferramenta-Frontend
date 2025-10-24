import "./Requisitos.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { useState, useEffect } from "react";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import { LuPencil } from "react-icons/lu";
import { FiClock, FiTrash2 } from "react-icons/fi";
import RequisitoModal from "./RequisitoModal";
import axios from "axios";
import { toast } from "react-hot-toast";

type Alteracao = {
  data_formatada: string;
  usuario_nome: string;
  status_anterior: string;
  status_novo: string;
  observacao: string;
  criado_em: string;
};

type Requisito = {
  uuid: string; // UUID real do banco
  requisito_id: string; // ID exibido no frontend (RF001 / RNF001)
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
  const [mostrarHistorico, setMostrarHistorico] = useState<{
    requisito_id: string;
    descricao: string;
    historico: Alteracao[];
  } | null>(null);
  const [editandoRequisito, setEditandoRequisito] = useState<Requisito | null>(
    null
  );
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);

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

  // Função para buscar histórico do requisito
  const buscarHistoricoRequisito = async (
    requisito_uuid: string,
    descricao: string,
    requisito_id_frontend: string
  ) => {
    setCarregandoHistorico(true);
    try {
      console.log(`🔍 Buscando histórico para requisito: ${requisito_uuid}`);

      const response = await axios.get(
        `${API_URL}/requisito/${requisito_uuid}/historico`
      );

      if (response.data.success) {
        setMostrarHistorico({
          requisito_id: requisito_id_frontend,
          descricao,
          historico: response.data.historico,
        });
      } else {
        console.error("Erro na resposta da API:", response.data.message);
        toast.error("Erro ao carregar histórico");
      }
    } catch (error) {
      console.error("❌ Erro ao buscar histórico:", error);
      toast.error("Não foi possível carregar o histórico");
    } finally {
      setCarregandoHistorico(false);
    }
  };

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
        const novoReq: Requisito = {
          uuid: req.requisito_id, // UUID real
          requisito_id: "", // ID exibido no frontend
          tipo: req.tipo,
          prioridade: req.prioridade,
          descricao: req.descricao,
          status: req.status,
          criterioAceite: req.criterio_aceite || "-",
          historico: [], // Inicialmente vazio, será carregado sob demanda
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
      data_formatada: new Date().toLocaleString(),
      usuario_nome: cargo,
      status_anterior: requisito.status,
      status_novo: requisito.status,
      observacao: descricao,
      criado_em: new Date().toISOString(),
    };
    const requisitoAtualizado: Requisito = {
      ...requisito,
      historico: [...requisito.historico, novaEntrada],
    };

    if (requisito.tipo === "Funcional") {
      setRequisitosFuncionais((prev) =>
        prev.map((r) => (r.uuid === requisito.uuid ? requisitoAtualizado : r))
      );
    } else {
      setRequisitosNaoFuncionais((prev) =>
        prev.map((r) => (r.uuid === requisito.uuid ? requisitoAtualizado : r))
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
        prev.map((r) => (r.uuid === requisito.uuid ? atualizadoComStatus : r))
      );
    } else {
      setRequisitosNaoFuncionais((prev) =>
        prev.map((r) => (r.uuid === requisito.uuid ? atualizadoComStatus : r))
      );
    }
  };

  const excluirRequisito = async (requisito: Requisito) => {
    // ✅ Substituir confirm nativo por toast de confirmação customizado
    toast(
      (t) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minWidth: "300px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "500", fontSize: "16px" }}>
            Excluir requisito?
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#666",
            }}
          >
            "{requisito.descricao.substring(0, 50)}..."
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: "#999",
              fontStyle: "italic",
            }}
          >
            Esta ação não pode ser desfeita.
          </p>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              marginTop: "8px",
            }}
          >
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmarExclusaoRequisito(requisito);
              }}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Excluir
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                background: "#6b7280",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        duration: 15000, // 15 segundos para decidir
        style: {
          background: "#fff",
          color: "#333",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      }
    );
  };

  // Função separada para a exclusão real
  const confirmarExclusaoRequisito = async (requisito: Requisito) => {
    try {
      const loadingToast = toast.loading("Excluindo requisito...");

      const res = await fetch(`${API_URL}/requisito/delete/${requisito.uuid}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar requisito");

      if (requisito.tipo === "Funcional") {
        setRequisitosFuncionais((prev) =>
          prev.filter((r) => r.uuid !== requisito.uuid)
        );
      } else {
        setRequisitosNaoFuncionais((prev) =>
          prev.filter((r) => r.uuid !== requisito.uuid)
        );
      }

      toast.success("Requisito excluído com sucesso!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("Falha ao excluir requisito");
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
                <tr key={req.uuid}>
                  <td>{req.requisito_id}</td>
                  <td className={`prioridade ${req.prioridade.toLowerCase()}`}>
                    {req.prioridade}
                  </td>
                  <td>{req.descricao}</td>
                  <td>{req.criterioAceite}</td>
                  <td>{req.tipo}</td>
                  <td
                    className={`status ${req.status
                      .replace(" ", "-")
                      .toLowerCase()}`}
                  >
                    {req.status}
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
                        onClick={() =>
                          buscarHistoricoRequisito(
                            req.uuid,
                            req.descricao,
                            req.requisito_id
                          )
                        }
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
                onSubmit={carregarRequisitos} // recarrega lista após criação ou edição
                editandoRequisito={!!editandoRequisito}
                requisitoId={editandoRequisito?.uuid} // UUID real para PUT
              />
            )}

            {mostrarHistorico && (
              <div className="modal_overlay">
                <div className="modal_conteudo modal_mostrar modal-historico">
                  <h3>Histórico do Requisito</h3>
                  <p>
                    <strong>ID:</strong> {mostrarHistorico.requisito_id}
                  </p>
                  <p>
                    <strong>Descrição:</strong> {mostrarHistorico.descricao}
                  </p>

                  {carregandoHistorico ? (
                    <div className="carregando">Carregando histórico...</div>
                  ) : (
                    <div className="historico-container">
                      {mostrarHistorico.historico.length === 0 ? (
                        <p className="sem-historico">
                          Nenhuma alteração registrada.
                        </p>
                      ) : (
                        <ul className="lista_historico">
                          {mostrarHistorico.historico.map((alt, i) => (
                            <li key={i} className="item-historico">
                              <div className="historico-header">
                                <div className="historico-data">
                                  {alt.data_formatada ||
                                    new Date(alt.criado_em).toLocaleString()}
                                </div>
                                <div className="historico-usuario">
                                  {alt.usuario_nome || "Sistema"}
                                </div>
                              </div>
                              <div className="historico-status">
                                <span className="status-anterior">
                                  {alt.status_anterior || "N/A"}
                                </span>
                                <span className="seta">→</span>
                                <span className="status-novo">
                                  {alt.status_novo}
                                </span>
                              </div>
                              {alt.observacao && (
                                <div className="historico-observacao">
                                  <strong>Observação:</strong> {alt.observacao}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

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
