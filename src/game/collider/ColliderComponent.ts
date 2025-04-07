/* eslint-disable @typescript-eslint/no-explicit-any */
export class ColliderComponent {
  #lifeComponent;

  constructor(lifeComponent: any) {
    this.#lifeComponent = lifeComponent;
  }

  collideWithEnemyShip() {
    if (this.#lifeComponent.isDead) return;

    this.#lifeComponent.die();
  }

  collideWithEnemyProjectile() {
    if (this.#lifeComponent.isDead) return;

    this.#lifeComponent.hit();
  }
}
