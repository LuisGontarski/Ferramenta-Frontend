import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Github.css";
import axios from "axios";

export default function GithubErrorIntegration() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"success" | "error" | "loading">(
    "loading"
  );
  const [payload, setPayload] = useState<any>(null);
  const [fetchingToken, setFetchingToken] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      const payloadString = sessionStorage.getItem("pendingRegistration");
      if (payloadString) {
        const parsedPayload = JSON.parse(payloadString);
        setPayload(parsedPayload);
      }

      const tempId = searchParams.get("temp_id");
      if (!tempId) {
        console.warn("Nenhum temp_id fornecido. Prosseguindo sem GitHub.");
        setStatus("error");
        setFetchingToken(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/github/token`,
          { params: { temp_id: tempId } }
        );

        const githubToken = response.data.github_token;

        if (payload) {
          const updatedPayload = {
            ...payload,
            github_token: githubToken || null,
          };
          setPayload(updatedPayload);

          // Salva IDs mesmo que githubToken seja nulo
          if (updatedPayload.usuario_id) {
            localStorage.setItem("usuario_id", updatedPayload.usuario_id);
          }
          if (githubToken) {
            localStorage.setItem("github_token", githubToken);
            setStatus("success");
          } else {
            setStatus("error"); // falha no GitHub, mas prossegue
          }
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Erro ao buscar token do GitHub:", err);
        setStatus("error");
      } finally {
        setFetchingToken(false);
      }
    };

    fetchToken();
  }, [searchParams]);

  const handleProceed = async () => {
    if (!payload) {
      alert("Nenhum dado de cadastro encontrado.");
      return;
    }

    try {
      const finalPayload = {
        ...payload,
        github_token: payload.github_token || null,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user`,
        finalPayload
      );

      // Salva usuario_id e github_token mesmo que token seja nulo
      if (response.data.usuario_id) {
        localStorage.setItem("usuario_id", response.data.usuario_id);
      }
      if (response.data.github_token) {
        localStorage.setItem("github_token", response.data.github_token);
      }

      sessionStorage.removeItem("pendingRegistration");
      window.location.href = "/";
    } catch (err: any) {
      console.error("Erro ao finalizar cadastro:", err);
      const statusCode = err.response?.status || "Erro desconhecido";
      alert(
        `Não foi possível finalizar o cadastro. Status code: ${statusCode}`
      );
    }
  };

  const handleRetry = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github/login`;
  };

  if (fetchingToken) {
    return (
      <div className="github-success-container">
        <div className="loading-box">
          <div className="loading-animation">⏳</div>
          <h2>Verificando integração com GitHub...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="github-success-container">
      {status === "success" ? (
        <div className="success-box">
          <div className="success-animation">✔</div>
          <h2>Integração com GitHub realizada com sucesso!</h2>
          <button className="proceed-button" onClick={handleProceed}>
            Prosseguir
          </button>
        </div>
      ) : (
        <div className="error-box">
          <div className="error-animation">✖</div>
          <h2>Não foi possível se integrar com o GitHub!</h2>
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
