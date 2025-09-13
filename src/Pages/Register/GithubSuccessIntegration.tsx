import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Github.css";

export default function GithubSuccessIntegration() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"success" | "error" | "loading">(
    "loading"
  );
  const [message, setMessage] = useState(
    "Verificando integração com GitHub..."
  );
  const [payload, setPayload] = useState<any>(null);
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [savedUserId, setSavedUserId] = useState<string | null>(null);
  const [action, setAction] = useState<() => Promise<void>>(
    () => async () => {}
  );

  // Função para criar usuário
  const createUser = async (payload: any, token: string) => {
    try {
      const finalPayload = { ...payload, github_token: token };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user`,
        finalPayload
      );

      localStorage.setItem("usuario_id", response.data.usuario_id);
      if (response.data.github_token) {
        localStorage.setItem("github_token", response.data.github_token);
      }
      sessionStorage.removeItem("pendingRegistration");

      setStatus("success");
      setMessage("Integração com GitHub realizada com sucesso!");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.response?.data?.message || "Erro ao integrar GitHub");
    }
  };

  // Função para atualizar usuário existente
  const updateUser = async (userId: string, token: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/github/update`,
        {
          usuario_id: userId,
          github_token: token,
        }
      );

      localStorage.setItem("github_token", response.data.github_token);
      setStatus("success");
      setMessage("Integração com GitHub realizada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao atualizar usuário:", err.response || err);
      setStatus("error");
      setMessage(err.response?.data?.message || "Erro ao integrar GitHub");
    }
  };

  // useEffect apenas prepara o estado e a ação correta
  useEffect(() => {
    const token = searchParams.get("github_token");
    const payloadString = sessionStorage.getItem("pendingRegistration");
    const userId = localStorage.getItem("usuario_id");

    setGithubToken(token);

    if (!token) {
      setStatus("error");
      setMessage("Não foi possível obter o token do GitHub.");
      setAction(() => async () => {});
      return;
    }

    if (payloadString && !userId) {
      const parsedPayload = JSON.parse(payloadString);
      setPayload(parsedPayload);
      // Ação será executada no botão
      setAction(() => async () => await createUser(parsedPayload, token));
      setStatus("success"); // já mostra check e botão
      setMessage("Clique em 'Prosseguir' para finalizar a integração.");
    } else if (userId) {
      setSavedUserId(userId);
      setAction(() => async () => await updateUser(userId, token));
      setStatus("success"); // já mostra check e botão
      setMessage("Clique em 'Prosseguir' para atualizar a integração.");
    } else {
      setStatus("error");
      setMessage("Usuário não encontrado. Cadastro ou integração incompleta.");
      setAction(() => async () => {});
    }
  }, [searchParams]);

  // Funções de navegação
  const handleProceed = async () => {
    if (!action) return;

    try {
      setStatus("loading");
      setMessage("Integrando com GitHub...");

      await action(); // executa createUser ou updateUser

      // Sempre redireciona depois
      window.location.href = "/";
    } catch (err) {
      console.error("Erro ao processar a integração:", err);
      setStatus("error");
      setMessage("Erro ao integrar GitHub. Você pode tentar novamente.");
    }
  };

  const handleRetry = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github/login`;
  };

  return (
    <div className="github-success-container">
      {status === "loading" ? (
        <div className="loading-box">
          <div className="loading-animation">⏳</div>
          <h2>{message}</h2>
        </div>
      ) : status === "success" ? (
        <div className="success-box">
          <div className="success-animation">✔</div>
          <h2>{message}</h2>
          <button className="proceed-button" onClick={handleProceed}>
            Prosseguir
          </button>
        </div>
      ) : (
        <div className="error-box">
          <div className="error-animation">✖</div>
          <h2>{message}</h2>
          <div className="button-group">
            <button className="retry-button" onClick={handleRetry}>
              Tentar integrar com GitHub
            </button>
            <button className="proceed-button" onClick={handleProceed}>
              Prosseguir sem GitHub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
