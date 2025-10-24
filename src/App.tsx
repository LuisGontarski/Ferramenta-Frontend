import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ Importar o Toaster
import HomePage from "./Pages/HomePage/HomePage";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Projetos from "./Pages/Projetos/projetos";
import Perfil from "./Pages/Perfil/Perfil";
import ProjetosDetalhes from "./Pages/ProjetosDetalhes/ProjetosDetalhes";
import Kanban from "./Pages/Kanban/Kanban";
import EsqueceuSenha from "./Pages/EsqueceuSenha/EsqueceuSenha";
import Documentos from "./Pages/Documentos/Documentos";
import Requisitos from "./Pages/Requisitos/Requisitos";
import Cronograma from "./Pages/Cronograma/Cronograma";
import ChatWrapper from "./Pages/Chat/ChatWrapper";
import GithubErrorIntegration from "./Pages/Register/GithubErrorIntegration";
import GithubSuccessIntegration from "./Pages/Register/GithubSuccessIntegration";
import HistoricoProjetoWrapper from "./Pages/Historico/HistoricoProjetoWrapper";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/projetosDetalhes/:id" element={<ProjetosDetalhes />} />
          <Route path="/kanban/:id" element={<Kanban />} />
          <Route path="/esqueceuSenha" element={<EsqueceuSenha />} />
          <Route path="/documentos/:id" element={<Documentos />} />
          <Route path="/requisitos/:id" element={<Requisitos />} />
          <Route path="/cronograma/:id" element={<Cronograma />} />
          <Route path="/chat/:projeto_id" element={<ChatWrapper />} />
          <Route
            path="/github-error-integration"
            element={<GithubErrorIntegration />}
          />
          <Route
            path="/github-success-integration"
            element={<GithubSuccessIntegration />}
          />
          <Route
            path="/historico/:projeto_id"
            element={<HistoricoProjetoWrapper />}
          />
        </Routes>
      </Router>

      {/* ✅ Toaster Global - Adicione esta linha */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
          loading: {
            duration: Infinity, // Loading fica até ser substituído
            iconTheme: {
              primary: "#3b82f6",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}

export default App;
