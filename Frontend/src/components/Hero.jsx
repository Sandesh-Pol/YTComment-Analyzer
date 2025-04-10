import youtubeIcon from "../assets/images/yt-icon.png";
import reportIcon from "../assets/images/report.png";
import comments from "../assets/images/comments.png";
import ai from "../assets/images/ai.png";
import { NavLink } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useEffect } from "react";

const Hero = ({ isCollapsed }) => {
  useTheme();

  useEffect(() => {
    localStorage.removeItem("sentimentData");
    localStorage.removeItem("commentCount");
    localStorage.removeItem("videoUrl");
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-[80vh] text-center font-sora font-semibold transition-all duration-300 ${isCollapsed ? "pl-0" : "pl-4"} max-w-[1920px] mx-auto px-4 lg:px-8`}>
      <img
        src={youtubeIcon}
        alt="YouTube Logo"
        className="size-40 mt-10 mb-4 select-none max-w-[160px] lg:max-w-[200px]"
      />

      <div className="text-4xl lg:text-5xl font-bold dark:text-white text-gray-800 mb-2 select-none">
        EVERY COMMENT COUNTS
      </div>
      <div className="text-4xl lg:text-5xl font-bold dark:text-white text-gray-800 mb-8 select-none">
        GET THE MEANING BEHIND IT
      </div>

      <div className="dark:text-gray-300 text-gray-600 text-lg mb-8 max-w-2xl cursor-pointer px-4">
        Get instant sentiment analysis on your YouTube comments. Know what your
        audience feels — at a glance.
      </div>

      <NavLink to="/link-input">
        <button className="bg-brightRed text-white px-8 py-2 rounded-full text-base font-semibold hover:bg-brightRed/80 transition-colors shadow-[0_0_50px_rgba(242,0,1,0.5)]">
          GET INSIGHTS NOW
        </button>
      </NavLink>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-12 px-4">
        <div className="p-6 rounded-xl transition-colors duration-300">
          <img
            src={reportIcon}
            alt="Sentiment Analysis"
            className="size-32 mx-auto"
          />
          <h3 className="dark:text-white text-gray-800 text-xl font-semibold mb-2">
            Sentiment Analysis
          </h3>
        </div>

        <div className="p-6 rounded-xl transition-colors duration-300">
          <img
            src={comments}
            alt="Toxicity Analysis"
            className="size-32 mx-auto"
          />
          <h3 className="dark:text-white text-gray-800 text-xl font-semibold mb-2">
            Toxicity Analysis
          </h3>
        </div>

        <div className="p-6 rounded-xl transition-colors duration-300">
          <img src={ai} alt="AI Insights" className="size-32 mx-auto" />
          <h3 className="dark:text-white text-gray-800 text-xl font-semibold mb-2">AI Insights</h3>
        </div>
      </div>
    </div>
  );
};

export default Hero;