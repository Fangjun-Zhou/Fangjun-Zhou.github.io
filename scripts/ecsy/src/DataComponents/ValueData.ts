import { Component, ComponentSchema, Types } from "ecsy";

export class ValueData extends Component<ValueData> {
  intVal: number;
  strVal: string;

  static schema: ComponentSchema = {
    intVal: {
      type: Types.Number,
      default: 0,
    },
    strVal: {
      type: Types.String,
      default: "",
    },
  };
}
