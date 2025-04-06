import { Sidebar } from "./components/Sidebar.jsx";
import Hero from "./components/Hero.jsx";

function App() {
  return (
    <div className="bg-jetBlack w-full h-screen overflow-hidden font-inter">
      <Sidebar />
      <main className="ml-52 h-screen overflow-hidden">
        <Hero />
      </main>
    </div>
  );
}

export default App;
