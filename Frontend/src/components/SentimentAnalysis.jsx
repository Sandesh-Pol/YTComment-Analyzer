"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

const sentimentColors = {
  sPositive: "#059669", 
  positive: "#10b981", 
  wPositive: "#34d399",
  neutral: "#6b7280", 
  wNegative: "#f87171", 
  negative: "#ef4444", 
  sNegative: "#b91c1c", 
}

export function SentimentAnalysis({ sentiment }) {
  const vaderData = [
    {
      name: "Strong Positive",
      value: sentiment.vader.breakdown.spositive || 0,
      color: sentimentColors.sPositive
    },
    {
      name: "Positive",
      value: sentiment.vader.breakdown.positive || 0,
      color: sentimentColors.positive
    },
    {
      name: "Weak Positive",
      value: sentiment.vader.breakdown.wpositive || 0,
      color: sentimentColors.wPositive
    },
    {
      name: "Neutral",
      value: sentiment.vader.breakdown.neutral || 0,
      color: sentimentColors.neutral
    },
    {
      name: "Weak Negative",
      value: sentiment.vader.breakdown.wnegative || 0,
      color: sentimentColors.wNegative
    },
    {
      name: "Negative",
      value: sentiment.vader.breakdown.negative || 0,
      color: sentimentColors.negative
    },
    {
      name: "Strong Negative",
      value: sentiment.vader.breakdown.snegative || 0,
      color: sentimentColors.sNegative
    }
  ]

  const textblobData = [
    {
      name: "Strong Positive",
      value: sentiment.textblob.breakdown.spositive || 0,
      color: sentimentColors.sPositive
    },
    {
      name: "Positive",
      value: sentiment.textblob.breakdown.positive || 0,
      color: sentimentColors.positive
    },
    {
      name: "Weak Positive",
      value: sentiment.textblob.breakdown.wpositive || 0,
      color: sentimentColors.wPositive
    },
    {
      name: "Neutral",
      value: sentiment.textblob.breakdown.neutral || 0,
      color: sentimentColors.neutral
    },
    {
      name: "Weak Negative",
      value: sentiment.textblob.breakdown.wnegative || 0,
      color: sentimentColors.wNegative
    },
    {
      name: "Negative",
      value: sentiment.textblob.breakdown.negative || 0,
      color: sentimentColors.negative
    },
    {
      name: "Strong Negative",
      value: sentiment.textblob.breakdown.snegative || 0,
      color: sentimentColors.sNegative
    }
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{payload[0].name}</p>
          <p className="text-gray-600 dark:text-gray-300">Count: {payload[0].value}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {((payload[0].value / (sentiment.totalComments || 1)) * 100).toFixed(1)}% of total
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

    return value > 0 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {value}
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

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
      <div className="w-full space-y-8 p-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight dark:text-white">Sentiment Analysis</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Analysis of {sentiment.totalComments} comments using VADER and TextBlob models
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
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex flex-col">
                    <span className="text-gray-600 dark:text-gray-300 font-medium mb-2">VADER Score:</span>
                    <span className={`text-3xl font-bold ${getSentimentTextColor(sentiment.vader.score)}`}>
                      {sentiment.vader.score.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {sentiment.vader.score > 0 ? "Positive" : sentiment.vader.score < 0 ? "Negative" : "Neutral"} sentiment
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex flex-col">
                    <span className="text-gray-600 dark:text-gray-300 font-medium mb-2">TextBlob Score:</span>
                    <span className={`text-3xl font-bold ${getSentimentTextColor(sentiment.textblob.score)}`}>
                      {sentiment.textblob.score.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {sentiment.textblob.score > 0 ? "Positive" : sentiment.textblob.score < 0 ? "Negative" : "Neutral"} sentiment
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-6 dark:text-white">VADER Sentiment Distribution</h3>
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vaderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      paddingAngle={2}
                    >
                      {vaderData.map((entry, index) => (
                        <Cell key={`vader-cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{fontSize: "12px"}}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-6 dark:text-white">TextBlob Sentiment Distribution</h3>
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={textblobData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      paddingAngle={2}
                    >
                      {textblobData.map((entry, index) => (
                        <Cell key={`textblob-cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{fontSize: "12px"}}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}