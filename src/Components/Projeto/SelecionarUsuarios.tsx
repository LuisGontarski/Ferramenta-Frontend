import React, { useState, useEffect, useRef } from "react";
import "./SelecionarUsuarios.css";

interface Usuario {
  usuario_id: string;
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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL;
        const url = `${baseUrl}/user/list/github${
          search ? `?search=${search}` : ""
        }`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Erro ao buscar usuários");

        const data: Usuario[] = await res.json();
        setUsuarios(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        isFirstLoad.current = false;
      }
    };

    const timeout = setTimeout(fetchUsuarios, 400); // debounce
    return () => clearTimeout(timeout);
  }, [search]);

  const toggleUsuario = (id: string) => {
    const novosSelecionados = selecionados.includes(id)
      ? selecionados.filter((i) => i !== id)
      : [...selecionados, id];

    setSelecionados(novosSelecionados);

    const usuariosSelecionados = usuarios.filter((u) =>
      novosSelecionados.includes(u.usuario_id)
    );
    onSelecionar(usuariosSelecionados);
  };

  const renderMensagem = () => {
    if (loading) return <p className="mensagem_info">Buscando usuários...</p>;
    if (usuarios.length === 0 && !isFirstLoad.current)
      return <p className="mensagem_info">Nenhum usuário encontrado.</p>;
    return null;
  };

  return (
    <div className="selecionar_usuarios_container">
      <label className="titulo_usuarios">Selecione os membros da equipe:</label>

      <input
        type="text"
        className="input_pesquisa"
        placeholder="Pesquisar usuário..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {renderMensagem()}

      {!loading &&
        usuarios.map((usuario) => (
          <div
            key={usuario.usuario_id}
            className="usuario_item"
            onClick={() => toggleUsuario(usuario.usuario_id)}
          >
            <input
              type="checkbox"
              checked={selecionados.includes(usuario.usuario_id)}
              readOnly
            />
            <span>{usuario.nome_usuario}</span>
          </div>
        ))}
    </div>
  );
};

export default SelecionarUsuarios;
