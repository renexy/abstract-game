/* eslint-disable @typescript-eslint/no-explicit-any */
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllHighScores, saveHighScore } from "../services/firebase/firebase";
import { useAccount } from "wagmi";
import TwitterIcon from "@mui/icons-material/Twitter";

type ScoreboardProps = {
  updateHighScore: string;
  goBack: () => void;
};

function Scoreboard({ updateHighScore, goBack }: ScoreboardProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [showNewScoreScreen, setNewScoreScreen] = useState<boolean>(false);
  const [leaderBoard, setLeaderboard] = useState<any>([]);

  const { address } = useAccount();

  useEffect(() => {
    if (updateHighScore) {
      updateHighScoreData();
      setNewScoreScreen(true);
    }
    getHighScores();
  }, []);

  const getHighScores = async () => {
    const data = await getAllHighScores();
    const sortedData = data.sort((a: any, b: any) => b.score - a.score);
    setLeaderboard(sortedData);
    setLoading(false);
  };

  const updateHighScoreData = async () => {
    await saveHighScore(+updateHighScore, address as any);
  };

  const openTestnetExplorer = (wa: any) => {
    window.open(`https://explorer.testnet.abs.xyz/address/${wa}`, "_blank");
  };

  const getWalletInfo = (addressInternal: any) => {
    return (
      <span
        onClick={() => openTestnetExplorer(addressInternal)}
        className={`${
          addressInternal === address?.toLowerCase()
            ? "text-[#764120]"
            : "text-white cursor-pointer hover:text-[#764120] hover:shadow-[#764120] transition-all duration-300"
        }`}
      >
        {addressInternal?.substring(0, 4) +
          "..." +
          addressInternal?.substring(addressInternal.length - 4)}
      </span>
    );
  };
  const tweet = (text: string) => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(tweetUrl, "_blank");
  };

  if (loading) {
    return (
      <div
        className="bg-[#090812] bg-opacity-95 shadow-lg p-4 rounded-lg h-[540px] gap-10
      w-[500px] relative animate-fadeInSlideUp justify-center items-center flex flex-col justify-center"
      >
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (showNewScoreScreen) {
    return (
      <div
        className="bg-[#090812] bg-opacity-95 shadow-lg p-4 rounded-lg h-[540px] gap-10
        w-[500px] relative animate-fadeInSlideUp justify-center items-center flex flex-col justify-center"
      >
        <span className="text-white hover:text-[#764120] hover:shadow-[#764120] transition-all duration-300 text-center">
          Congratulations! 🎊 <br /> Your high score was: {updateHighScore}
        </span>
        <TwitterIcon
          className="cursor-pointer"
          color="secondary"
          onClick={() =>
            tweet(
              `I just reached a high score of ${updateHighScore} on https://abstract-game.vercel.app/`
            )
          }
        />
        <span
          onClick={() => setNewScoreScreen(false)}
          className="text-white cursor-pointer hover:text-[#764120] hover:shadow-[#764120] transition-all duration-300"
        >
          Continue to leaderboard
        </span>
      </div>
    );
  }

  return (
    <div
      className="bg-[#090812] bg-opacity-95 shadow-lg p-4 rounded-lg h-[540px] gap-10
    w-[500px] relative animate-fadeInSlideUp justify-center items-center flex flex-col justify-center"
    >
      <span className="text-white hover:text-[#764120] hover:shadow-[#764120] transition-all duration-300">
        Leaderboard
      </span>
      <div className="flex w-full overflow-y-auto flex flex-col gap-[8px]">
        {leaderBoard.map((item: any, index: number) => {
          return (
            <div
              className="flex w-full justify-between items-center px-[4px]"
              key={index}
            >
              <span className="text-white cursor-pointer hover:text-[#764120] hover:shadow-[#764120] transition-all duration-300">
                {getWalletInfo(item.wa)}
              </span>
              <span className="text-white cursor-pointer hover:text-[#764120] hover:shadow-[#764120] transition-all duration-300">
                {item.score}
              </span>
            </div>
          );
        })}
      </div>

      <span
        onClick={goBack}
        className="text-white cursor-pointer hover:text-[#764120] hover:shadow-[#764120] transition-all duration-300"
      >
        Back
      </span>
    </div>
  );
}

export default Scoreboard;
