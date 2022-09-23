import { Attributes, System, SystemQueries } from "ecsy";
import { Transform2DData } from "../DataComponents/Demo2/Transform2DData";
import { MoonTag } from "../TagComponents/Demo2/MoonTag";

const moonSize = 10;

export class MoonRenderSystem extends System {
  static queries: SystemQueries = {
    moons: {
      components: [MoonTag, Transform2DData],
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
    this.queries.moons.results.forEach((entity) => {
      // Get Transform2DData.
      const transform = entity.getComponent(Transform2DData);

      // Draw a circle at the entity's position.
      this.canvasContext.beginPath();
      this.canvasContext.fillStyle = "black";
      this.canvasContext.arc(
        transform.position.x,
        transform.position.y,
        moonSize,
        0,
        2 * Math.PI
      );
      this.canvasContext.fill();
    });
  }
}
