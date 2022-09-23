import { System, SystemQueries } from "ecsy";
import { MassData } from "../DataComponents/Demo2/MassData";
import { Transform2DData } from "../DataComponents/Demo2/Transform2DData";
import { VelocityData } from "../DataComponents/Demo2/VelocityData";
import { MoonTag } from "../TagComponents/Demo2/MoonTag";
import { PlanetTag } from "../TagComponents/Demo2/PlanetTag";
import { Vector2 } from "../Utils/Vector2";

// Gravity constant.
const G = 6.67408 * Math.pow(10, -11);

export class GravitySystem extends System {
  static queries: SystemQueries = {
    planets: {
      components: [PlanetTag, Transform2DData, MassData],
    },
    moons: {
      components: [MoonTag, Transform2DData, VelocityData, MassData],
    },
  };

  execute(delta: number, time: number): void {
    // Get all planets.
    const planets = this.queries.planets.results;
    // Get all moons.
    const moons = this.queries.moons.results;

    // For each planet.
    planets.forEach((planet) => {
      // Get planet's Transform2DData.
      const planetTransform = planet.getComponent(Transform2DData);
      // Get planet's MassData.
      const planetMass = planet.getComponent(MassData);

      // For each moon.
      moons.forEach((moon) => {
        // Get moon's Transform2DData.
        const moonTransform = moon.getComponent(Transform2DData);
        // Get moon's VelocityData.
        const moonVelocity = moon.getMutableComponent(VelocityData);
        // Get moon's MassData.
        const moonMass = moon.getComponent(MassData);

        // Get the distance between the planet and the moon.
        const distance = Vector2.sub(
          planetTransform.position,
          moonTransform.position
        ).magnitude();
        // Get the force of gravity.
        const force = (planetMass.mass * moonMass.mass) / (distance * distance);
        // Get the direction of the force.
        const direction = Vector2.sub(
          planetTransform.position,
          moonTransform.position
        ).normalize();
        // Get the acceleration of the force.
        const acceleration = Vector2.scale(direction, force / moonMass.mass);

        // Apply the acceleration to the moon's velocity.
        moonVelocity.velocity = Vector2.add(
          moonVelocity.velocity,
          acceleration
        );
      });
    });
  }
}
