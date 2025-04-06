import logo from "../assets/logo/logo-dark.png";
import menu from "../assets/icons/menu.svg"

export const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="fixed top-0 left-0 w-full flex items-center gap-6 px-6 py-4 z-10">
      <div className="menu-icon">
        <img 
          className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" 
          src={menu} 
          alt="menu" 
          onClick={toggleSidebar}
        />
      </div>
      <div className="flex items-center">
        <img 
          className="h-20 w-auto object-contain" 
          src={logo} 
          alt="Insightify"
          style={{ maxWidth: '140px' }}
        />
      </div>
    </nav>
  );
};
