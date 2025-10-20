import "./Documentos.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

interface Documento {
  documento_id: string;
  nome_arquivo: string;
  caminho_arquivo: string;
  tamanho_arquivo: number;
  tipo_arquivo: string;
  criado_em: string;
}

const Documentos = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const { id: projeto_id } = useParams<{ id: string }>();

  // Função para buscar os documentos do projeto
  const fetchDocumentos = async () => {
    if (!projeto_id) return;
    try {
      const response = await axios.get(`${BASE_URL}/list/${projeto_id}`);
      setDocumentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
    }
  };
  
  // Executa a busca ao carregar o componente
  useEffect(() => {
    fetchDocumentos();
  }, [projeto_id]);

  // Função para enviar o arquivo para o backend
  const handleAdicionarDocumento = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo || !projeto_id) return;

    const formData = new FormData();
    formData.append("arquivo", arquivo); // 'arquivo' deve ser o mesmo nome usado no middleware do multer: upload.single('arquivo')
    formData.append("projeto_id", projeto_id);

    try {
      const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Atualiza a lista de documentos na tela com o novo arquivo
      setDocumentos(prevDocs => [response.data.documento, ...prevDocs]);
      alert("Arquivo enviado com sucesso!");

    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      alert("Falha ao enviar o arquivo.");
    }
  };

  const handleDeletarDocumento = async (docId: string, docName: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o arquivo "${docName}"?`)) {
      return;
    }

    try {
      // Em Documentos.tsx (parece correto)
      const response = await axios.delete(`${BASE_URL}/documentos/${docId}`); // Chama a API de exclusão

      if (response.status === 200) {
        // Remove o documento da lista na tela
        setDocumentos(prevDocs => prevDocs.filter(doc => doc.documento_id !== docId));
        alert("Documento excluído com sucesso!");
      } else {
        throw new Error(response.data.message || "Erro ao excluir documento");
      }
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
      alert("Falha ao excluir o documento.");
    }
  };

  const abrirInputArquivo = () => {
    const input = document.getElementById("input_arquivo") as HTMLInputElement | null;
    input?.click();
  };
  
  // Função para formatar o tamanho do arquivo
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

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
                <h2 className="subtitulo_documentos">Documentos e recursos relacionados</h2>
              </div>
              <button onClick={abrirInputArquivo} className="button_adicionar_arquivo">+ Adicionar Arquivo</button>
            </div>

            {documentos.length === 0 ? (
              <div className="div_nenhum_arquivo_documentos">
                <h2 className="subtitulo_documentos">Nenhum arquivo encontrado</h2>
              </div>
            ) : (
              <div className="lista_documentos">
                {documentos.map((doc) => (
                  <div className="documento_item" key={doc.documento_id}>
                    <div className="info_documento">
                        <span className="documento_nome">{doc.nome_arquivo}</span>
                        <span className="documento_detalhes">
                            {formatBytes(doc.tamanho_arquivo)} - {new Date(doc.criado_em).toLocaleDateString()}
                        </span>
                    </div>
                    {/* O link para download agora aponta para o caminho servido pelo back-end */}
                    <a
                      href={`/${doc.caminho_arquivo.replace(/\\/g, '/')}`} 
                      download={doc.nome_arquivo} 
                      className="documento_download"
                      title="Baixar arquivo"
                    >
                    
                      <i className="fa-solid fa-download"></i> 
                    </a>
                    <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Impede clique no link pai
                          handleDeletarDocumento(doc.documento_id, doc.nome_arquivo);
                        }}
                        className="documento_delete"
                        title="Excluir arquivo"
                      >
                         <i className="fa-solid fa-trash"></i> {/* Exemplo com ícone */}
                      </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              id="input_arquivo"
              style={{ display: "none" }}
              onChange={handleAdicionarDocumento}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Documentos;