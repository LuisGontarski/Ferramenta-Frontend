import "./Kanban.css";
import NavbarHome from "../../Components/Navbar/NavbarHome";
import MenuLateral from "../../Components/MenuLateral/MenuLateral";
import ConteudoKanban from "./ConteudoKanban";

const Kanban = () => {
  return (
    <>
      <NavbarHome />
      <div className="container_conteudos">
        <MenuLateral />
        <ConteudoKanban></ConteudoKanban>
      </div>
    </>
  );
};

export default Kanban;
