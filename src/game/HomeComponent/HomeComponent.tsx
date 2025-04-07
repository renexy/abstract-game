import { GameScene } from "../Scenes/game-scene";
import { BootScene } from "../Scenes/boot-scene";
import { useRef, useState } from "react";
import { PreloadScene } from "../Scenes/preload-scene";

const Home = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const gameRef = useRef<Phaser.Game | null>(null);

  const startGame = () => {
    setGameStarted(true);
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game({
        type: Phaser.CANVAS,
        roundPixels: true,
        pixelArt: true,
        scale: {
          parent: "game-container",
          width: 650,
          height: "100%",
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
    }

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        setGameStarted(false);
      }
    };
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      {!gameStarted && (
        <button onClick={startGame} className="text-[#fff]">
          Start
        </button>
      )}
      {gameStarted && <div id="game-container"></div>}
    </div>
  );
};

export default Home;
