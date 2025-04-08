/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_EVENTS } from "../../events/EventBusComponent";
import * as config from "../../Config";

const ENEMY_SCORES: any = {
  AbstractEnemy: config.ENEMY_ABSTRACT_SCORE,
  FighterEnemy: config.ENEMY_FIGHTER_SCORE,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export class Score extends Phaser.GameObjects.Text {
  #score: any;
  #eventBusComponent: any;

  constructor(scene: any, eventBusComponent: any) {
    super(scene, scene.scale.width / 2, 20, "0", {
      fontSize: "24px",
      color: "#ff2f66",
    });

    this.scene.add.existing(this);
    this.#eventBusComponent = eventBusComponent;
    this.#score = 0;
    this.setOrigin(0.5);

    this.#eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, (enemy: any) => {
      console.log(ENEMY_SCORES[enemy.constructor.name], 'score');
      this.#score += ENEMY_SCORES[enemy.constructor.name];
      this.setText(this.#score.toString(10));
    });
  }
}
