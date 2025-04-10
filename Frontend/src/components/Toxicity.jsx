import { useTheme } from "../hooks/useTheme.js";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Toxicity = ({ isCollapsed }) => {
  useTheme();
  const navigate = useNavigate();
  const [toxicComments, setToxicComments] = useState([]);
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
      setToxicComments(parsedData.toxicity?.bert || []);
      setLoading(false);
    } catch (err) {
      console.error("Error loading toxic comments:", err);
      
      setError("Failed to load toxic comments. Please try again.");
      setLoading(false);
    }
  }, [navigate]);

  const getToxicityColor = (score) => {
    if (score < 30) return "#22c55e"; 
    if (score < 60) return "#fbbf24"; 
    return "#ef4444";
  };

  const createChartData = (score) => {
    return [
      { name: "Toxic", value: score, color: getToxicityColor(score) },
      { name: "Non-Toxic", value: 100 - score, color: "#e5e7eb" }
    ];
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen transition-all duration-300 ${isCollapsed ? "pl-0" : "pl-4"}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brightRed border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="dark:text-white text-gray-800 text-lg">Loading toxic comments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-screen transition-all duration-300 ${isCollapsed ? "pl-0" : "pl-4"}`}>
        <div className="text-center">
          <p className="dark:text-white text-gray-800 text-lg text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-start min-h-[80vh] font-sora transition-all duration-300 mt-16 px-4 lg:px-6 ${isCollapsed ? "pl-0" : "pl-4"} max-w-[1920px] mx-auto`}>
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-5xl font-bold dark:text-white text-gray-800 mb-3">Toxicity Review</h1>
        <p className="dark:text-gray-300 text-gray-600 text-base lg:text-lg mb-4">
          Monitor and analyze toxic comments from your YouTube videos
        </p>
        <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6 border dark:border-gray-700 border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold dark:text-white text-gray-800">Recent Comments</h2>
            <div className="flex gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm dark:text-gray-300 text-gray-600">High</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                <span className="text-sm dark:text-gray-300 text-gray-600">Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm dark:text-gray-300 text-gray-600">Low</span>
              </div>
            </div>
          </div>
          <div className="max-h-[400px] overflow-y-auto hide-scrollbar pr-1">
            {toxicComments.length > 0 ? (
              <div className="space-y-3">
                {toxicComments.map(([comment, score], index) => (
                  <div 
                    key={index} 
                    className="flex items-center px-2 py-3 rounded-lg dark:bg-gray-700/50 bg-gray-50 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex-shrink-0 w-24 mr-4 flex flex-col items-center">
                      <div className="relative inline-block">
                        <img 
                          src={`https://ui-avatars.com/api/?name=User&background=random`} 
                          alt="User" 
                          className="w-11 h-11 rounded-full border-2 border-gray-200 dark:border-gray-600"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                          score > 70 ? 'bg-red-500' : 
                          score > 30 ? 'bg-yellow-400' : 'bg-green-500'
                        }`}></div>
                      </div>
                      <div className="text-xs font-medium mt-1 text-center dark:text-gray-300 text-gray-600 truncate max-w-[80px]">
                        User
                      </div>
                    </div>
                    <div className={`w-[calc(100%-144px)] h-16 overflow-y-auto mr-4 py-1 ${
                      score > 70 
                        ? 'text-red-600 dark:text-red-400 font-medium' 
                        : 'dark:text-gray-200 text-gray-700'
                    }`}>
                      {comment}
                    </div>
                    
                    <div className="flex-shrink-0 w-16 h-16 relative">
                      <div className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={createChartData(score * 100)}
                              cx="50%"
                              cy="50%"
                              innerRadius={17}
                              outerRadius={27}
                              dataKey="value"
                              startAngle={90}
                              endAngle={-270}
                              strokeWidth={0}
                            >
                              {createChartData(score * 100).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full" style={{ width: '34px', height: '34px', margin: 'auto' }}>
                          <span className="text-sm font-bold" style={{ color: getToxicityColor(score * 100) }}>
                            {Math.round(score * 100)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] rounded-lg dark:bg-gray-700/50 bg-gray-50 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4">
                    <svg className="w-full h-full text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-2">No Toxic Comments Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                    Great news! No toxic comments were detected in the analyzed video.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toxicity;