import { Component } from "ecsy";
import { Vector2, Vector2Type } from "../../Utils/Vector2";

export class Transform2DData extends Component<Transform2DData> {
  position: Vector2;

  static schema = {
    position: {
      type: Vector2Type,
      default: new Vector2(0, 0),
    },
  };
}
