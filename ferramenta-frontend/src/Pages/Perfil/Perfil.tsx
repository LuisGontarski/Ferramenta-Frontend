import "./Perfil.css";
import imgPerfil from '../../assets/img_perfil.jpeg';
import NavbarHome from "../../Components/Navbar/NavbarHome";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const dataDistribuicao = [
  { name: 'Projeto A', value: 40 },
  { name: 'Projeto B', value: 30 },
  { name: 'Projeto C', value: 30 },
];

const dataCommits = [
  { name: 'Projeto A', commits: 24 },
  { name: 'Projeto B', commits: 13 },
  { name: 'Projeto C', commits: 32 },
];

const dataHoras = [
  { dia: 'Seg', horas: 5 },
  { dia: 'Ter', horas: 7 },
  { dia: 'Qua', horas: 4 },
  { dia: 'Qui', horas: 6 },
  { dia: 'Sex', horas: 3 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Perfil = () => {
  return (
    <>
      <div>
        <NavbarHome />
      </div>
      <div className="container_perfil">
        <div className="card_perfil">
          <div className="div_foto_perfil">
            <img src={imgPerfil} alt="testes" className="foto_perfil" />
            <h2 className="texto_foto_perfil">Gustavo Capeletti</h2>
            <h2 className="texto_cargo">Desenvolvedor Frontend</h2>
          </div>
          <div className="container_icones_perfil">
            <div className="div_icones_perfil">
              <i className="fa-regular fa-envelope icones_perfil"></i>
              <h2 className="texto_dados">gustavo.capeletti@gmail.com</h2>
            </div>
            <div className="div_icones_perfil">
              <i className="fa-brands fa-github icones_perfil"></i>
              <h2 className="texto_dados">github.com/IGDSCI</h2>
            </div>
            <div className="div_icones_perfil">
              <i className="fa-regular fa-calendar icones_perfil"></i>
              <h2 className="texto_dados">Ingressou em 15/03/2022</h2>
            </div>
          </div>
          
          <button className="btn_editar">Editar Perfil</button>
        </div>

        <div className="container_editar sumir" id="editar_modal">
          <div className="card_editar">
            <h2 className="titulo_input">Nome</h2>
            <input type="text" name="" id="" className="input_modal" />
            <h2 className="titulo_input">Cargo</h2>
            <input type="text" name="" id="" className="input_modal" />
            <h2 className="titulo_input">E-mail</h2>
            <input type="text" name="" id="" className="input_modal" />
            <h2 className="titulo_input">GitHub</h2>
            <input type="text" name="" id="" className="input_modal" />
          </div>
          <button className="btn_conectar">Salvar</button>   
        </div>

        <div className="container_sessoes_perfil">
          <div className="card_perfil">
            <h2>Atividades</h2>
            <h2>Commits</h2>
            <h2>Tarefas</h2>
            <h2>Pull Requests</h2>
            <h2>Tempo</h2>
            <div>
              <h2>commit icone</h2>
              <div>
                <h2>Implementação do módulo de relatórios financeiros</h2>
                <h2>Sistema de Gestão Financeira</h2>
              </div>
            </div>
          </div>

          <div>
            <h2>Visão geral</h2>
            <h2>Atividades</h2>
            <h2>Configurações</h2>
          </div>

          <div className="card_perfil">
            <h2>Resumo</h2>
            <h2>Visão geral do desempenho e atividades</h2>

            <h2>Distribuição do tempo</h2>
            <PieChart width={200} height={200}>
              <Pie
                data={dataDistribuicao}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {dataDistribuicao.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>

            <h2>Commits por Projeto</h2>
            <BarChart width={300} height={200} data={dataCommits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="commits" fill="#82ca9d" />
            </BarChart>

            <h2>Horas por Dia</h2>
            <BarChart width={300} height={200} data={dataHoras}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="horas" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </div>
    </>
  );
};

export default Perfil;
