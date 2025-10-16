import "./Documentos.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { useState, useEffect } from "react";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";

interface Documento {
  documento_id: string;
  nome_arquivo: string;
  caminho_arquivo: string;
  tipo_arquivo: string;
  tamanho_arquivo: number;
  criado_em: string;
}

const Documentos = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [arquivos, setArquivos] = useState<File[]>([]);

  const projeto_id = localStorage.getItem("projeto_id");

  useEffect(() => {
    if (!projeto_id) return;
    listarDocumentos();
  }, [projeto_id]);

  const listarDocumentos = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/documento/list/${projeto_id}`
      );
      if (!res.ok) throw new Error("Erro ao buscar documentos");
      const data: Documento[] = await res.json();
      setDocumentos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdicionarDocumento = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivosSelecionados = Array.from(e.target.files || []);
    setArquivos(arquivosSelecionados);
  };

  const abrirInputArquivo = () => {
    const input = document.getElementById(
      "input_arquivo"
    ) as HTMLInputElement | null;
    input?.click();
  };

  const handleUpload = async () => {
    if (!projeto_id || arquivos.length === 0) {
      alert("Selecione arquivos para enviar.");
      return;
    }

    const formData = new FormData();
    arquivos.forEach((file) => formData.append("arquivos", file));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/documento/upload/${projeto_id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data: Documento[] = await res.json();
      setDocumentos((prev) => [...prev, ...data]);
      setArquivos([]);
      alert("Arquivos enviados com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar arquivos.");
    }
  };

  return (
    <>
      <NavbarHome />
      <div className="container_conteudos">
        <MenuLateral />
        <div className="container_vertical_conteudos">
          <div className="card_documentos">
            <div className="div_adicionar_arquivo_documentos">
              <div className="div_titulo_documentos">
                <h2 className="titulo_documentos">Arquivos do Projeto</h2>
                <h2 className="subtitulo_documentos">
                  Documentos e recursos relacionados
                </h2>
              </div>
              <button
                onClick={abrirInputArquivo}
                className="button_adicionar_arquivo"
              >
                + Adicionar Arquivo
              </button>
              {arquivos.length > 0 && (
                <button
                  onClick={handleUpload}
                  className="button_adicionar_arquivo"
                  style={{ marginLeft: "0.5rem" }}
                >
                  Enviar Arquivos
                </button>
              )}
            </div>

            {documentos.length === 0 ? (
              <div className="div_nenhum_arquivo_documentos">
                <h2 className="subtitulo_documentos">
                  Nenhum arquivo encontrado
                </h2>
              </div>
            ) : (
              <div className="lista_documentos">
                {documentos.map((doc) => (
                  <div className="documento_item" key={doc.documento_id}>
                    <span className="documento_nome">{doc.nome_arquivo}</span>
                    <a
                      href={`${import.meta.env.VITE_API_URL}/${
                        doc.caminho_arquivo
                      }`}
                      download={doc.nome_arquivo}
                      className="documento_download"
                      title="Baixar arquivo"
                    >
                      <i className="fa-solid fa-download"></i>
                    </a>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              id="input_arquivo"
              style={{ display: "none" }}
              onChange={handleAdicionarDocumento}
              multiple
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Documentos;
