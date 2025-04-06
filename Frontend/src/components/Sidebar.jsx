import { Navbar } from "./Navbar.jsx";

import home from "../assets/icons/home.svg";
import report from "../assets/icons/report.svg";
import toxic from "../assets/icons/toxic.svg";
import ai from "../assets/icons/ai.svg";
import profile from "../assets/icons/profile.svg";
import { useState } from "react";

export const Sidebar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
          <div className="sidebar-menu flex flex-col gap-8 mt-8 px-6">
            <div className="option flex items-center gap-4 cursor-pointer text-white hover:opacity-80 transition-opacity">
              <img className="size-6 min-w-6" src={home} alt="" />
              <span className={`text-sm whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>Home</span>
            </div>
            <div className="option flex items-center gap-4 cursor-pointer text-white hover:opacity-80 transition-opacity">
              <img className="size-6 min-w-6" src={report} alt="" />
              <span className={`text-sm whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>Analysis</span>
            </div>
            <div className="relative flex items-center">
              <div className="option flex items-center gap-4 cursor-pointer text-white hover:opacity-80 transition-opacity">
                <img className="size-6 min-w-6" src={toxic} alt="" />
                <span className={`text-sm whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>Toxicity Review</span>
              </div>
            </div>
            <div className="option flex items-center gap-4 cursor-pointer text-white hover:opacity-80 transition-opacity">
              <img className="size-6 min-w-6" src={ai} alt="" />
              <span className={`text-sm whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>AI Insights</span>
            </div>
          </div>

          <div className="sidebar-footer flex flex-col gap-8 mb-32 px-6">
            <div className="option flex items-center gap-4 cursor-pointer text-white hover:opacity-80 transition-opacity">
              <img className="size-6 min-w-6" src={profile} alt="" />
              <span className={`text-sm whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>Profile</span>
            </div>
            <div className={`flex items-center gap-4 text-white ${isCollapsed ? "justify-center" : ""}`}>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-10 h-5 rounded-full relative transition-colors  ${isCollapsed ? "opacity-0" : "opacity-100"} ${
                  isDarkMode ? "bg-red-600" : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-transform ${
                    isDarkMode ? "translate-x-5" : "translate-x-0.5"
                  }`}
                ></div>
              </button>
              <span className={`text-sm whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>Dark Mode</span>
            </div>
          </div>
        </div>
        <div className={`absolute right-0 top-32 h-[10rem] w-1 bg-white rounded-full ${isCollapsed ? "hidden" : "block"}`}></div>

      </div>
    </>
  );
};
