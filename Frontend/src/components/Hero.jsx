import youtubeIcon from "../assets/images/yt-icon.png";
import reportIcon from "../assets/images/report.png";
import comments from "../assets/images/comments.png";
import ai from "../assets/images/ai.png";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center font-sora font-semibold">
      <img
        src={youtubeIcon}
        alt="YouTube Logo"
        className="size-40 mt-10 mb-4 animate-bounce"
      />

      <h1 className="text-5xl font-bold text-white mb-2">
        EVERY COMMENT COUNTS
      </h1>
      <h2 className="text-5xl font-bold text-white mb-8">
        GET THE MEANING BEHIND IT
      </h2>

      <p className="text-gray-300 text-lg mb-8 max-w-2xl">
        Get instant sentiment analysis on your YouTube comments. Know what your
        audience feels — at a glance.
      </p>

      <button className="bg-brightRed text-white px-8 py-2 rounded-full text-base font-semibold hover:bg-brightRed/80 transition-colors shadow-[0_0_50px_rgba(242,0,1,0.5)]">
        GET INSIGHTS NOW
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="p-6 rounded-xl transition-colors duration-300">
          <img
            src={reportIcon}
            alt="Sentiment Analysis"
            className="size-32 mx-auto"
          />
          <h3 className="text-white text-xl font-semibold mb-2">
            Sentiment Analysis
          </h3>
        </div>

        <div className="p-6 rounded-xl transition-colors duration-300">
          <img
            src={comments}
            alt="Toxicity Analysis"
            className="size-32 mx-auto"
          />
          <h3 className="text-white text-xl font-semibold mb-2">
            Toxicity Analysis
          </h3>
        </div>

        <div className="p-6 rounded-xl transition-colors duration-300">
          <img src={ai} alt="AI Insights" className="size-32 mx-auto" />
          <h3 className="text-white text-xl font-semibold mb-2">AI Insights</h3>
        </div>
      </div>
    </div>
  );
};

export default Hero;
