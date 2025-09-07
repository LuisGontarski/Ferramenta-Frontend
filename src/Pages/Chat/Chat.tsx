import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Chat.css";

interface ChatProps {
  projeto_id: string;
  usuario_id: string;
  usuario_nome: string;
}

interface Mensagem {
  usuario_id: string;
  usuario_nome: string;
  texto: string;
  data_envio: string;
}

// Conectando com o Socket.io do backend
const socket = io("http://localhost:3000"); // coloque a URL do seu backend

const Chat: React.FC<ChatProps> = ({
  projeto_id,
  usuario_id,
  usuario_nome,
}) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    if (!projeto_id) return;

    // Entrar na sala do projeto
    socket.emit("joinProject", projeto_id);

    // Receber novas mensagens
    socket.on("newMessage", (mensagem: Mensagem) => {
      setMensagens((prev) => [...prev, mensagem]);
    });

    // Limpar listeners ao desmontar
    return () => {
      socket.off("newMessage");
    };
  }, [projeto_id]);

  const enviarMensagem = () => {
    if (!texto.trim() || !projeto_id) return;

    const mensagem: Mensagem = {
      usuario_id,
      usuario_nome,
      texto,
      data_envio: new Date().toISOString(),
    };

    // Emitir mensagem para o backend
    socket.emit("sendMessage", {
      ...mensagem,
      projeto_id,
    });

    setTexto(""); // limpar input
  };

  return (
    <div className="chat-container">
      <h2>Chat do Projeto</h2>
      <div className="chat-messages">
        {mensagens.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${
              msg.usuario_id === usuario_id ? "mine" : ""
            }`}
          >
            <strong>{msg.usuario_nome}:</strong> {msg.texto}
            <span className="chat-date">
              {new Date(msg.data_envio).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite sua mensagem..."
          onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
        />
        <button onClick={enviarMensagem}>Enviar</button>
      </div>
    </div>
  );
};

export default Chat;
