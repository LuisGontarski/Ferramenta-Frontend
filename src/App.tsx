import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Projetos from './Pages/Projetos/projetos';
import Perfil from './Pages/Perfil/Perfil';
import ProjetosDetalhes from './Pages/ProjetosDetalhes/ProjetosDetalhes';
import Kanban from './Pages/Kanban/Kanban';
import EsqueceuSenha from './Pages/EsqueceuSenha/EsqueceuSenha';
import Documentos from './Pages/Documentos/Documentos';
import Requisitos from './Pages/Requisitos/Requisitos';
import Cronograma from './Pages/Cronograma/Cronograma';
import ChatWrapper from './Pages/Chat/ChatWrapper';
import GithubSuccess from './Pages/Register/GithubSucess';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/projetosDetalhes" element={<ProjetosDetalhes />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/esqueceuSenha" element={<EsqueceuSenha />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/requisitos" element={<Requisitos />} />
        <Route path="/cronograma" element={<Cronograma />} />
        <Route path="/chat/:projeto_id" element={<ChatWrapper />} />
        <Route path="/github-success" element={<GithubSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
