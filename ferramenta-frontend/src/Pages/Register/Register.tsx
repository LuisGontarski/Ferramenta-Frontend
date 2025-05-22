import React, { useState } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import { register } from "../../api/register";

const Register: React.FC = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleRegister = async () => {
    try {
      const response = await register({ nome, email, senha });
      console.log("Cadastro bem-sucedido:", response);
      // Aqui você pode redirecionar o usuário ou mostrar uma mensagem de sucesso
    } catch (error: any) {
      console.error("Erro ao fazer cadastro:", error.message || error);
      alert("Cadastro falhou: " + (error.message || "Tente novamente."));
    }
  };

  return (
    <main className="mainRegister">
      <div className="card-container">
        <section className="card">
          <Link to="/home" className="logo-register">
            Ferramenta
          </Link>
          <p className="subtitle">Crie sua conta</p>

          <input
            type="text"
            placeholder="Seu nome completo"
            className="input"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input type="email" placeholder="Seu e-mail" className="input" />
          <input
            type="password"
            placeholder="Crie uma senha"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirme sua senha"
            className="input"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button className="btn-register" onClick={handleRegister}>
            Cadastrar
          </button>

          <p className="redirect">
            Já tem uma conta? <Link to="/login">Entrar</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Register;
