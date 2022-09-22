import { Attributes, System } from "ecsy";
import { Transform2DData } from "../DataComponents/Demo2/Transform2DData";
import { Vector2 } from "../Utils/Vector2";

/**
 * System to load the scene.
 */
export class LoadSceneSystem extends System {
  init(attributes?: Attributes): void {
    console.log("LoadSceneSystem.init()");

    // Instantiate a new entity.
    let entityInstance = this.world.createEntity();
    // Add Transform2DData component to the entity.
    entityInstance.addComponent(Transform2DData, {
      position: new Vector2(0, 0),
    });
  }

  execute(delta: number, time: number): void {
    // Do nothing.
  }
}
