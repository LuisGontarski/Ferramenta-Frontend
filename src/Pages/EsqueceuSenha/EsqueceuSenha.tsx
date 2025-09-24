import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabaseClient.js";

const EsqueceuSenha = () => {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const handleResetPassword = async () => {
    setMensagem("");
    setErro("");

    if (!email) {
      setErro("Por favor, digite seu email.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setErro(error.message);
    } else {
      setMensagem("Enviamos um link para redefinição de senha no seu email.");
    }
  };

  return (
    <main className="mainLogin">
      <div className="left_card_login">
        <div className="left_card_login_content">
          <h2 className="left_card_titulo">Recuperar Senha</h2>
          <h2 className="texto_slogan_login">Não se preocupe, isso acontece com todos nós. Digite seu email e enviaremos um link para redefinir sua senha.</h2>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button onClick={handleResetPassword} className="btn-login">
            Enviar instruções
          </button>

          {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
          {erro && <p style={{ color: "red" }}>{erro}</p>}

          <p className="redirect_login">
            <Link to="/login">Voltar</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default EsqueceuSenha;
