/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Phaser from "phaser";
import { Player } from "../objects/player";
// import { AbstractEnemy } from "../objects/enemies/abstract";
import { FighterEnemy } from "../objects/enemies/fighter";
import { EnemySpawnerComponent } from "../spawners/EnemySpawnerComponent";
import { AbstractEnemy } from "../objects/enemies/abstract";
import * as config from "../Config";
import { CUSTOM_EVENTS, EventBusComponent } from "../events/EventBusComponent";
import { EnemyDestroyedComponent } from "../spawners/EnemyDestroyedComponent";
import { Score } from "../objects/ui/Score";
import { LivesComponent } from "../objects/ui/Lives";
import { AudioManager } from "../objects/AudioManager";
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.pack("asset_pack", "/assets/data/assets.json");
  }

  create() {
    this.add
      .sprite(0, 0, "bg1", 0)
      .setOrigin(0, 1)
      .setAlpha(0.7)
      .setAngle(90)
      .setScale(1, 1.25)
      .play("bg1");
    this.add
      .sprite(0, 0, "bg2", 0)
      .setOrigin(0, 1)
      .setAlpha(0.7)
      .setAngle(90)
      .setScale(1, 1.25)
      .play("bg2");
    this.add
      .sprite(0, 0, "bg3", 0)
      .setOrigin(0, 1)
      .setAlpha(0.7)
      .setAngle(90)
      .setScale(1, 1.25)
      .play("bg3");
    const eventBusComponent = new EventBusComponent();
    const player = new Player(this, eventBusComponent);
    const abstractSpawner = new EnemySpawnerComponent(
      this,
      AbstractEnemy,
      {
        interval: config.ENEMY_ABSTRACT_GROUP_SPAWN_INTERVAL,
        spawnAt: config.ENEMY_ABSTRACT_GROUP_SPAWN_AT,
      },
      eventBusComponent
    );
    const fighterSpawner = new EnemySpawnerComponent(
      this,
      FighterEnemy,
      {
        interval: config.ENEMY_FIGHTER_GROUP_SPAWN_INTERVAL,
        spawnAt: config.ENEMY_FIGHTER_GROUP_SPAWN_AT,
      },
      eventBusComponent
    );

    new EnemyDestroyedComponent(this, eventBusComponent);

    this.physics.add.overlap(
      player,
      abstractSpawner.phaserGroup,
      (playerGameObject: any, enemyGameObject: any) => {
        if (!playerGameObject.active || !enemyGameObject.active) return;
        playerGameObject.colliderComponent.collideWithEnemyShip();
        enemyGameObject.colliderComponent.collideWithEnemyShip();
      }
    );

    this.physics.add.overlap(
      player,
      fighterSpawner.phaserGroup,
      (playerGameObject: any, enemyGameObject: any) => {
        if (!playerGameObject.active || !enemyGameObject.active) return;
        playerGameObject.colliderComponent.collideWithEnemyShip();
        enemyGameObject.colliderComponent.collideWithEnemyShip();
      }
    );

    eventBusComponent.on(CUSTOM_EVENTS.ENEMY_INIT, (gameObject: any) => {
      if (gameObject.type !== "FighterEnemy") {
        return;
      }

      this.physics.add.overlap(
        player,
        gameObject.weaponObjectGroup,
        (playerGameObject: any, enemyGameObject: any) => {
          if (!playerGameObject.active || !enemyGameObject.active) return;
          gameObject.weaponComponent.destroyBullet(enemyGameObject);
          playerGameObject.colliderComponent.collideWithEnemyProjectile();
        }
      );
    });

    this.physics.add.overlap(
      abstractSpawner.phaserGroup,
      player.weaponObjectGroup,
      (playerGameObject: any, projectileGameObject: any) => {
        if (!playerGameObject.active || !projectileGameObject.active) return;
        player.weaponComponent.destroyBullet(projectileGameObject);
        playerGameObject.colliderComponent.collideWithEnemyProjectile();
      }
    );

    this.physics.add.overlap(
      fighterSpawner.phaserGroup,
      player.weaponObjectGroup,
      (playerGameObject: any, projectileGameObject: any) => {
        if (!playerGameObject.active || !projectileGameObject.active) return;
        player.weaponComponent.destroyBullet(projectileGameObject);
        playerGameObject.colliderComponent.collideWithEnemyProjectile();
      }
    );

    const x = new Score(this, eventBusComponent);
    new LivesComponent(this, eventBusComponent);
    new AudioManager(this, eventBusComponent);

    // Listen for game over event and emit it to the game instance
    eventBusComponent.on(CUSTOM_EVENTS.GAME_OVER, () => {
      this.game.events.emit("gameOver", x);
    });
  }
}
