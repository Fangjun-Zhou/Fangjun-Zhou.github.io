import { World } from "ecsy";

const world = new World({
  entityPoolSize: 10000,
});

const mainUpdate = () => {
  world.execute();
  requestAnimationFrame(mainUpdate);
};

export const demo2 = () => {
  // TODO: Register all systems.

  // Start main loop.
  requestAnimationFrame(mainUpdate);
};
