"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ErrorBoundary } from 'react-error-boundary'
import { useState, useEffect } from 'react'

const sentimentColors = {
  sPositive: "#10B981", // Emerald-500
  positive: "#34D399",  // Emerald-400
  wPositive: "#6EE7B7", // Emerald-300
  neutral: "#64748B",   // Slate-500
  wNegative: "#FDA4AF", // Rose-300
  negative: "#FB7185",  // Rose-400
  sNegative: "#F43F5E", // Rose-500
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <p className="text-red-600 dark:text-red-400 mb-2">Something went wrong:</p>
      <pre className="text-sm text-red-500 dark:text-red-300 mb-4">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="bg-brightRed text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brightRed/80 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}

export function SentimentAnalysis({ sentiment }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sentiment) {
      setIsLoading(false);
    }
  }, [sentiment]);

  if (!sentiment) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-yellow-600 dark:text-yellow-400">No sentiment data available</p>
      </div>
    )
  }

  console.log("Raw sentiment data:", sentiment); 

  const safeSentiment = {
    totalComments: sentiment?.total_comments || 0,
    vader: {
      score: sentiment?.sentiment?.vader?.overall || 0,
      breakdown: sentiment?.sentiment?.vader?.breakdown || {
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
      score: sentiment?.sentiment?.textblob?.overall || 0,
      breakdown: sentiment?.sentiment?.textblob?.breakdown || {
        spositive: 0,
        positive: 0,
        wpositive: 0,
        neutral: 0,
        wnegative: 0,
        negative: 0,
        snegative: 0
      }
    }
  }

  console.log("Processed sentiment data:", safeSentiment); // Debug log

  const total = safeSentiment.totalComments || 1; // Prevent division by zero
  const vaderData = [
    {
      name: "Strong Positive",
      value: (Number(safeSentiment.vader.breakdown.spositive) / total) * 100 || 0,
      color: sentimentColors.sPositive
    },
    {
      name: "Positive",
      value: (Number(safeSentiment.vader.breakdown.positive) / total) * 100 || 0,
      color: sentimentColors.positive
    },
    {
      name: "Weak Positive",
      value: (Number(safeSentiment.vader.breakdown.wpositive) / total) * 100 || 0,
      color: sentimentColors.wPositive
    },
    {
      name: "Neutral",
      value: (Number(safeSentiment.vader.breakdown.neutral) / total) * 100 || 0,
      color: sentimentColors.neutral
    },
    {
      name: "Weak Negative",
      value: (Number(safeSentiment.vader.breakdown.wnegative) / total) * 100 || 0,
      color: sentimentColors.wNegative
    },
    {
      name: "Negative",
      value: (Number(safeSentiment.vader.breakdown.negative) / total) * 100 || 0,
      color: sentimentColors.negative
    },
    {
      name: "Strong Negative",
      value: (Number(safeSentiment.vader.breakdown.snegative) / total) * 100 || 0,
      color: sentimentColors.sNegative
    }
  ].filter(item => item.value > 0) 

  const textblobData = [
    {
      name: "Strong Positive",
      value: (Number(safeSentiment.textblob.breakdown.spositive) / total) * 100 || 0,
      color: sentimentColors.sPositive
    },
    {
      name: "Positive",
      value: (Number(safeSentiment.textblob.breakdown.positive) / total) * 100 || 0,
      color: sentimentColors.positive
    },
    {
      name: "Weak Positive",
      value: (Number(safeSentiment.textblob.breakdown.wpositive) / total) * 100 || 0,
      color: sentimentColors.wPositive
    },
    {
      name: "Neutral",
      value: (Number(safeSentiment.textblob.breakdown.neutral) / total) * 100 || 0,
      color: sentimentColors.neutral
    },
    {
      name: "Weak Negative",
      value: (Number(safeSentiment.textblob.breakdown.wnegative) / total) * 100 || 0,
      color: sentimentColors.wNegative
    },
    {
      name: "Negative",
      value: (Number(safeSentiment.textblob.breakdown.negative) / total) * 100 || 0,
      color: sentimentColors.negative
    },
    {
      name: "Strong Negative",
      value: (Number(safeSentiment.textblob.breakdown.snegative) / total) * 100 || 0,
      color: sentimentColors.sNegative
    }
  ].filter(item => item.value > 0) // Only show segments with values

  console.log("Chart data:", { vaderData, textblobData }); // Debug log

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          <p className="font-semibold text-gray-900 dark:text-white text-base">{payload[0].name}</p>
          <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">
            Count: {payload[0].value.toFixed(1)}%
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {payload[0].value.toFixed(1)}% of total comments
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomizedLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, value } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return value > 3 ? (
      <text 
        x={x} 
        y={y} 
        fill="#FFFFFF"
        filter="drop-shadow(0px 1px 1px rgb(0 0 0 / 0.3))"
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {value.toFixed(1)}%
      </text>
    ) : null;
  };

  const getSentimentTextColor = (score) => {
    if (score >= 0.5) return "text-emerald-600 dark:text-emerald-400";
    if (score > 0) return "text-emerald-500 dark:text-emerald-300";
    if (score === 0) return "text-gray-600 dark:text-gray-300";
    if (score > -0.5) return "text-red-500 dark:text-red-300";
    return "text-red-600 dark:text-red-400";
  };

  if (!vaderData.length && !textblobData.length) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-yellow-600 dark:text-yellow-400">No sentiment distribution data available</p>
      </div>
    );
  }

  const ChartSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      <div className="h-[500px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
    </div>
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="w-full space-y-8 p-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight dark:text-white">Sentiment Analysis</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Analysis of {safeSentiment.totalComments} comments using VADER and TextBlob models
            </p>
          </div>

          <div className="grid gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold dark:text-white">Overall Sentiment Scores</h3>
                  <div className="relative group">
                    <span className="cursor-help">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <div className="absolute hidden group-hover:block right-0 w-64 p-3 mt-2 space-y-2 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                      <p className="text-gray-600 dark:text-gray-300">Scores range from -1 (very negative) to +1 (very positive)</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isLoading ? (
                    <>
                      <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-24"></div>
                      <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-24"></div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <div className="flex flex-col">
                          <span className="text-gray-600 dark:text-gray-300 font-medium mb-2">VADER Score:</span>
                          <span className={`text-3xl font-bold ${getSentimentTextColor(safeSentiment.vader.score)}`}>
                            {Number(safeSentiment.vader.score).toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {safeSentiment.vader.score > 0 ? "Positive" : safeSentiment.vader.score < 0 ? "Negative" : "Neutral"} sentiment
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <div className="flex flex-col">
                          <span className="text-gray-600 dark:text-gray-300 font-medium mb-2">TextBlob Score:</span>
                          <span className={`text-3xl font-bold ${getSentimentTextColor(safeSentiment.textblob.score)}`}>
                            {Number(safeSentiment.textblob.score).toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {safeSentiment.textblob.score > 0 ? "Positive" : safeSentiment.textblob.score < 0 ? "Negative" : "Neutral"} sentiment
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-8 dark:text-white">VADER Sentiment Distribution</h3>
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart className="flex gap-5">
                        <Pie
                          data={vaderData}
                          cx="55%"
                          cy="50%"
                          innerRadius={100}
                          outerRadius={145}
                          dataKey="value"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          paddingAngle={4}
                          isAnimationActive={false}
                          strokeWidth={1}
                          stroke="#1E293B"
                        >
                          {vaderData.map((entry, index) => (
                            <Cell 
                              key={`vader-cell-${index}`} 
                              fill={entry.color}
                              style={{ filter: 'drop-shadow(0px 2px 4px rgb(0 0 0 / 0.1))' }}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={<CustomTooltip />}
                          cursor={false}
                        />
                        <Legend 
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          wrapperStyle={{
                            fontSize: "12px",
                            paddingLeft: "32px",
                            lineHeight: "28px"
                          }}
                          formatter={(value) => (
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-8 dark:text-white">TextBlob Sentiment Distribution</h3>
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={textblobData}
                          cx="55%"
                          cy="50%"
                          innerRadius={100}
                          outerRadius={145}
                          dataKey="value"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          paddingAngle={4}
                          isAnimationActive={false}
                          strokeWidth={1}
                          stroke="#1E293B"
                        >
                          {textblobData.map((entry, index) => (
                            <Cell 
                              key={`textblob-cell-${index}`} 
                              fill={entry.color}
                              style={{ filter: 'drop-shadow(0px 2px 4px rgb(0 0 0 / 0.1))' }}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={<CustomTooltip />}
                          cursor={false}
                        />
                        <Legend
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          wrapperStyle={{
                            fontSize: "12px",
                            paddingLeft: "32px",
                            lineHeight: "28px"
                          }}
                          formatter={(value) => (
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}