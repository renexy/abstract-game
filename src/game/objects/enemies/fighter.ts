import { AbstractEnemyInputComponent } from "../../input/BotAbstractInputComponent";
import { VerticalMovementComponent } from "../../movement/VerticalMovementComponent";
import * as config from "../../Config";
import { BotFighterInputComponent } from "../../input/BotFighterInputComponent";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class FighterEnemy extends Phaser.GameObjects.Container {
  #inputComponent;
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
    this.#inputComponent.update();
    this.#verticalMovementComponent.update();
  }
}
