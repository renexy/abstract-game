/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputComponent } from "./InputComponent";
import * as config from "../Config";

export class AbstractEnemyInputComponent extends InputComponent {
  #gameObject;
  #startX;
  #maxXMovement;

  constructor(gameObject: any) {
    super();
    this.#gameObject = gameObject;
    this.#startX = this.#gameObject.x;
    this.#maxXMovement = config.ENEMY_ABSTRACT_MOVEMENT_MAX_X;
    this._right = true;
    this._down = true;
    this._left = true;
  }

  update() {
    if (this.#gameObject.x > this.#startX + this.#maxXMovement) {
      this._left = true;
      this._right = false;
    } else if (this.#gameObject.x < this.#startX - this.#maxXMovement) {
      this._left = false;
      this._right = true;
    }
  }
}
