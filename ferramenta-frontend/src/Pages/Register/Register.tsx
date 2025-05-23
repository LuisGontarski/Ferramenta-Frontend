import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/registerService";
import type { UserDTO } from "../../dtos/userDTO";

const Register: React.FC = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const userPayload: UserDTO = {
      usuario_id: "", // pode ser vazio, backend deve gerar
      nome_usuario: nome,
      email: email,
      senha: senha,
      cargo: "usuário",   // valor padrão
      github: "",         // pode ser preenchido depois
      foto_perfil: ""     // idem
    };

    try {
      const response = await register(userPayload);
      console.log("Cadastro bem-sucedido:", response);

      // ✅ Salva o ID no localStorage
      localStorage.setItem("usuario_id", response.usuario_id);

      navigate("/");
    } catch (error: any) {
      console.error("Erro ao fazer cadastro:", error.message || error);
      var inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        input.style.border = "1px solid red";
      });
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
          <input
            type="email"
            placeholder="Seu e-mail"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Crie uma senha"
            className="input"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirme sua senha"
            className="input"
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
