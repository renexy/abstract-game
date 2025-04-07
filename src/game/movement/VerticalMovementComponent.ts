/* eslint-disable @typescript-eslint/no-explicit-any */
import * as config from "../Config";
export class VerticalMovementComponent {
  #gameObject;
  #inputComponent;
  #velocity;

  constructor(gameObject: any, inputComponent: any, velocity: any) {
    this.#gameObject = gameObject;
    this.#inputComponent = inputComponent;
    this.#velocity = velocity;

    this.#gameObject.body.setDamping(true);
    this.#gameObject.body.setDrag(config.COMPONENT_MOVEMENT_VERTICAL_DRAG);
    this.#gameObject.body.setMaxVelocity(config.COMPONENT_MOVEMENT_VERTICAL_MAX_VELOCITY);
  }

  reset() {
    this.#gameObject.body.velocity.y = 0;
    this.#gameObject.body.setAngularAcceleration(0);
  }

  update() {
    if (this.#inputComponent.downIsDown) {
      this.#gameObject.body.velocity.y += this.#velocity;
    } else if (this.#inputComponent.upIsDown) {
      this.#gameObject.body.velocity.y -= this.#velocity;
    } else {
      this.#gameObject.body.setAngularAcceleration(0);
    }
  }
}
