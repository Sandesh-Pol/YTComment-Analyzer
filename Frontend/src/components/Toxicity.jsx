import { useTheme } from "../hooks/useTheme.js";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const Toxicity = ({ isCollapsed }) => {
  useTheme();

  // Sample data for demonstration
  const sampleComments = [
    {
      id: 1,
      username: "UserOne",
      avatarUrl: "https://ui-avatars.com/api/?name=User+One&background=random",
      comment: "This video is absolutely terrible! What a waste of time.",
      toxicityScore: 85
    },
    {
      id: 2,
      username: "CalmViewer",
      avatarUrl: "https://ui-avatars.com/api/?name=Calm+Viewer&background=random",
      comment: "Great explanation of the topic. I learned a lot from this, thank you!",
      toxicityScore: 5
    },
    {
      id: 3,
      username: "AngryUser42",
      avatarUrl: "https://ui-avatars.com/api/?name=Angry+User&background=random",
      comment: "You should delete your channel. Your content is garbage and misleading!!!",
      toxicityScore: 95
    },
    {
      id: 4,
      username: "NeutralPerson",
      avatarUrl: "https://ui-avatars.com/api/?name=Neutral+Person&background=random",
      comment: "I think there are some good points, but I disagree with some of the conclusions.",
      toxicityScore: 25
    },
    {
      id: 5,
      username: "MildlyCritical",
      avatarUrl: "https://ui-avatars.com/api/?name=Mildly+Critical&background=random",
      comment: "This could have been better with more research. Not very impressed honestly.",
      toxicityScore: 45
    },
    {
      id: 6,
      username: "HappyFan",
      avatarUrl: "https://ui-avatars.com/api/?name=Happy+Fan&background=random",
      comment: "Love your videos! Keep up the amazing work, I always learn something new!",
      toxicityScore: 2
    },
    {
      id: 7,
      username: "FrustratedViewer",
      avatarUrl: "https://ui-avatars.com/api/?name=Frustrated+Viewer&background=random",
      comment: "How can you be so wrong about everything? Do some research next time!",
      toxicityScore: 75
    }
  ];

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

  return (
    <div className={`flex flex-col items-start min-h-[80vh] font-sora transition-all duration-300 mt-16 px-6 ${isCollapsed ? "pl-0" : "pl-4"}`}>
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold dark:text-white text-gray-800 mb-3">Toxicity Review</h1>
        <p className="dark:text-gray-300 text-gray-600 text-lg mb-4">
          Monitor and analyze toxic comments from your YouTube videos
        </p>
        <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700 border-gray-100">
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
            <div className="space-y-3">
              {sampleComments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="flex items-center px-2 py-3 rounded-lg dark:bg-gray-700/50 bg-gray-50 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex-shrink-0 w-24 mr-4 flex flex-col items-center">
                    <div className="relative inline-block">
                      <img 
                        src={comment.avatarUrl} 
                        alt={comment.username} 
                        className="w-11 h-11 rounded-full border-2 border-gray-200 dark:border-gray-600"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                        comment.toxicityScore > 70 ? 'bg-red-500' : 
                        comment.toxicityScore > 30 ? 'bg-yellow-400' : 'bg-green-500'
                      }`}></div>
                    </div>
                    <div className="text-xs font-medium mt-1 text-center dark:text-gray-300 text-gray-600 truncate max-w-[80px]">
                      {comment.username}
                    </div>
                  </div>
                  <div className={`w-[calc(100%-144px)] h-16 overflow-y-auto mr-4 py-1 ${
                    comment.toxicityScore > 70 
                      ? 'text-red-600 dark:text-red-400 font-medium' 
                      : 'dark:text-gray-200 text-gray-700'
                  }`}>
                    {comment.comment}
                  </div>
                  
                  <div className="flex-shrink-0 w-16 h-16 relative">
                    <div className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={createChartData(comment.toxicityScore)}
                            cx="50%"
                            cy="50%"
                            innerRadius={17}
                            outerRadius={27}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            strokeWidth={0}
                          >
                            {createChartData(comment.toxicityScore).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full" style={{ width: '34px', height: '34px', margin: 'auto' }}>
                        <span className="text-sm font-bold" style={{ color: getToxicityColor(comment.toxicityScore) }}>
                          {comment.toxicityScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toxicity;