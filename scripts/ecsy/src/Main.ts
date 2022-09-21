import { World } from "ecsy";
import { ValueData } from "./DataComponents/ValueData";

// Create the main world.
let mainWorld = new World({
  entityPoolSize: 10000,
});

const valueData: ValueData = new ValueData();
console.log(valueData.intVal);
console.log(valueData.strVal);

valueData.intVal += 10;
valueData.strVal = "Hello World!";

console.log(valueData.intVal);
console.log(valueData.strVal);
