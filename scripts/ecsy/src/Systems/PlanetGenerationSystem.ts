import { Attributes, System, SystemQueries } from "ecsy";
import { MassData } from "../DataComponents/Demo2/MassData";
import { Transform2DData } from "../DataComponents/Demo2/Transform2DData";
import { VelocityData } from "../DataComponents/Demo2/VelocityData";
import { DraggableTag } from "../TagComponents/Demo2/DraggableTag";
import { MoonTag } from "../TagComponents/Demo2/MoonTag";
import { PlanetTag } from "../TagComponents/Demo2/PlanetTag";
import { Vector2 } from "../Utils/Vector2";

export class PlanetGenerationSystem extends System {
  static queries: SystemQueries = {
    moons: {
      components: [MoonTag],
    },
    planets: {
      components: [PlanetTag],
    },
  };

  mainCanvas: HTMLCanvasElement;
  moonCount: number = 0;

  init(attributes?: Attributes): void {
    // Get the canvas element.
    this.mainCanvas = attributes.canvas as HTMLCanvasElement;
    // Get the buttons.
    const generateMoonButton =
      attributes.generateMoonButton as HTMLButtonElement;
    const generatePlanetButton =
      attributes.generatePlanetButton as HTMLButtonElement;
    const clearEntitiesButton =
      attributes.clearEntitiesButton as HTMLButtonElement;
    const moonCountText = attributes.moonCountText as HTMLParagraphElement;

    // Add event listeners.
    generateMoonButton.addEventListener("click", () => {
      this.generateMoons(50);
      // Update entity count text.
      this.moonCount += 50;
      moonCountText.innerText = this.moonCount.toString();
    });

    generatePlanetButton.addEventListener("click", () => {
      this.generatePlanets(1);
    });

    clearEntitiesButton.addEventListener("click", () => {
      // Remove all entities.
      const moons = this.queries.moons.results;
      // Inverse loop to avoid index issues.
      for (let i = moons.length - 1; i >= 0; i--) {
        moons[i].remove();
      }

      const planets = this.queries.planets.results;
      // Inverse loop to avoid index issues.
      for (let i = planets.length - 1; i >= 0; i--) {
        planets[i].remove();
      }

      // Update entity count text.
      this.moonCount = 0;
      moonCountText.innerText = this.moonCount.toString();
    });

    this.generatePlanets(1);
    this.generateMoons(50);
    // Update entity count text.
    this.moonCount += 50;
    moonCountText.innerText = this.moonCount.toString();
  }

  execute(delta: number, time: number): void {
    // Do nothing.
  }

  generateMoons(generateNum: number) {
    // Randomly add generateNum draggable entities.
    for (let i = 0; i < generateNum; i++) {
      this.world
        .createEntity()
        .addComponent(Transform2DData, {
          position: new Vector2(
            Math.random() * this.mainCanvas.width,
            Math.random() * this.mainCanvas.height
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
  }

  generatePlanets(generateNum: number) {
    // Randomly generate generateNum planets.
    for (let i = 0; i < generateNum; i++) {
      this.world
        .createEntity()
        .addComponent(Transform2DData, {
          position: new Vector2(
            this.mainCanvas.width / 2,
            this.mainCanvas.height / 2
          ),
        })
        .addComponent(MassData, {
          mass: Math.random() * 5000 + 5000,
        })
        .addComponent(PlanetTag)
        .addComponent(DraggableTag);
    }
  }
}
