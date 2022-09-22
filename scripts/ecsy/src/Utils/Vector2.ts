import { cloneClonable, copyCopyable, createType } from "ecsy";

export class Vector2 {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy(v: Vector2) {
    this.x = v.x;
    this.y = v.y;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }
}

export const Vector2Type = createType({
  name: "Vector2",
  default: new Vector2(0, 0),
  copy: copyCopyable<Vector2>,
  clone: cloneClonable<Vector2>,
});
