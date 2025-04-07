/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    this.load.pack("asset_pack", "src/game/assets/data/assets.json");
  }

  create() {
    this.createAnimations();
    this.scene.start("GameScene");
  }

  createAnimations() {
    const data = this.cache.json.get("animations_json");
    data.forEach((animation: any) => {
      const frames = animation.frames
        ? this.anims.generateFrameNumbers(animation.assetKey, {
            frames: animation.frames,
          })
        : this.anims.generateFrameNumbers(animation.assetKey);

      this.anims.create({
        key: animation.key,
        frames: frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
      });
    });
  }
}
