import { useState, useEffect } from "react";
import axios from "axios";

// Tipos
type HistoricoTarefa = {
  historico_id: string;
  tarefa_id: string;
  tipo_alteracao: string;
  campo_alterado: string | null;
  valor_anterior: string | null;
  valor_novo: string | null;
  observacao: string | null;
  criado_em: string;
  usuario_id: string | null;
  usuario_nome: string | null;
  tarefa_titulo: string;
  sprint_id: string;
  sprint_nome: string;
  data_formatada: string;
};

type HistoricoTarefaModalProps = {
  tarefa_id: string;
  isOpen: boolean;
  onClose: () => void;
  tarefa_titulo?: string;
};

const API_URL = import.meta.env.VITE_API_URL;

const HistoricoTarefaModal = ({
  tarefa_id,
  isOpen,
  onClose,
  tarefa_titulo = "Tarefa",
}: HistoricoTarefaModalProps) => {
  const [historicos, setHistoricos] = useState<HistoricoTarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados para filtros
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [filtroUsuario] = useState<string>("");

  // Buscar históricos
  const buscarHistoricos = async () => {
    if (!tarefa_id) return;

    setCarregando(true);
    setErro(null);

    try {
      console.log(`🔍 Buscando históricos para tarefa: ${tarefa_id}`);

      const response = await axios.get(
        `${API_URL}/tarefas/${tarefa_id}/historico`
      );

      if (response.data.success) {
        setHistoricos(response.data.historico);
        console.log(
          `✅ ${response.data.historico.length} históricos carregados para a tarefa`
        );
      } else {
        setErro("Erro ao carregar históricos");
      }
    } catch (error) {
      console.error("❌ Erro ao buscar históricos da tarefa:", error);
      setErro("Não foi possível carregar o histórico da tarefa");
    } finally {
      setCarregando(false);
    }
  };

  // Carregar históricos quando o modal abrir
  useEffect(() => {
    if (isOpen && tarefa_id) {
      buscarHistoricos();
    }
  }, [isOpen, tarefa_id]);

  // Filtrar históricos
  const historicosFiltrados = historicos.filter((hist) => {
    const passaFiltroTipo = !filtroTipo || hist.tipo_alteracao === filtroTipo;
    const passaFiltroUsuario =
      !filtroUsuario ||
      (hist.usuario_nome &&
        hist.usuario_nome.toLowerCase().includes(filtroUsuario.toLowerCase()));

    return passaFiltroTipo && passaFiltroUsuario;
  });

  // Função para traduzir tipos de alteração
  const traduzirTipoAlteracao = (tipo: string) => {
    const traducoes: { [key: string]: string } = {
      CRIACAO: "Criação",
      FASE_ALTERADA: "Fase Alterada",
      STATUS_ALTERADO: "Status Alterado",
      ATUALIZACAO: "Atualização",
      EXCLUSAO: "Exclusão",
    };
    return traducoes[tipo] || tipo;
  };

  // Função para formatar a descrição da alteração
  const formatarDescricao = (hist: HistoricoTarefa) => {
    if (hist.tipo_alteracao === "CRIACAO") {
      return `Tarefa "${hist.tarefa_titulo}" criada`;
    } else if (hist.tipo_alteracao === "FASE_ALTERADA") {
      return `Fase alterada de "${hist.valor_anterior || "N/A"}" para "${
        hist.valor_novo || "N/A"
      }"`;
    } else if (hist.tipo_alteracao === "STATUS_ALTERADO") {
      return `Status alterado de "${hist.valor_anterior || "N/A"}" para "${
        hist.valor_novo || "N/A"
      }"`;
    } else {
      return (
        hist.observacao ||
        `Alteração em ${hist.campo_alterado || "campo desconhecido"}`
      );
    }
  };

  // Tipos únicos para o filtro
  const tiposUnicos = [...new Set(historicos.map((h) => h.tipo_alteracao))];

  if (!isOpen) return null;

  return (
    <div className="modal_overlay historico_modal_overlay">
      <div className="modal_detalhes_tarefa historico_modal">
        {/* Cabeçalho */}
        <div className="modal_header">
          <h2 className="titulo_tarefa">
            Histórico da Tarefa
            {tarefa_titulo && `: ${tarefa_titulo}`}
          </h2>
          <button className="btn_fechar_modal" onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        {/* Filtros */}
        <div className="filtros_historicos">
          <div className="filtro_grupo">
            <label>Tipo de Alteração:</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="select_filtro"
            >
              <option value="">Todos os tipos</option>
              {tiposUnicos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {traduzirTipoAlteracao(tipo)}
                </option>
              ))}
            </select>
          </div>

          <div className="contador">
            {historicosFiltrados.length} de {historicos.length} registros
          </div>
        </div>

        {/* Botão Atualizar */}
        <div className="botoes_acao_modal">
          <button
            onClick={buscarHistoricos}
            className="btn_atualizar"
            disabled={carregando}
          >
            {carregando ? "🔄" : "↻"} Atualizar
          </button>
        </div>

        {/* Conteúdo */}
        <div className="conteudo_historicos_modal">
          {carregando ? (
            <div className="carregando_historicos">
              <div className="spinner"></div>
              <p>Carregando histórico...</p>
            </div>
          ) : erro ? (
            <div className="erro_historicos">
              <p>❌ {erro}</p>
              <button
                onClick={buscarHistoricos}
                className="btn_tentar_novamente"
              >
                Tentar Novamente
              </button>
            </div>
          ) : historicosFiltrados.length === 0 ? (
            <div className="vazio_historicos">
              <p>📝 Nenhum registro de histórico encontrado</p>
              <p className="subtitulo_vazio">
                As alterações desta tarefa aparecerão aqui automaticamente.
              </p>
            </div>
          ) : (
            <div className="lista_historicos">
              {historicosFiltrados.map((hist) => (
                <div key={hist.historico_id} className="item_historico">
                  <div className="historico_header">
                    <div className="historico_tipo">
                      <span
                        className={`badge ${hist.tipo_alteracao.toLowerCase()}`}
                      >
                        {traduzirTipoAlteracao(hist.tipo_alteracao)}
                      </span>
                    </div>
                    <div className="historico_data">{hist.data_formatada}</div>
                  </div>

                  <div className="historico_corpo">
                    <div className="historico_descricao">
                      {formatarDescricao(hist)}
                    </div>

                    <div className="historico_usuario">
                      <strong>Por:</strong> {hist.usuario_nome || "Sistema"}
                    </div>

                    {hist.sprint_nome && (
                      <div className="historico_sprint">
                        <strong>Sprint:</strong> {hist.sprint_nome}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão Fechar */}
        <div className="botoes_modal">
          <button className="btn_secundario" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoricoTarefaModal;
