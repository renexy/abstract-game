import { VerticalMovementComponent } from "../../movement/VerticalMovementComponent";
import * as config from "../../Config";
import { BotFighterInputComponent } from "../../input/BotFighterInputComponent";
import { WeaponComponent } from "../../weapon/WeaponComponent";
import { HealthComponent } from "../../health/HealthComponent";
import { ColliderComponent } from "../../collider/ColliderComponent";
import { CUSTOM_EVENTS } from "../../events/EventBusComponent";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class FighterEnemy extends Phaser.GameObjects.Container {
  readonly type = "FighterEnemy";
  #isInitialized: boolean;
  #healthComponent: any;
  #colliderComponent: any;
  #inputComponent: any;
  #weaponComponent: any;
  #eventBusComponent: any;
  #abstractSprite;
  #verticalMovementComponent: any;
  #penguinFireFeetSprite;

  constructor(scene: any, x: any, y: any) {
    super(scene, x, y, []);
    this.#isInitialized = false;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    (this.body as any).setSize(24, 24);
    (this.body as any).setOffset(-12, -12);

    this.#abstractSprite = scene.add.sprite(0, 0, "fighter", 0);
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

  get colliderComponent() {
    return this.#colliderComponent;
  }

  get healthComponent() {
    return this.#healthComponent;
  }

  get weaponObjectGroup() {
    return this.#weaponComponent.bulletGroup;
  }

  get weaponComponent() {
    return this.#weaponComponent;
  }

  get shipAssetKey() {
    return "fighter"
  }

  get shipDestroyedAnimationKey() {
    return "explosion"
  }

  init(eventBusComponent: any) {
    this.#eventBusComponent = eventBusComponent;
    this.#inputComponent = new BotFighterInputComponent();
    this.#verticalMovementComponent = new VerticalMovementComponent(
      this,
      this.#inputComponent,
      config.ENEMY_FIGHTER_MOVEMENT_VERTICAL_VELOCITY
    );

    this.#weaponComponent = new WeaponComponent(this, this.#inputComponent, {
      speed: config.ENEMY_FIGHTER_BULLET_SPEED,
      lifespan: config.ENEMY_FIGHTER_BULLET_LIFESPAN,
      flipY: true,
      interval: config.ENEMY_FIGHTER_BULLET_INTERVAL,
      maxCount: config.ENEMY_FIGHTER_BULLET_MAX_COUNT,
      yOffset: 10,
    }, this.#eventBusComponent);

    this.#healthComponent = new HealthComponent(config.ENEMY_FIGHTER_HEALTH);
    this.#colliderComponent = new ColliderComponent(this.#healthComponent, this.#eventBusComponent);
    this.#eventBusComponent.emit(CUSTOM_EVENTS.ENEMY_INIT, this);
    this.#isInitialized = true;
  }

  reset() {
    this.setActive(true);
    this.setVisible(true);
    this.#healthComponent.reset();
    this.#verticalMovementComponent.reset();
  }

  update(_ts: any, dt: any) {
    if (!this.#isInitialized) return;

    if (!this.active) {
      return;
    }
    if (this.#healthComponent.isDead) {
      this.setActive(false);
      this.setVisible(false);
      this.#eventBusComponent.emit(CUSTOM_EVENTS.ENEMY_DESTROYED, this);
    }
    this.#inputComponent.update();
    this.#verticalMovementComponent.update();
    this.#weaponComponent.update(dt);
  }
}
