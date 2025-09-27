import "./Requisitos.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { useState } from "react";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";

type Requisito = {
  id: number;
  tipo: "Funcional" | "Não Funcional";
  prioridade: "Alta" | "Média" | "Baixa";
  descricao: string;
};

const Requisitos = () => {
  const [requisitosFuncionais, setRequisitosFuncionais] = useState<Requisito[]>([]);
  const [requisitosNaoFuncionais, setRequisitosNaoFuncionais] = useState<Requisito[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const cargo = localStorage.getItem("cargo");

  const [tipo, setTipo] = useState<"Funcional" | "Não Funcional">("Funcional");
  const [prioridade, setPrioridade] = useState<"Alta" | "Média" | "Baixa">("Média");
  const [descricao, setDescricao] = useState("");

  const abrirModal = () => setMostrarModal(true);
  const fecharModal = () => {
    setMostrarModal(false);
    setTipo("Funcional");
    setPrioridade("Média");
    setDescricao("");
  };

  const adicionarRequisito = () => {
    if (descricao.trim() === "") return;

    const novoRequisito: Requisito = {
      id:
        tipo === "Funcional"
          ? requisitosFuncionais.length + 1
          : requisitosNaoFuncionais.length + 1,
      tipo,
      prioridade,
      descricao,
    };

    if (tipo === "Funcional") {
      setRequisitosFuncionais((prev) => [...prev, novoRequisito]);
    } else {
      setRequisitosNaoFuncionais((prev) => [...prev, novoRequisito]);
    }

    fecharModal();
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
            </tr>
          </thead>
            <tbody>
                {requisitos.length === 0 ? (
                    <tr>
                    <td colSpan={3} className="linha-vazia">Nada registrado ainda.</td>
                    </tr>
                ) : (
                    requisitos.map((req, index) => (
                    <tr key={req.id} className={index % 2 === 0 ? "linha-par" : "linha-impar"}>
                        <td className="col-id">{`${prefixo}-${req.id.toString().padStart(2, "0")}`}</td>
                        <td className={`col-prioridade prioridade ${req.prioridade.toLowerCase()}`}>{req.prioridade}</td>
                        <td className="col-descricao">{req.descricao}</td>
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
                  <button onClick={abrirModal} className="button_adicionar_arquivo">
                    + Adicionar Requisito
                  </button>
                )}

            </div>

            {renderTabela("Requisitos Funcionais", requisitosFuncionais, "RFN")}
            {renderTabela("Requisitos Não Funcionais", requisitosNaoFuncionais, "RNF")}

            {mostrarModal && (
              <div className="modal_overlay">
                <div className={`modal_conteudo ${mostrarModal == true ? 'modal_mostrar' : ''}`}>
                  <h3>Novo Requisito</h3>
                  <select value={tipo} onChange={(e) => setTipo(e.target.value as any)}>
                    <option value="Funcional">Funcional</option>
                    <option value="Não Funcional">Não Funcional</option>
                  </select>
                  <select value={prioridade} onChange={(e) => setPrioridade(e.target.value as any)}>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                  <textarea
                    placeholder="Descrição do requisito"
                    rows={4}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                  <div className="botoes_form">
                    <button onClick={adicionarRequisito}>Adicionar</button>
                    <button onClick={fecharModal}>Cancelar</button>
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
