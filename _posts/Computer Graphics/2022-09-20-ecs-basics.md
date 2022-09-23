---
layout: post
title: ECS Basics
category: computer-graphics
---

<script src="https://requirejs.org/docs/release/2.3.6/comments/require.js"></script>
<script src="/Blog/scripts/ecsy/build/out.js" id="module"></script>
<style>
  .title {
    font-weight: bold;
    text-align: center;
  }
  .centeredText {
    text-align: center;
  }
  .verticalContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .horizontalContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .debugCanvasArea {
    width: 100%;
    resize: none;
  }
  .debugButtonContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .debugButton {
    align-self: center;
    margin: 10px;
  }
</style>

# Demo

## ECS Gravity Simulation

**NOTICE: You can actually drag and move orange planets!!**

<div class="horizontalContainer">
  <p class="title" style="margin-right: 10px;">Moon Count:</p>
  <p id="moonCount">0</p>
</div>

<canvas id="mainCanvas" class="debugCanvasArea" width="500" height="500"> </canvas>

<div class="debugButtonContainer">
  <button class="debugButton" id="generateMoonButton">
    Generate 50 Moons
  </button>
  <button class="debugButton" id="generatePlanetButton">
    Generate 1 Planets
  </button>
  <button class="debugButton" id="clearEntitiesButton">
    Clear All Entities
  </button>
</div>

# ECSY References

