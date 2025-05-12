import React from "react";
import "./Register.css";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <main className="mainRegister">
      <div className="card-container">
        <section className="card">
          <Link to="/home" className="logo-register">Ferramenta</Link>
          <p className="subtitle">Crie sua conta</p>

          <input
            type="text"
            placeholder="Seu nome completo"
            className="input"
          />
          <input
            type="email"
            placeholder="Seu e-mail"
            className="input"
          />
          <input
            type="password"
            placeholder="Crie uma senha"
            className="input"
          />
          <input
            type="password"
            placeholder="Confirme sua senha"
            className="input"
          />

          <button className="btn-register">Cadastrar</button>

          <p className="redirect">
            Já tem uma conta? <Link to="/login">Entrar</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Register;
