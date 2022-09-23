import { World } from "ecsy";
import { MassData } from "./DataComponents/Demo2/MassData";
import { Transform2DData } from "./DataComponents/Demo2/Transform2DData";
import { VelocityData } from "./DataComponents/Demo2/VelocityData";
import { ClearCanvasSystem } from "./Systems/ClearCanvasSystem";
import { DebugRenderSystem } from "./Systems/DebugRenderSystem";
import { DraggableHighlightRenderSystem } from "./Systems/DraggableHighlightRenderSystem";
import { DraggableSystem } from "./Systems/DraggableSystem";
import { GravitySystem } from "./Systems/GravitySystem";
import { MoonRenderSystem } from "./Systems/MoonRenderSystem";
import { PlanetRenderSystem } from "./Systems/PlanetRenderSystem";
import { VelocityMoveSystem } from "./Systems/VelocityMoveSystem";
import { DebugTag } from "./TagComponents/Demo2/DebugTag";
import { DraggableHighlightTag } from "./TagComponents/Demo2/DraggableHighlightTag";
import { DraggableTag } from "./TagComponents/Demo2/DraggableTag";
import { MoonTag } from "./TagComponents/Demo2/MoonTag";
import { PlanetTag } from "./TagComponents/Demo2/PlanetTag";
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

  // Resize canvas to fit its css size.
  mainCanvas.width = mainCanvas.clientWidth;
  mainCanvas.height = mainCanvas.clientHeight;

  // Register all tag components.
  world
    .registerComponent(DebugTag)
    .registerComponent(DraggableTag)
    .registerComponent(DraggableHighlightTag)
    .registerComponent(PlanetTag)
    .registerComponent(MoonTag);
  // Register all data components.
  world
    .registerComponent(Transform2DData)
    .registerComponent(VelocityData)
    .registerComponent(MassData);

  // Register all game play systems.
  world
    .registerSystem(DraggableSystem, {
      canvas: mainCanvas,
    })
    .registerSystem(VelocityMoveSystem)
    .registerSystem(GravitySystem);

  // Register all render systems.
  world
    .registerSystem(ClearCanvasSystem, {
      canvas: mainCanvas,
    })
    .registerSystem(MoonRenderSystem, {
      canvas: mainCanvas,
    })
    .registerSystem(PlanetRenderSystem, {
      canvas: mainCanvas,
    })
    .registerSystem(DebugRenderSystem, {
      canvas: mainCanvas,
    })
    .registerSystem(DraggableHighlightRenderSystem, {
      canvas: mainCanvas,
    });

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
      .addComponent(VelocityData, {
        velocity: new Vector2(
          Math.random() * 100 - 50,
          Math.random() * 100 - 50
        ),
      })
      .addComponent(MassData, {
        mass: Math.random() * 5 + 5,
      })
      .addComponent(MoonTag);
  }

  // Randomly generate 3 planets.
  for (let i = 0; i < 1; i++) {
    world
      .createEntity()
      .addComponent(Transform2DData, {
        position: new Vector2(mainCanvas.width / 2, mainCanvas.height / 2),
      })
      .addComponent(MassData, {
        mass: Math.random() * 5000 + 5000,
      })
      .addComponent(PlanetTag)
      .addComponent(DraggableTag);
  }

  // Start main loop.
  requestAnimationFrame(mainUpdate);
};
