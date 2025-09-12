import React, { useState, useEffect } from "react";
import "./SelecionarUsuarios.css";

interface Usuario {
  usuario_id: string; // mudou para string por ser UUID
  nome_usuario: string;
  github: string;
}

interface SelecionarUsuariosProps {
  onSelecionar: (usuarios: Usuario[]) => void;
}

const SelecionarUsuarios: React.FC<SelecionarUsuariosProps> = ({
  onSelecionar,
}) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL; // pegar do Vite
        console.log("Buscando usuários em:", `${baseUrl}/user/list/github`);
        const res = await fetch(`${baseUrl}/user/list/github`);
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data: Usuario[] = await res.json();
        setUsuarios(data.filter((u) => u.github !== ""));
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsuarios();
  }, []);

  const toggleUsuario = (id: string) => {
    let novosSelecionados;
    if (selecionados.includes(id)) {
      novosSelecionados = selecionados.filter((i) => i !== id);
    } else {
      novosSelecionados = [...selecionados, id];
    }
    setSelecionados(novosSelecionados);

    const usuariosSelecionados = usuarios.filter((u) =>
      novosSelecionados.includes(u.usuario_id)
    );
    onSelecionar(usuariosSelecionados);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <label
        style={{ fontWeight: "bold", marginBottom: "0.5rem", display: "block" }}
      >
        Selecione os membros da equipe:
      </label>
      {usuarios.map((usuario) => (
        <div
          key={usuario.usuario_id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <input
            type="checkbox"
            checked={selecionados.includes(usuario.usuario_id)}
            onChange={() => toggleUsuario(usuario.usuario_id)}
          />
          <span style={{ marginLeft: "0.5rem" }}>{usuario.nome_usuario}</span>
        </div>
      ))}
    </div>
  );
};

export default SelecionarUsuarios;
