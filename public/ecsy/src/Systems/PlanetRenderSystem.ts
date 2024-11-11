import { Attributes, System, SystemQueries } from "ecsy";
import { Transform2DData } from "../DataComponents/Demo2/Transform2DData";
import { PlanetTag } from "../TagComponents/Demo2/PlanetTag";

const planetSize = 20;

export class PlanetRenderSystem extends System {
  static queries: SystemQueries = {
    planets: {
      components: [PlanetTag, Transform2DData],
    },
  };

  // Main canvas.
  mainCanvas: HTMLCanvasElement;
  // Canvas context.
  canvasContext: CanvasRenderingContext2D;

  init(attributes?: Attributes) {
    this.mainCanvas = attributes.canvas;
    this.canvasContext = this.mainCanvas.getContext("2d");
  }

  execute(delta: number, time: number): void {
    this.queries.planets.results.forEach((entity) => {
      // Get Transform2DData.
      const transform = entity.getComponent(Transform2DData);

      // Draw a circle at the entity's position.
      this.canvasContext.beginPath();
      this.canvasContext.fillStyle = "orange";
      this.canvasContext.arc(
        transform.position.x,
        transform.position.y,
        planetSize,
        0,
        2 * Math.PI
      );
      this.canvasContext.fill();
    });
  }
}
