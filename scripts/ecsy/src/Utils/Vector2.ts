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
    return this;
  }

  copy(v: Vector2) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  static add(v1: Vector2, v2: Vector2) {
    let out = new Vector2();
    out.x = v1.x + v2.x;
    out.y = v1.y + v2.y;
    return out;
  }

  static scale(v: Vector2, s: number) {
    let out = new Vector2();
    out.x = v.x * s;
    out.y = v.y * s;
    return out;
  }
}

export const Vector2Type = createType({
  name: "Vector2",
  default: new Vector2(0, 0),
  copy: copyCopyable<Vector2>,
  clone: cloneClonable<Vector2>,
});
