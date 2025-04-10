import { useState } from "react";
import { useTheme } from "../hooks/useTheme.js";
import { useNavigate } from "react-router-dom";
import commentInput from "../assets/images/comment-input.svg";

const LinkInputSection = ({ isCollapsed }) => {
  useTheme(); 
  const navigate = useNavigate();

  const [videoUrl, setVideoUrl] = useState("");
  const [commentCount, setCommentCount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      localStorage.removeItem("sentimentData");
      localStorage.removeItem("commentCount");
      localStorage.removeItem("videoUrl");
      
      const response = await fetch("http://127.0.0.1:8000/api/sentiment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_url: videoUrl,
          comment_count: parseInt(commentCount)
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }
      
      localStorage.setItem("sentimentData", JSON.stringify(data));
      localStorage.setItem("videoUrl", videoUrl);
      localStorage.setItem("commentCount", commentCount);
      navigate("/analysis");
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to analyze comments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex min-h-screen transition-all duration-300 ${
        isCollapsed ? "pl-0" : "pl-4"
      }`}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-12">
        <div className="w-full flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-5/12 flex justify-center">
            <img
              src={commentInput}
              alt="YouTube Comment Analysis"
              className="max-w-full h-auto object-contain max-h-96"
            />
          </div>

          <div className="w-full md:w-7/12">
            <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-800 mb-4">
              Ready to Decode Your Comments?
            </h1>

            <p className="text-lg dark:text-gray-300 text-gray-600 mb-8">
              <span className="inline-block mr-2">🔍</span> Paste your YouTube
              video link and choose how many comments you want Insightify to
              analyze.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-medium dark:text-white text-gray-700">
                  <span className="text-xl">📺</span> Video URL
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 border-gray-300 
                          dark:bg-gray-800 bg-white dark:text-white text-gray-800 
                          focus:outline-none focus:ring-2 focus:ring-brightRed"
                  placeholder="https://www.youtube.com/watch?v=abc123"
                  required
                />
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  <span className="inline-block mr-1">ℹ️</span> We support
                  public videos only.
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-medium dark:text-white text-gray-700">
                  <span className="text-xl">💬</span> Number of Comments
                </label>
                <input
                  type="number"
                  list="comment-options"
                  value={commentCount}
                  onChange={(e) => setCommentCount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 border-gray-300 
              dark:bg-gray-800 bg-white dark:text-white text-gray-800 
              focus:outline-none focus:ring-2 focus:ring-brightRed"
                  placeholder="e.g., 100"
                  min="1"
                  max="500"
                  required
                />

                <datalist id="comment-options">
                  <option value="50" />
                  <option value="100" />
                  <option value="250" />
                  <option value="500" />
                </datalist>
                <p className="text-sm dark:text-gray-400 text-gray-500">
                  <span className="inline-block mr-1">🔝</span> We'll analyze
                  the top comments first. max value is 500
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`bg-brightRed text-white px-8 py-2 rounded-full text-base font-semibold transition-colors shadow-[0_0_30px_rgba(242,0,1,0.5)] ${
                  isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-brightRed/80"
                }`}
              >
                {isLoading ? "Analyzing..." : "Analyze My Comments"}
              </button>

              <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 dark:text-gray-300 text-gray-600">
                  <span className="text-xl">😊</span> Sentiment Analysis
                </div>
                <div className="flex items-center gap-2 dark:text-gray-300 text-gray-600">
                  <span className="text-xl">🔍</span> Emotion Detection
                </div>
                <div className="flex items-center gap-2 dark:text-gray-300 text-gray-600">
                  <span className="text-xl">🛡️</span> Toxicity Filtering
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkInputSection;
