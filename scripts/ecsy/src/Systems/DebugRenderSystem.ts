import { Attributes, System, SystemQueries } from "ecsy";
import { Transform2DData } from "../DataComponents/Demo2/Transform2DData";

export class DebugRenderSystem extends System {
  static queries: SystemQueries = {
    transformEntities: {
      components: [Transform2DData],
    },
  };

  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;

  init(attributes?: Attributes): void {
    // Get the canvas element.
    this.canvas = attributes.canvas as HTMLCanvasElement;
    this.canvasContext = this.canvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
  }

  execute(delta: number, time: number): void {
    // Render Position for all the transform entities.
    this.queries.transformEntities.results.forEach((entity) => {
      let transform = entity.getComponent(Transform2DData);
      let x = transform.position.x;
      let y = transform.position.y;

      // Draw a circle at the position.
      this.canvasContext.save();
      this.canvasContext.translate(x, y);

      this.canvasContext.fillStyle = "red";
      this.canvasContext.arc(0, 0, 20, 0, 2 * Math.PI);
      this.canvasContext.fill();

      this.canvasContext.restore();
    });
  }
}
