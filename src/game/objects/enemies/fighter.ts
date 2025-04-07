import { VerticalMovementComponent } from "../../movement/VerticalMovementComponent";
import * as config from "../../Config";
import { BotFighterInputComponent } from "../../input/BotFighterInputComponent";
import { WeaponComponent } from "../../weapon/WeaponComponent";
import { HealthComponent } from "../../health/HealthComponent";
import { ColliderComponent } from "../../collider/ColliderComponent";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class FighterEnemy extends Phaser.GameObjects.Container {
  #healthComponent;
  #colliderComponent;
  #inputComponent;
  #weaponComponent;
  #abstractSprite;
  #verticalMovementComponent;
  #penguinFireFeetSprite;

  constructor(scene: any, x: any, y: any) {
    super(scene, x, y, []);

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
    });

    this.#healthComponent = new HealthComponent(config.ENEMY_FIGHTER_HEALTH);
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

  update(ts: any, dt: any) {
    console.log(ts);
    if (!this.active) {
      return;
    }
    if (this.#healthComponent.isDead) {
      this.setActive(false);
      this.setVisible(false);
    }
    this.#inputComponent.update();
    this.#verticalMovementComponent.update();
    this.#weaponComponent.update(dt);
  }
}
