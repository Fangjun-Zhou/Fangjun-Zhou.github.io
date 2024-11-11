import { Attributes, System, SystemQueries } from "ecsy";
import { Transform2DData } from "../DataComponents/Demo2/Transform2DData";
import { DraggableHighlightTag } from "../TagComponents/Demo2/DraggableHighlightTag";

export class DraggableHighlightRenderSystem extends System {
  static queries: SystemQueries = {
    highlightEntities: {
      components: [Transform2DData, DraggableHighlightTag],
    },
  };

  mainCanvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;

  init(attributes?: Attributes) {
    this.mainCanvas = attributes.canvas;
    this.canvasContext = this.mainCanvas.getContext("2d");
  }

  execute(delta: number, time: number): void {
    this.queries.highlightEntities.results.forEach((entity) => {
      // Get Transform2DData.
      const transform = entity.getComponent(Transform2DData);

      // Draw a circle at the entity's position.
      this.canvasContext.beginPath();
      this.canvasContext.strokeStyle = "blue";
      this.canvasContext.arc(
        transform.position.x,
        transform.position.y,
        30,
        0,
        2 * Math.PI
      );
      this.canvasContext.stroke();
    });
  }
}
