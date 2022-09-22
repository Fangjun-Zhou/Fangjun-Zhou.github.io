import { Component } from "ecsy";
import { Vector2 } from "../../Utils/Vector2";

export class LineData extends Component<LineData> {
  points: Array<Vector2>;

  constructor() {
    // Disable the default schema behavior.
    super(false);

    // Custom data setup.
    this.points = new Array<Vector2>();
  }

  copy(source: this): this {
    this.points.length = source.points.length;

    for (let i = 0; i < source.points.length; i++) {
      const sourcePoint = source.points[i];
      this.points[i] = sourcePoint.clone();
    }

    return this;
  }

  // No need to override default clone() behavior.
  // If parameters are needed for the constructor, write a custom clone() method.
  // clone(): this {
  //   return new (this.constructor()).copy(this);
  // }

  reset(): void {
    this.points.forEach((point) => {
      point.x = 0;
      point.y = 0;
    });
  }
}
