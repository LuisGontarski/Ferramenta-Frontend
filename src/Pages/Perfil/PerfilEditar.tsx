import React, { useState } from "react";
import "./PerfilEditar.css";
import { toast } from "react-hot-toast";

interface PerfilEditarProps {
  usuario: {
    nome: string;
    cargo: string;
    email: string;
    github: string;
    foto_perfil: string;
  };
  onClose: () => void;
  onSave: (usuarioEditado: any) => void;
}

const PerfilEditar: React.FC<PerfilEditarProps> = ({
  usuario,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState(usuario);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email) {
      // ✅ Validação com toast
      toast.error("Nome e e-mail são obrigatórios!");
      return;
    }

    onSave(formData);
    onClose();
  };
  return (
    <div className="modal_overlay" id="editar_modal">
      <div className="modal_container">
        <div className="modal_header">
          <h2>Editar Perfil</h2>
          <button className="btn_fechar" onClick={onClose}>
            X
          </button>
        </div>

        <form className="modal_body" onSubmit={handleSubmit}>
          {/* Campos Editáveis */}
          <label>Nome *</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
            required
          />

          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu.email@exemplo.com"
            required
          />

          {/* Campos Somente Leitura */}
          <label>Cargo</label>
          <input
            type="text"
            name="cargo"
            value={formData.cargo}
            disabled
            className="campo-desabilitado"
          />

          <label>GitHub</label>
          <input
            type="text"
            name="github"
            value={formData.github}
            disabled
            className="campo-desabilitado"
          />

          <div className="info-observacao">
            <p>💡 Apenas nome e e-mail podem ser editados.</p>
          </div>

          <div className="modal_footer">
            <button type="submit" className="btn_salvar">
              Salvar Alterações
            </button>
            <button type="button" className="btn_cancelar" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerfilEditar;
