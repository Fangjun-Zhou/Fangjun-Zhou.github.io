import { World } from "ecsy";
import { Transform2DData } from "./DataComponents/Demo2/Transform2DData";
import { ClearCanvasSystem } from "./Systems/ClearCanvasSystem";
import { DebugRenderSystem } from "./Systems/DebugRenderSystem";
import { DebugTag } from "./TagComponents/Demo2/DebugTag";
import { Vector2 } from "./Utils/Vector2";

const world = new World({
  entityPoolSize: 10000,
});

const mainUpdate = () => {
  world.execute();
  requestAnimationFrame(mainUpdate);
};

export const demo2 = () => {
  // Get main canvas.
  let mainCanvas = document.getElementById("mainCanvas");

  // Return if canvas is not found.
  if (!mainCanvas) {
    return;
  }

  // Register all components.
  world.registerComponent(Transform2DData).registerComponent(DebugTag);

  // Register all systems.
  world
    .registerSystem(ClearCanvasSystem, {
      canvas: mainCanvas,
    })
    .registerSystem(DebugRenderSystem, {
      canvas: mainCanvas,
    });

  // TODO: Remove this debug entity.
  // Added a test entity.
  world
    .createEntity()
    .addComponent(Transform2DData, {
      position: new Vector2(250, 250),
    })
    .addComponent(DebugTag);

  // Start main loop.
  requestAnimationFrame(mainUpdate);
};
