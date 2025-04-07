/* eslint-disable @typescript-eslint/no-unused-vars */

import Phaser from "phaser";
import { Player } from "../objects/player";
import { AbstractEnemy } from "../objects/enemies/abstract";
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.pack('asset_pack', '/assets/data/assets.json');
  }

  create() {
    new Player(this);
    new AbstractEnemy(this, this.scale.width / 2, 0);
    // const enemy = new FighterEnemy(this, this.scale.width / 2, 0);
  }
}
