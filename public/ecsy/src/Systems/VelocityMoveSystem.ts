import { System, SystemQueries } from "ecsy";
import { Transform2DData } from "../DataComponents/Demo2/Transform2DData";
import { VelocityData } from "../DataComponents/Demo2/VelocityData";

export class VelocityMoveSystem extends System {
  static queries: SystemQueries = {
    entities: {
      components: [VelocityData, Transform2DData],
    },
  };

  execute(delta: number, time: number): void {
    this.queries.entities.results.forEach((entity) => {
      // Get Transform2DData.
      const transform = entity.getComponent(Transform2DData);
      // Get VelocityData.
      const velocity = entity.getComponent(VelocityData);

      // Update position.
      transform.position.x += velocity.velocity.x * delta;
      transform.position.y += velocity.velocity.y * delta;
    });
  }
}
