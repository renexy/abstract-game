/* eslint-disable @typescript-eslint/no-unused-vars */

import { CUSTOM_EVENTS } from "../events/EventBusComponent";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class EnemySpawnerComponent {
  readonly type = "EnemySpawnerComponent";
  #scene;
  #spawnInterval;
  #spawnAt;
  #group;
  #disableSpawning;

  constructor(
    scene: any,
    enemyClass: any,
    spawnConfig: any,
    eventBusComponent: any
  ) {
    this.#scene = scene;

    this.#group = this.#scene.add.group({
      name: `${this.type}-${Phaser.Math.RND.uuid()}`,
      classType: enemyClass,
      runChildUpdate: true,
      createCallback: (enemy: any) => {
        enemy.init(eventBusComponent);
      },
    });

    this.#spawnInterval = spawnConfig.interval;
    this.#spawnAt = spawnConfig.spawnAt;
    this.#disableSpawning = false;

    this.#scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.#scene.physics.world.on(
      Phaser.Physics.Arcade.Events.WORLD_STEP,
      this.worldStep,
      this
    );

    // Clean up event listeners when scene is destroyed
    this.#scene.events.once(Phaser.Scenes.Events.DESTROY, () => {
      this.cleanup();
    });

    eventBusComponent.on(CUSTOM_EVENTS.GAME_OVER, () => {
      this.#disableSpawning = true;
      this.cleanup();
    });
  }

  cleanup() {
    try {
      if (this.#scene && this.#scene.events) {
        this.#scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
      }
      if (this.#scene && this.#scene.physics && this.#scene.physics.world) {
        this.#scene.physics.world.off(
          Phaser.Physics.Arcade.Events.WORLD_STEP,
          this.worldStep,
          this
        );
      }
    } catch (error) {
      console.log('Cleanup error:', error);
    }
  }

  get phaserGroup() {
    return this.#group;
  }

  update(_ts: any, dt: any) {
    if (this.#disableSpawning) return;

    this.#spawnAt -= dt;
    if (this.#spawnAt > 0) {
      return;
    }

    const x = Phaser.Math.RND.between(30, this.#scene.scale.width - 30);
    const enemy = this.#group.get(x, -20);
    enemy.reset();
    this.#spawnAt = this.#spawnInterval;
  }

  worldStep(_delta: any) {
    if (this.#disableSpawning) return;

    this.#group.getChildren().forEach((enemy: any) => {
      if (!enemy.active) return;

      if (enemy.y > this.#scene.scale.height + 50) {
        enemy.setActive(false);
        enemy.setVisible(false);
      }
    });
  }
}
