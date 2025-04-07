/* eslint-disable no-unused-private-class-members */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputComponent } from "./InputComponent";

export class KeyboardInputComponent extends InputComponent {
  #cursorKeys;
  #inputLocked;

  constructor(scene: any) {
    super();
    this.#cursorKeys = scene.input.keyboard.createCursorKeys();
    this.#inputLocked = false;
  }

  set lockInput(val: any) {
    this.#inputLocked = val;
    console.log(this.#inputLocked);
  }

  update() {

    this._up = this.#cursorKeys.up.isDown;
    this._down = this.#cursorKeys.down.isDown;
    this._left = this.#cursorKeys.left.isDown;
    this._right = this.#cursorKeys.right.isDown;
    this._shoot = this.#cursorKeys.space.isDown;
  }
}
