import { Attributes, Entity, System, SystemQueries } from "ecsy";
import { Transform2DData } from "../DataComponents/Demo2/Transform2DData";
import { DebugTag } from "../TagComponents/Demo2/DebugTag";
import { DraggableHighlightTag } from "../TagComponents/Demo2/DraggableHighlightTag";
import { DraggableTag } from "../TagComponents/Demo2/DraggableTag";
import { Vector2 } from "../Utils/Vector2";

// The maximum distance between the mouse and the entity to be considered interacting.
const interactRadius = 30;

export class DraggableSystem extends System {
  static queries: SystemQueries = {
    draggableEntities: {
      components: [DraggableTag, Transform2DData],
    },
    highlightEntities: {
      components: [DraggableHighlightTag],
    },
  };

  // Main canvas.
  mainCanvas: HTMLCanvasElement;
  // Current mouse position.
  mousePos: Vector2 = new Vector2(0, 0);
  // If the mouse is down currently.
  isMouseDown: boolean = false;

  // The entity that is closest to the mouse and has the DraggableTag.
  closestEntity: Entity = null;
  // The entity is being dragged.
  currEntity: Entity = null;

  init(attributes?: Attributes) {
    this.mainCanvas = attributes.canvas;

    // Add mouse event canvas mouse move event.
    this.mainCanvas.addEventListener("mousemove", (event) => {
      let newMousePos = this.getMousePos(this.mainCanvas, event);
      // Get the delta mouse position.
      let deltaMousePos = Vector2.sub(newMousePos, this.mousePos);
      // Set the mouse position.
      this.mousePos = newMousePos;

      // Move the selected entity if the mouse is down.
      if (this.isMouseDown && this.currEntity != null) {
        const transform = this.currEntity.getMutableComponent(Transform2DData);
        transform.position = Vector2.add(transform.position, deltaMousePos);
      }
    });

    // Add mouse event canvas mouse down event.
    this.mainCanvas.addEventListener("mousedown", (event) => {
      this.isMouseDown = true;
      this.updateSelectedEntity();

      this.mousePos = this.getMousePos(this.mainCanvas, event);
    });

    // Add mouse event canvas mouse up event.
    this.mainCanvas.addEventListener("mouseup", (event) => {
      this.isMouseDown = false;
    });
  }

  execute(delta: number, time: number): void {
    // Return if the current mouse is down.
    if (this.isMouseDown) {
      return;
    }

    let highlightEntity: Entity = null;
    let highlightDistance: number = 0;

    this.queries.draggableEntities.results.forEach((entity) => {
      // Get the entity's transform.
      const transform = entity.getComponent(Transform2DData);
      // Calculate the distance between the mouse and the entity.
      const distance = Vector2.sub(
        this.mousePos,
        transform.position
      ).magnitude();

      // If the distance is larger than the interact radius, skip.
      if (distance > interactRadius) {
        return;
      }

      // If highlighted entity is null or the distance is less than the current highlighted entity.
      if (highlightEntity == null || distance < highlightDistance) {
        highlightEntity = entity;
        highlightDistance = distance;
      }
    });

    // Clear all highlight tags.
    this.queries.highlightEntities.results.forEach((entity) => {
      if (entity != highlightEntity) {
        entity.removeComponent(DraggableHighlightTag);
      }
    });

    // Add highlight tag to the closest entity.
    if (
      highlightEntity &&
      !highlightEntity.hasComponent(DraggableHighlightTag)
    ) {
      highlightEntity.addComponent(DraggableHighlightTag);
    }

    // Set the closest entity.
    this.closestEntity = highlightEntity;
  }

  getMousePos(canvas: HTMLCanvasElement, event: MouseEvent): Vector2 {
    const rect = canvas.getBoundingClientRect();
    return new Vector2(event.clientX - rect.left, event.clientY - rect.top);
  }

  updateSelectedEntity() {
    // When there is no selected entity, and there is a closest entity, select the closest entity.
    if (this.currEntity == null && this.closestEntity != null) {
      this.currEntity = this.closestEntity;
      // Add DebugTag to the selected entity.
      this.currEntity.addComponent(DebugTag);
    } else if (this.currEntity != null && this.closestEntity == null) {
      // Remove DebugTag from the selected entity.
      this.currEntity.removeComponent(DebugTag);
      this.currEntity = null;
    } else if (this.currEntity != null && this.closestEntity != null) {
      // If the selected entity is not the closest entity, select the closest entity.
      if (this.currEntity != this.closestEntity) {
        this.currEntity.removeComponent(DebugTag);
        this.currEntity = this.closestEntity;
        this.currEntity.addComponent(DebugTag);
      }
    }
  }
}
