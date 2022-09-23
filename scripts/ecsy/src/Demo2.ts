import { World } from "ecsy";
import { Transform2DData } from "./DataComponents/Demo2/Transform2DData";
import { ClearCanvasSystem } from "./Systems/ClearCanvasSystem";
import { DebugRenderSystem } from "./Systems/DebugRenderSystem";
import { DraggableHighlightRenderSystem } from "./Systems/DraggableHighlightRenderSystem";
import { DraggableSystem } from "./Systems/DraggableSystem";
import { DebugTag } from "./TagComponents/Demo2/DebugTag";
import { DraggableHighlightTag } from "./TagComponents/Demo2/DraggableHighlightTag";
import { DraggableTag } from "./TagComponents/Demo2/DraggableTag";
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
  let mainCanvas = document.getElementById("mainCanvas") as HTMLCanvasElement;

  // Return if canvas is not found.
  if (!mainCanvas) {
    return;
  }

  // Register all tag components.
  world
    .registerComponent(DebugTag)
    .registerComponent(DraggableTag)
    .registerComponent(DraggableHighlightTag);
  // Register all data components.
  world.registerComponent(Transform2DData);

  // Register all game play systems.
  world.registerSystem(DraggableSystem, {
    canvas: mainCanvas,
  });

  // Register all render systems.
  world
    .registerSystem(ClearCanvasSystem, {
      canvas: mainCanvas,
    })
    .registerSystem(DebugRenderSystem, {
      canvas: mainCanvas,
    })
    .registerSystem(DraggableHighlightRenderSystem, {
      canvas: mainCanvas,
    });

  // TODO: Remove this debug entity.

  // Randomly add 200 draggable entities.
  for (let i = 0; i < 50; i++) {
    world
      .createEntity()
      .addComponent(Transform2DData, {
        position: new Vector2(
          Math.random() * mainCanvas.width,
          Math.random() * mainCanvas.height
        ),
      })
      .addComponent(DraggableTag);
  }

  // Start main loop.
  requestAnimationFrame(mainUpdate);
};
