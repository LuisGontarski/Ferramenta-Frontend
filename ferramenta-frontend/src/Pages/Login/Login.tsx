import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <main className="mainLogin">
      <div className="card-container">
        <section className="card">
          <Link to="/home" className="logo-login">
            Ferramenta
          </Link>
          <p className="subtitle">Entre para continuar</p>

          <input
            type="email"
            placeholder="Insira seu e-mail"
            className="input"
          />
          <input
            type="password"
            placeholder="Insira sua senha"
            className="input"
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

          <button className="btn-login">Entrar</button>

          <p className="redirect">
            Não tem uma conta? <Link to="/register">Cadastre-se</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Login;