[ECSY Documentation](https://ecsyjs.github.io/ecsy/docs/#/)

[ECSY GitHub Repo](https://github.com/ecsyjs/ecsy)

Install ECSY

```bash
npm install --save ecsy
```

# World

The ecsy use world as the container for all the entities, components, and systems.

To create a new world, simply call:

```ts
// Create the main world.
let mainWorld = new World({
  entityPoolSize: 10000,
});
```

Note that the World constructor can take WorldOptions as input:

```ts
/**
* Create a new World.
*/
constructor(options?: WorldOptions);
```

Inside the ECSY, the WorldOptions is assigned to the world.options with some default values:

```ts
this.options = Object.assign({}, DEFAULT_OPTIONS, options);
```

# Components

## Creating Components

To create a data component class, extend the `Component` class:

```ts
export class ValueData extends Component<ValueData> {
  intVal: number;
  strVal: string;

  static schema: ComponentSchema = {
    intVal: {
      type: Types.Number,
      default: 0,
    },
    strVal: {
      type: Types.String,
      default: "",
    },
  };
}
```

When using ECSY with TypeScript, the class need to be provided.

ECSY use the schema to set the default values and implement default `.copy()`, `.clone()`, `.reset()` methods.

## Using Components

Create the component by calling its constructor. This will also set all the fields to default values.

```ts
// Create a new component.
const valueData: ValueData = new ValueData();

// Change the value of the component.
valueData.intVal += 10;
valueData.strVal = "Hello World!";
```

<textarea readonly class="debugTextArea" id="debug1"></textarea>
<button class="debugButton" id="debugButton1">
Change Component Value
</button>

## Custom Types

Besides the basic types supported by schema, custom types can be created.

For example, if we want a Vector2 type to store vector info, we can define:

```ts
export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy(v: Vector2) {
    this.x = v.x;
    this.y = v.y;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }
}
```

The methods `.set()`, `.copy()`, and `.clone()` must be implemented for the custom types to work. This is used by ECSY to reset the value inside components.

These methods are particularly useful to implement the object pool in ECSY. I will mention it latter, but ignoring the object pooling mechanism will not affect your ability to use ECSY. So you can simply forget it at this point.

After defining the class, it is also required to convert the class to a schema which can be used by ECSY:

```ts
export const Vector2Type = createType({
  name: "Vector2",
  default: new Vector2(0, 0),
  copy: copyCopyable<Vector2>,
  clone: cloneClonable<Vector2>,
});
```

Now, we can create a component to store this custom type. Just like what we just done before:

```ts
/**
 * Transform2DData.ts
 */
export class Transform2DData extends Component<Transform2DData> {
  position: Vector2;

  static schema = {
    position: {
      type: Vector2Type,
      default: new Vector2(0, 0),
    },
  };
}

/**
 * Main.ts
 */
// Create a new transform component.
const transform2D: Transform2DData = new Transform2DData();

// Change the value of the component.
transform2D.position.x += 10;
transform2D.position.y += 10;
```

<textarea readonly class="debugTextArea" id="debug2"></textarea>
<button class="debugButton" id="debugButton2">
Change Component Value
</button>

## Special Components

### Tag Components

For tags classes, it is recommended to extend the `TagComponent` class instead of `Component`. It is said by the ECSY documents that this can increase the performance.

```ts
// Defining the tag component.
class Enemy extends TagComponent {}

// Adding a component to an entity.
entity.addComponent(Enemy);
```

### Single Value Components

In the official document, it is mentioned that `.value` can be used to get the value of a component with only one field.

However, this method seems to be deprecated in current version of ECSY.

## Component Pooling

In Unity DOTS, components are stored in linear memory blocks called archetypes. This increase the spacial locality for the ECS framework and thus can be efficient when dealing with massive objects.

When adding and removing components to entities in DOTS, components as structs can be added to the end of an archetype directly.

However, ECSY is written in JS completely. Which means components are still randomly allocated in the memory.

To increase the performance and lower the performance drop caused by GC as much as possible, ECSY use object pools to manage components.

This will solve the problems of components continually deleted by GC when removing components from entities. However, this will not solve the problem of components allocated in the memory randomly.

In other words, adding and removing components to an entity is still costly in ECSY.

Nevertheless, remember adding and removing tags happened most frequently when dealing with tags. And ECSY provides `TagComponent` to increase the performance of this type of operation.

It can be inferred that ECSY choose to store tag information directly in entities instead of using objects to do so.

## Custom Components

There are some cases where default schema handler cannot handle the value operation.

For example, if a component contains an array of objects, the full copy of that component should recursively deep copy the entire array.

And the reset behavior of the component is also customizable. For some applications the array may reset to empty, where in other scenarios maybe we just want to set all the values inside the array back to default.

In this example, a custom component `Line` is defined to store an array of `Vector2` information:

```ts
export class LineData extends Component<LineData> {
  points: Array<Vector2>;

  constructor() {
    // Disable the default schema behavior.
    super(false);

    // Custom data setup.
    this.points = new Array<Vector2>();
  }

  copy(source: this): this {
    this.points.length = source.points.length;

    for (let i = 0; i < source.points.length; i++) {
      const sourcePoint = source.points[i];
      this.points[i] = sourcePoint.clone();
    }

    return this;
  }

  // No need to override default clone() behavior.
  // If parameters are needed for the constructor, write a custom clone() method.
  // clone(): this {
  //   return new (this.constructor()).copy(this);
  // }

  reset(): void {
    this.points.forEach((point) => {
      point.x = 0;
      point.y = 0;
    });
  }
}
```

Note that to disable the default copy and clone behavior provided by the schema handler, you need to call `super(false)` inside the constructor.

To use the custom component:

```ts
// Create 2 new LineData component.
const lineData: LineData = new LineData();
const lineData2: LineData = new LineData();

// Clear the points array.
lineData.points.length = 0;
// Add random points to the original line.
for (let i = 0; i < 3; i++) {
  lineData.points.push(new Vector2(Math.random(), Math.random()));
}

// Copy the original line to the second line.
lineData2.copy(lineData);
```

<textarea readonly class="debugTextArea" id="debug3"></textarea>
<button class="debugButton" id="debugButton3">
Change Original Line Data
</button>
<button class="debugButton" id="debugButton4">Copy Line Data</button>

## Disable and Custom Object Pooling

When you want to disable the object pool, simply register it with object pooling option to false:

```ts
world.registerComponent(LineData, false);
```

To implement a custom object pool, extends `ObjectPool` class:

```ts
// Register MyComponent with an ObjectPool that has 1000 initial instances of LineData
world.registerComponent(LineData, new ObjectPool(LineData, 1000));

// Use your own custom ObjectPool implementation
class MyObjectPool extends ObjectPool {
  acquire() {
    // Your implementation
  }

  release(item) {
    // Your implementation
  }

  expand(count) {
    // Your implementation
  }
}

// Use the custom object pool.
world.registerComponent(LineData, new MyObjectPool(LineData, 1000));
```

## System State Components

ECSY will destroy the default components when their parent entities are destroyed. However, when a component contains custom objects that we want to deallocate manually, we don't want this automatic behavior to take place.

In the example given by ECSY documentation, `GeometryComponent` should be used to store data to describe the mesh, `StateComponentGeometry` is used to store the real mesh data as a reference.

```ts
class StateComponentGeometry extends SystemStateComponent<StateComponentGeometry> {
  meshReference: Mesh;

  static.schema = {
    meshReference: { type: Types.Ref },
  };
}

class Geometry extends Component<Geometry> {
  primitive: string;

  static.schema = {
    primitive: { type: Types.String, default: "box" },
  };
}
```

To instantiate and destroy real mesh data, a system is need to perform the operation:

```ts
class GeometrySystem extends System {
  init() {
  },
  execute(delta, time) {
    this.queries.added.forEach(entity => {
      var mesh = new Mesh(entity.getComponent(Geometry).primitive);
      entity.addComponent(StateComponentGeometry, {mesh: mesh});
    });

    this.queries.remove.forEach(entity => {
      var component = entity.getComponent(StateComponentGeometry);
      // free resources for the mesh
      component.mesh.dispose();

      entity.removeComponent(StateComponentGeometry);
    });

    this.queries.normal.forEach(entity => {
      // use entity and its components (Geometry and StateComponentGeometry) if needed
    });
  }
}

GeometrySystem.queries = {
  added: { components: [Geometry, Not(StateComponentGeometry)] },
  remove: { components: [Not(Geometry), StateComponentGeometry] },
  normal: { components: [Geometry, StateComponentGeometry] },
};
```

# Entities

## Create Entities

Create entities by calling `world.createEntity()`

## Add Components

Add components to the entity by calling `entity.addComponent()`

## Access Components

When accessing a readonly component, call `entity.getComponent(Component)`.

When accessing a component and change its value, call `entity.getMutableComponent(Component)`

## Remove Components

To remove a component from the entity, call `entity.removeComponent(ComponentA)`.

The ECSY use "deferred remove" for removing components. This mechanism works similar to CommandBuffer in Unity DOTS.

After removing a component, other systems can still get the removed component by calling `getRemovedComponent(Component)`. However, the entity will not be queried by normal query result.

To ignore the command buffer and remove a component immediately, call `entity.removeComponent(ComponentA, true)`, which set the `forceImmediate` flag to true.

# Systems

A system contains two callback functions: `init()`, and `execute()`.

`init()` is called when the system is registered in the world.

`execute()` is called every time when the `world.execute()` is called.

All the query used by the system should be stored in `static.queries`.

A typical system looks like this:

```ts
class SystemName extends System {
  static queries = {
    boxes: { components: [Box] },
    spheres: { components: [Sphere] },
  };

  init() {
    // Init system.
  }

  execute(delta, time) {
    this.queries.boxes.results.forEach((entity) => {
      let box = entity.getComponent(Box);
      // Do whatever you want with box
    });

    this.queries.spheres.results.forEach((entity) => {
      let sphere = entity.getComponent(Sphere);
      // Do whatever you want with Sphere
    });
  }
}
```

**IMPORTANT: If the query result will be mutated, traverse the query in reverse order.**

This includes, adding (removing) a new component so that the query structure will be changed. Or deleting an entity in the query.

## Register (Unregister) Systems

Call `world.registerSystem(SystemClass)` to register a new system. Call `world.unregisterSystem(SystemClass)` to unregister the system.

## Execution Order

The execution order among systems is based on their registration order.

However, changing the priority manually can override the execution order. By default, all the systems are initialized with priority 0.

```ts
world
  .registerSystem(SystemA)
  .registerSystem(SystemB, { priority: 2 })
  .registerSystem(SystemC, { priority: -1 })
  .registerSystem(SystemD)
  .registerSystem(SystemE);
```

This will result in the following execution order: `SystemC > SystemA > SystemD > SystemE > SystemB`
