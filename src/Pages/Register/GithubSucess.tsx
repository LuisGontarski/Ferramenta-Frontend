import { useSearchParams, useNavigate } from "react-router-dom";
import "./GithubSuccess.css";

export default function GithubSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const githubId = params.get("githubId");

  const handleProsseguir = () => {
    navigate("/home"); // Ajusta pro próximo step se precisar
  };

  return (
    <div className="github-success-container">
      <h2 className="github-success-title">✅ Integração concluída!</h2>
      <p className="github-success-subtitle">Conta vinculada: {githubId}</p>

      <div className="github-success-animation">
        {/* Aqui pode entrar um GIF ou Lottie */}
        <img src="/sucesso.gif" alt="Sucesso" width="100%" />
      </div>

      <button onClick={handleProsseguir} className="github-success-button">
        Prosseguir
      </button>
    </div>
  );
}
