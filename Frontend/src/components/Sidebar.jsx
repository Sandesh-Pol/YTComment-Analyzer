import { Navbar } from "./Navbar.jsx";
import { NavLink } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";

import home from "../assets/icons/home.svg";
import report from "../assets/icons/report.svg";
import toxic from "../assets/icons/toxic.svg";
import ai from "../assets/icons/ai.svg";
import profile from "../assets/icons/profile.svg";

export const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const getLinkStyles = (isActive) => {
    return `flex items-center w-full px-4 py-3 cursor-pointer transition-all duration-200 
      ${isCollapsed ? "justify-center" : ""} 
      ${isActive ? "dark:bg-gray-700/30 bg-gray-200 rounded-xl" : "hover:dark:bg-gray-800/50 hover:bg-gray-200/50 hover:rounded-xl"}`;
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <div 
        className={`h-screen fixed left-0 top-24 flex transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="sidebar-menu flex flex-col gap-2 mt-8">
            <NavLink to="/" className={({isActive}) => getLinkStyles(isActive)}>
              <img className="size-6 min-w-6 dark:invert-0 invert" src={home} alt="" />
              <span className={`text-sm whitespace-nowrap transition-opacity duration-200 dark:text-white ${isCollapsed ? "opacity-0 absolute" : "opacity-100 ml-4"}`}>Home</span>
            </NavLink>
            <NavLink to="/analysis" className={({isActive}) => getLinkStyles(isActive)}>
              <img className="size-6 min-w-6 dark:invert-0 invert" src={report} alt="" />
              <span className={`text-sm whitespace-nowrap transition-opacity duration-200 dark:text-white ${isCollapsed ? "opacity-0 absolute" : "opacity-100 ml-4"}`}>Analysis</span>
            </NavLink>
            <NavLink to="/toxicity" className={({isActive}) => getLinkStyles(isActive)}>
              <img className="size-6 min-w-6 dark:invert-0 invert" src={toxic} alt="" />
              <span className={`text-sm whitespace-nowrap transition-opacity duration-200 dark:text-white ${isCollapsed ? "opacity-0 absolute" : "opacity-100 ml-4"}`}>Toxicity Review</span>
            </NavLink>
            <NavLink to="/ai-insights" className={({isActive}) => getLinkStyles(isActive)}>
              <img className="size-6 min-w-6 dark:invert-0 invert" src={ai} alt="" />
              <span className={`text-sm whitespace-nowrap transition-opacity duration-200 dark:text-white ${isCollapsed ? "opacity-0 absolute" : "opacity-100 ml-4"}`}>AI Insights</span>
            </NavLink>
          </div>

          <div className="sidebar-footer flex flex-col gap-2 mb-28">
            <NavLink to="/profile" className={({isActive}) => getLinkStyles(isActive)}>
              <img className="size-6 min-w-6 dark:invert-0 invert" src={profile} alt="" />
              <span className={`text-sm whitespace-nowrap transition-opacity duration-200 dark:text-white ${isCollapsed ? "opacity-0 absolute" : "opacity-100 ml-4"}`}>Profile</span>
            </NavLink>
            <div className={`flex items-center py-3 ${isCollapsed ? "justify-center px-0" : "px-4"} gap-4 dark:text-white`}>
              <button
                onClick={toggleDarkMode}
                className={`w-10 h-5 rounded-full relative transition-colors ${isCollapsed ? "opacity-0" : "opacity-100"} ${
                  isDarkMode ? "bg-red-600" : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-transform ${
                    isDarkMode ? "translate-x-5" : "translate-x-0.5"
                  }`}
                ></div>
              </button>
              <span className={`text-sm whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "opacity-0 absolute" : "opacity-100"}`}>Dark Mode</span>
            </div>
          </div>
        </div>
        <div className="absolute top-36 h-[10rem] w-1 bg-black dark:bg-white rounded-full -right-2 `"></div>
      </div>
    </>
  );
};