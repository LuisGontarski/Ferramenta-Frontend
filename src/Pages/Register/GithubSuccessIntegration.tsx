import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./GithubSuccess.css";

export default function GithubSuccessIntegration() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"success" | "error" | "loading">(
    "loading"
  );
  const [message, setMessage] = useState(
    "Verificando integração com GitHub..."
  );
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const githubToken = searchParams.get("github_token");
      if (!githubToken) {
        setStatus("error");
        setMessage("Não foi possível obter o token do GitHub.");
        return;
      }

      // Primeiro tenta recuperar payload
      const payloadString = sessionStorage.getItem("pendingRegistration");
      const savedUserId = localStorage.getItem("usuario_id");

      try {
        if (payloadString && !savedUserId) {
          // Novo usuário
          const parsedPayload = JSON.parse(payloadString);
          setPayload(parsedPayload);

          const finalPayload = { ...parsedPayload, github_token: githubToken };

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
        } else if (savedUserId) {
          // Usuário já existe
          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/user/github/update`,
            { usuario_id: savedUserId, github_token: githubToken }
          );

          localStorage.setItem("github_token", response.data.github_token);
          setStatus("success");
          setMessage("Integração com GitHub realizada com sucesso!");
        } else {
          setStatus("error");
          setMessage(
            "Usuário não encontrado. Cadastro ou integração incompleta."
          );
        }
      } catch (err: any) {
        console.error("Erro na integração com GitHub:", err.response || err);
        setStatus("error");
        const backendMessage =
          err.response?.data?.message || "Erro ao integrar GitHub";
        setMessage(backendMessage);
      }
    };

    init();
  }, [searchParams]);

  const handleProceed = () => {
    window.location.href = "/";
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
