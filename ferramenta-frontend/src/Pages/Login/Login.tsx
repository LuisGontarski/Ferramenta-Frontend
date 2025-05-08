import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <main className="main">
      <div className="card-container">
        <section className="card">
          <h1>Zencore</h1>
          <p>Entre para continuar</p>
          <input type="text" name="" id="" placeholder="Insira seu email..." />
          <input
            type="password"
            name=""
            id=""
            placeholder="Insira sua senha..."
          />
          <div className="checkbox-container">
            <input type="checkbox" id="manterConectado" />
            <label htmlFor="manterConectado">Continuar conectado</label>
          </div>
          <button className="btn-login">Entrar</button>
          <div className="links-container">
            <a href="/">Esqueci minha senha</a>
            <div className="divider"></div>
            <a href="/">Criar conta</a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
