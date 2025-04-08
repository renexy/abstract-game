/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbstractEnemyInputComponent } from "../../input/BotAbstractInputComponent";
import { VerticalMovementComponent } from "../../movement/VerticalMovementComponent";
import * as config from "../../Config";
import { HorizontalMovementComponent } from "../../movement/HorizontalMovementComponent";
import { HealthComponent } from "../../health/HealthComponent";
import { ColliderComponent } from "../../collider/ColliderComponent";
import { CUSTOM_EVENTS } from "../../events/EventBusComponent";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class AbstractEnemy extends Phaser.GameObjects.Container {
  #isInitialized: boolean;
  #healthComponent: any;
  #colliderComponent: any;
  #inputComponent: any;
  #eventBusComponent: any;
  #abstractSprite;
  #horizontalMovementComponent: any;
  #verticalMovementComponent: any;
  #penguinFireFeetSprite;

  constructor(scene: any, x: any, y: any) {
    super(scene, x, y, []);
    this.#isInitialized = false;

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

  init(eventBusComponent: any) {
    this.#eventBusComponent = eventBusComponent;
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
    this.#eventBusComponent.emit(CUSTOM_EVENTS.ENEMY_INIT, this);
    this.#isInitialized = true;
  }

  reset() {
    this.setActive(true);
    this.setVisible(true);
    this.#inputComponent.startX = this.x;
    this.#healthComponent.reset();
    this.#verticalMovementComponent.reset();
    this.#horizontalMovementComponent.reset();
  }

  update(_ts: any, _dt: any) {
    if (!this.#isInitialized) return;
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
