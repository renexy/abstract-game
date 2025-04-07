/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Phaser from "phaser";
import { Player } from "../objects/player";
// import { AbstractEnemy } from "../objects/enemies/abstract";
import { FighterEnemy } from "../objects/enemies/fighter";
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.pack("asset_pack", "/assets/data/assets.json");
  }

  create() {
    const player = new Player(this);
    // const enemy = new AbstractEnemy(this, this.scale.width / 2, 0);
    const enemy = new FighterEnemy(this, this.scale.width / 2, 0);

    this.physics.add.overlap(
      player,
      enemy,
      (playerGameObject: any, enemyGameObject: any) => {
        playerGameObject.colliderComponent.collideWithEnemyShip();
        enemyGameObject.colliderComponent.collideWithEnemyShip();
      }
    );

    this.physics.add.overlap(
      player,
      enemy.weaponObjectGroup,
      (playerGameObject: any, enemyGameObject: any) => {
        enemy.weaponComponent.destroyBullet(enemyGameObject);
        playerGameObject.colliderComponent.collideWithEnemyProjectile();
      }
    );

    this.physics.add.overlap(
      enemy,
      player.weaponObjectGroup,
      (playerGameObject: any, projectileGameObject: any) => {
        player.weaponComponent.destroyBullet(projectileGameObject);
        playerGameObject.colliderComponent.collideWithEnemyProjectile();
      }
    );
  }
}
