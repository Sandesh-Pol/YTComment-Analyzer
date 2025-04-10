import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme.js";
import { SentimentAnalysis } from "./SentimentAnalysis";
import { useNavigate } from "react-router-dom";

const Analysis = ({ isCollapsed }) => {
  useTheme();
  const navigate = useNavigate();
  
  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("sentimentData");
      if (!storedData) {
        navigate("/link-input");
        return;
      }
      
      const parsedData = JSON.parse(storedData);
      console.log("ParsedData:",parsedData);

      // Validate the data structure
      if (!parsedData || typeof parsedData !== 'object') {
        throw new Error("Invalid data format");
      }

      // Ensure required properties exist with default values
      const validatedData = {
        total_comments: parsedData.total_comments || 0,
        sentiment: {
          vader: {
            overall: parsedData.sentiment?.vader?.overall || 0,
            breakdown: parsedData.sentiment?.vader?.breakdown || {
              spositive: 0,
              positive: 0,
              wpositive: 0,
              neutral: 0,
              wnegative: 0,
              negative: 0,
              snegative: 0
            }
          },
          textblob: {
            overall: parsedData.sentiment?.textblob?.overall || 0,
            breakdown: parsedData.sentiment?.textblob?.breakdown || {
              spositive: 0,
              positive: 0,
              wpositive: 0,
              neutral: 0,
              wnegative: 0,
              negative: 0,
              snegative: 0
            }
          }
        },
        toxicity: {
          bert: parsedData.toxicity?.bert || []
        },
        emojis: parsedData.emojis || []
      };
      
      setSentimentData(validatedData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading analysis data:", err);
      setError("Failed to load analysis data. Please try again.");
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen transition-all duration-300 ${isCollapsed ? "pl-0" : "pl-4"}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brightRed border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="dark:text-white text-gray-800 text-lg">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-screen transition-all duration-300 ${isCollapsed ? "pl-0" : "pl-4"}`}>
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
          <button 
            onClick={() => navigate("/link-input")}
            className="bg-brightRed text-white px-6 py-2 rounded-full text-base font-semibold hover:bg-brightRed/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 lg:p-8 transition-all duration-300 min-h-screen overflow-y-scroll hide-scrollbar mt-10 ${isCollapsed ? "pl-0" : "pl-4"} max-w-[1920px] mx-auto`}>
      <div className="mb-8 pl-4 lg:pl-6 mt-3">
        <h1 className="text-3xl lg:text-4xl font-bold dark:text-white text-gray-800 mb-4">Analysis Dashboard</h1>
        <p className="dark:text-gray-300 text-gray-600 text-base lg:text-lg max-w-2xl">
          View detailed analysis of your YouTube comments and engagement metrics.
        </p>
      </div>
      
      <div className="mt-8 px-2 lg:px-4">
        {sentimentData && <SentimentAnalysis sentiment={sentimentData} />}
      </div>
    </div>
  );
};

export default Analysis; 