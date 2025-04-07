/* eslint-disable @typescript-eslint/no-unused-vars */

import Phaser from "phaser";
import { Player } from "../objects/player";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.pack('asset_pack', 'src/game/assets/data/assets.json');
  }

  create() {
    const player = new Player(this);
    console.log(player);
  }
}
