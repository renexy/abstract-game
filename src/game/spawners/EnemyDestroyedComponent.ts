/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_EVENTS } from "../events/EventBusComponent";

export class EnemyDestroyedComponent {
  readonly type = "EnemyDestroyedComponent";
  #scene: any;
  #group: any;
  #eventBusComponent: any;

  constructor(scene: any, eventBusComponent: any) {
    this.#scene = scene;
    this.#eventBusComponent = eventBusComponent;

    this.#group = this.#scene.add.group({
      name: `${this.type}-${Phaser.Math.RND.uuid}`,
    });

    this.#eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, (enemy: any) => {
      const gameObject = this.#group.get(
        enemy.x,
        enemy.y,
        enemy.shipAssetKey,
        0
      );
      gameObject.play({
        key: enemy.shipDestroyedAnimationKey,
      });
    });
  }
}
