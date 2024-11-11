import { Component } from "ecsy";
import { Vector2, Vector2Type } from "../../Utils/Vector2";

export class VelocityData extends Component<VelocityData> {
  velocity: Vector2;

  static schema = {
    velocity: {
      type: Vector2Type,
      default: new Vector2(0, 0),
    },
  };
}
