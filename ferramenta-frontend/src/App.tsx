import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Projetos from './Pages/Projetos/projetos';
import Perfil from './Pages/Perfil/Perfil';
import ProjetosDetalhes from './Pages/ProjetosDetalhes/ProjetosDetalhes';

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
      </Routes>
    </Router>
  );
}

export default App;
