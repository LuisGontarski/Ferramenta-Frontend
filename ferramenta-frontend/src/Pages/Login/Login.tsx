import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import {
  login,
  type LoginPayload,
  type LoginResponse,
} from "../../services/authService";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {

    setLoginError(null);
    if (!email.trim() || !senha.trim()) {
      setLoginError("E-mail e senha são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const payload: LoginPayload = { email, senha };
      const response: LoginResponse = await login(payload);

      localStorage.setItem("token", response.token);
      localStorage.setItem("usuario_id", response.usuario_id);

      navigate("/perfil");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Falha no login. Verifique suas credenciais ou tente novamente mais tarde.";
      setLoginError(errorMessage);
      console.error(
        "Erro ao fazer login:",
        errorMessage,
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mainLogin">
      <div className="card-container">
        <section className="card">
          <Link to="/" className="logo-login">
            Ferramenta
          </Link>
          <p className="subtitle">Entre para continuar</p>

          <input
            type="email"
            placeholder="Insira seu e-mail"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Insira sua senha"
            className="input"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
          />

          {loginError && (
            <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
              {loginError}
            </p>
          )}

          <div className="options">
            <label className="checkbox">
              <input type="checkbox" disabled={loading} />
              Continuar conectado
            </label>
            <a href="#" className="forgot">
              Esqueceu sua senha?
            </a>
          </div>

          <button
            className="btn-login"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="redirect">
            Não tem uma conta? <Link to="/register">Cadastre-se</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Login;
