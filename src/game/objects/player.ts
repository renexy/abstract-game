/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from "phaser";
import { KeyboardInputComponent } from "../input/KeyboardInputComponent";
import { HorizontalMovementComponent } from "../movement/HorizontalMovementComponent";
import * as config from "../Config";
import { WeaponComponent } from "../weapon/WeaponComponent";
import { HealthComponent } from "../health/HealthComponent";
import { ColliderComponent } from "../collider/ColliderComponent";

export class Player extends Phaser.GameObjects.Container {
  #healthComponent;
  #colliderComponent;
  #horizontalMovementComponent;
  #weaponComponent;
  #keyboardInputCompoinent;
  #penguinSprite;
  #penguinFireFeetSprite;

  constructor(scene: any) {
    super(scene, scene.scale.width / 2, scene.scale.height - 32, []);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    (this.body as any).setSize(24, 24);
    (this.body as any).setOffset(-12, -12);
    (this.body as any).setCollideWorldBounds(true);
    this.setDepth(2);

    this.#penguinSprite = scene.add.sprite(0, -18, "penguin");
    this.#penguinFireFeetSprite = scene.add.sprite(0, 0, "penguin_fire_feet");
    this.#penguinFireFeetSprite.play("penguin_fire_feet");
    this.add([this.#penguinFireFeetSprite, this.#penguinSprite]);

    this.#keyboardInputCompoinent = new KeyboardInputComponent(this.scene);
    this.#horizontalMovementComponent = new HorizontalMovementComponent(
      this,
      this.#keyboardInputCompoinent,
      config.PLAYER_MOVEMENT_HORIZONTAL_VELOCITY
    );
    this.#weaponComponent = new WeaponComponent(
      this,
      this.#keyboardInputCompoinent,
      {
        speed: config.PLAYER_BULLET_SPEED,
        lifespan: config.PLAYER_BULLET_LIFESPAN,
        flipY: false,
        interval: config.PLAYER_BULLET_INTERVAL,
        maxCount: config.PLAYER_BULLET_MAX_COUNT,
        yOffset: -20,
      }
    );

    this.#healthComponent = new HealthComponent(config.PLAYER_HEALTH);
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
      this.#hide();
      this.setVisible(true);
      this.#penguinSprite.play({
        key: "explosion",
      });
      return;
    }

    this.#penguinSprite.setFrame((config.PLAYER_HEALTH - this.#healthComponent.life).toString(10));
    this.#keyboardInputCompoinent.update();
    this.#horizontalMovementComponent.update();
    this.#weaponComponent.update(dt);
  }

  #hide() {
    this.setActive(false);
    this.setVisible(false);
    this.#penguinFireFeetSprite.setVisible(false);
    this.#keyboardInputCompoinent.lockInput = true;
  }
}
