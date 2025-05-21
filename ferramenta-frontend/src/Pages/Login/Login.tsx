import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { login } from "../../api/auth";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      const response = await login({ email, senha });
      console.log("Login bem-sucedido:", response);

      // Exemplo: salvar token
      localStorage.setItem("token", response.token);
      // Aqui você pode redirecionar o usuário, ex: navigate("/dashboard")
      console.log(response.token);

    } catch (error: any) {
      console.error("Erro ao fazer login:", error.message || error);
      alert("Login falhou: " + (error.message || "Verifique suas credenciais."));
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
          />
          <input
            type="password"
            placeholder="Insira sua senha"
            className="input"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div className="options">
            <label className="checkbox">
              <input type="checkbox" />
              Continuar conectado
            </label>
            <a href="/" className="forgot">
              Esqueceu sua senha?
            </a>
          </div>

          <button className="btn-login" onClick={handleLogin}>
            Entrar
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
