import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import {
  login,
  type LoginPayload,
  type LoginResponse,
} from "../../services/authService";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      localStorage.setItem("cargo", response.cargo || "Não informar");
      localStorage.setItem(
        "github_token",
        response.github_token || "Não informar"
      );
      localStorage.setItem("usuario_nome", response.usuario_nome || "Usuário");

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
          <h2 className="texto_slogan_login">
            <span>Organize</span> seus projetos, <span>Conecte</span> seus
            repositórios, <span>Simplifique</span> seu fluxo.
          </h2>
        </div>
      </div>
      <div className="card_container_login">
        <section className="card_login">
          <div className="header_login">
            <span className="logo-login">Acesse e otimize sua gestão</span>
            <p className="subtitle">Entre com suas credenciais</p>
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
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Insira sua senha"
                className="input_login"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {loginError && (
            <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
              {loginError}
            </p>
          )}

          <button
            className="btn-login"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <div className="footer_login">
            {/* <Link to={"/esqueceuSenha"}>
                Esqueceu sua senha?
            </Link> */}
            <p className="redirect_login">
              Não tem uma conta? <Link to="/register">Cadastre-se</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
