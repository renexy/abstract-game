/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from "phaser";
import { KeyboardInputComponent } from "../input/KeyboardInputComponent";
import { HorizontalMovementComponent } from "../movement/HorizontalMovementComponent";
import * as config from "../Config"
import { VerticalMovementComponent } from "../movement/VerticalMovementComponent";

export class Player extends Phaser.GameObjects.Container {
  #horizontalMovementComponent;
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
    this.#horizontalMovementComponent = new HorizontalMovementComponent(this, this.#keyboardInputCompoinent, config.PLAYER_MOVEMENT_HORIZONTAL_VELOCITY);
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
      },
      this
    );
  }

  update(ts: any, dt: any) {
    // console.log(ts, dt);
    this.#keyboardInputCompoinent.update();
    this.#horizontalMovementComponent.update();
  }
}
