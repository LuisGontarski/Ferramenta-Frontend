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
      <div className="left_card_login">
        <div className="left_card_login_content">
          <h2 className="left_card_titulo">ReProject</h2>
          <h2><span>Organize</span> seus projetos <span>Conecte</span> seus repositórios <span>Simplifique</span> seu fluxo.</h2>
        </div>
      </div>
      <div className="card_container_login">
        <section className="card_login">
          <div className="header_login">
            <Link to="/" className="logo-login">Acesse sua conta</Link>
            <p className="subtitle">Entre para continuar</p>
          </div>
          <div>
            <h2 className="titulos_inputs_login">Email</h2>
            <input
              type="email"
              placeholder="Insira seu e-mail"
              className="input_login"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <h2 className="titulos_inputs_login">Senha</h2>
            <input
              type="password"
              placeholder="Insira sua senha"
              className="input_login"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
            />
          </div>


          {loginError && (
            <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
              {loginError}
            </p>
          )}

          <div className="options">
            <label className="checkbox_login">
              <input type="checkbox" disabled={loading} />
              Continuar conectado
            </label>
            <Link to={"/esqueceuSenha"}>
            <a href="#" className="forgot">
              Esqueceu sua senha?
            </a>
            </Link>
            
          </div>

          <button
            className="btn-login"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="redirect_login">
            Não tem uma conta? <Link to="/register">Cadastre-se</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Login;
