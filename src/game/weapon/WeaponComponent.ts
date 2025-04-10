import { CUSTOM_EVENTS } from "../events/EventBusComponent";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class WeaponComponent {
  #gameObject;
  #inputComponent;
  #bulletGroup;
  #fireBulletInterval;
  #bulletConfig;
  #eventBusComponent;

  constructor(gameObject: any, inputComponent: any, bulletConfig: any, eventBusComponent: any) {
    this.#gameObject = gameObject;
    this.#inputComponent = inputComponent;
    this.#bulletConfig = bulletConfig;
    this.#fireBulletInterval = 0;
    this.#eventBusComponent = eventBusComponent;

    this.#bulletGroup = this.#gameObject.scene.physics.add.group({
      name: `bullet${Phaser.Math.RND.uuid()}`,
      enable: false,
    });
    this.#bulletGroup.createMultiple({
      key: "bullet",
      quantity: this.#bulletConfig.maxCount,
      active: false,
      visible: false,
    });

    this.#gameObject.scene.physics.world.on(
      Phaser.Physics.Arcade.Events.WORLD_STEP,
      this.worldStep,
      this
    );
    this.#gameObject.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.#gameObject.scene.physics.world.off(
          Phaser.Physics.Arcade.Events.WORLD_STEP,
          this.worldStep,
          this
        );
      },
      this
    );
  }

  get bulletGroup() {
    return this.#bulletGroup;
  }

  update(dt: any) {
    this.#fireBulletInterval -= dt;
    if (this.#fireBulletInterval > 0) {
      return;
    }
    if (this.#inputComponent.shootIsDown) {
      const bullet = this.#bulletGroup.getFirstDead();
      if (bullet === undefined || bullet === null) {
        return;
      }
      const x = this.#gameObject.x;
      const y = this.#gameObject.y + this.#bulletConfig.yOffset;
      bullet.enableBody(true, x, y, true, true);

      bullet.body.velocity.y -= this.#bulletConfig.speed;
      bullet.setState(this.#bulletConfig.lifespan);
      bullet.play("bullet");
      bullet.setScale(0.8);
      bullet.body.setSize(14, 18);
      bullet.setFlipY(this.#bulletConfig.flipY);

      this.#fireBulletInterval = this.#bulletConfig.interval;
      this.#eventBusComponent.emit(CUSTOM_EVENTS.SHIP_SHOOT);
    }
  }

  worldStep(delta: any) {
    this.#bulletGroup.getChildren().forEach((bullet: any) => {
      if (!bullet.active) return;
      bullet.state -= delta;
      if (bullet.state <= 0) {
        bullet.disableBody(true, true);
      }
    });
  }

  destroyBullet(bullet: any) {
    bullet.setState(0);
  }
}
