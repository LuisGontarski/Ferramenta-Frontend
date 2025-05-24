import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/registerService";
import type { UserDTO, ResponseUserDTO } from "../../dtos/userDTO";
import * as ft_validator from "../../utils/validatorUtils";

const Register: React.FC = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [cargo, setCargo] = useState("Não informar");
  const [github, setGithub] = useState("");
  const [showGithubInput, setShowGithubInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(null);
    document.querySelectorAll("input, select").forEach((input) => {
      (input as HTMLElement).style.border = "";
    });

    const currentValidationErrors: Record<string, string> = {};

    const nomeError = ft_validator.validateRequired(nome, "Nome");
    if (nomeError) {
      currentValidationErrors.nome = nomeError;
    }

    let emailErrorMsg = ft_validator.validateRequired(email, "E-mail");
    if (!emailErrorMsg && email) {
      emailErrorMsg = ft_validator.validateEmailFormat(email);
    }
    if (emailErrorMsg) {
      currentValidationErrors.email = emailErrorMsg;
    }

    let senhaErrorMsg = ft_validator.validateRequired(senha, "Senha");
    if (!senhaErrorMsg && senha) {
      senhaErrorMsg = ft_validator.validatePasswordLength(senha, 6);
    }
    if (senhaErrorMsg) {
      currentValidationErrors.senha = senhaErrorMsg;
    }

    if (senha) {
      let confirmaSenhaErrorMsg = ft_validator.validateRequired(
        confirmaSenha,
        "Confirmação de senha"
      );
      if (!confirmaSenhaErrorMsg && confirmaSenha) {
        confirmaSenhaErrorMsg = ft_validator.validatePasswordMatch(
          senha,
          confirmaSenha
        );
      }
      if (confirmaSenhaErrorMsg) {
        currentValidationErrors.confirmaSenha = confirmaSenhaErrorMsg;
      }
    } else if (confirmaSenha) {
      currentValidationErrors.confirmaSenha =
        "Preencha o campo 'Crie uma senha' primeiro.";
    }

    setFieldErrors(currentValidationErrors);

    if (Object.keys(currentValidationErrors).length > 0) {
      Object.keys(currentValidationErrors).forEach((key) => {
        const el = document.querySelector(`[name="${key}"]`) as HTMLElement;
        if (el) {
          el.style.border = "1px solid red";
        }
      });
      return;
    }

    const payloadToSend: UserDTO = {
      nome_usuario: nome,
      email: email,
      senha: senha,
    };

    if (cargo && cargo !== "Não informar") {
      payloadToSend.cargo = cargo;
    }

    if (showGithubInput && github.trim() !== "") {
      payloadToSend.github = github.trim();
    }

    try {
      const response: ResponseUserDTO = await register(payloadToSend);
      console.log("Cadastro bem-sucedido:", response);

      if (response && response.usuario_id) {
        localStorage.setItem("usuario_id", response.usuario_id);
        if (response.token) {
          localStorage.setItem("authToken", response.token);
          // Adicionar lógica para configurar o header de autorização do Axios globalmente se necessário
          // Ex: axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        }
        navigate("/");
      } else {
        console.error(
          "Resposta do backend inválida ou não contém usuario_id:",
          response
        );
        setError("Erro ao processar o cadastro após o envio. Tente novamente.");
        document.querySelectorAll("input, select").forEach((input) => {
          (input as HTMLElement).style.border = "1px solid red";
        });
      }
    } catch (err: any) {
      console.error(
        "Erro ao fazer cadastro (catch):",
        err.response || err.message || err
      );
      const backendErrorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erro desconhecido ao fazer cadastro. Verifique os dados e tente novamente.";
      setError(backendErrorMessage);
      document.querySelectorAll("input, select").forEach((input) => {
        (input as HTMLElement).style.border = "1px solid red";
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

          {error && <p className="error-message">{error}</p>}

          <input
            type="text"
            placeholder="Seu nome completo"
            name="nome"
            className="input"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              setFieldErrors((prev) => ({ ...prev, nome: "" }));
              (e.target as HTMLElement).style.border = "";
            }}
          />
          {fieldErrors.nome && (
            <p className="field-error-message">{fieldErrors.nome}</p>
          )}

          <input
            type="email"
            placeholder="Seu e-mail"
            name="email"
            className="input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: "" }));
              (e.target as HTMLElement).style.border = "";
            }}
          />
          {fieldErrors.email && (
            <p className="field-error-message">{fieldErrors.email}</p>
          )}

          <input
            type="password"
            placeholder="Crie uma senha (mín. 6 caracteres)"
            name="senha"
            className="input"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setFieldErrors((prev) => ({ ...prev, senha: "" }));
              (e.target as HTMLElement).style.border = "";
            }}
          />
          {fieldErrors.senha && (
            <p className="field-error-message">{fieldErrors.senha}</p>
          )}

          <input
            type="password"
            placeholder="Confirme sua senha"
            name="confirmaSenha"
            className="input"
            value={confirmaSenha}
            onChange={(e) => {
              setConfirmaSenha(e.target.value);
              setFieldErrors((prev) => ({ ...prev, confirmaSenha: "" }));
              (e.target as HTMLElement).style.border = "";
            }}
          />
          {fieldErrors.confirmaSenha && (
            <p className="field-error-message">{fieldErrors.confirmaSenha}</p>
          )}

          <label htmlFor="cargo" className="label-register">
            Cargo:
          </label>
          <select
            id="cargo"
            name="cargo"
            className="input"
            value={cargo}
            onChange={(e) => {
              setCargo(e.target.value);
              (e.target as HTMLElement).style.border = "";
            }}
          >
            <option value="Não informar">Não informar</option>
            <option value="Desenvolvedor">Desenvolvedor</option>
            <option value="Scrum Master">Scrum Master</option>
            <option value="Product Owner">Product Owner</option>
          </select>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="showGithub"
              checked={showGithubInput}
              onChange={(e) => setShowGithubInput(e.target.checked)}
            />
            <label htmlFor="showGithub" className="label-checkbox">
              Deseja informar seu GitHub?
            </label>
          </div>

          {showGithubInput && (
            <>
              <label htmlFor="github" className="label-register">
                GitHub Username:
              </label>
              <input
                type="text"
                id="github"
                name="github"
                placeholder="Seu usuário do GitHub"
                className="input"
                value={github}
                onChange={(e) => {
                  setGithub(e.target.value);
                  (e.target as HTMLElement).style.border = "";
                }}
              />
            </>
          )}

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
