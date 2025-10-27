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

type HistoricoProjetoProps = {
  projeto_id: string;
  usuario_id: string;
  historicos: HistoricoTarefa[];
  setHistoricos: (historicos: HistoricoTarefa[]) => void;
  carregando: boolean;
  setCarregando: (carregando: boolean) => void;
  erro: string | null;
  setErro: (erro: string | null) => void;
};

const API_URL = import.meta.env.VITE_API_URL;

const HistoricoProjeto = ({
  projeto_id,
  usuario_id,
  historicos,
  setHistoricos,
  carregando,
  setCarregando,
  erro,
  setErro,
}: HistoricoProjetoProps) => {
  // Estados para filtros
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [filtroUsuario, setFiltroUsuario] = useState<string>("");

  // Buscar históricos
  const buscarHistoricos = async () => {
    setCarregando(true);
    setErro(null);

    try {
      console.log(`🔍 Buscando históricos para projeto: ${projeto_id}`);

      const response = await axios.get(
        `${API_URL}/tarefas/projeto/${projeto_id}/historico`
      );

      if (response.data.success) {
        setHistoricos(response.data.historico);
        console.log(
          `✅ ${response.data.historico.length} históricos carregados`
        );
      } else {
        setErro("Erro ao carregar históricos");
      }
    } catch (error) {
      console.error("❌ Erro ao buscar históricos:", error);
      setErro("Não foi possível carregar o histórico do projeto");
    } finally {
      setCarregando(false);
    }
  };

  // Carregar históricos ao montar o componente
  useEffect(() => {
    buscarHistoricos();
  }, [projeto_id]);

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
    };
    return traducoes[tipo] || tipo;
  };

  // Função para formatar a descrição da alteração
  const formatarDescricao = (hist: HistoricoTarefa) => {
    if (hist.tipo_alteracao === "CRIACAO") {
      return `Tarefa "${hist.tarefa_titulo}" criada`;
    } else if (hist.tipo_alteracao === "FASE_ALTERADA") {
      return `Fase alterada de "${hist.valor_anterior}" para "${hist.valor_novo}"`;
    } else {
      return hist.observacao || `Alteração em ${hist.campo_alterado}`;
    }
  };

  // Tipos únicos para o filtro
  const tiposUnicos = [...new Set(historicos.map((h) => h.tipo_alteracao))];

  return (
    <div className="historicos_container">
      <div className="card_historicos">
        {/* Cabeçalho */}
        <div className="div_titulo_historicos">
          <div className="div_titulo_documentos">
            <h2 className="titulo_documentos">Histórico do Projeto</h2>
            <h2 className="subtitulo_documentos">
              Acompanhe todas as alterações das tarefas do projeto
            </h2>
          </div>

          {/* Botões de Ação */}
          <div className="botoes_acao">
            <button
              onClick={buscarHistoricos}
              className="btn_atualizar"
              disabled={carregando}
            >
              {carregando ? "🔄" : "↻"} Atualizar
            </button>
          </div>
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

          <div className="filtro_grupo">
            <label>Usuário:</label>
            <input
              type="text"
              placeholder="Filtrar por usuário..."
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
              className="input_filtro"
            />
          </div>

          <div className="contador">
            {historicosFiltrados.length} de {historicos.length} registros
          </div>
        </div>

        {/* Conteúdo */}
        <div className="conteudo_historicos">
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
                As alterações das tarefas aparecerão aqui automaticamente.
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
                    <div className="historico_tarefa">
                      <strong>Tarefa:</strong> {hist.tarefa_titulo}
                    </div>

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
      </div>
    </div>
  );
};

export default HistoricoProjeto;
