/* eslint-disable @typescript-eslint/no-explicit-any */
import * as config from "../../Config";
import { CUSTOM_EVENTS } from "../../events/EventBusComponent";

export class LivesComponent extends Phaser.GameObjects.Container {
  #lives: any;
  #eventBusComponent: any;

  constructor(scene: any, eventBusComponent: any) {
    super(scene, 5, scene.scale.height - 30, []);
    this.#eventBusComponent = eventBusComponent;
    this.#lives = config.PLAYER_LIVES;
    this.scene.add.existing(this);

    for (let i = 0; i < this.#lives; i += 1) {
      const ship = scene.add
        .image(i * 40, 0, "penguin")
        .setScale(0.6)
        .setOrigin(0);
      this.add(ship);
    }

    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_DESTROYED, () => {
      this.#lives -= 1;
      this.getAt(this.#lives).destroy();

      if (this.#lives > 0) {
        scene.time.delayedCall(1500, () => {
          this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_SPAWN);
        });
        return;
      }

      this.scene.add
        .text(
          this.scene.scale.width / 2,
          this.scene.scale.height / 2,
          "GAME OVER",
          {
            fontSize: "24px",
          }
        )
        .setOrigin(0.5);

      this.#eventBusComponent.emit(CUSTOM_EVENTS.GAME_OVER);
    });

    this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_SPAWN);
  }
}
