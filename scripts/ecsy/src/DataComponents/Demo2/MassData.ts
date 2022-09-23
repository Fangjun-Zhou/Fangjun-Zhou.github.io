import { Component, Types } from "ecsy";

export class MassData extends Component<MassData> {
  mass: number;

  static schema = {
    mass: {
      type: Types.Number,
      default: 1,
    },
  };
}
