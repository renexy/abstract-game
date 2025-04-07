/* eslint-disable @typescript-eslint/no-explicit-any */
import * as config from "../Config";
export class HorizontalMovementComponent {
  #gameObject;
  #inputComponent;
  #velocity;

  constructor(gameObject: any, inputComponent: any, velocity: any) {
    this.#gameObject = gameObject;
    this.#inputComponent = inputComponent;
    this.#velocity = velocity;

    this.#gameObject.body.setDamping(true);
    this.#gameObject.body.setDrag(config.COMPONENT_MOVEMENT_HORIZONTAL_DRAG);
    this.#gameObject.body.setMaxVelocity(config.COMPONENT_MOVEMENT_HORIZONTAL_MAX_VELOCITY);
  }

  reset() {
    this.#gameObject.body.velocity.x = 0;
    this.#gameObject.body.setAngularAcceleration(0);
  }

  update() {
    if (this.#inputComponent.leftIsDown) {
      this.#gameObject.body.velocity.x -= this.#velocity;
    } else if (this.#inputComponent.rightIsDown) {
      this.#gameObject.body.velocity.x += this.#velocity;
    } else {
      this.#gameObject.body.setAngularAcceleration(0);
    }
  }
}
