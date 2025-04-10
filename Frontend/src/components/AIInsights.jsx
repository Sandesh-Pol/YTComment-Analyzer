import { useTheme } from "../hooks/useTheme.js";
import aiIcon from "../assets/icons/ai.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AiInsights = ({ isCollapsed = false }) => {
  const navigate = useNavigate();
  useTheme();
  const [insights, setInsights] = useState({
    summary: {
      intro: "",
      points: []
    },
    publicDemands: {
      intro: "",
      points: []
    },
    suggestions: {
      intro: "",
      points: []
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processAnalysisData = (data) => {
    const geminiAnalysis = data?.gemini_analysis;
    
    if (!geminiAnalysis) {
      throw new Error('No analysis data available');
    }

    const convertNumberedListToArray = (listString) => {
      if (!listString) return [];
      // Split by newline and remove empty lines
      const lines = listString.split('\n').filter(line => line.trim().length > 0);
      
      // The first line is the introduction text
      const introText = lines[0];
      
      // The rest are the actual points
      const points = lines.slice(1).map(item => {
        return item
          .replace(/^\d+\.\s*/, '') // Remove numbering
          .replace(/\*\*/g, '') // Remove all asterisks (using global flag)
          .replace(/^\*\s*/, '') // Remove bullet points
          .replace(/^\*\s*Suggestion:\s*/, 'Suggestion: ') // Standardize suggestion format
          .trim();
      }).filter(item => item.length > 0);

      return {
        introText,
        points
      };
    };

    // Process each section
    const summaryData = convertNumberedListToArray(geminiAnalysis.summary);
    const demandsData = convertNumberedListToArray(geminiAnalysis.public_demands);
    const suggestionsData = convertNumberedListToArray(geminiAnalysis.suggestions);

    return {
      summary: {
        intro: summaryData.introText,
        points: summaryData.points
      },
      publicDemands: {
        intro: demandsData.introText,
        points: demandsData.points
      },
      suggestions: {
        intro: suggestionsData.introText,
        points: suggestionsData.points
      }
    };
  };

  useEffect(() => {
    const fetchInsights = async () => {
      const videoUrl = localStorage.getItem("videoUrl");
      const commentCount = localStorage.getItem("commentCount");
      
      if (!videoUrl || !commentCount) {
        navigate('/link-input')
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const cachedInsights = localStorage.getItem("aiInsightsData");
        if (cachedInsights) {
          try {
            const data = JSON.parse(cachedInsights);
            const processedInsights = processAnalysisData(data);
            setInsights(processedInsights);
            return;
          } catch (parseError) {
            console.log("Could not use cached insights, fetching fresh data...", parseError);
            localStorage.removeItem("aiInsightsData");
          }
        }

        console.log('Making API request with:', {
          video_url: videoUrl,
          comment_limit: parseInt(commentCount)
        });

        const response = await axios.post('http://127.0.0.1:8000/api/aireport/', {
          video_url: videoUrl,
          comment_limit: parseInt(commentCount)
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log('API Response:', response);

        if (response.data) {
          localStorage.setItem("aiInsightsData", JSON.stringify(response.data));
          const processedInsights = processAnalysisData(response.data);
          setInsights(processedInsights);
        } else {
          throw new Error("No data received from the server");
        }
      } catch (err) {
        console.error("Error fetching AI insights:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response,
          request: err.request
        });
        
        if (err.response?.status === 500) {
          setError("Server error: Failed to generate AI insights. Please try again.");
        } else if (err.message === 'No analysis data available') {
          setError("AI analysis data is not in the expected format. Please try analyzing the video again.");
        } else {
          setError(err.response?.data?.message || "Failed to fetch AI insights. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const renderInsightCard = (title, icon, content = { intro: "", points: [] }, isFullWidth = false) => {
    let mainPointCounter = 0;
    
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group transition-all duration-300 ${isFullWidth ? 'w-full' : ''}`}>
        {/* Card Header */}
        <div className="bg-gradient-to-r from-red-500/10 to-brightRed/10 dark:from-red-500/20 dark:to-brightRed/20 p-4 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-brightRed flex items-center justify-center mr-3 shadow-sm">
            {icon}
          </div>
          <h2 className="text-base font-bold dark:text-white text-gray-800 group-hover:text-brightRed transition-colors duration-300">{title}</h2>
        </div>

        {/* Card Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brightRed"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 dark:text-red-400 text-center py-4">{error}</div>
          ) : (
            <div className="space-y-4">
              {/* Introduction Text */}
              {content.intro && (
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {content.intro}
                </p>
              )}
              
              {/* Points List */}
              {content.points && content.points.length > 0 && (
                <ul className="space-y-3">
                  {content.points.map((item, index) => {
                    const isSuggestion = item.toLowerCase().startsWith('suggestion:');
                    const isConclusion = item.toLowerCase().includes('by addressing these points');
                    
                    if (!isSuggestion && !isConclusion) {
                      mainPointCounter++;
                    }

                    return (
                      <div key={index}>
                        <li className="space-y-2">
                          <div className="flex items-start gap-2">
                            {!isSuggestion && !isConclusion ? (
                              <span className="flex-shrink-0 text-brightRed font-bold">
                                {mainPointCounter}.
                              </span>
                            ) : null}
                            <div className={`flex-1 ${isSuggestion ? 'pl-4' : ''}`}>
                              {isSuggestion ? (
                                <div className="space-y-2">
                                  {/* Main Suggestion Line */}
                                  <div className="flex items-start gap-2">
                                    <span className="text-brightRed font-bold">{mainPointCounter}.</span>
                                    <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                      {item.replace(/^Suggestion:\s*/, '')}
                                    </span>
                                  </div>
                                  {/* Sub-points (if any) */}
                                  {item.includes('\n') && (
                                    <ul className="pl-6 space-y-1">
                                      {item.split('\n').slice(1).map((subPoint, subIndex) => (
                                        <li key={subIndex} className="flex items-start gap-2">
                                          <span className="text-brightRed">•</span>
                                          <span className="text-sm text-muted-foreground dark:text-gray-400">
                                            {subPoint.trim().replace(/^\*\s*Suggestion:\s*/, '')}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ) : (
                                <span className={`${!isConclusion ? 'text-sm font-medium' : 'text-xs text-muted-foreground'} text-gray-800 dark:text-gray-200`}>
                                  {item}
                                </span>
                              )}
                            </div>
                          </div>
                        </li>
                      </div>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col items-start h-screen overflow-y-auto font-sora transition-all duration-300 mt-16 px-6 hide-scrollbar ${isCollapsed ? "pl-0" : "pl-4"}`}>
      <div className="w-full max-w-[90%] mx-auto pb-8 mb-14">
        <div className="flex items-center mb-6 py-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brightRed to-red-700 flex items-center justify-center mr-4 shadow-sm">
            <img src={aiIcon} alt="AI" className="w-6 h-6 brightness-200" />
          </div>
          <div>
            <h1 className="text-2xl font-bold dark:text-white text-gray-800">AI Insights</h1>
            <p className="dark:text-gray-400 text-gray-500 text-sm">
              Intelligent analysis powered by machine learning
            </p>
          </div>
        </div>

        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {renderInsightCard(
            "📝 Summary",
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>,
            insights.summary
          )}
          
          {renderInsightCard(
            "📢 Public Demands",
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>,
            insights.publicDemands
          )}
        </div>

        {/* Bottom Full Width Section */}
        {renderInsightCard(
          "💡 Suggestions",
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>,
          insights.suggestions,
          true
        )}
      </div>
    </div>
  );
};

export default AiInsights;