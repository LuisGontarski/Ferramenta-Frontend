import React, { useState } from "react";
import "./PerfilEditar.css";

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
  const [preview, setPreview] = useState(usuario.foto_perfil);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        setFormData({ ...formData, foto_perfil: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelarFoto = () => {
    setPreview(usuario.foto_perfil);
    setFormData({ ...formData, foto_perfil: usuario.foto_perfil });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) {
      alert("Nome e e-mail são obrigatórios!");
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
          {/* Prévia da foto */}
          <div className="foto_preview_container">
            {preview ? (
              <img
                src={preview}
                alt="Prévia da foto"
                className="foto_preview"
              />
            ) : (
              <div className="avatar_iniciais">
                {formData.nome
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>

          {/* Upload de arquivo */}
          <label>Enviar sua foto:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button
            type="button"
            className="btn_cancelar_foto"
            onClick={handleCancelarFoto}
          >
            Cancelar Foto
          </button>

          {/* Outros campos */}
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />

          <label>Cargo</label>
          <input
            type="text"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>GitHub</label>
          <input
            type="text"
            name="github"
            value={formData.github}
            onChange={handleChange}
          />

          <div className="modal_footer">
            <button type="submit" className="btn_salvar">
              Salvar
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
