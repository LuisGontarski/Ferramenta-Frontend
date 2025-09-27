import "./Requisitos.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { useState } from "react";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";

type Alteracao = {
  data: string;
  usuario: string;
  descricao: string;
};

type Requisito = {
  id: number;
  tipo: "Funcional" | "Não Funcional";
  prioridade: "Alta" | "Média" | "Baixa";
  descricao: string;
  status: "Proposto" | "Aprovado" | "Em andamento" | "Concluído";
  origem?: string;
  responsavel?: string;
  criterioAceite?: string;
  historico: Alteracao[];
};

const Requisitos = () => {
  const [requisitosFuncionais, setRequisitosFuncionais] = useState<Requisito[]>([]);
  const [requisitosNaoFuncionais, setRequisitosNaoFuncionais] = useState<Requisito[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState<Requisito | null>(null);
  const [editandoRequisito, setEditandoRequisito] = useState<Requisito | null>(null);
  const cargo = localStorage.getItem("cargo") || "Usuário";

  // Estados dos campos do formulário
  const [tipo, setTipo] = useState<"Funcional" | "Não Funcional">("Funcional");
  const [prioridade, setPrioridade] = useState<"Alta" | "Média" | "Baixa">("Média");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState<"Proposto" | "Aprovado" | "Em andamento" | "Concluído">("Proposto");
  const [origem, setOrigem] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [criterioAceite, setCriterioAceite] = useState("");

  // Abrir modal para adicionar novo requisito
  const abrirModalNovo = () => {
    setEditandoRequisito(null);
    setTipo("Funcional");
    setPrioridade("Média");
    setDescricao("");
    setStatus("Proposto");
    setOrigem("");
    setResponsavel("");
    setCriterioAceite("");
    setMostrarModal(true);
  };

  // Abrir modal para editar requisito existente
  const abrirModalEditar = (requisito: Requisito) => {
    setEditandoRequisito(requisito);
    setTipo(requisito.tipo);
    setPrioridade(requisito.prioridade);
    setDescricao(requisito.descricao);
    setStatus(requisito.status);
    setOrigem(requisito.origem || "");
    setResponsavel(requisito.responsavel || "");
    setCriterioAceite(requisito.criterioAceite || "");
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setEditandoRequisito(null);
  };

  const adicionarRequisito = () => {
    if (descricao.trim() === "") return;

    const novoRequisito: Requisito = {
      id: tipo === "Funcional" ? requisitosFuncionais.length + 1 : requisitosNaoFuncionais.length + 1,
      tipo,
      prioridade,
      descricao,
      status,
      origem: origem || undefined,
      responsavel: responsavel || undefined,
      criterioAceite: criterioAceite || undefined,
      historico: [
        {
          data: new Date().toLocaleString(),
          usuario: cargo,
          descricao: "Requisito criado",
        },
      ],
    };

    if (tipo === "Funcional") {
      setRequisitosFuncionais((prev) => [...prev, novoRequisito]);
    } else {
      setRequisitosNaoFuncionais((prev) => [...prev, novoRequisito]);
    }

    fecharModal();
  };

  const atualizarRequisito = () => {
  if (!editandoRequisito || descricao.trim() === "") return;

  let alteracoes: string[] = [];

  if (editandoRequisito.status !== status) {
    alteracoes.push(`Status: "${editandoRequisito.status}" → "${status}"`);
  }

  if (editandoRequisito.prioridade !== prioridade) {
    alteracoes.push(`Prioridade: "${editandoRequisito.prioridade}" → "${prioridade}"`);
  }

  if (editandoRequisito.descricao !== descricao) {
    alteracoes.push(`Descrição: "${editandoRequisito.descricao}" → "${descricao}"`);
  }

  if (editandoRequisito.origem !== origem) {
    alteracoes.push(`Origem: "${editandoRequisito.origem || "-"}" → "${origem || "-"}"`);
  }

  if (editandoRequisito.responsavel !== responsavel) {
    alteracoes.push(`Responsável: "${editandoRequisito.responsavel || "-"}" → "${responsavel || "-"}"`);
  }

  if (editandoRequisito.criterioAceite !== criterioAceite) {
    alteracoes.push(
      `Critério de Aceite: "${editandoRequisito.criterioAceite || "-"}" → "${criterioAceite || "-"}"`
    );
  }

  const atualizacao: Alteracao = {
    data: new Date().toLocaleString(),
    usuario: cargo,
    descricao: alteracoes.length > 0 
      ? `Alterações realizadas: ${alteracoes.join("; ")}`
      : "Edição salva sem mudanças",
  };

  const requisitoAtualizado: Requisito = {
    ...editandoRequisito,
    tipo,
    prioridade,
    descricao,
    status,
    origem: origem || undefined,
    responsavel: responsavel || undefined,
    criterioAceite: criterioAceite || undefined,
    historico: [...editandoRequisito.historico, atualizacao],
  };

  if (editandoRequisito.tipo === "Funcional") {
    setRequisitosFuncionais(prev => 
      prev.map(req => req.id === editandoRequisito.id ? requisitoAtualizado : req)
    );
  } else {
    setRequisitosNaoFuncionais(prev => 
      prev.map(req => req.id === editandoRequisito.id ? requisitoAtualizado : req)
    );
  }

  fecharModal();
};


  const excluirRequisito = (requisito: Requisito) => {
    if (window.confirm(`Tem certeza que deseja excluir o requisito ${requisito.descricao.substring(0, 50)}...?`)) {
      if (requisito.tipo === "Funcional") {
        setRequisitosFuncionais(prev => prev.filter(req => req.id !== requisito.id));
      } else {
        setRequisitosNaoFuncionais(prev => prev.filter(req => req.id !== requisito.id));
      }
    }
  };

  const adicionarEntradaHistorico = (requisito: Requisito, descricao: string) => {
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
      setRequisitosFuncionais(prev => 
        prev.map(req => req.id === requisito.id ? requisitoAtualizado : req)
      );
    } else {
      setRequisitosNaoFuncionais(prev => 
        prev.map(req => req.id === requisito.id ? requisitoAtualizado : req)
      );
    }

    return requisitoAtualizado;
  };

  const mudarStatus = (requisito: Requisito, novoStatus: Requisito["status"]) => {
    const requisitoAtualizado = adicionarEntradaHistorico(
      requisito, 
      `Status alterado: ${requisito.status} → ${novoStatus}`
    );
    
    const requisitoComStatus: Requisito = {
      ...requisitoAtualizado,
      status: novoStatus,
    };

    if (requisito.tipo === "Funcional") {
      setRequisitosFuncionais(prev => 
        prev.map(req => req.id === requisito.id ? requisitoComStatus : req)
      );
    } else {
      setRequisitosNaoFuncionais(prev => 
        prev.map(req => req.id === requisito.id ? requisitoComStatus : req)
      );
    }
  };

  const renderTabela = (titulo: string, requisitos: Requisito[], prefixo: string) => (
  <>
    <h3 className="subtitulo_requisitos">{titulo}</h3>
    <div className="tabela_container">
      <table className="tabela_requisitos">
        <thead>
          <tr>
            <th className="col-id">ID</th>
            <th className="col-prioridade">Prioridade</th>
            <th className="col-descricao">Descrição</th>
            <th className="col-criterio">Critério de Aceite</th>
            <th>Status</th>
            <th>Origem</th>
            <th>Responsável</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {requisitos.length === 0 ? (
            <tr>
              <td colSpan={8} className="linha-vazia">Nada registrado ainda.</td>
            </tr>
          ) : (
            requisitos.map((req, index) => (
              <tr key={req.id} className={index % 2 === 0 ? "linha-par" : "linha-impar"}>
                <td className="col-id">{`${prefixo}-${req.id.toString().padStart(2, "0")}`}</td>
                <td className={`col-prioridade prioridade ${req.prioridade.toLowerCase()}`}>
                  {req.prioridade}
                </td>
                <td className="col-descricao">{req.descricao}</td>
                <td>{req.criterioAceite || "-"}</td>
                <td>
                  <select 
                    value={req.status} 
                    onChange={(e) => mudarStatus(req, e.target.value as Requisito["status"])}
                    className={`status-select status-${req.status.toLowerCase().replace(" ", "-")}`}
                  >
                    <option value="Proposto">Proposto</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </td>
                <td>{req.origem || "-"}</td>
                <td>{req.responsavel || "-"}</td>
                <td>
                  <div className="acoes-botoes">
                    <button 
                      onClick={() => abrirModalEditar(req)}
                      className="btn-editar"
                      title="Editar requisito"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => setMostrarHistorico(req)}
                      className="btn-historico"
                      title="Ver histórico"
                    >
                      📋
                    </button>
                    {(cargo === "Scrum Master" || cargo === "Product Owner") && (
                      <button 
                        onClick={() => excluirRequisito(req)}
                        className="btn-excluir"
                        title="Excluir requisito"
                      >
                        🗑️
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
                <h2 className="titulo_documentos">Documentação de Requisitos</h2>
                <h2 className="subtitulo_documentos">Requisitos funcionais e não funcionais definidos para o projeto.</h2>
              </div>
              {(cargo === "Scrum Master" || cargo === "Product Owner") && (
                <button onClick={abrirModalNovo} className="button_adicionar_arquivo">
                  + Adicionar Requisito
                </button>
              )}
            </div>

            {renderTabela("Requisitos Funcionais", requisitosFuncionais, "RFN")}
            {renderTabela("Requisitos Não Funcionais", requisitosNaoFuncionais, "RNF")}

            {mostrarModal && (
              <div className="modal_overlay">
                <div className={`modal_conteudo ${mostrarModal ? 'modal_mostrar' : ''}`}>
                  <h3>{editandoRequisito ? 'Editar Requisito' : 'Novo Requisito'}</h3>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Tipo:</label>
                      <select value={tipo} onChange={(e) => setTipo(e.target.value as any)}>
                        <option value="Funcional">Funcional</option>
                        <option value="Não Funcional">Não Funcional</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Prioridade:</label>
                      <select value={prioridade} onChange={(e) => setPrioridade(e.target.value as any)}>
                        <option value="Alta">Alta</option>
                        <option value="Média">Média</option>
                        <option value="Baixa">Baixa</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Status:</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                        <option value="Proposto">Proposto</option>
                        <option value="Aprovado">Aprovado</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Concluído">Concluído</option>
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label>Origem:</label>
                      <input
                        type="text"
                        placeholder="Cliente, regulatório, equipe..."
                        value={origem}
                        onChange={(e) => setOrigem(e.target.value)}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Responsável:</label>
                      <input
                        type="text"
                        placeholder="Nome do responsável"
                        value={responsavel}
                        onChange={(e) => setResponsavel(e.target.value)}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Descrição do Requisito:</label>
                      <textarea
                        placeholder="Descreva o requisito detalhadamente..."
                        rows={3}
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Critério de Aceite:</label>
                      <textarea
                        placeholder="Condições para considerar o requisito atendido..."
                        rows={2}
                        value={criterioAceite}
                        onChange={(e) => setCriterioAceite(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="botoes_form">
                    <button onClick={editandoRequisito ? atualizarRequisito : adicionarRequisito}>
                      {editandoRequisito ? 'Atualizar' : 'Adicionar'}
                    </button>
                    <button onClick={fecharModal}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            {mostrarHistorico && (
              <div className="modal_overlay">
                <div className="modal_conteudo modal_mostrar modal-historico">
                  <h3>Histórico do Requisito {mostrarHistorico.id}</h3>
                  <p><strong>Descrição:</strong> {mostrarHistorico.descricao}</p>
                  
                  <div className="historico-container">
                    {mostrarHistorico.historico.length === 0 ? (
                      <p className="sem-historico">Nenhuma alteração registrada.</p>
                    ) : (
                      <ul className="lista_historico">
                        {mostrarHistorico.historico.map((alt, i) => (
                          <li key={i} className="item-historico">
                            <div className="historico-data">{alt.data}</div>
                            <div className="historico-usuario">{alt.usuario}</div>
                            <div className="historico-descricao">{alt.descricao}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="botoes_form">
                    <button onClick={() => setMostrarHistorico(null)}>Fechar</button>
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