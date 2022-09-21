import { World } from "ecsy";
import { LineData } from "./DataComponents/LineData";
import { Transform2DData } from "./DataComponents/Transform2DData";
import { ValueData } from "./DataComponents/ValueData";
import { Vector2 } from "./Utils/Vector2";

// 1. Create a world
const mainWorld: World = new World({
  entityPoolSize: 10000,
});

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
  const transform2D: Transform2DData = new Transform2DData();
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

const CustomComponentDemo = () => {
  let debugTextArea = document.getElementById("debug3") as HTMLTextAreaElement;
  let randomOriginalButton = document.getElementById(
    "debugButton3"
  ) as HTMLButtonElement;
  let copyComponent = document.getElementById(
    "debugButton4"
  ) as HTMLButtonElement;

  // Return if the debug elements are not found.
  if (!debugTextArea || !randomOriginalButton || !copyComponent) {
    return;
  }

  // Create 2 new LineData component.
  const lineData: LineData = new LineData();
  const lineData2: LineData = new LineData();
  debugTextArea.innerHTML =
    "Initial LineData: " +
    JSON.stringify(lineData) +
    "\n" +
    "Initial LineData2: " +
    JSON.stringify(lineData2) +
    "\n";

  const RandomOriginal = () => {
    // Clear the points array.
    lineData.points.length = 0;

    // Add random points to the original line.
    for (let i = 0; i < 3; i++) {
      lineData.points.push(new Vector2(Math.random(), Math.random()));
    }

    debugTextArea.innerHTML =
      "Current LineData: " +
      JSON.stringify(lineData) +
      "\n" +
      "Current LineData2: " +
      JSON.stringify(lineData2) +
      "\n";
  };

  const CopyComponent = () => {
    // Copy the original line to the second line.
    lineData2.copy(lineData);

    debugTextArea.innerHTML =
      "Current LineData: " +
      JSON.stringify(lineData) +
      "\n" +
      "Current LineData2: " +
      JSON.stringify(lineData2) +
      "\n";
  };

  randomOriginalButton.addEventListener("click", RandomOriginal);
  copyComponent.addEventListener("click", CopyComponent);
};

const main = () => {
  // 2. Components
  BasicComponentDemo();
  CustomTypeDemo();
  CustomComponentDemo();
};

window.onload = main;
