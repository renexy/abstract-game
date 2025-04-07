
export class InputComponent {
  _up: boolean = false;
  _down: boolean = false;
  _left: boolean = false;
  _right: boolean = false;
  _shoot: boolean = false;

  constructor() {
    this.reset();
  }

  get leftIsDown() {
    return this._left;
  }

  get rightIsDown() {
    return this._right;
  }

  get downIsDown() {
    return this._down;
  }

  get upIsDown() {
    return this._up;
  }

  get shootIsDown() {
    return this._shoot;
  }

  reset() {
    this._up = false;
    this._down = false;
    this._left = false;
    this._right = false;
    this._shoot = false;
  }
}
