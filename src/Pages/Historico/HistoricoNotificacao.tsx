// pages/Notificacoes/HistoricoNotificacao.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import "./HistoricoNotificacao.css";

const API_URL = import.meta.env.VITE_API_URL;

interface Notificacao {
  notificacao_id: string;
  usuario_id: string;
  tarefa_id?: string;
  tipo_notificacao: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  criado_em: string;
  lida_em?: string;
}

const HistoricoNotificacao = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalNaoLidas, setTotalNaoLidas] = useState(0);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  const carregarNotificacoes = async () => {
    try {
      const usuarioId = localStorage.getItem("usuario_id");
      if (!usuarioId) {
        console.error("Usuário não encontrado no localStorage");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_URL}/notificacoes?usuario_id=${usuarioId}`
      );

      if (response.data.success) {
        setNotificacoes(response.data.notificacoes);
        setTotalNaoLidas(response.data.totalNaoLidas);
      }
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLida = async (notificacaoId: string) => {
    try {
      const usuarioId = localStorage.getItem("usuario_id");
      if (!usuarioId) return;

      await axios.patch(
        `${API_URL}/notificacoes/${notificacaoId}/marcar-lida`,
        { usuario_id: usuarioId }
      );

      // Atualizar a lista local
      setNotificacoes((prev) =>
        prev.map((notif) =>
          notif.notificacao_id === notificacaoId
            ? { ...notif, lida: true, lida_em: new Date().toISOString() }
            : notif
        )
      );

      setTotalNaoLidas((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
    }
  };

  const marcarTodasComoLidas = async () => {
    try {
      const usuarioId = localStorage.getItem("usuario_id");
      if (!usuarioId) return;

      await axios.patch(`${API_URL}/notificacoes/marcar-todas-lidas`, {
        usuario_id: usuarioId,
      });

      // Atualizar a lista local
      setNotificacoes((prev) =>
        prev.map((notif) => ({
          ...notif,
          lida: true,
          lida_em: new Date().toISOString(),
        }))
      );

      setTotalNaoLidas(0);
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err);
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();
    const diffMinutos = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMinutos < 1) return "Agora mesmo";
    if (diffMinutos < 60) return `${diffMinutos} min atrás`;
    if (diffHoras < 24) return `${diffHoras} h atrás`;
    if (diffDias < 7) return `${diffDias} dia${diffDias > 1 ? "s" : ""} atrás`;

    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case "TAREFA_ATRIBUÍDA":
        return "📋";
      case "TAREFA_CONCLUIDA":
        return "✅";
      case "COMENTARIO":
        return "💬";
      case "PRAZO":
        return "⏰";
      default:
        return "🔔";
    }
  };

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
                Aguarde enquanto carrega as notificações...
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
          <div className="notificacoes-main-content">
            <div className="notificacoes-header">
              <div className="notificacoes-title">
                <h1 className="projetos-title">Notificações</h1>
                {totalNaoLidas > 0 && (
                  <span className="notificacoes-count">{totalNaoLidas}</span>
                )}
              </div>

              {totalNaoLidas > 0 && (
                <button
                  className="projetos-new-btn"
                  onClick={marcarTodasComoLidas}
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>

            <div className="notificacoes-list">
              {notificacoes.length === 0 ? (
                <div className="projetos-empty">
                  <div className="sem-notificacoes-icon">🔔</div>
                  <h3>Nenhuma notificação</h3>
                  <p>Quando você receber notificações, elas aparecerão aqui.</p>
                </div>
              ) : (
                notificacoes.map((notificacao) => (
                  <div
                    key={notificacao.notificacao_id}
                    className={`notificacao-item ${
                      notificacao.lida ? "lida" : "nao-lida"
                    }`}
                    onClick={() =>
                      !notificacao.lida &&
                      marcarComoLida(notificacao.notificacao_id)
                    }
                  >
                    <div className="notificacao-icon">
                      {getIconePorTipo(notificacao.tipo_notificacao)}
                    </div>

                    <div className="notificacao-content">
                      <div className="notificacao-header">
                        <h3 className="notificacao-titulo">
                          {notificacao.titulo}
                        </h3>
                        {!notificacao.lida && (
                          <div className="notificacao-ponto"></div>
                        )}
                      </div>

                      <p className="notificacao-mensagem">
                        {notificacao.mensagem}
                      </p>

                      <div className="notificacao-footer">
                        <span className="notificacao-data">
                          {formatarData(notificacao.criado_em)}
                        </span>

                      </div>
                    </div>

                    {!notificacao.lida && (
                      <button
                        className="btn-marcar-lida"
                        onClick={(e) => {
                          e.stopPropagation();
                          marcarComoLida(notificacao.notificacao_id);
                        }}
                        title="Marcar como lida"
                      >
                        ✓
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default HistoricoNotificacao;
