import { World } from "ecsy";
import { Transform2D } from "./DataComponents/Transform2DData";
import { ValueData } from "./DataComponents/ValueData";

// 2.1 Basic Components
// 2.1.1 Create a component
// 2.1.2 Change the value of the component
const BasicComponentDemo = () => {
  let debugTextArea = document.getElementById("debug1") as HTMLTextAreaElement;
  let debugButton = document.getElementById(
    "debugButton1"
  ) as HTMLButtonElement;

  // Return if the debug elements are not found.
  if (!debugTextArea || !debugButton) {
    return;
  }

  // Create a new component.
  const valueData: ValueData = new ValueData();
  debugTextArea.innerHTML +=
    "Initial ValueData: " + JSON.stringify(valueData) + "\n";

  const ChangeValueData = () => {
    // Change the value of the component.
    valueData.intVal += 10;
    valueData.strVal = "Hello World!";
    debugTextArea.innerHTML +=
      "Current ValueData: " + JSON.stringify(valueData) + "\n";
  };

  debugButton.addEventListener("click", ChangeValueData);
};

// 2.2 Custom Types
// 2.2.1 Create a component with a custom type
// 2.2.2 Change the value of the component
const CustomTypeDemo = () => {
  let debugTextArea = document.getElementById("debug2") as HTMLTextAreaElement;
  let debugButton = document.getElementById(
    "debugButton2"
  ) as HTMLButtonElement;

  // Return if the debug elements are not found.
  if (!debugTextArea || !debugButton) {
    return;
  }

  // Create a new transform component.
  const transform2D: Transform2D = new Transform2D();
  debugTextArea.innerHTML +=
    "Initial Transform2D: " + JSON.stringify(transform2D) + "\n";

  const ChangeTransform2D = () => {
    // Change the value of the component.
    transform2D.position.x += 10;
    transform2D.position.y += 10;
    debugTextArea.innerHTML +=
      "Current Transform2D: " + JSON.stringify(transform2D) + "\n";
  };

  debugButton.addEventListener("click", ChangeTransform2D);
};

const main = () => {
  // 1. World
  // 1.1 Create a world

  // Create the main world.
  let mainWorld = new World({
    entityPoolSize: 10000,
  });

  // 2. Components
  BasicComponentDemo();
  CustomTypeDemo();
};

window.onload = main;
