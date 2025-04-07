import { useTheme } from "../hooks/useTheme.js";
import { SentimentAnalysis } from "./SentimentAnalysis";

const Analysis = ({ isCollapsed }) => {
  // Theme is applied via CSS classes
  useTheme();

  // Sample sentiment data - replace with actual data from your API
  const sampleSentimentData = {
    totalComments: 50,
    vader: {
      score: 0.06,
      breakdown: {
        spositive: 8,  // Strong Positive
        positive: 12,  // Positive
        wpositive: 10, // Weak Positive
        neutral: 8,    // Neutral
        wnegative: 6,  // Weak Negative
        negative: 4,   // Negative
        snegative: 2   // Strong Negative
      }
    },
    textblob: {
      score: 0.03,
      breakdown: {
        spositive: 7, 
        positive: 11,  
        wpositive: 12,
        neutral: 9,    
        wnegative: 5,  
        negative: 4,
        snegative: 2   
      }
    }
  };

  return (
    <div className={`p-8 transition-all duration-300 h-screen overflow-y-scroll hide-scrollbar mt-10${isCollapsed ? "pl-0" : "pl-4"}`}>
      <div className="mb-8 pl-6 mt-20">
        <h1 className="text-4xl font-bold dark:text-white text-gray-800 mb-4">Analysis Dashboard</h1>
        <p className="dark:text-gray-300 text-gray-600 text-lg max-w-2xl">
          View detailed analysis of your YouTube comments and engagement metrics.
        </p>
      </div>
      
      <div className="mt-8">
        <SentimentAnalysis sentiment={sampleSentimentData} />
      </div>
    </div>
  );
};

export default Analysis; 