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
import { PlanetGenerationSystem } from "./Systems/PlanetGenerationSystem";
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

  // Get buttons.
  const generateMoonButton = document.getElementById(
    "generateMoonButton"
  ) as HTMLButtonElement;
  const generatePlanetButton = document.getElementById(
    "generatePlanetButton"
  ) as HTMLButtonElement;
  const clearEntitiesButton = document.getElementById(
    "clearEntitiesButton"
  ) as HTMLButtonElement;

  // Get entity count text.
  const moonCountText = document.getElementById(
    "moonCount"
  ) as HTMLParagraphElement;

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
    .registerSystem(GravitySystem)
    .registerSystem(PlanetGenerationSystem, {
      canvas: mainCanvas,
      generateMoonButton: generateMoonButton,
      generatePlanetButton: generatePlanetButton,
      clearEntitiesButton: clearEntitiesButton,
      moonCountText: moonCountText,
    });

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

  // Start main loop.
  requestAnimationFrame(mainUpdate);
};
