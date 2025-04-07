import { Sidebar } from "./components/Sidebar.jsx";
import Hero from "./components/Hero.jsx";
import Analysis from "./components/Analysis.jsx";
import Toxicity from "./components/Toxicity.jsx";
import AIInsights from "./components/AIInsights.jsx";
import Profile from "./components/Profile.jsx";
import LinkInputSection from "./components/LinkInputSection.jsx";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="dark:bg-jetBlack bg-gray-100 w-full h-screen overflow-hidden font-inter">
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
          <main className={`transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-60"} h-screen overflow-hidden`}>
            <Routes>
              <Route path="/" element={<Hero isCollapsed={isCollapsed} />} />
              <Route path="/analysis" element={<Analysis isCollapsed={isCollapsed} />} />
              <Route path="/toxicity" element={<Toxicity isCollapsed={isCollapsed} />} />
              <Route path="/ai-insights" element={<AIInsights isCollapsed={isCollapsed} />} />
              <Route path="/profile" element={<Profile isCollapsed={isCollapsed} />} />
              <Route path="/link-input" element={<LinkInputSection isCollapsed={isCollapsed} />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;