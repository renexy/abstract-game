import { AbstractEnemyInputComponent } from "../../input/BotAbstractInputComponent";
import { VerticalMovementComponent } from "../../movement/VerticalMovementComponent";
import * as config from "../../Config";
import { HorizontalMovementComponent } from "../../movement/HorizontalMovementComponent";
import { HealthComponent } from "../../health/HealthComponent";
import { ColliderComponent } from "../../collider/ColliderComponent";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class AbstractEnemy extends Phaser.GameObjects.Container {
  #healthComponent;
  #colliderComponent;
  #inputComponent;
  #abstractSprite;
  #horizontalMovementComponent;
  #verticalMovementComponent;
  #penguinFireFeetSprite;

  constructor(scene: any, x: any, y: any) {
    super(scene, x, y, []);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    (this.body as any).setSize(24, 24);
    (this.body as any).setOffset(-12, -12);

    this.#abstractSprite = scene.add.sprite(0, 0, "abstract", 0);
    this.#penguinFireFeetSprite = scene.add
      .sprite(0, -20, "penguin_fire_feet")
      .setFlipY(true);
    this.#penguinFireFeetSprite.play("penguin_fire_feet");
    this.add([this.#abstractSprite, this.#penguinFireFeetSprite]);

    this.#inputComponent = new AbstractEnemyInputComponent(this);

    this.#verticalMovementComponent = new VerticalMovementComponent(
      this,
      this.#inputComponent,
      config.ENEMY_ABSTRACT_MOVEMENT_VERTICAL_VELOCITY
    );
    this.#horizontalMovementComponent = new HorizontalMovementComponent(
      this,
      this.#inputComponent,
      config.ENEMY_ABSTRACT_MOVEMENT_HORIZONTAL_VELOCITY
    );

    this.#healthComponent = new HealthComponent(config.ENEMY_ABSTRACT_HEALTH);
    this.#colliderComponent = new ColliderComponent(this.#healthComponent);

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
      },
      this
    );
  }

  get healthComponent() {
    return this.#healthComponent;
  }

  get colliderComponent() {
    return this.#colliderComponent;
  }

  update(ts: any, dt: any) {
    console.log(ts, dt);
    if (!this.active) {
      return;
    }
    if (this.#healthComponent.isDead) {
      this.setActive(false);
      this.setVisible(false);
    }
    this.#inputComponent.update();
    this.#verticalMovementComponent.update();
    this.#horizontalMovementComponent.update();
  }
}
