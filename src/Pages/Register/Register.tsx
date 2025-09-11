import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/registerService";
import type { UserDTO, ResponseUserDTO } from "../../dtos/userDTO";
import * as ft_validator from "../../utils/validatorUtils";
import "./Register.css";

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [cargoOutro, setCargoOutro] = useState("");

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

  // Avança para o próximo step com validação
  const handleNextStep = () => {
    if (step === 1) {
      const currentValidationErrors: Record<string, string> = {};

      const nomeError = ft_validator.validateRequired(nome, "Nome");
      if (nomeError) currentValidationErrors.nome = nomeError;

      let emailErrorMsg = ft_validator.validateRequired(email, "E-mail");
      if (!emailErrorMsg && email) {
        emailErrorMsg = ft_validator.validateEmailFormat(email);
      }
      if (emailErrorMsg) currentValidationErrors.email = emailErrorMsg;

      let senhaErrorMsg = ft_validator.validateRequired(senha, "Senha");
      if (!senhaErrorMsg && senha) {
        senhaErrorMsg = ft_validator.validatePasswordLength(senha, 6);
      }
      if (senhaErrorMsg) currentValidationErrors.senha = senhaErrorMsg;

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
        if (confirmaSenhaErrorMsg)
          currentValidationErrors.confirmaSenha = confirmaSenhaErrorMsg;
      } else if (confirmaSenha) {
        currentValidationErrors.confirmaSenha =
          "Preencha o campo 'Crie uma senha' primeiro.";
      }

      setFieldErrors(currentValidationErrors);

      if (Object.keys(currentValidationErrors).length > 0) return;
    }

    setStep(step + 1);
  };

  // Payload unificado para salvar no sessionStorage ou enviar ao backend
  const getPayloadToSave = (): UserDTO => {
    const payload: UserDTO = {
      nome_usuario: nome,
      email,
      senha,
    };

    if (cargo && cargo !== "Não informar") {
      payload.cargo =
        cargo === "Outro" && cargoOutro.trim() !== ""
          ? cargoOutro.trim()
          : cargo;
    }

    if (showGithubInput && github.trim() !== "") {
      payload.github = github.trim();
    }

    return payload;
  };

  // Handler para cadastro direto
  const handleRegister = async () => {
    setError(null);
    const payloadToSend = getPayloadToSave();

    try {
      const response: ResponseUserDTO = await register(payloadToSend);
      if (response?.usuario_id) {
        localStorage.setItem("usuario_id", response.usuario_id);
        if (response.token) {
          localStorage.setItem("authToken", response.token);
        }

        localStorage.setItem("cargo", payloadToSend.cargo || "Não informar");

        navigate("/");
      } else {
        setError("Erro ao processar o cadastro após o envio. Tente novamente.");
      }
    } catch (err: any) {
      const backendErrorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erro desconhecido ao fazer cadastro. Verifique os dados e tente novamente.";
      setError(backendErrorMessage);
    }
  };

  // Handler para redirecionar ao GitHub
  const handleGithubConnect = () => {
    const payloadToSave = getPayloadToSave();
    sessionStorage.setItem(
      "pendingRegistration",
      JSON.stringify(payloadToSave)
    );

    // Redireciona para o login do GitHub
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github/login`;
  };

  return (
    <main className="mainLogin">
      <div className="left_card_login">
        <div className="left_card_login_content">
          <h2 className="left_card_titulo">ReProject</h2>
          <h2>
            <span>Organize</span> seus projetos <span>Conecte</span> seus
            repositórios <span>Simplifique</span> seu fluxo.
          </h2>
          <div className="etapas-indicador">
            <div className="etapas-numeros">
              <span className={step >= 1 ? "etapa ativa" : "etapa"}>1</span>
              <div className={step >= 2 ? "barra ativa" : "barra"}></div>
              <span className={step >= 2 ? "etapa ativa" : "etapa"}>2</span>
              <div className={step >= 3 ? "barra ativa" : "barra"}></div>
              <span className={step >= 3 ? "etapa ativa" : "etapa"}>3</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card_container_login">
        <section className="card_login">
          <Link to="/" className="logo-register">
            Crie sua conta
          </Link>

          {error && <p className="error-message">{error}</p>}

          {/* Step 1 */}
          {step === 1 && (
            <>
              <div>
                <h2 className="titulos_inputs_login">Nome completo</h2>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  className="input_login"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, nome: "" }));
                  }}
                />
                {fieldErrors.nome && (
                  <p className="field-error-message">{fieldErrors.nome}</p>
                )}
              </div>

              <div>
                <h2 className="titulos_inputs_login">Email</h2>
                <input
                  type="email"
                  placeholder="Seu email"
                  className="input_login"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: "" }));
                  }}
                />
                {fieldErrors.email && (
                  <p className="field-error-message">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <h2 className="titulos_inputs_login">Senha</h2>
                <input
                  type="password"
                  placeholder="Crie uma senha"
                  className="input_login"
                  value={senha}
                  onChange={(e) => {
                    setSenha(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, senha: "" }));
                  }}
                />
                {fieldErrors.senha && (
                  <p className="field-error-message">{fieldErrors.senha}</p>
                )}
              </div>

              <div>
                <h2 className="titulos_inputs_login">Confirmar senha</h2>
                <input
                  type="password"
                  placeholder="Confirme sua senha"
                  className="input_login"
                  value={confirmaSenha}
                  onChange={(e) => {
                    setConfirmaSenha(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, confirmaSenha: "" }));
                  }}
                />
                {fieldErrors.confirmaSenha && (
                  <p className="field-error-message">
                    {fieldErrors.confirmaSenha}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="div_cargo">
              <label className="titulos_inputs_login">Cargo:</label>
              <div className="cargo-options">
                {[
                  "Desenvolvedor",
                  "Scrum Master",
                  "Product Owner",
                  "Outro",
                ].map((c) => (
                  <div
                    key={c}
                    className={`cargo-option ${cargo === c ? "selected" : ""}`}
                    onClick={() => {
                      setCargo(c);
                      if (c !== "Outro") setCargoOutro("");
                    }}
                  >
                    <div className="icon">
                      {c === "Desenvolvedor"
                        ? "</>"
                        : c === "Scrum Master"
                        ? "👥"
                        : c === "Product Owner"
                        ? "🎯"
                        : "⚙️"}
                    </div>
                    <div>
                      <strong>{c}</strong>
                      <p>
                        {c === "Desenvolvedor"
                          ? "Escrevo código e desenvolvo funcionalidades"
                          : c === "Scrum Master"
                          ? "Facilito processos ágeis e removo impedimentos"
                          : c === "Product Owner"
                          ? "Defino requisitos e priorizo o backlog"
                          : "Minha função não está listada acima"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {cargo === "Outro" && (
                <div className="cargo-outro-input">
                  <label htmlFor="cargoOutro" className="label-register">
                    Descreva sua função:
                  </label>
                  <input
                    type="text"
                    id="cargoOutro"
                    name="cargoOutro"
                    placeholder="Digite sua função"
                    className="input_login"
                    value={cargoOutro}
                    onChange={(e) => setCargoOutro(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <div className="github-card">
                <i className="fa-brands fa-github icone_git_maior"></i>
                <h2 className="github-title">Conectar ao GitHub</h2>
                <p className="github-description">
                  Sincronize seus repositórios do GitHub para gerenciar seus
                  projetos.
                </p>
                <button
                  className="github-connect-button"
                  onClick={handleGithubConnect}
                >
                  <i className="fa-brands fa-github icone_git_menor"></i>
                  Conectar GitHub
                </button>
              </div>
            </div>
          )}

          <button
            className="btn-login"
            onClick={step < 3 ? handleNextStep : handleRegister}
          >
            {step < 3 ? "Continuar" : "Cadastrar"}
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
