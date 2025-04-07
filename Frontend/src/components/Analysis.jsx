import { useTheme } from "../hooks/useTheme.js";

const Analysis = ({ isCollapsed }) => {
  // Theme is applied via CSS classes
  useTheme();

  return (
    <div className={`flex flex-col items-center justify-center min-h-[80vh] text-center font-sora font-semibold transition-all duration-300 ${isCollapsed ? "pl-0" : "pl-4"}`}>
      <h1 className="text-5xl font-bold dark:text-white text-gray-800 mb-8">Analysis Dashboard</h1>
      <p className="dark:text-gray-300 text-gray-600 text-lg mb-8 max-w-2xl">
        View detailed analysis of your YouTube comments and engagement metrics.
      </p>
    </div>
  );
};

export default Analysis; 