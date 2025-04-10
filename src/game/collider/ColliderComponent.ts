import { CUSTOM_EVENTS } from "../events/EventBusComponent";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class ColliderComponent {
  #lifeComponent;
  #eventBusComponent;

  constructor(lifeComponent: any, eventBusComponent: any) {
    this.#lifeComponent = lifeComponent;
    this.#eventBusComponent = eventBusComponent;
  }

  collideWithEnemyShip() {
    if (this.#lifeComponent.isDead) return;

    this.#lifeComponent.die();
  }

  collideWithEnemyProjectile() {
    if (this.#lifeComponent.isDead) return;

    this.#lifeComponent.hit();
    this.#eventBusComponent.emit(CUSTOM_EVENTS.SHIP_HIT);
  }
}
