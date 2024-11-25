const Navbar = ({ onSelectRecipesUser, onSelectRecipesImported, onSelectMenu }) => {
    return (
      <div className="navbar">
        <ul>
          <li>
            <button onClick={onSelectRecipesUser}>Recetas Creadas</button>
          </li>
          <li>
            <button onClick={onSelectRecipesImported}>Recetas Importadas</button>
          </li>
          <li>
            <button onClick={onSelectMenu}>Menú</button>
          </li>
        </ul>
      </div>
    );
  };
  
  export default Navbar;
  