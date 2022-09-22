import { World } from "ecsy";
import { Transform2DData } from "./DataComponents/Demo2/Transform2DData";
import { ClearCanvasSystem } from "./Systems/ClearCanvasSystem";
import { DebugRenderSystem } from "./Systems/DebugRenderSystem";
import { LoadSceneSystem } from "./Systems/LoadSceneSystem";

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

  // Register all components.
  world.registerComponent(Transform2DData);

  // Register all systems.
  world
    .registerSystem(LoadSceneSystem)
    .registerSystem(ClearCanvasSystem, {
      canvas: mainCanvas,
    })
    .registerSystem(DebugRenderSystem, {
      canvas: mainCanvas,
    });

  // Start main loop.
  requestAnimationFrame(mainUpdate);
};
