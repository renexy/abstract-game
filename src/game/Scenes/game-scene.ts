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
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.pack("asset_pack", "/assets/data/assets.json");
  }

  create() {
    const eventBusComponent = new EventBusComponent();
    const player = new Player(this);
    const abstractSpawner = new EnemySpawnerComponent(this, AbstractEnemy, {
      interval: config.ENEMY_ABSTRACT_GROUP_SPAWN_INTERVAL,
      spawnAt: config.ENEMY_ABSTRACT_GROUP_SPAWN_AT,
    }, eventBusComponent);
    const fighterSpawner = new EnemySpawnerComponent(this, FighterEnemy, {
      interval: config.ENEMY_FIGHTER_GROUP_SPAWN_INTERVAL,
      spawnAt: config.ENEMY_FIGHTER_GROUP_SPAWN_AT,
    }, eventBusComponent);
    // const enemy = new AbstractEnemy(this, this.scale.width / 2, 0);
    // const enemy = new FighterEnemy(this, this.scale.width / 2, 0);

    this.physics.add.overlap(
      player,
      abstractSpawner.phaserGroup,
      (playerGameObject: any, enemyGameObject: any) => {
        playerGameObject.colliderComponent.collideWithEnemyShip();
        enemyGameObject.colliderComponent.collideWithEnemyShip();
      }
    );

    this.physics.add.overlap(
      player,
      fighterSpawner.phaserGroup,
      (playerGameObject: any, enemyGameObject: any) => {
        playerGameObject.colliderComponent.collideWithEnemyShip();
        enemyGameObject.colliderComponent.collideWithEnemyShip();
      }
    );

    eventBusComponent.on(CUSTOM_EVENTS.ENEMY_INIT, (gameObject: any) => {
      if(gameObject.constructor.name !== 'FighterEnemy') {
        return; 
      }

      this.physics.add.overlap(
        player,
        gameObject.weaponObjectGroup,
        (playerGameObject: any, enemyGameObject: any) => {
          gameObject.weaponComponent.destroyBullet(enemyGameObject);
          playerGameObject.colliderComponent.collideWithEnemyProjectile();
        }
      );
    })


    this.physics.add.overlap(
      abstractSpawner.phaserGroup,
      player.weaponObjectGroup,
      (playerGameObject: any, projectileGameObject: any) => {
        player.weaponComponent.destroyBullet(projectileGameObject);
        playerGameObject.colliderComponent.collideWithEnemyProjectile();
      }
    );

    this.physics.add.overlap(
      fighterSpawner.phaserGroup,
      player.weaponObjectGroup,
      (playerGameObject: any, projectileGameObject: any) => {
        player.weaponComponent.destroyBullet(projectileGameObject);
        playerGameObject.colliderComponent.collideWithEnemyProjectile();
      }
    );
  }
}
