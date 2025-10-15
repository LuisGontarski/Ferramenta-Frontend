import React, { useEffect, useState, useRef } from "react";
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

// Conexão com Socket.io usando variável do .env
const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000");

const Chat: React.FC<ChatProps> = ({
  projeto_id,
  usuario_id,
  usuario_nome,
}) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rolagem automática para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  useEffect(() => {
    if (!projeto_id) return;

    // Entrar na sala do projeto
    socket.emit("joinProject", projeto_id);

    // Receber histórico do backend
    socket.on("messageHistory", (msgs: Mensagem[]) => {
      setMensagens(msgs);
    });

    // Receber novas mensagens
    socket.on("newMessage", (msg: Mensagem) => {
      setMensagens((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("messageHistory");
      socket.off("newMessage");
    };
  }, [projeto_id]);

  const enviarMensagem = () => {
    if (!texto.trim() || !projeto_id) return;

    socket.emit("sendMessage", {
      usuario_id,
      usuario_nome,
      projeto_id,
      texto,
    });

    setTexto("");
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
              {new Date(msg.data_envio).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
