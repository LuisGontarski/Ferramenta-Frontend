import "./Documentos.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { useState } from "react";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";

const Documentos = () => {
    const [documentos, setDocumentos] = useState<File[]>([]);

    const handleAdicionarDocumento = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arquivos = Array.from(e.target.files || []);
        setDocumentos((prevDocs) => [...prevDocs, ...arquivos]);
    };

    const abrirInputArquivo = () => {
        const input = document.getElementById("input_arquivo") as HTMLInputElement | null;
        input?.click();
    };

    return (
        <>
            <NavbarHome />
            <div className="container_conteudos">
                <MenuLateral />
                <div className="container_vertical_conteudos">
                    <div className="card_atualizacoes">
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
                                {documentos.map((doc, index) => (
                                    <div className="documento_item" key={index}>
                                        <span className="documento_nome">{doc.name}</span>
                                        <a
                                            href={URL.createObjectURL(doc)}
                                            download={doc.name}
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
