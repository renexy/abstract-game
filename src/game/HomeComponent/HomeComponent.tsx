/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameScene } from "../Scenes/game-scene";
import { BootScene } from "../Scenes/boot-scene";
import { useRef, useState } from "react";
import { PreloadScene } from "../Scenes/preload-scene";
import {
  useAbstractClient,
  useLoginWithAbstract,
} from "@abstract-foundation/agw-react";
import { useAccount } from "wagmi";
import { CircularProgress } from "@mui/material";
import Scoreboard from "../../components/Scoreboard";
import toast from "react-hot-toast";
import {
  depositTokens,
  depositTokenstest,
} from "../../services/web3/interactions";
import logo from "../../assets/logo.png";
import abstract from "../../assets/abstract.png";

const Home = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [updateHighScore, setUpdateHighScore] = useState<string>("");
  const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const gameRef = useRef<Phaser.Game | null>(null);
  const { address, isConnected, isConnecting } = useAccount();
  const { data: agwClient } = useAbstractClient();
  const { login, logout } = useLoginWithAbstract();

  const startGame = () => {
    // If there's an existing game, destroy it first
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    setUpdateHighScore("");
    setGameStarted(true);
    gameRef.current = new Phaser.Game({
      type: Phaser.CANVAS,
      roundPixels: true,
      pixelArt: true,
      scale: {
        parent: "game-container",
        width: 360,
        height: 640,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
      },
      backgroundColor: "transparent",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0, x: 0 },
          debug: false,
        },
      },
    });

    gameRef.current.scene.add("BootScene", BootScene);
    gameRef.current.scene.add("PreloadScene", PreloadScene);
    gameRef.current.scene.add("GameScene", GameScene);
    gameRef.current.scene.start("BootScene");

    // Listen for game over event
    gameRef.current.events.on("gameOver", (data: any) => {
      console.log("Game over event received in HomeComponent", data);
      localStorage.removeItem("player-lives-noot");
      setGameStarted(false);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        setUpdateHighScore(data.text);
        setShowScoreboard(true);
      }
    });
  };

  const getWalletInfo = () => {
    if (!isConnected)
      return (
        <span
          className="text-[#5c5e6d] cursor-pointer hover:text-[#ef971f] hover:shadow-[#ef971f] transition-all duration-300"
          onClick={login}
        >
          Connect Wallet
        </span>
      );

    return (
      <span className="text-[#5c5e6d]">
        {address?.substring(0, 4) +
          "..." +
          address?.substring(address.length - 4)}
      </span>
    );
  };

  const deleteThis = async () => {
    setLoading(true);
    await depositTokens(agwClient!);
    await new Promise((res) => setTimeout(res, 3000));
    await depositTokenstest(agwClient!);
    window.localStorage.setItem("player-lives-noot", "3");
    setLoading(false);
  };

  if (isConnecting || loading) {
    return (
      <div
        className="bg-[#090812] bg-opacity-95 shadow-lg p-4 rounded-lg h-[540px] gap-10
  w-[500px] relative animate-fadeInSlideUp justify-center items-center flex flex-col justify-center"
      >
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (showScoreboard) {
    return (
      <Scoreboard
        updateHighScore={updateHighScore}
        goBack={() => {
          setUpdateHighScore("");
          setShowScoreboard(false);
        }}
      />
    );
  }

  return (
    <>
      {gameStarted && <div id="game-container"></div>}
      {!gameStarted && (
        <div
          className="bg-[#090812] bg-opacity-95 shadow-lg p-4 rounded-lg h-[540px] gap-8
  w-[500px] relative animate-fadeInSlideUp justify-center items-center flex flex-col justify-center"
        >
          <div className="flex flex-col gap-[6px] justify-center items-center">
            <img src={logo} height={40} width={40} />
            <span className="text-[#5c5e6d] text-[24px] hover:shadow-[#ef971f] transition-all duration-300">
              <span className="text-[#f62c25]">Noot</span> Shooter
            </span>
            <span className="text-[#5c5e6d] text-[20px] w-full flex justify-evenly items-center">
              Powered by <img src={abstract} height={32} width={32} />
            </span>
          </div>

          <span
            className={
              !isConnected && !gameStarted
                ? "text-[#4A5659]"
                : "text-[#5c5e6d] cursor-pointer hover:text-[#ef971f] hover:shadow-[#ef971f] transition-all duration-300"
            }
            onClick={() => {
              if (!isConnected) {
                toast.error("Please connect wallet!");
              } else {
                startGame();
              }
            }}
          >
            {gameRef.current ? "Play Again" : "Start Game"}
          </span>
          {getWalletInfo()}
          <span
            onClick={() => setShowScoreboard(true)}
            className="text-[#5c5e6d] cursor-pointer hover:text-[#ef971f] hover:shadow-[#ef971f] transition-all duration-300"
          >
            Leaderboard
          </span>
          <span
            className="text-[#5c5e6d] cursor-pointer hover:text-[#ef971f] hover:shadow-[#ef971f] transition-all duration-300"
            onClick={deleteThis}
          >
            Buy extra life
          </span>
          {address && (
            <span
              className="text-[#5c5e6d] cursor-pointer hover:text-[#ef971f] hover:shadow-[#ef971f] transition-all duration-300"
              onClick={logout}
            >
              Disconnect Wallet
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
