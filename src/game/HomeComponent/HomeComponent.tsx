import { GameScene } from "../Scenes/game-scene";
import { BootScene } from "../Scenes/boot-scene";
import { useRef } from "react";
import { PreloadScene } from "../Scenes/preload-scene";

const Home = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  const startGame = () => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game({
        type: Phaser.CANVAS,
        roundPixels: true,
        pixelArt: true,
        scale: {
          parent: "game-container",
          width: 450,
          height: 640,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        },
        backgroundColor: "#0000FF",
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0, x: 0 },
            debug: true,
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
      }
    };
  };

  return (
    <div>
      {!gameRef.current && <button onClick={startGame}>Start</button>}
      {gameRef.current && <div id="game-container" />}
    </div>
  );
};

export default Home;
