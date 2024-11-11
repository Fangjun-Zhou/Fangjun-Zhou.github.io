import { Attributes, System } from "ecsy";

export class ClearCanvasSystem extends System {
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
    // Clear the canvas.
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
