import { useTheme } from "../hooks/useTheme.js";

const AIInsights = ({ isCollapsed }) => {
  // Theme is applied via CSS classes
  useTheme();

  return (
    <div className={`flex flex-col items-center justify-center min-h-[80vh] text-center font-sora font-semibold transition-all duration-300 ${isCollapsed ? "pl-0" : "pl-4"}`}>
      <h1 className="text-5xl font-bold dark:text-white text-gray-800 mb-8">AI Insights</h1>
      <p className="dark:text-gray-300 text-gray-600 text-lg mb-8 max-w-2xl">
        Leverage AI to uncover deep insights from your YouTube comments.
      </p>
    </div>
  );
};

export default AIInsights; 