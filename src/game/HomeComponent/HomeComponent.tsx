import { GameScene } from "../Scenes/game-scene";
import { BootScene } from "../Scenes/boot-scene";
import { useRef, useState } from "react";
import { PreloadScene } from "../Scenes/preload-scene";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { useAccount } from "wagmi";
import { CircularProgress } from "@mui/material";

const Home = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const gameRef = useRef<Phaser.Game | null>(null);
  const { address, isConnected, isConnecting } = useAccount();
  const { login } = useLoginWithAbstract();

  const startGame = () => {
    // If there's an existing game, destroy it first
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

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
    gameRef.current.events.on('gameOver', () => {
      console.log('Game over event received in HomeComponent');
      setGameStarted(false);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    });
  };

  const getWalletInfo = () => {
    if (!isConnected)
      return (
        <span
          className="text-white cursor-pointer hover:text-[#764120] hover:shadow-[#764120] transition-all duration-300"
          onClick={login}
        >
          Connect Wallet
        </span>
      );

    return (
      <span className="text-white">
        {address?.substring(0, 4) +
          "..." +
          address?.substring(address.length - 4)}
      </span>
    );
  };

  if (isConnecting) {
    return (
      <div
        className="bg-[#090812] bg-opacity-95 shadow-lg p-4 rounded-lg h-[540px] gap-10
  w-[500px] relative animate-fadeInSlideUp justify-center items-center flex flex-col justify-center"
      >
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <>
      {gameStarted && <div id="game-container"></div>}
      {!gameStarted && (
        <div
          className="bg-[#090812] bg-opacity-95 shadow-lg p-4 rounded-lg h-[540px] gap-10
  w-[500px] relative animate-fadeInSlideUp justify-center items-center flex flex-col justify-center"
        >
          <span
            className={
              !isConnected && !gameStarted
                ? "text-[#4A5659]"
                : "text-white cursor-pointer hover:text-[#764120] hover:shadow-[#764120] transition-all duration-300"
            }
            onClick={startGame}
          >
            {gameRef.current ? "Play Again" : "Start Game"}
          </span>
          {getWalletInfo()}
          <span className="text-white cursor-pointer hover:text-[#764120] hover:shadow-[#764120] transition-all duration-300">
            Leaderboard
          </span>
          <span className="text-white cursor-pointer hover:text-[#764120] hover:shadow-[#764120] transition-all duration-300">
            Buy upgrades
          </span>
        </div>
      )}
    </>
  );
};

export default Home;
