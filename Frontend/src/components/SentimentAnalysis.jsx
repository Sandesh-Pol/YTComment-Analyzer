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
    const { cx, cy, midAngle, outerRadius, value, fill } = props;
    const RADIAN = Math.PI / 180;
    // Only show labels for segments with value > 5%
    if (value <= 5) return null;

    // Calculate optimal line length based on value
    const lineLength = Math.min(Math.max(value * 1.5, 30), 60);
    
    // Calculate points for the label line
    const radius = outerRadius + 10;
    const x1 = cx + radius * Math.cos(-midAngle * RADIAN);
    const y1 = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Add a slight curve to the line to avoid overlaps
    const curve = 20 * Math.sin(midAngle * RADIAN);
    const x2 = cx + (radius + lineLength) * Math.cos(-midAngle * RADIAN) + curve;
    const y2 = cy + (radius + lineLength) * Math.sin(-midAngle * RADIAN);

    const textAnchor = Math.cos(-midAngle * RADIAN) >= 0 ? 'start' : 'end';
    const textOffset = Math.cos(-midAngle * RADIAN) >= 0 ? 5 : -5;

    return (
      <g>
        <path
          d={`M${x1},${y1}Q${x1 + curve},${y1} ${x2},${y2}`}
          stroke={fill}
          strokeWidth={1}
          fill="none"
          opacity={0.6}
        />
        <text
          x={x2 + textOffset}
          y={y2}
          textAnchor={textAnchor}
          dominantBaseline="central"
          className="text-xs font-medium fill-gray-700 dark:fill-gray-300"
          style={{ fontSize: '11px', opacity: 0.9 }}
        >
          {`${value.toFixed(1)}`}
        </text>
      </g>
    );
  };

  // Center content for each chart
  const renderCenterContent = (score, type) => {
    const emoji = score > 0.3 ? "😊" : score < -0.3 ? "😔" : "😐";
    const scoreColor = getSentimentTextColor(score);
    
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center flex flex-col items-center gap-1">
          <span className="text-2xl mb-1">{emoji}</span>
          <span className={`text-xl font-bold ${scoreColor}`}>
            {score.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {type}
          </span>
        </div>
      </div>
    );
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
      <div className="w-full overflow-hidden">
        <div className="w-full p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight dark:text-white">Sentiment Analysis</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Analysis of {safeSentiment.totalComments} comments using VADER and TextBlob models
            </p>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* VADER Chart */}
            <div className="bg-white dark:bg-gray-900 overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">VADER Distribution</h3>
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <div className="w-full aspect-square relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={vaderData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={110}
                          dataKey="value"
                          labelLine={true}
                          label={renderCustomizedLabel}
                          paddingAngle={2}
                          isAnimationActive={false}
                          strokeWidth={1}
                          stroke="#1E293B"
                        >
                          {vaderData.map((entry, index) => (
                            <Cell 
                              key={`vader-cell-${index}`} 
                              fill={entry.color}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={<CustomTooltip />}
                          cursor={false}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {renderCenterContent(safeSentiment.vader.score, 'VADER')}
                  </div>
                )}
              </div>
            </div>

            {/* TextBlob Chart */}
            <div className="bg-white dark:bg-gray-900 overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">TextBlob Distribution</h3>
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <div className="w-full aspect-square relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={textblobData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={110}
                          dataKey="value"
                          labelLine={true}
                          label={renderCustomizedLabel}
                          paddingAngle={2}
                          isAnimationActive={false}
                          strokeWidth={1}
                          stroke="#1E293B"
                        >
                          {textblobData.map((entry, index) => (
                            <Cell 
                              key={`textblob-cell-${index}`} 
                              fill={entry.color}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={<CustomTooltip />}
                          cursor={false}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {renderCenterContent(safeSentiment.textblob.score, 'TextBlob')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shared Legend */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
              {[
                { name: "Strong Positive", color: sentimentColors.sPositive },
                { name: "Positive", color: sentimentColors.positive },
                { name: "Weak Positive", color: sentimentColors.wPositive },
                { name: "Neutral", color: sentimentColors.neutral },
                { name: "Weak Negative", color: sentimentColors.wNegative },
                { name: "Negative", color: sentimentColors.negative },
                { name: "Strong Negative", color: sentimentColors.sNegative }
              ].map((item, index) => (
                <div key={index} className="flex items-center px-2 py-1">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}