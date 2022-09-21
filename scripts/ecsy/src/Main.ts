import { World } from "ecsy";
import { ValueData } from "./DataComponents/ValueData";

const main = () => {
  // 1. World
  // 1.1 Create a world

  // Create the main world.
  let mainWorld = new World({
    entityPoolSize: 10000,
  });

  // 2. Components
  // 2.1 Create a component
  // 2.2 Change the value of the component

  let debugTextArea = document.getElementById("debug1") as HTMLTextAreaElement;
  let debugButton = document.getElementById(
    "debugButton1"
  ) as HTMLButtonElement;

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

window.onload = main;
