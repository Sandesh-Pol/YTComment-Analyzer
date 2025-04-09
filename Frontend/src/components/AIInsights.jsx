import { useTheme } from "../hooks/useTheme.js";
import aiIcon from "../assets/icons/ai.svg";
import { useState } from "react";

const AIInsights = ({ isCollapsed }) => {
  useTheme();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const commentSummary = "The majority of comments express enthusiasm about the video content, particularly highlighting the quality of explanations and visual examples. Many viewers appreciate the depth of analysis and requested more videos on related topics. There's also notable engagement around timestamps and specific sections of the video.";
  
  const publicDemands = [
    "More detailed tutorials on advanced techniques",
    "Follow-up video explaining practical applications",
    "Downloadable resources or templates mentioned in the video",
    "Longer videos with more in-depth explanations"
  ];

  return (
    <div className={`flex flex-col items-start min-h-[80vh] font-sora transition-all duration-300 mt-16 px-6 ${isCollapsed ? "pl-0" : "pl-4"}`}>
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brightRed to-red-700 flex items-center justify-center mr-4 shadow-lg">
            <img src={aiIcon} alt="AI" className="w-6 h-6 brightness-200" />
          </div>
          <div>
            <h1 className="text-4xl font-bold dark:text-white text-gray-800">AI Insights</h1>
            <p className="dark:text-gray-400 text-gray-500 text-sm">
              Intelligent analysis powered by machine learning
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 mb-8">
          <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-500/10 to-brightRed/10 dark:from-red-500/20 dark:to-brightRed/20 p-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-brightRed flex items-center justify-center mr-3 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold dark:text-white text-gray-800 group-hover:text-brightRed transition-colors duration-300">Summary of Comments</h2>
            </div>
            <div className="p-5 flex flex-col">
              <p className="dark:text-gray-300 text-gray-600 leading-relaxed text-base flex-grow">
                {commentSummary}
              </p>
            </div>
          </div>

          <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-500/10 to-brightRed/10 dark:from-red-500/20 dark:to-brightRed/20 p-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-brightRed flex items-center justify-center mr-3 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold dark:text-white text-gray-800 group-hover:text-brightRed transition-colors duration-300">Public Demands</h2>
            </div>
            <div className="p-5">
              <ul className="space-y-2">
                {publicDemands.map((demand, index) => (
                  <li 
                    key={index} 
                    className="flex items-start rounded-lg p-2 transition-all duration-200"
                    style={{
                      backgroundColor: hoveredIndex === index ? 'rgba(242, 0, 1, 0.05)' : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-brightRed to-red-700 text-white flex-shrink-0 mr-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className={`dark:text-gray-300 text-gray-600 transition-all duration-300 ${hoveredIndex === index ? 'font-medium' : ''}`}>
                      {demand}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;