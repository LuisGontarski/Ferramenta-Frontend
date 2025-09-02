import "./NavbarHome.css";
const NavbarHome = () => {
  return (
      <header className="headerNavBarHome">
        <a href="/" className="logo">
          ReProject
        </a>

        <nav className="navbarHome">
          <div className="div-menu">
          </div>

          <div className="div-other">
            <a href="/perfil" className="nav_perfil">
              <img className="img_perfil_navbar" src="/src/assets/desenvolvedor1.jpeg"></img>
            </a>
          </div>
        </nav>
      </header>
  );
};

export default NavbarHome;
