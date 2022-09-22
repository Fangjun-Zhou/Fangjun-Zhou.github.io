import { Attributes, System, SystemQueries } from "ecsy";
import { Transform2DData } from "../DataComponents/Demo2/Transform2DData";
import { DebugTag } from "../TagComponents/Demo2/DebugTag";

const arrowLength = 50;
const arrowWidth = 2;

export class DebugRenderSystem extends System {
  static queries: SystemQueries = {
    transformEntities: {
      components: [Transform2DData, DebugTag],
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

      // Draw a circle.
      this.canvasContext.fillStyle = "green";
      this.canvasContext.beginPath();
      this.canvasContext.arc(0, 0, 5, 0, 2 * Math.PI);
      this.canvasContext.fill();

      // Draw a red arrow for positive X axis.
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(0, 0);
      this.canvasContext.strokeStyle = "red";
      this.canvasContext.lineWidth = arrowWidth;
      this.canvasContext.lineTo(arrowLength - 10, 0);
      this.canvasContext.stroke();
      // Draw a red arrow top for positive X axis.
      this.canvasContext.beginPath();
      this.canvasContext.fillStyle = "red";
      this.canvasContext.moveTo(arrowLength, 0);
      this.canvasContext.lineTo(arrowLength - 10, 5);
      this.canvasContext.lineTo(arrowLength - 10, -5);
      this.canvasContext.closePath();
      this.canvasContext.fill();

      // Draw a blue arrow for positive Y axis.
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(0, 0);
      this.canvasContext.strokeStyle = "blue";
      this.canvasContext.lineWidth = arrowWidth;
      this.canvasContext.lineTo(0, arrowLength - 10);
      this.canvasContext.stroke();
      // Draw a blue arrow top for positive Y axis.
      this.canvasContext.beginPath();
      this.canvasContext.fillStyle = "blue";
      this.canvasContext.moveTo(0, arrowLength);
      this.canvasContext.lineTo(5, arrowLength - 10);
      this.canvasContext.lineTo(-5, arrowLength - 10);
      this.canvasContext.closePath();
      this.canvasContext.fill();

      this.canvasContext.restore();
    });
  }
}
