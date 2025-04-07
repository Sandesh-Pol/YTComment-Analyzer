import logoDark from "../assets/logo/logo-dark.png";
import logoLight from "../assets/logo/logo-light.png";
import menu from "../assets/icons/menu.svg";
import { useTheme } from "../hooks/useTheme.js";

export const Navbar = ({ toggleSidebar }) => {
  useTheme();

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center gap-6 px-6 py-2 z-10">
      <div className="menu-icon">
        <img
          className="w-7 h-7 cursor-pointer hover:opacity-80 transition-opacity dark:invert-0 invert select-none"
          src={menu}
          alt="menu"
          onClick={toggleSidebar}
        />
      </div>
      <div className="flex items-center">
        <img 
          className="h-20 w-auto object-contain dark:block hidden" 
          src={logoDark} 
          alt="Insightify"
          style={{ maxWidth: '140px' }}
        />
        <img 
          className="h-20 w-auto object-contain dark:hidden block" 
          src={logoLight} 
          alt="Insightify"
          style={{ maxWidth: '140px' }}
        />
      </div>
    </nav>
  );
};

