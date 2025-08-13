import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const EsqueceuSenha = () => {
  return (
    <main className="mainLogin">
      <div className="left_card_login">
        <div className="left_card_login_content">
          <h2 className="left_card_titulo">Recuperar Senha</h2>
          <h2>Não se preocupe, isso acontece com todos nós. Digite seu email e enviaremos um link para redefinir sua senha.</h2>
        </div>
      </div>
      <div className="card_container_login">
        <section className="card_login">
          <div className="header_login">
            <Link to="/" className="logo-login">Esqueceu sua senha?</Link>
            <p className="subtitle">Digite seu email para receber as instruções de recuperação</p>
          </div>
          <div>
            <h2 className="titulos_inputs_login">Email</h2>
            <input
              type="email"
              placeholder="seu@gmail.com"
              className="input_login"
            />
          </div>
          <button className="btn-login">Enviar instruções</button>

          <p className="redirect_login">
            Lembrou da senha? <Link to="/login">Login</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default EsqueceuSenha;
