/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/ecsy/src/Component.js":
/*!********************************************!*\
  !*** ./node_modules/ecsy/src/Component.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => (/* binding */ Component)
/* harmony export */ });
class Component {
  constructor(props) {
    if (props !== false) {
      const schema = this.constructor.schema;

      for (const key in schema) {
        if (props && props.hasOwnProperty(key)) {
          this[key] = props[key];
        } else {
          const schemaProp = schema[key];
          if (schemaProp.hasOwnProperty("default")) {
            this[key] = schemaProp.type.clone(schemaProp.default);
          } else {
            const type = schemaProp.type;
            this[key] = type.clone(type.default);
          }
        }
      }

      if ( true && props !== undefined) {
        this.checkUndefinedAttributes(props);
      }
    }

    this._pool = null;
  }

  copy(source) {
    const schema = this.constructor.schema;

    for (const key in schema) {
      const prop = schema[key];

      if (source.hasOwnProperty(key)) {
        this[key] = prop.type.copy(source[key], this[key]);
      }
    }

    // @DEBUG
    if (true) {
      this.checkUndefinedAttributes(source);
    }

    return this;
  }

  clone() {
    return new this.constructor().copy(this);
  }

  reset() {
    const schema = this.constructor.schema;

    for (const key in schema) {
      const schemaProp = schema[key];

      if (schemaProp.hasOwnProperty("default")) {
        this[key] = schemaProp.type.copy(schemaProp.default, this[key]);
      } else {
        const type = schemaProp.type;
        this[key] = type.copy(type.default, this[key]);
      }
    }
  }

  dispose() {
    if (this._pool) {
      this._pool.release(this);
    }
  }

  getName() {
    return this.constructor.getName();
  }

  checkUndefinedAttributes(src) {
    const schema = this.constructor.schema;

    // Check that the attributes defined in source are also defined in the schema
    Object.keys(src).forEach((srcKey) => {
      if (!schema.hasOwnProperty(srcKey)) {
        console.warn(
          `Trying to set attribute '${srcKey}' not defined in the '${this.constructor.name}' schema. Please fix the schema, the attribute value won't be set`
        );
      }
    });
  }
}

Component.schema = {};
Component.isComponent = true;
Component.getName = function () {
  return this.displayName || this.name;
};


/***/ }),

/***/ "./node_modules/ecsy/src/ComponentManager.js":
/*!***************************************************!*\
  !*** ./node_modules/ecsy/src/ComponentManager.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComponentManager": () => (/* binding */ ComponentManager)
/* harmony export */ });
/* harmony import */ var _ObjectPool_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjectPool.js */ "./node_modules/ecsy/src/ObjectPool.js");


class ComponentManager {
  constructor() {
    this.Components = [];
    this._ComponentsMap = {};

    this._componentPool = {};
    this.numComponents = {};
    this.nextComponentId = 0;
  }

  hasComponent(Component) {
    return this.Components.indexOf(Component) !== -1;
  }

  registerComponent(Component, objectPool) {
    if (this.Components.indexOf(Component) !== -1) {
      console.warn(
        `Component type: '${Component.getName()}' already registered.`
      );
      return;
    }

    const schema = Component.schema;

    if (!schema) {
      throw new Error(
        `Component "${Component.getName()}" has no schema property.`
      );
    }

    for (const propName in schema) {
      const prop = schema[propName];

      if (!prop.type) {
        throw new Error(
          `Invalid schema for component "${Component.getName()}". Missing type for "${propName}" property.`
        );
      }
    }

    Component._typeId = this.nextComponentId++;
    this.Components.push(Component);
    this._ComponentsMap[Component._typeId] = Component;
    this.numComponents[Component._typeId] = 0;

    if (objectPool === undefined) {
      objectPool = new _ObjectPool_js__WEBPACK_IMPORTED_MODULE_0__.ObjectPool(Component);
    } else if (objectPool === false) {
      objectPool = undefined;
    }

    this._componentPool[Component._typeId] = objectPool;
  }

  componentAddedToEntity(Component) {
    this.numComponents[Component._typeId]++;
  }

  componentRemovedFromEntity(Component) {
    this.numComponents[Component._typeId]--;
  }

  getComponentsPool(Component) {
    return this._componentPool[Component._typeId];
  }
}


/***/ }),

/***/ "./node_modules/ecsy/src/Entity.js":
/*!*****************************************!*\
  !*** ./node_modules/ecsy/src/Entity.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Entity": () => (/* binding */ Entity)
/* harmony export */ });
/* harmony import */ var _Query_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Query.js */ "./node_modules/ecsy/src/Query.js");
/* harmony import */ var _WrapImmutableComponent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WrapImmutableComponent.js */ "./node_modules/ecsy/src/WrapImmutableComponent.js");



class Entity {
  constructor(entityManager) {
    this._entityManager = entityManager || null;

    // Unique ID for this entity
    this.id = entityManager._nextEntityId++;

    // List of components types the entity has
    this._ComponentTypes = [];

    // Instance of the components
    this._components = {};

    this._componentsToRemove = {};

    // Queries where the entity is added
    this.queries = [];

    // Used for deferred removal
    this._ComponentTypesToRemove = [];

    this.alive = false;

    //if there are state components on a entity, it can't be removed completely
    this.numStateComponents = 0;
  }

  // COMPONENTS

  getComponent(Component, includeRemoved) {
    var component = this._components[Component._typeId];

    if (!component && includeRemoved === true) {
      component = this._componentsToRemove[Component._typeId];
    }

    return  true
      ? (0,_WrapImmutableComponent_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Component, component)
      : 0;
  }

  getRemovedComponent(Component) {
    const component = this._componentsToRemove[Component._typeId];

    return  true
      ? (0,_WrapImmutableComponent_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Component, component)
      : 0;
  }

  getComponents() {
    return this._components;
  }

  getComponentsToRemove() {
    return this._componentsToRemove;
  }

  getComponentTypes() {
    return this._ComponentTypes;
  }

  getMutableComponent(Component) {
    var component = this._components[Component._typeId];

    if (!component) {
      return;
    }

    for (var i = 0; i < this.queries.length; i++) {
      var query = this.queries[i];
      // @todo accelerate this check. Maybe having query._Components as an object
      // @todo add Not components
      if (query.reactive && query.Components.indexOf(Component) !== -1) {
        query.eventDispatcher.dispatchEvent(
          _Query_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.COMPONENT_CHANGED,
          this,
          component
        );
      }
    }
    return component;
  }

  addComponent(Component, values) {
    this._entityManager.entityAddComponent(this, Component, values);
    return this;
  }

  removeComponent(Component, forceImmediate) {
    this._entityManager.entityRemoveComponent(this, Component, forceImmediate);
    return this;
  }

  hasComponent(Component, includeRemoved) {
    return (
      !!~this._ComponentTypes.indexOf(Component) ||
      (includeRemoved === true && this.hasRemovedComponent(Component))
    );
  }

  hasRemovedComponent(Component) {
    return !!~this._ComponentTypesToRemove.indexOf(Component);
  }

  hasAllComponents(Components) {
    for (var i = 0; i < Components.length; i++) {
      if (!this.hasComponent(Components[i])) return false;
    }
    return true;
  }

  hasAnyComponents(Components) {
    for (var i = 0; i < Components.length; i++) {
      if (this.hasComponent(Components[i])) return true;
    }
    return false;
  }

  removeAllComponents(forceImmediate) {
    return this._entityManager.entityRemoveAllComponents(this, forceImmediate);
  }

  copy(src) {
    // TODO: This can definitely be optimized
    for (var ecsyComponentId in src._components) {
      var srcComponent = src._components[ecsyComponentId];
      this.addComponent(srcComponent.constructor);
      var component = this.getComponent(srcComponent.constructor);
      component.copy(srcComponent);
    }

    return this;
  }

  clone() {
    return new Entity(this._entityManager).copy(this);
  }

  reset() {
    this.id = this._entityManager._nextEntityId++;
    this._ComponentTypes.length = 0;
    this.queries.length = 0;

    for (var ecsyComponentId in this._components) {
      delete this._components[ecsyComponentId];
    }
  }

  remove(forceImmediate) {
    return this._entityManager.removeEntity(this, forceImmediate);
  }
}


/***/ }),

/***/ "./node_modules/ecsy/src/EntityManager.js":
/*!************************************************!*\
  !*** ./node_modules/ecsy/src/EntityManager.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EntityManager": () => (/* binding */ EntityManager)
/* harmony export */ });
/* harmony import */ var _ObjectPool_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjectPool.js */ "./node_modules/ecsy/src/ObjectPool.js");
/* harmony import */ var _QueryManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./QueryManager.js */ "./node_modules/ecsy/src/QueryManager.js");
/* harmony import */ var _EventDispatcher_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EventDispatcher.js */ "./node_modules/ecsy/src/EventDispatcher.js");
/* harmony import */ var _SystemStateComponent_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SystemStateComponent.js */ "./node_modules/ecsy/src/SystemStateComponent.js");





class EntityPool extends _ObjectPool_js__WEBPACK_IMPORTED_MODULE_0__.ObjectPool {
  constructor(entityManager, entityClass, initialSize) {
    super(entityClass, undefined);
    this.entityManager = entityManager;

    if (typeof initialSize !== "undefined") {
      this.expand(initialSize);
    }
  }

  expand(count) {
    for (var n = 0; n < count; n++) {
      var clone = new this.T(this.entityManager);
      clone._pool = this;
      this.freeList.push(clone);
    }
    this.count += count;
  }
}

/**
 * @private
 * @class EntityManager
 */
class EntityManager {
  constructor(world) {
    this.world = world;
    this.componentsManager = world.componentsManager;

    // All the entities in this instance
    this._entities = [];
    this._nextEntityId = 0;

    this._entitiesByNames = {};

    this._queryManager = new _QueryManager_js__WEBPACK_IMPORTED_MODULE_1__["default"](this);
    this.eventDispatcher = new _EventDispatcher_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    this._entityPool = new EntityPool(
      this,
      this.world.options.entityClass,
      this.world.options.entityPoolSize
    );

    // Deferred deletion
    this.entitiesWithComponentsToRemove = [];
    this.entitiesToRemove = [];
    this.deferredRemovalEnabled = true;
  }

  getEntityByName(name) {
    return this._entitiesByNames[name];
  }

  /**
   * Create a new entity
   */
  createEntity(name) {
    var entity = this._entityPool.acquire();
    entity.alive = true;
    entity.name = name || "";
    if (name) {
      if (this._entitiesByNames[name]) {
        console.warn(`Entity name '${name}' already exist`);
      } else {
        this._entitiesByNames[name] = entity;
      }
    }

    this._entities.push(entity);
    this.eventDispatcher.dispatchEvent(ENTITY_CREATED, entity);
    return entity;
  }

  // COMPONENTS

  /**
   * Add a component to an entity
   * @param {Entity} entity Entity where the component will be added
   * @param {Component} Component Component to be added to the entity
   * @param {Object} values Optional values to replace the default attributes
   */
  entityAddComponent(entity, Component, values) {
    // @todo Probably define Component._typeId with a default value and avoid using typeof
    if (
      typeof Component._typeId === "undefined" &&
      !this.world.componentsManager._ComponentsMap[Component._typeId]
    ) {
      throw new Error(
        `Attempted to add unregistered component "${Component.getName()}"`
      );
    }

    if (~entity._ComponentTypes.indexOf(Component)) {
      if (true) {
        console.warn(
          "Component type already exists on entity.",
          entity,
          Component.getName()
        );
      }
      return;
    }

    entity._ComponentTypes.push(Component);

    if (Component.__proto__ === _SystemStateComponent_js__WEBPACK_IMPORTED_MODULE_3__.SystemStateComponent) {
      entity.numStateComponents++;
    }

    var componentPool = this.world.componentsManager.getComponentsPool(
      Component
    );

    var component = componentPool
      ? componentPool.acquire()
      : new Component(values);

    if (componentPool && values) {
      component.copy(values);
    }

    entity._components[Component._typeId] = component;

    this._queryManager.onEntityComponentAdded(entity, Component);
    this.world.componentsManager.componentAddedToEntity(Component);

    this.eventDispatcher.dispatchEvent(COMPONENT_ADDED, entity, Component);
  }

  /**
   * Remove a component from an entity
   * @param {Entity} entity Entity which will get removed the component
   * @param {*} Component Component to remove from the entity
   * @param {Bool} immediately If you want to remove the component immediately instead of deferred (Default is false)
   */
  entityRemoveComponent(entity, Component, immediately) {
    var index = entity._ComponentTypes.indexOf(Component);
    if (!~index) return;

    this.eventDispatcher.dispatchEvent(COMPONENT_REMOVE, entity, Component);

    if (immediately) {
      this._entityRemoveComponentSync(entity, Component, index);
    } else {
      if (entity._ComponentTypesToRemove.length === 0)
        this.entitiesWithComponentsToRemove.push(entity);

      entity._ComponentTypes.splice(index, 1);
      entity._ComponentTypesToRemove.push(Component);

      entity._componentsToRemove[Component._typeId] =
        entity._components[Component._typeId];
      delete entity._components[Component._typeId];
    }

    // Check each indexed query to see if we need to remove it
    this._queryManager.onEntityComponentRemoved(entity, Component);

    if (Component.__proto__ === _SystemStateComponent_js__WEBPACK_IMPORTED_MODULE_3__.SystemStateComponent) {
      entity.numStateComponents--;

      // Check if the entity was a ghost waiting for the last system state component to be removed
      if (entity.numStateComponents === 0 && !entity.alive) {
        entity.remove();
      }
    }
  }

  _entityRemoveComponentSync(entity, Component, index) {
    // Remove T listing on entity and property ref, then free the component.
    entity._ComponentTypes.splice(index, 1);
    var component = entity._components[Component._typeId];
    delete entity._components[Component._typeId];
    component.dispose();
    this.world.componentsManager.componentRemovedFromEntity(Component);
  }

  /**
   * Remove all the components from an entity
   * @param {Entity} entity Entity from which the components will be removed
   */
  entityRemoveAllComponents(entity, immediately) {
    let Components = entity._ComponentTypes;

    for (let j = Components.length - 1; j >= 0; j--) {
      if (Components[j].__proto__ !== _SystemStateComponent_js__WEBPACK_IMPORTED_MODULE_3__.SystemStateComponent)
        this.entityRemoveComponent(entity, Components[j], immediately);
    }
  }

  /**
   * Remove the entity from this manager. It will clear also its components
   * @param {Entity} entity Entity to remove from the manager
   * @param {Bool} immediately If you want to remove the component immediately instead of deferred (Default is false)
   */
  removeEntity(entity, immediately) {
    var index = this._entities.indexOf(entity);

    if (!~index) throw new Error("Tried to remove entity not in list");

    entity.alive = false;
    this.entityRemoveAllComponents(entity, immediately);

    if (entity.numStateComponents === 0) {
      // Remove from entity list
      this.eventDispatcher.dispatchEvent(ENTITY_REMOVED, entity);
      this._queryManager.onEntityRemoved(entity);
      if (immediately === true) {
        this._releaseEntity(entity, index);
      } else {
        this.entitiesToRemove.push(entity);
      }
    }
  }

  _releaseEntity(entity, index) {
    this._entities.splice(index, 1);

    if (this._entitiesByNames[entity.name]) {
      delete this._entitiesByNames[entity.name];
    }
    entity._pool.release(entity);
  }

  /**
   * Remove all entities from this manager
   */
  removeAllEntities() {
    for (var i = this._entities.length - 1; i >= 0; i--) {
      this.removeEntity(this._entities[i]);
    }
  }

  processDeferredRemoval() {
    if (!this.deferredRemovalEnabled) {
      return;
    }

    for (let i = 0; i < this.entitiesToRemove.length; i++) {
      let entity = this.entitiesToRemove[i];
      let index = this._entities.indexOf(entity);
      this._releaseEntity(entity, index);
    }
    this.entitiesToRemove.length = 0;

    for (let i = 0; i < this.entitiesWithComponentsToRemove.length; i++) {
      let entity = this.entitiesWithComponentsToRemove[i];
      while (entity._ComponentTypesToRemove.length > 0) {
        let Component = entity._ComponentTypesToRemove.pop();

        var component = entity._componentsToRemove[Component._typeId];
        delete entity._componentsToRemove[Component._typeId];
        component.dispose();
        this.world.componentsManager.componentRemovedFromEntity(Component);

        //this._entityRemoveComponentSync(entity, Component, index);
      }
    }

    this.entitiesWithComponentsToRemove.length = 0;
  }

  /**
   * Get a query based on a list of components
   * @param {Array(Component)} Components List of components that will form the query
   */
  queryComponents(Components) {
    return this._queryManager.getQuery(Components);
  }

  // EXTRAS

  /**
   * Return number of entities
   */
  count() {
    return this._entities.length;
  }

  /**
   * Return some stats
   */
  stats() {
    var stats = {
      numEntities: this._entities.length,
      numQueries: Object.keys(this._queryManager._queries).length,
      queries: this._queryManager.stats(),
      numComponentPool: Object.keys(this.componentsManager._componentPool)
        .length,
      componentPool: {},
      eventDispatcher: this.eventDispatcher.stats,
    };

    for (var ecsyComponentId in this.componentsManager._componentPool) {
      var pool = this.componentsManager._componentPool[ecsyComponentId];
      stats.componentPool[pool.T.getName()] = {
        used: pool.totalUsed(),
        size: pool.count,
      };
    }

    return stats;
  }
}

const ENTITY_CREATED = "EntityManager#ENTITY_CREATE";
const ENTITY_REMOVED = "EntityManager#ENTITY_REMOVED";
const COMPONENT_ADDED = "EntityManager#COMPONENT_ADDED";
const COMPONENT_REMOVE = "EntityManager#COMPONENT_REMOVE";


/***/ }),

/***/ "./node_modules/ecsy/src/EventDispatcher.js":
/*!**************************************************!*\
  !*** ./node_modules/ecsy/src/EventDispatcher.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventDispatcher)
/* harmony export */ });
/**
 * @private
 * @class EventDispatcher
 */
class EventDispatcher {
  constructor() {
    this._listeners = {};
    this.stats = {
      fired: 0,
      handled: 0,
    };
  }

  /**
   * Add an event listener
   * @param {String} eventName Name of the event to listen
   * @param {Function} listener Callback to trigger when the event is fired
   */
  addEventListener(eventName, listener) {
    let listeners = this._listeners;
    if (listeners[eventName] === undefined) {
      listeners[eventName] = [];
    }

    if (listeners[eventName].indexOf(listener) === -1) {
      listeners[eventName].push(listener);
    }
  }

  /**
   * Check if an event listener is already added to the list of listeners
   * @param {String} eventName Name of the event to check
   * @param {Function} listener Callback for the specified event
   */
  hasEventListener(eventName, listener) {
    return (
      this._listeners[eventName] !== undefined &&
      this._listeners[eventName].indexOf(listener) !== -1
    );
  }

  /**
   * Remove an event listener
   * @param {String} eventName Name of the event to remove
   * @param {Function} listener Callback for the specified event
   */
  removeEventListener(eventName, listener) {
    var listenerArray = this._listeners[eventName];
    if (listenerArray !== undefined) {
      var index = listenerArray.indexOf(listener);
      if (index !== -1) {
        listenerArray.splice(index, 1);
      }
    }
  }

  /**
   * Dispatch an event
   * @param {String} eventName Name of the event to dispatch
   * @param {Entity} entity (Optional) Entity to emit
   * @param {Component} component
   */
  dispatchEvent(eventName, entity, component) {
    this.stats.fired++;

    var listenerArray = this._listeners[eventName];
    if (listenerArray !== undefined) {
      var array = listenerArray.slice(0);

      for (var i = 0; i < array.length; i++) {
        array[i].call(this, entity, component);
      }
    }
  }

  /**
   * Reset stats counters
   */
  resetCounters() {
    this.stats.fired = this.stats.handled = 0;
  }
}


/***/ }),

/***/ "./node_modules/ecsy/src/ObjectPool.js":
/*!*********************************************!*\
  !*** ./node_modules/ecsy/src/ObjectPool.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ObjectPool": () => (/* binding */ ObjectPool)
/* harmony export */ });
class ObjectPool {
  // @todo Add initial size
  constructor(T, initialSize) {
    this.freeList = [];
    this.count = 0;
    this.T = T;
    this.isObjectPool = true;

    if (typeof initialSize !== "undefined") {
      this.expand(initialSize);
    }
  }

  acquire() {
    // Grow the list by 20%ish if we're out
    if (this.freeList.length <= 0) {
      this.expand(Math.round(this.count * 0.2) + 1);
    }

    var item = this.freeList.pop();

    return item;
  }

  release(item) {
    item.reset();
    this.freeList.push(item);
  }

  expand(count) {
    for (var n = 0; n < count; n++) {
      var clone = new this.T();
      clone._pool = this;
      this.freeList.push(clone);
    }
    this.count += count;
  }

  totalSize() {
    return this.count;
  }

  totalFree() {
    return this.freeList.length;
  }

  totalUsed() {
    return this.count - this.freeList.length;
  }
}


/***/ }),

/***/ "./node_modules/ecsy/src/Query.js":
/*!****************************************!*\
  !*** ./node_modules/ecsy/src/Query.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Query)
/* harmony export */ });
/* harmony import */ var _EventDispatcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventDispatcher.js */ "./node_modules/ecsy/src/EventDispatcher.js");
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils.js */ "./node_modules/ecsy/src/Utils.js");



class Query {
  /**
   * @param {Array(Component)} Components List of types of components to query
   */
  constructor(Components, manager) {
    this.Components = [];
    this.NotComponents = [];

    Components.forEach((component) => {
      if (typeof component === "object") {
        this.NotComponents.push(component.Component);
      } else {
        this.Components.push(component);
      }
    });

    if (this.Components.length === 0) {
      throw new Error("Can't create a query without components");
    }

    this.entities = [];

    this.eventDispatcher = new _EventDispatcher_js__WEBPACK_IMPORTED_MODULE_0__["default"]();

    // This query is being used by a reactive system
    this.reactive = false;

    this.key = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_1__.queryKey)(Components);

    // Fill the query with the existing entities
    for (var i = 0; i < manager._entities.length; i++) {
      var entity = manager._entities[i];
      if (this.match(entity)) {
        // @todo ??? this.addEntity(entity); => preventing the event to be generated
        entity.queries.push(this);
        this.entities.push(entity);
      }
    }
  }

  /**
   * Add entity to this query
   * @param {Entity} entity
   */
  addEntity(entity) {
    entity.queries.push(this);
    this.entities.push(entity);

    this.eventDispatcher.dispatchEvent(Query.prototype.ENTITY_ADDED, entity);
  }

  /**
   * Remove entity from this query
   * @param {Entity} entity
   */
  removeEntity(entity) {
    let index = this.entities.indexOf(entity);
    if (~index) {
      this.entities.splice(index, 1);

      index = entity.queries.indexOf(this);
      entity.queries.splice(index, 1);

      this.eventDispatcher.dispatchEvent(
        Query.prototype.ENTITY_REMOVED,
        entity
      );
    }
  }

  match(entity) {
    return (
      entity.hasAllComponents(this.Components) &&
      !entity.hasAnyComponents(this.NotComponents)
    );
  }

  toJSON() {
    return {
      key: this.key,
      reactive: this.reactive,
      components: {
        included: this.Components.map((C) => C.name),
        not: this.NotComponents.map((C) => C.name),
      },
      numEntities: this.entities.length,
    };
  }

  /**
   * Return stats for this query
   */
  stats() {
    return {
      numComponents: this.Components.length,
      numEntities: this.entities.length,
    };
  }
}

Query.prototype.ENTITY_ADDED = "Query#ENTITY_ADDED";
Query.prototype.ENTITY_REMOVED = "Query#ENTITY_REMOVED";
Query.prototype.COMPONENT_CHANGED = "Query#COMPONENT_CHANGED";


/***/ }),

/***/ "./node_modules/ecsy/src/QueryManager.js":
/*!***********************************************!*\
  !*** ./node_modules/ecsy/src/QueryManager.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ QueryManager)
/* harmony export */ });
/* harmony import */ var _Query_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Query.js */ "./node_modules/ecsy/src/Query.js");
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils.js */ "./node_modules/ecsy/src/Utils.js");



/**
 * @private
 * @class QueryManager
 */
class QueryManager {
  constructor(world) {
    this._world = world;

    // Queries indexed by a unique identifier for the components it has
    this._queries = {};
  }

  onEntityRemoved(entity) {
    for (var queryName in this._queries) {
      var query = this._queries[queryName];
      if (entity.queries.indexOf(query) !== -1) {
        query.removeEntity(entity);
      }
    }
  }

  /**
   * Callback when a component is added to an entity
   * @param {Entity} entity Entity that just got the new component
   * @param {Component} Component Component added to the entity
   */
  onEntityComponentAdded(entity, Component) {
    // @todo Use bitmask for checking components?

    // Check each indexed query to see if we need to add this entity to the list
    for (var queryName in this._queries) {
      var query = this._queries[queryName];

      if (
        !!~query.NotComponents.indexOf(Component) &&
        ~query.entities.indexOf(entity)
      ) {
        query.removeEntity(entity);
        continue;
      }

      // Add the entity only if:
      // Component is in the query
      // and Entity has ALL the components of the query
      // and Entity is not already in the query
      if (
        !~query.Components.indexOf(Component) ||
        !query.match(entity) ||
        ~query.entities.indexOf(entity)
      )
        continue;

      query.addEntity(entity);
    }
  }

  /**
   * Callback when a component is removed from an entity
   * @param {Entity} entity Entity to remove the component from
   * @param {Component} Component Component to remove from the entity
   */
  onEntityComponentRemoved(entity, Component) {
    for (var queryName in this._queries) {
      var query = this._queries[queryName];

      if (
        !!~query.NotComponents.indexOf(Component) &&
        !~query.entities.indexOf(entity) &&
        query.match(entity)
      ) {
        query.addEntity(entity);
        continue;
      }

      if (
        !!~query.Components.indexOf(Component) &&
        !!~query.entities.indexOf(entity) &&
        !query.match(entity)
      ) {
        query.removeEntity(entity);
        continue;
      }
    }
  }

  /**
   * Get a query for the specified components
   * @param {Component} Components Components that the query should have
   */
  getQuery(Components) {
    var key = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_1__.queryKey)(Components);
    var query = this._queries[key];
    if (!query) {
      this._queries[key] = query = new _Query_js__WEBPACK_IMPORTED_MODULE_0__["default"](Components, this._world);
    }
    return query;
  }

  /**
   * Return some stats from this class
   */
  stats() {
    var stats = {};
    for (var queryName in this._queries) {
      stats[queryName] = this._queries[queryName].stats();
    }
    return stats;
  }
}


/***/ }),

/***/ "./node_modules/ecsy/src/RemoteDevTools/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/ecsy/src/RemoteDevTools/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "enableRemoteDevtools": () => (/* binding */ enableRemoteDevtools)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/ecsy/src/RemoteDevTools/utils.js");
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Utils.js */ "./node_modules/ecsy/src/Utils.js");
/* global Peer */



function hookConsoleAndErrors(connection) {
  var wrapFunctions = ["error", "warning", "log"];
  wrapFunctions.forEach((key) => {
    if (typeof console[key] === "function") {
      var fn = console[key].bind(console);
      console[key] = (...args) => {
        connection.send({
          method: "console",
          type: key,
          args: JSON.stringify(args),
        });
        return fn.apply(null, args);
      };
    }
  });

  window.addEventListener("error", (error) => {
    connection.send({
      method: "error",
      error: JSON.stringify({
        message: error.error.message,
        stack: error.error.stack,
      }),
    });
  });
}

function includeRemoteIdHTML(remoteId) {
  let infoDiv = document.createElement("div");
  infoDiv.style.cssText = `
    align-items: center;
    background-color: #333;
    color: #aaa;
    display:flex;
    font-family: Arial;
    font-size: 1.1em;
    height: 40px;
    justify-content: center;
    left: 0;
    opacity: 0.9;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  `;

  infoDiv.innerHTML = `Open ECSY devtools to connect to this page using the code:&nbsp;<b style="color: #fff">${remoteId}</b>&nbsp;<button onClick="generateNewCode()">Generate new code</button>`;
  document.body.appendChild(infoDiv);

  return infoDiv;
}

function enableRemoteDevtools(remoteId) {
  if (!_Utils_js__WEBPACK_IMPORTED_MODULE_1__.hasWindow) {
    console.warn("Remote devtools not available outside the browser");
    return;
  }

  window.generateNewCode = () => {
    window.localStorage.clear();
    remoteId = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.generateId)(6);
    window.localStorage.setItem("ecsyRemoteId", remoteId);
    window.location.reload(false);
  };

  remoteId = remoteId || window.localStorage.getItem("ecsyRemoteId");
  if (!remoteId) {
    remoteId = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.generateId)(6);
    window.localStorage.setItem("ecsyRemoteId", remoteId);
  }

  let infoDiv = includeRemoteIdHTML(remoteId);

  window.__ECSY_REMOTE_DEVTOOLS_INJECTED = true;
  window.__ECSY_REMOTE_DEVTOOLS = {};

  let Version = "";

  // This is used to collect the worlds created before the communication is being established
  let worldsBeforeLoading = [];
  let onWorldCreated = (e) => {
    var world = e.detail.world;
    Version = e.detail.version;
    worldsBeforeLoading.push(world);
  };
  window.addEventListener("ecsy-world-created", onWorldCreated);

  let onLoaded = () => {
    // var peer = new Peer(remoteId);
    var peer = new Peer(remoteId, {
      host: "peerjs.ecsy.io",
      secure: true,
      port: 443,
      config: {
        iceServers: [
          { url: "stun:stun.l.google.com:19302" },
          { url: "stun:stun1.l.google.com:19302" },
          { url: "stun:stun2.l.google.com:19302" },
          { url: "stun:stun3.l.google.com:19302" },
          { url: "stun:stun4.l.google.com:19302" },
        ],
      },
      debug: 3,
    });

    peer.on("open", (/* id */) => {
      peer.on("connection", (connection) => {
        window.__ECSY_REMOTE_DEVTOOLS.connection = connection;
        connection.on("open", function () {
          // infoDiv.style.visibility = "hidden";
          infoDiv.innerHTML = "Connected";

          // Receive messages
          connection.on("data", function (data) {
            if (data.type === "init") {
              var script = document.createElement("script");
              script.setAttribute("type", "text/javascript");
              script.onload = () => {
                script.parentNode.removeChild(script);

                // Once the script is injected we don't need to listen
                window.removeEventListener(
                  "ecsy-world-created",
                  onWorldCreated
                );
                worldsBeforeLoading.forEach((world) => {
                  var event = new CustomEvent("ecsy-world-created", {
                    detail: { world: world, version: Version },
                  });
                  window.dispatchEvent(event);
                });
              };
              script.innerHTML = data.script;
              (document.head || document.documentElement).appendChild(script);
              script.onload();

              hookConsoleAndErrors(connection);
            } else if (data.type === "executeScript") {
              let value = eval(data.script);
              if (data.returnEval) {
                connection.send({
                  method: "evalReturn",
                  value: value,
                });
              }
            }
          });
        });
      });
    });
  };

  // Inject PeerJS script
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.injectScript)(
    "https://cdn.jsdelivr.net/npm/peerjs@0.3.20/dist/peer.min.js",
    onLoaded
  );
}

if (_Utils_js__WEBPACK_IMPORTED_MODULE_1__.hasWindow) {
  const urlParams = new URLSearchParams(window.location.search);

  // @todo Provide a way to disable it if needed
  if (urlParams.has("enable-remote-devtools")) {
    enableRemoteDevtools();
  }
}


/***/ }),

/***/ "./node_modules/ecsy/src/RemoteDevTools/utils.js":
/*!*******************************************************!*\
  !*** ./node_modules/ecsy/src/RemoteDevTools/utils.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generateId": () => (/* binding */ generateId),
/* harmony export */   "injectScript": () => (/* binding */ injectScript)
/* harmony export */ });
function generateId(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function injectScript(src, onLoad) {
  var script = document.createElement("script");
  // @todo Use link to the ecsy-devtools repo?
  script.src = src;
  script.onload = onLoad;
  (document.head || document.documentElement).appendChild(script);
}


/***/ }),

/***/ "./node_modules/ecsy/src/System.js":
/*!*****************************************!*\
  !*** ./node_modules/ecsy/src/System.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Not": () => (/* binding */ Not),
/* harmony export */   "System": () => (/* binding */ System)
/* harmony export */ });
/* harmony import */ var _Query_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Query.js */ "./node_modules/ecsy/src/Query.js");
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils.js */ "./node_modules/ecsy/src/Utils.js");



class System {
  canExecute() {
    if (this._mandatoryQueries.length === 0) return true;

    for (let i = 0; i < this._mandatoryQueries.length; i++) {
      var query = this._mandatoryQueries[i];
      if (query.entities.length === 0) {
        return false;
      }
    }

    return true;
  }

  getName() {
    return this.constructor.getName();
  }

  constructor(world, attributes) {
    this.world = world;
    this.enabled = true;

    // @todo Better naming :)
    this._queries = {};
    this.queries = {};

    this.priority = 0;

    // Used for stats
    this.executeTime = 0;

    if (attributes && attributes.priority) {
      this.priority = attributes.priority;
    }

    this._mandatoryQueries = [];

    this.initialized = true;

    if (this.constructor.queries) {
      for (var queryName in this.constructor.queries) {
        var queryConfig = this.constructor.queries[queryName];
        var Components = queryConfig.components;
        if (!Components || Components.length === 0) {
          throw new Error("'components' attribute can't be empty in a query");
        }

        // Detect if the components have already been registered
        let unregisteredComponents = Components.filter(
          (Component) => !(0,_Utils_js__WEBPACK_IMPORTED_MODULE_1__.componentRegistered)(Component)
        );

        if (unregisteredComponents.length > 0) {
          throw new Error(
            `Tried to create a query '${
              this.constructor.name
            }.${queryName}' with unregistered components: [${unregisteredComponents
              .map((c) => c.getName())
              .join(", ")}]`
          );
        }

        var query = this.world.entityManager.queryComponents(Components);

        this._queries[queryName] = query;
        if (queryConfig.mandatory === true) {
          this._mandatoryQueries.push(query);
        }
        this.queries[queryName] = {
          results: query.entities,
        };

        // Reactive configuration added/removed/changed
        var validEvents = ["added", "removed", "changed"];

        const eventMapping = {
          added: _Query_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.ENTITY_ADDED,
          removed: _Query_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.ENTITY_REMOVED,
          changed: _Query_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.COMPONENT_CHANGED, // Query.prototype.ENTITY_CHANGED
        };

        if (queryConfig.listen) {
          validEvents.forEach((eventName) => {
            if (!this.execute) {
              console.warn(
                `System '${this.getName()}' has defined listen events (${validEvents.join(
                  ", "
                )}) for query '${queryName}' but it does not implement the 'execute' method.`
              );
            }

            // Is the event enabled on this system's query?
            if (queryConfig.listen[eventName]) {
              let event = queryConfig.listen[eventName];

              if (eventName === "changed") {
                query.reactive = true;
                if (event === true) {
                  // Any change on the entity from the components in the query
                  let eventList = (this.queries[queryName][eventName] = []);
                  query.eventDispatcher.addEventListener(
                    _Query_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.COMPONENT_CHANGED,
                    (entity) => {
                      // Avoid duplicates
                      if (eventList.indexOf(entity) === -1) {
                        eventList.push(entity);
                      }
                    }
                  );
                } else if (Array.isArray(event)) {
                  let eventList = (this.queries[queryName][eventName] = []);
                  query.eventDispatcher.addEventListener(
                    _Query_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.COMPONENT_CHANGED,
                    (entity, changedComponent) => {
                      // Avoid duplicates
                      if (
                        event.indexOf(changedComponent.constructor) !== -1 &&
                        eventList.indexOf(entity) === -1
                      ) {
                        eventList.push(entity);
                      }
                    }
                  );
                } else {
                  /*
                  // Checking just specific components
                  let changedList = (this.queries[queryName][eventName] = {});
                  event.forEach(component => {
                    let eventList = (changedList[
                      componentPropertyName(component)
                    ] = []);
                    query.eventDispatcher.addEventListener(
                      Query.prototype.COMPONENT_CHANGED,
                      (entity, changedComponent) => {
                        if (
                          changedComponent.constructor === component &&
                          eventList.indexOf(entity) === -1
                        ) {
                          eventList.push(entity);
                        }
                      }
                    );
                  });
                  */
                }
              } else {
                let eventList = (this.queries[queryName][eventName] = []);

                query.eventDispatcher.addEventListener(
                  eventMapping[eventName],
                  (entity) => {
                    // @fixme overhead?
                    if (eventList.indexOf(entity) === -1)
                      eventList.push(entity);
                  }
                );
              }
            }
          });
        }
      }
    }
  }

  stop() {
    this.executeTime = 0;
    this.enabled = false;
  }

  play() {
    this.enabled = true;
  }

  // @question rename to clear queues?
  clearEvents() {
    for (let queryName in this.queries) {
      var query = this.queries[queryName];
      if (query.added) {
        query.added.length = 0;
      }
      if (query.removed) {
        query.removed.length = 0;
      }
      if (query.changed) {
        if (Array.isArray(query.changed)) {
          query.changed.length = 0;
        } else {
          for (let name in query.changed) {
            query.changed[name].length = 0;
          }
        }
      }
    }
  }

  toJSON() {
    var json = {
      name: this.getName(),
      enabled: this.enabled,
      executeTime: this.executeTime,
      priority: this.priority,
      queries: {},
    };

    if (this.constructor.queries) {
      var queries = this.constructor.queries;
      for (let queryName in queries) {
        let query = this.queries[queryName];
        let queryDefinition = queries[queryName];
        let jsonQuery = (json.queries[queryName] = {
          key: this._queries[queryName].key,
        });

        jsonQuery.mandatory = queryDefinition.mandatory === true;
        jsonQuery.reactive =
          queryDefinition.listen &&
          (queryDefinition.listen.added === true ||
            queryDefinition.listen.removed === true ||
            queryDefinition.listen.changed === true ||
            Array.isArray(queryDefinition.listen.changed));

        if (jsonQuery.reactive) {
          jsonQuery.listen = {};

          const methods = ["added", "removed", "changed"];
          methods.forEach((method) => {
            if (query[method]) {
              jsonQuery.listen[method] = {
                entities: query[method].length,
              };
            }
          });
        }
      }
    }

    return json;
  }
}

System.isSystem = true;
System.getName = function () {
  return this.displayName || this.name;
};

function Not(Component) {
  return {
    operator: "not",
    Component: Component,
  };
}


/***/ }),

/***/ "./node_modules/ecsy/src/SystemManager.js":
/*!************************************************!*\
  !*** ./node_modules/ecsy/src/SystemManager.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SystemManager": () => (/* binding */ SystemManager)
/* harmony export */ });
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils.js */ "./node_modules/ecsy/src/Utils.js");


class SystemManager {
  constructor(world) {
    this._systems = [];
    this._executeSystems = []; // Systems that have `execute` method
    this.world = world;
    this.lastExecutedSystem = null;
  }

  registerSystem(SystemClass, attributes) {
    if (!SystemClass.isSystem) {
      throw new Error(
        `System '${SystemClass.name}' does not extend 'System' class`
      );
    }

    if (this.getSystem(SystemClass) !== undefined) {
      console.warn(`System '${SystemClass.getName()}' already registered.`);
      return this;
    }

    var system = new SystemClass(this.world, attributes);
    if (system.init) system.init(attributes);
    system.order = this._systems.length;
    this._systems.push(system);
    if (system.execute) {
      this._executeSystems.push(system);
      this.sortSystems();
    }
    return this;
  }

  unregisterSystem(SystemClass) {
    let system = this.getSystem(SystemClass);
    if (system === undefined) {
      console.warn(
        `Can unregister system '${SystemClass.getName()}'. It doesn't exist.`
      );
      return this;
    }

    this._systems.splice(this._systems.indexOf(system), 1);

    if (system.execute) {
      this._executeSystems.splice(this._executeSystems.indexOf(system), 1);
    }

    // @todo Add system.unregister() call to free resources
    return this;
  }

  sortSystems() {
    this._executeSystems.sort((a, b) => {
      return a.priority - b.priority || a.order - b.order;
    });
  }

  getSystem(SystemClass) {
    return this._systems.find((s) => s instanceof SystemClass);
  }

  getSystems() {
    return this._systems;
  }

  removeSystem(SystemClass) {
    var index = this._systems.indexOf(SystemClass);
    if (!~index) return;

    this._systems.splice(index, 1);
  }

  executeSystem(system, delta, time) {
    if (system.initialized) {
      if (system.canExecute()) {
        let startTime = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_0__.now)();
        system.execute(delta, time);
        system.executeTime = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_0__.now)() - startTime;
        this.lastExecutedSystem = system;
        system.clearEvents();
      }
    }
  }

  stop() {
    this._executeSystems.forEach((system) => system.stop());
  }

  execute(delta, time, forcePlay) {
    this._executeSystems.forEach(
      (system) =>
        (forcePlay || system.enabled) && this.executeSystem(system, delta, time)
    );
  }

  stats() {
    var stats = {
      numSystems: this._systems.length,
      systems: {},
    };

    for (var i = 0; i < this._systems.length; i++) {
      var system = this._systems[i];
      var systemStats = (stats.systems[system.getName()] = {
        queries: {},
        executeTime: system.executeTime,
      });
      for (var name in system.ctx) {
        systemStats.queries[name] = system.ctx[name].stats();
      }
    }

    return stats;
  }
}


/***/ }),

/***/ "./node_modules/ecsy/src/SystemStateComponent.js":
/*!*******************************************************!*\
  !*** ./node_modules/ecsy/src/SystemStateComponent.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SystemStateComponent": () => (/* binding */ SystemStateComponent)
/* harmony export */ });
/* harmony import */ var _Component_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component.js */ "./node_modules/ecsy/src/Component.js");


class SystemStateComponent extends _Component_js__WEBPACK_IMPORTED_MODULE_0__.Component {}

SystemStateComponent.isSystemStateComponent = true;


/***/ }),

/***/ "./node_modules/ecsy/src/TagComponent.js":
/*!***********************************************!*\
  !*** ./node_modules/ecsy/src/TagComponent.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TagComponent": () => (/* binding */ TagComponent)
/* harmony export */ });
/* harmony import */ var _Component_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component.js */ "./node_modules/ecsy/src/Component.js");


class TagComponent extends _Component_js__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor() {
    super(false);
  }
}

TagComponent.isTagComponent = true;


/***/ }),

/***/ "./node_modules/ecsy/src/Types.js":
/*!****************************************!*\
  !*** ./node_modules/ecsy/src/Types.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Types": () => (/* binding */ Types),
/* harmony export */   "cloneArray": () => (/* binding */ cloneArray),
/* harmony export */   "cloneClonable": () => (/* binding */ cloneClonable),
/* harmony export */   "cloneJSON": () => (/* binding */ cloneJSON),
/* harmony export */   "cloneValue": () => (/* binding */ cloneValue),
/* harmony export */   "copyArray": () => (/* binding */ copyArray),
/* harmony export */   "copyCopyable": () => (/* binding */ copyCopyable),
/* harmony export */   "copyJSON": () => (/* binding */ copyJSON),
/* harmony export */   "copyValue": () => (/* binding */ copyValue),
/* harmony export */   "createType": () => (/* binding */ createType)
/* harmony export */ });
const copyValue = (src) => src;

const cloneValue = (src) => src;

const copyArray = (src, dest) => {
  if (!src) {
    return src;
  }

  if (!dest) {
    return src.slice();
  }

  dest.length = 0;

  for (let i = 0; i < src.length; i++) {
    dest.push(src[i]);
  }

  return dest;
};

const cloneArray = (src) => src && src.slice();

const copyJSON = (src) => JSON.parse(JSON.stringify(src));

const cloneJSON = (src) => JSON.parse(JSON.stringify(src));

const copyCopyable = (src, dest) => {
  if (!src) {
    return src;
  }

  if (!dest) {
    return src.clone();
  }

  return dest.copy(src);
};

const cloneClonable = (src) => src && src.clone();

function createType(typeDefinition) {
  var mandatoryProperties = ["name", "default", "copy", "clone"];

  var undefinedProperties = mandatoryProperties.filter((p) => {
    return !typeDefinition.hasOwnProperty(p);
  });

  if (undefinedProperties.length > 0) {
    throw new Error(
      `createType expects a type definition with the following properties: ${undefinedProperties.join(
        ", "
      )}`
    );
  }

  typeDefinition.isType = true;

  return typeDefinition;
}

/**
 * Standard types
 */
const Types = {
  Number: createType({
    name: "Number",
    default: 0,
    copy: copyValue,
    clone: cloneValue,
  }),

  Boolean: createType({
    name: "Boolean",
    default: false,
    copy: copyValue,
    clone: cloneValue,
  }),

  String: createType({
    name: "String",
    default: "",
    copy: copyValue,
    clone: cloneValue,
  }),

  Array: createType({
    name: "Array",
    default: [],
    copy: copyArray,
    clone: cloneArray,
  }),

  Ref: createType({
    name: "Ref",
    default: undefined,
    copy: copyValue,
    clone: cloneValue,
  }),

  JSON: createType({
    name: "JSON",
    default: null,
    copy: copyJSON,
    clone: cloneJSON,
  }),
};


/***/ }),

/***/ "./node_modules/ecsy/src/Utils.js":
/*!****************************************!*\
  !*** ./node_modules/ecsy/src/Utils.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "componentPropertyName": () => (/* binding */ componentPropertyName),
/* harmony export */   "componentRegistered": () => (/* binding */ componentRegistered),
/* harmony export */   "getName": () => (/* binding */ getName),
/* harmony export */   "hasWindow": () => (/* binding */ hasWindow),
/* harmony export */   "now": () => (/* binding */ now),
/* harmony export */   "queryKey": () => (/* binding */ queryKey)
/* harmony export */ });
/**
 * Return the name of a component
 * @param {Component} Component
 * @private
 */
function getName(Component) {
  return Component.name;
}

/**
 * Return a valid property name for the Component
 * @param {Component} Component
 * @private
 */
function componentPropertyName(Component) {
  return getName(Component);
}

/**
 * Get a key from a list of components
 * @param {Array(Component)} Components Array of components to generate the key
 * @private
 */
function queryKey(Components) {
  var ids = [];
  for (var n = 0; n < Components.length; n++) {
    var T = Components[n];

    if (!componentRegistered(T)) {
      throw new Error(`Tried to create a query with an unregistered component`);
    }

    if (typeof T === "object") {
      var operator = T.operator === "not" ? "!" : T.operator;
      ids.push(operator + T.Component._typeId);
    } else {
      ids.push(T._typeId);
    }
  }

  return ids.sort().join("-");
}

// Detector for browser's "window"
const hasWindow = typeof window !== "undefined";

// performance.now() "polyfill"
const now =
  hasWindow && typeof window.performance !== "undefined"
    ? performance.now.bind(performance)
    : Date.now.bind(Date);

function componentRegistered(T) {
  return (
    (typeof T === "object" && T.Component._typeId !== undefined) ||
    (T.isComponent && T._typeId !== undefined)
  );
}


/***/ }),

/***/ "./node_modules/ecsy/src/Version.js":
/*!******************************************!*\
  !*** ./node_modules/ecsy/src/Version.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Version": () => (/* binding */ Version)
/* harmony export */ });
const Version = "0.3.1";


/***/ }),

/***/ "./node_modules/ecsy/src/World.js":
/*!****************************************!*\
  !*** ./node_modules/ecsy/src/World.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "World": () => (/* binding */ World)
/* harmony export */ });
/* harmony import */ var _SystemManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SystemManager.js */ "./node_modules/ecsy/src/SystemManager.js");
/* harmony import */ var _EntityManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EntityManager.js */ "./node_modules/ecsy/src/EntityManager.js");
/* harmony import */ var _ComponentManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ComponentManager.js */ "./node_modules/ecsy/src/ComponentManager.js");
/* harmony import */ var _Version_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Version.js */ "./node_modules/ecsy/src/Version.js");
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Utils.js */ "./node_modules/ecsy/src/Utils.js");
/* harmony import */ var _Entity_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Entity.js */ "./node_modules/ecsy/src/Entity.js");







const DEFAULT_OPTIONS = {
  entityPoolSize: 0,
  entityClass: _Entity_js__WEBPACK_IMPORTED_MODULE_5__.Entity,
};

class World {
  constructor(options = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    this.componentsManager = new _ComponentManager_js__WEBPACK_IMPORTED_MODULE_2__.ComponentManager(this);
    this.entityManager = new _EntityManager_js__WEBPACK_IMPORTED_MODULE_1__.EntityManager(this);
    this.systemManager = new _SystemManager_js__WEBPACK_IMPORTED_MODULE_0__.SystemManager(this);

    this.enabled = true;

    this.eventQueues = {};

    if (_Utils_js__WEBPACK_IMPORTED_MODULE_4__.hasWindow && typeof CustomEvent !== "undefined") {
      var event = new CustomEvent("ecsy-world-created", {
        detail: { world: this, version: _Version_js__WEBPACK_IMPORTED_MODULE_3__.Version },
      });
      window.dispatchEvent(event);
    }

    this.lastTime = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_4__.now)() / 1000;
  }

  registerComponent(Component, objectPool) {
    this.componentsManager.registerComponent(Component, objectPool);
    return this;
  }

  registerSystem(System, attributes) {
    this.systemManager.registerSystem(System, attributes);
    return this;
  }

  hasRegisteredComponent(Component) {
    return this.componentsManager.hasComponent(Component);
  }

  unregisterSystem(System) {
    this.systemManager.unregisterSystem(System);
    return this;
  }

  getSystem(SystemClass) {
    return this.systemManager.getSystem(SystemClass);
  }

  getSystems() {
    return this.systemManager.getSystems();
  }

  execute(delta, time) {
    if (!delta) {
      time = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_4__.now)() / 1000;
      delta = time - this.lastTime;
      this.lastTime = time;
    }

    if (this.enabled) {
      this.systemManager.execute(delta, time);
      this.entityManager.processDeferredRemoval();
    }
  }

  stop() {
    this.enabled = false;
  }

  play() {
    this.enabled = true;
  }

  createEntity(name) {
    return this.entityManager.createEntity(name);
  }

  stats() {
    var stats = {
      entities: this.entityManager.stats(),
      system: this.systemManager.stats(),
    };

    return stats;
  }
}


/***/ }),

/***/ "./node_modules/ecsy/src/WrapImmutableComponent.js":
/*!*********************************************************!*\
  !*** ./node_modules/ecsy/src/WrapImmutableComponent.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ wrapImmutableComponent)
/* harmony export */ });
const proxyMap = new WeakMap();

const proxyHandler = {
  set(target, prop) {
    throw new Error(
      `Tried to write to "${target.constructor.getName()}#${String(
        prop
      )}" on immutable component. Use .getMutableComponent() to modify a component.`
    );
  },
};

function wrapImmutableComponent(T, component) {
  if (component === undefined) {
    return undefined;
  }

  let wrappedComponent = proxyMap.get(component);

  if (!wrappedComponent) {
    wrappedComponent = new Proxy(component, proxyHandler);
    proxyMap.set(component, wrappedComponent);
  }

  return wrappedComponent;
}


/***/ }),

/***/ "./node_modules/ecsy/src/index.js":
/*!****************************************!*\
  !*** ./node_modules/ecsy/src/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => (/* reexport safe */ _Component_js__WEBPACK_IMPORTED_MODULE_2__.Component),
/* harmony export */   "Not": () => (/* reexport safe */ _System_js__WEBPACK_IMPORTED_MODULE_1__.Not),
/* harmony export */   "ObjectPool": () => (/* reexport safe */ _ObjectPool_js__WEBPACK_IMPORTED_MODULE_5__.ObjectPool),
/* harmony export */   "System": () => (/* reexport safe */ _System_js__WEBPACK_IMPORTED_MODULE_1__.System),
/* harmony export */   "SystemStateComponent": () => (/* reexport safe */ _SystemStateComponent_js__WEBPACK_IMPORTED_MODULE_3__.SystemStateComponent),
/* harmony export */   "TagComponent": () => (/* reexport safe */ _TagComponent_js__WEBPACK_IMPORTED_MODULE_4__.TagComponent),
/* harmony export */   "Types": () => (/* reexport safe */ _Types_js__WEBPACK_IMPORTED_MODULE_6__.Types),
/* harmony export */   "Version": () => (/* reexport safe */ _Version_js__WEBPACK_IMPORTED_MODULE_7__.Version),
/* harmony export */   "World": () => (/* reexport safe */ _World_js__WEBPACK_IMPORTED_MODULE_0__.World),
/* harmony export */   "_Entity": () => (/* reexport safe */ _Entity_js__WEBPACK_IMPORTED_MODULE_9__.Entity),
/* harmony export */   "cloneArray": () => (/* reexport safe */ _Types_js__WEBPACK_IMPORTED_MODULE_6__.cloneArray),
/* harmony export */   "cloneClonable": () => (/* reexport safe */ _Types_js__WEBPACK_IMPORTED_MODULE_6__.cloneClonable),
/* harmony export */   "cloneJSON": () => (/* reexport safe */ _Types_js__WEBPACK_IMPORTED_MODULE_6__.cloneJSON),
/* harmony export */   "cloneValue": () => (/* reexport safe */ _Types_js__WEBPACK_IMPORTED_MODULE_6__.cloneValue),
/* harmony export */   "copyArray": () => (/* reexport safe */ _Types_js__WEBPACK_IMPORTED_MODULE_6__.copyArray),
/* harmony export */   "copyCopyable": () => (/* reexport safe */ _Types_js__WEBPACK_IMPORTED_MODULE_6__.copyCopyable),
/* harmony export */   "copyJSON": () => (/* reexport safe */ _Types_js__WEBPACK_IMPORTED_MODULE_6__.copyJSON),
/* harmony export */   "copyValue": () => (/* reexport safe */ _Types_js__WEBPACK_IMPORTED_MODULE_6__.copyValue),
/* harmony export */   "createType": () => (/* reexport safe */ _Types_js__WEBPACK_IMPORTED_MODULE_6__.createType),
/* harmony export */   "enableRemoteDevtools": () => (/* reexport safe */ _RemoteDevTools_index_js__WEBPACK_IMPORTED_MODULE_8__.enableRemoteDevtools)
/* harmony export */ });
/* harmony import */ var _World_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./World.js */ "./node_modules/ecsy/src/World.js");
/* harmony import */ var _System_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./System.js */ "./node_modules/ecsy/src/System.js");
/* harmony import */ var _Component_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Component.js */ "./node_modules/ecsy/src/Component.js");
/* harmony import */ var _SystemStateComponent_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SystemStateComponent.js */ "./node_modules/ecsy/src/SystemStateComponent.js");
/* harmony import */ var _TagComponent_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TagComponent.js */ "./node_modules/ecsy/src/TagComponent.js");
/* harmony import */ var _ObjectPool_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ObjectPool.js */ "./node_modules/ecsy/src/ObjectPool.js");
/* harmony import */ var _Types_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Types.js */ "./node_modules/ecsy/src/Types.js");
/* harmony import */ var _Version_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Version.js */ "./node_modules/ecsy/src/Version.js");
/* harmony import */ var _RemoteDevTools_index_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./RemoteDevTools/index.js */ "./node_modules/ecsy/src/RemoteDevTools/index.js");
/* harmony import */ var _Entity_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Entity.js */ "./node_modules/ecsy/src/Entity.js");












/***/ }),

/***/ "./src/DataComponents/Demo1/LineData.ts":
/*!**********************************************!*\
  !*** ./src/DataComponents/Demo1/LineData.ts ***!
  \**********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ecsy */ "./node_modules/ecsy/src/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ecsy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.LineData = void 0;
    class LineData extends ecsy_1.Component {
        constructor() {
            // Disable the default schema behavior.
            super(false);
            // Custom data setup.
            this.points = new Array();
        }
        copy(source) {
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
        reset() {
            this.points.forEach((point) => {
                point.x = 0;
                point.y = 0;
            });
        }
    }
    exports.LineData = LineData;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/DataComponents/Demo1/ValueData.ts":
/*!***********************************************!*\
  !*** ./src/DataComponents/Demo1/ValueData.ts ***!
  \***********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ecsy */ "./node_modules/ecsy/src/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ecsy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.ValueData = void 0;
    class ValueData extends ecsy_1.Component {
    }
    exports.ValueData = ValueData;
    ValueData.schema = {
        intVal: {
            type: ecsy_1.Types.Number,
            default: 0,
        },
        strVal: {
            type: ecsy_1.Types.String,
            default: "",
        },
    };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/DataComponents/Demo2/Transform2DData.ts":
/*!*****************************************************!*\
  !*** ./src/DataComponents/Demo2/Transform2DData.ts ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ecsy */ "./node_modules/ecsy/src/index.js"), __webpack_require__(/*! ../../Utils/Vector2 */ "./src/Utils/Vector2.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ecsy_1, Vector2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.Transform2DData = void 0;
    class Transform2DData extends ecsy_1.Component {
    }
    exports.Transform2DData = Transform2DData;
    Transform2DData.schema = {
        position: {
            type: Vector2_1.Vector2Type,
            default: new Vector2_1.Vector2(0, 0),
        },
    };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/Demo1.ts":
/*!**********************!*\
  !*** ./src/Demo1.ts ***!
  \**********************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ecsy */ "./node_modules/ecsy/src/index.js"), __webpack_require__(/*! ./DataComponents/Demo1/LineData */ "./src/DataComponents/Demo1/LineData.ts"), __webpack_require__(/*! ./DataComponents/Demo1/ValueData */ "./src/DataComponents/Demo1/ValueData.ts"), __webpack_require__(/*! ./DataComponents/Demo2/Transform2DData */ "./src/DataComponents/Demo2/Transform2DData.ts"), __webpack_require__(/*! ./Utils/Vector2 */ "./src/Utils/Vector2.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ecsy_1, LineData_1, ValueData_1, Transform2DData_1, Vector2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.demo1 = void 0;
    // 1. Create a world
    const mainWorld = new ecsy_1.World({
        entityPoolSize: 10000,
    });
    // 2.1 Basic Components
    // 2.1.1 Create a component
    // 2.1.2 Change the value of the component
    const BasicComponentDemo = () => {
        let debugTextArea = document.getElementById("debug1");
        let debugButton = document.getElementById("debugButton1");
        // Return if the debug elements are not found.
        if (!debugTextArea || !debugButton) {
            return;
        }
        // Create a new component.
        const valueData = new ValueData_1.ValueData();
        debugTextArea.innerHTML +=
            "Initial ValueData: " + JSON.stringify(valueData) + "\n";
        const ChangeValueData = () => {
            // Change the value of the component.
            valueData.intVal += 10;
            valueData.strVal = "Hello World!";
            debugTextArea.innerHTML +=
                "Current ValueData: " + JSON.stringify(valueData) + "\n";
        };
        debugButton.addEventListener("click", ChangeValueData);
    };
    // 2.2 Custom Types
    // 2.2.1 Create a component with a custom type
    // 2.2.2 Change the value of the component
    const CustomTypeDemo = () => {
        let debugTextArea = document.getElementById("debug2");
        let debugButton = document.getElementById("debugButton2");
        // Return if the debug elements are not found.
        if (!debugTextArea || !debugButton) {
            return;
        }
        // Create a new transform component.
        const transform2D = new Transform2DData_1.Transform2DData();
        debugTextArea.innerHTML +=
            "Initial Transform2D: " + JSON.stringify(transform2D) + "\n";
        const ChangeTransform2D = () => {
            // Change the value of the component.
            transform2D.position.x += 10;
            transform2D.position.y += 10;
            debugTextArea.innerHTML +=
                "Current Transform2D: " + JSON.stringify(transform2D) + "\n";
        };
        debugButton.addEventListener("click", ChangeTransform2D);
    };
    const CustomComponentDemo = () => {
        let debugTextArea = document.getElementById("debug3");
        let randomOriginalButton = document.getElementById("debugButton3");
        let copyComponent = document.getElementById("debugButton4");
        // Return if the debug elements are not found.
        if (!debugTextArea || !randomOriginalButton || !copyComponent) {
            return;
        }
        // Create 2 new LineData component.
        const lineData = new LineData_1.LineData();
        const lineData2 = new LineData_1.LineData();
        debugTextArea.innerHTML =
            "Initial LineData: " +
                JSON.stringify(lineData) +
                "\n" +
                "Initial LineData2: " +
                JSON.stringify(lineData2) +
                "\n";
        const RandomOriginal = () => {
            // Clear the points array.
            lineData.points.length = 0;
            // Add random points to the original line.
            for (let i = 0; i < 3; i++) {
                lineData.points.push(new Vector2_1.Vector2(Math.random(), Math.random()));
            }
            debugTextArea.innerHTML =
                "Current LineData: " +
                    JSON.stringify(lineData) +
                    "\n" +
                    "Current LineData2: " +
                    JSON.stringify(lineData2) +
                    "\n";
        };
        const CopyComponent = () => {
            // Copy the original line to the second line.
            lineData2.copy(lineData);
            debugTextArea.innerHTML =
                "Current LineData: " +
                    JSON.stringify(lineData) +
                    "\n" +
                    "Current LineData2: " +
                    JSON.stringify(lineData2) +
                    "\n";
        };
        randomOriginalButton.addEventListener("click", RandomOriginal);
        copyComponent.addEventListener("click", CopyComponent);
    };
    const demo1 = () => {
        // 2. Components
        BasicComponentDemo();
        CustomTypeDemo();
        CustomComponentDemo();
    };
    exports.demo1 = demo1;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/Demo2.ts":
/*!**********************!*\
  !*** ./src/Demo2.ts ***!
  \**********************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ecsy */ "./node_modules/ecsy/src/index.js"), __webpack_require__(/*! ./DataComponents/Demo2/Transform2DData */ "./src/DataComponents/Demo2/Transform2DData.ts"), __webpack_require__(/*! ./Systems/ClearCanvasSystem */ "./src/Systems/ClearCanvasSystem.ts"), __webpack_require__(/*! ./Systems/DebugRenderSystem */ "./src/Systems/DebugRenderSystem.ts"), __webpack_require__(/*! ./Systems/LoadSceneSystem */ "./src/Systems/LoadSceneSystem.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ecsy_1, Transform2DData_1, ClearCanvasSystem_1, DebugRenderSystem_1, LoadSceneSystem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.demo2 = void 0;
    const world = new ecsy_1.World({
        entityPoolSize: 10000,
    });
    const mainUpdate = () => {
        world.execute();
        requestAnimationFrame(mainUpdate);
    };
    const demo2 = () => {
        // Get main canvas.
        let mainCanvas = document.getElementById("mainCanvas");
        // Register all components.
        world.registerComponent(Transform2DData_1.Transform2DData);
        // Register all systems.
        world
            .registerSystem(LoadSceneSystem_1.LoadSceneSystem)
            .registerSystem(ClearCanvasSystem_1.ClearCanvasSystem, {
            canvas: mainCanvas,
        })
            .registerSystem(DebugRenderSystem_1.DebugRenderSystem, {
            canvas: mainCanvas,
        });
        // Start main loop.
        requestAnimationFrame(mainUpdate);
    };
    exports.demo2 = demo2;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/Main.ts":
/*!*********************!*\
  !*** ./src/Main.ts ***!
  \*********************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./Demo1 */ "./src/Demo1.ts"), __webpack_require__(/*! ./Demo2 */ "./src/Demo2.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Demo1_1, Demo2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    const main = () => {
        (0, Demo1_1.demo1)();
        (0, Demo2_1.demo2)();
    };
    window.onload = main;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/Systems/ClearCanvasSystem.ts":
/*!******************************************!*\
  !*** ./src/Systems/ClearCanvasSystem.ts ***!
  \******************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ecsy */ "./node_modules/ecsy/src/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ecsy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.ClearCanvasSystem = void 0;
    class ClearCanvasSystem extends ecsy_1.System {
        init(attributes) {
            // Get the canvas element.
            this.canvas = attributes.canvas;
            this.canvasContext = this.canvas.getContext("2d");
        }
        execute(delta, time) {
            // Clear the canvas.
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    exports.ClearCanvasSystem = ClearCanvasSystem;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/Systems/DebugRenderSystem.ts":
/*!******************************************!*\
  !*** ./src/Systems/DebugRenderSystem.ts ***!
  \******************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ecsy */ "./node_modules/ecsy/src/index.js"), __webpack_require__(/*! ../DataComponents/Demo2/Transform2DData */ "./src/DataComponents/Demo2/Transform2DData.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ecsy_1, Transform2DData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.DebugRenderSystem = void 0;
    class DebugRenderSystem extends ecsy_1.System {
        init(attributes) {
            // Get the canvas element.
            this.canvas = attributes.canvas;
            this.canvasContext = this.canvas.getContext("2d");
        }
        execute(delta, time) {
            // Render Position for all the transform entities.
            this.queries.transformEntities.results.forEach((entity) => {
                let transform = entity.getComponent(Transform2DData_1.Transform2DData);
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
    exports.DebugRenderSystem = DebugRenderSystem;
    DebugRenderSystem.queries = {
        transformEntities: {
            components: [Transform2DData_1.Transform2DData],
        },
    };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/Systems/LoadSceneSystem.ts":
/*!****************************************!*\
  !*** ./src/Systems/LoadSceneSystem.ts ***!
  \****************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ecsy */ "./node_modules/ecsy/src/index.js"), __webpack_require__(/*! ../DataComponents/Demo2/Transform2DData */ "./src/DataComponents/Demo2/Transform2DData.ts"), __webpack_require__(/*! ../Utils/Vector2 */ "./src/Utils/Vector2.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ecsy_1, Transform2DData_1, Vector2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.LoadSceneSystem = void 0;
    /**
     * System to load the scene.
     */
    class LoadSceneSystem extends ecsy_1.System {
        init(attributes) {
            console.log("LoadSceneSystem.init()");
            // Instantiate a new entity.
            let entityInstance = this.world.createEntity();
            // Add Transform2DData component to the entity.
            entityInstance.addComponent(Transform2DData_1.Transform2DData, {
                position: new Vector2_1.Vector2(0, 0),
            });
        }
        execute(delta, time) {
            // Do nothing.
        }
    }
    exports.LoadSceneSystem = LoadSceneSystem;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/Utils/Vector2.ts":
/*!******************************!*\
  !*** ./src/Utils/Vector2.ts ***!
  \******************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ecsy */ "./node_modules/ecsy/src/index.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ecsy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.Vector2Type = exports.Vector2 = void 0;
    class Vector2 {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        set(x, y) {
            this.x = x;
            this.y = y;
        }
        copy(v) {
            this.x = v.x;
            this.y = v.y;
        }
        clone() {
            return new Vector2(this.x, this.y);
        }
    }
    exports.Vector2 = Vector2;
    exports.Vector2Type = (0, ecsy_1.createType)({
        name: "Vector2",
        default: new Vector2(0, 0),
        copy: (ecsy_1.copyCopyable),
        clone: (ecsy_1.cloneClonable),
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/Main.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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bmVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvQ29tcG9uZW50TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvRW50aXR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9FbnRpdHlNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9FdmVudERpc3BhdGNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Vjc3kvc3JjL09iamVjdFBvb2wuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Vjc3kvc3JjL1F1ZXJ5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9RdWVyeU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Vjc3kvc3JjL1JlbW90ZURldlRvb2xzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9SZW1vdGVEZXZUb29scy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvU3lzdGVtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9TeXN0ZW1NYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9TeXN0ZW1TdGF0ZUNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvVGFnQ29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9UeXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvVXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Vjc3kvc3JjL1ZlcnNpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Vjc3kvc3JjL1dvcmxkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9XcmFwSW1tdXRhYmxlQ29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRGF0YUNvbXBvbmVudHMvRGVtbzEvTGluZURhdGEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0RhdGFDb21wb25lbnRzL0RlbW8xL1ZhbHVlRGF0YS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvRGF0YUNvbXBvbmVudHMvRGVtbzIvVHJhbnNmb3JtMkREYXRhLnRzIiwid2VicGFjazovLy8uL3NyYy9EZW1vMS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvRGVtbzIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N5c3RlbXMvQ2xlYXJDYW52YXNTeXN0ZW0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N5c3RlbXMvRGVidWdSZW5kZXJTeXN0ZW0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N5c3RlbXMvTG9hZFNjZW5lU3lzdGVtLnRzIiwid2VicGFjazovLy8uL3NyYy9VdGlscy9WZWN0b3IyLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBpZiAocHJvcHMgIT09IGZhbHNlKSB7XG4gICAgICBjb25zdCBzY2hlbWEgPSB0aGlzLmNvbnN0cnVjdG9yLnNjaGVtYTtcblxuICAgICAgZm9yIChjb25zdCBrZXkgaW4gc2NoZW1hKSB7XG4gICAgICAgIGlmIChwcm9wcyAmJiBwcm9wcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgdGhpc1trZXldID0gcHJvcHNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBzY2hlbWFQcm9wID0gc2NoZW1hW2tleV07XG4gICAgICAgICAgaWYgKHNjaGVtYVByb3AuaGFzT3duUHJvcGVydHkoXCJkZWZhdWx0XCIpKSB7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSBzY2hlbWFQcm9wLnR5cGUuY2xvbmUoc2NoZW1hUHJvcC5kZWZhdWx0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IHNjaGVtYVByb3AudHlwZTtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IHR5cGUuY2xvbmUodHlwZS5kZWZhdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJiBwcm9wcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuY2hlY2tVbmRlZmluZWRBdHRyaWJ1dGVzKHByb3BzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9wb29sID0gbnVsbDtcbiAgfVxuXG4gIGNvcHkoc291cmNlKSB7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpcy5jb25zdHJ1Y3Rvci5zY2hlbWE7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzY2hlbWEpIHtcbiAgICAgIGNvbnN0IHByb3AgPSBzY2hlbWFba2V5XTtcblxuICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHByb3AudHlwZS5jb3B5KHNvdXJjZVtrZXldLCB0aGlzW2tleV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEBERUJVR1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIHRoaXMuY2hlY2tVbmRlZmluZWRBdHRyaWJ1dGVzKHNvdXJjZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoKS5jb3B5KHRoaXMpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpcy5jb25zdHJ1Y3Rvci5zY2hlbWE7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzY2hlbWEpIHtcbiAgICAgIGNvbnN0IHNjaGVtYVByb3AgPSBzY2hlbWFba2V5XTtcblxuICAgICAgaWYgKHNjaGVtYVByb3AuaGFzT3duUHJvcGVydHkoXCJkZWZhdWx0XCIpKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHNjaGVtYVByb3AudHlwZS5jb3B5KHNjaGVtYVByb3AuZGVmYXVsdCwgdGhpc1trZXldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBzY2hlbWFQcm9wLnR5cGU7XG4gICAgICAgIHRoaXNba2V5XSA9IHR5cGUuY29weSh0eXBlLmRlZmF1bHQsIHRoaXNba2V5XSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICBpZiAodGhpcy5fcG9vbCkge1xuICAgICAgdGhpcy5fcG9vbC5yZWxlYXNlKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIGdldE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuZ2V0TmFtZSgpO1xuICB9XG5cbiAgY2hlY2tVbmRlZmluZWRBdHRyaWJ1dGVzKHNyYykge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXMuY29uc3RydWN0b3Iuc2NoZW1hO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCB0aGUgYXR0cmlidXRlcyBkZWZpbmVkIGluIHNvdXJjZSBhcmUgYWxzbyBkZWZpbmVkIGluIHRoZSBzY2hlbWFcbiAgICBPYmplY3Qua2V5cyhzcmMpLmZvckVhY2goKHNyY0tleSkgPT4ge1xuICAgICAgaWYgKCFzY2hlbWEuaGFzT3duUHJvcGVydHkoc3JjS2V5KSkge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgYFRyeWluZyB0byBzZXQgYXR0cmlidXRlICcke3NyY0tleX0nIG5vdCBkZWZpbmVkIGluIHRoZSAnJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9JyBzY2hlbWEuIFBsZWFzZSBmaXggdGhlIHNjaGVtYSwgdGhlIGF0dHJpYnV0ZSB2YWx1ZSB3b24ndCBiZSBzZXRgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuQ29tcG9uZW50LnNjaGVtYSA9IHt9O1xuQ29tcG9uZW50LmlzQ29tcG9uZW50ID0gdHJ1ZTtcbkNvbXBvbmVudC5nZXROYW1lID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5kaXNwbGF5TmFtZSB8fCB0aGlzLm5hbWU7XG59O1xuIiwiaW1wb3J0IHsgT2JqZWN0UG9vbCB9IGZyb20gXCIuL09iamVjdFBvb2wuanNcIjtcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudE1hbmFnZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLkNvbXBvbmVudHMgPSBbXTtcbiAgICB0aGlzLl9Db21wb25lbnRzTWFwID0ge307XG5cbiAgICB0aGlzLl9jb21wb25lbnRQb29sID0ge307XG4gICAgdGhpcy5udW1Db21wb25lbnRzID0ge307XG4gICAgdGhpcy5uZXh0Q29tcG9uZW50SWQgPSAwO1xuICB9XG5cbiAgaGFzQ29tcG9uZW50KENvbXBvbmVudCkge1xuICAgIHJldHVybiB0aGlzLkNvbXBvbmVudHMuaW5kZXhPZihDb21wb25lbnQpICE9PSAtMTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tcG9uZW50KENvbXBvbmVudCwgb2JqZWN0UG9vbCkge1xuICAgIGlmICh0aGlzLkNvbXBvbmVudHMuaW5kZXhPZihDb21wb25lbnQpICE9PSAtMSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBgQ29tcG9uZW50IHR5cGU6ICcke0NvbXBvbmVudC5nZXROYW1lKCl9JyBhbHJlYWR5IHJlZ2lzdGVyZWQuYFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzY2hlbWEgPSBDb21wb25lbnQuc2NoZW1hO1xuXG4gICAgaWYgKCFzY2hlbWEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYENvbXBvbmVudCBcIiR7Q29tcG9uZW50LmdldE5hbWUoKX1cIiBoYXMgbm8gc2NoZW1hIHByb3BlcnR5LmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBwcm9wTmFtZSBpbiBzY2hlbWEpIHtcbiAgICAgIGNvbnN0IHByb3AgPSBzY2hlbWFbcHJvcE5hbWVdO1xuXG4gICAgICBpZiAoIXByb3AudHlwZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEludmFsaWQgc2NoZW1hIGZvciBjb21wb25lbnQgXCIke0NvbXBvbmVudC5nZXROYW1lKCl9XCIuIE1pc3NpbmcgdHlwZSBmb3IgXCIke3Byb3BOYW1lfVwiIHByb3BlcnR5LmBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBDb21wb25lbnQuX3R5cGVJZCA9IHRoaXMubmV4dENvbXBvbmVudElkKys7XG4gICAgdGhpcy5Db21wb25lbnRzLnB1c2goQ29tcG9uZW50KTtcbiAgICB0aGlzLl9Db21wb25lbnRzTWFwW0NvbXBvbmVudC5fdHlwZUlkXSA9IENvbXBvbmVudDtcbiAgICB0aGlzLm51bUNvbXBvbmVudHNbQ29tcG9uZW50Ll90eXBlSWRdID0gMDtcblxuICAgIGlmIChvYmplY3RQb29sID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9iamVjdFBvb2wgPSBuZXcgT2JqZWN0UG9vbChDb21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAob2JqZWN0UG9vbCA9PT0gZmFsc2UpIHtcbiAgICAgIG9iamVjdFBvb2wgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5fY29tcG9uZW50UG9vbFtDb21wb25lbnQuX3R5cGVJZF0gPSBvYmplY3RQb29sO1xuICB9XG5cbiAgY29tcG9uZW50QWRkZWRUb0VudGl0eShDb21wb25lbnQpIHtcbiAgICB0aGlzLm51bUNvbXBvbmVudHNbQ29tcG9uZW50Ll90eXBlSWRdKys7XG4gIH1cblxuICBjb21wb25lbnRSZW1vdmVkRnJvbUVudGl0eShDb21wb25lbnQpIHtcbiAgICB0aGlzLm51bUNvbXBvbmVudHNbQ29tcG9uZW50Ll90eXBlSWRdLS07XG4gIH1cblxuICBnZXRDb21wb25lbnRzUG9vbChDb21wb25lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50UG9vbFtDb21wb25lbnQuX3R5cGVJZF07XG4gIH1cbn1cbiIsImltcG9ydCBRdWVyeSBmcm9tIFwiLi9RdWVyeS5qc1wiO1xuaW1wb3J0IHdyYXBJbW11dGFibGVDb21wb25lbnQgZnJvbSBcIi4vV3JhcEltbXV0YWJsZUNvbXBvbmVudC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRW50aXR5IHtcbiAgY29uc3RydWN0b3IoZW50aXR5TWFuYWdlcikge1xuICAgIHRoaXMuX2VudGl0eU1hbmFnZXIgPSBlbnRpdHlNYW5hZ2VyIHx8IG51bGw7XG5cbiAgICAvLyBVbmlxdWUgSUQgZm9yIHRoaXMgZW50aXR5XG4gICAgdGhpcy5pZCA9IGVudGl0eU1hbmFnZXIuX25leHRFbnRpdHlJZCsrO1xuXG4gICAgLy8gTGlzdCBvZiBjb21wb25lbnRzIHR5cGVzIHRoZSBlbnRpdHkgaGFzXG4gICAgdGhpcy5fQ29tcG9uZW50VHlwZXMgPSBbXTtcblxuICAgIC8vIEluc3RhbmNlIG9mIHRoZSBjb21wb25lbnRzXG4gICAgdGhpcy5fY29tcG9uZW50cyA9IHt9O1xuXG4gICAgdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlID0ge307XG5cbiAgICAvLyBRdWVyaWVzIHdoZXJlIHRoZSBlbnRpdHkgaXMgYWRkZWRcbiAgICB0aGlzLnF1ZXJpZXMgPSBbXTtcblxuICAgIC8vIFVzZWQgZm9yIGRlZmVycmVkIHJlbW92YWxcbiAgICB0aGlzLl9Db21wb25lbnRUeXBlc1RvUmVtb3ZlID0gW107XG5cbiAgICB0aGlzLmFsaXZlID0gZmFsc2U7XG5cbiAgICAvL2lmIHRoZXJlIGFyZSBzdGF0ZSBjb21wb25lbnRzIG9uIGEgZW50aXR5LCBpdCBjYW4ndCBiZSByZW1vdmVkIGNvbXBsZXRlbHlcbiAgICB0aGlzLm51bVN0YXRlQ29tcG9uZW50cyA9IDA7XG4gIH1cblxuICAvLyBDT01QT05FTlRTXG5cbiAgZ2V0Q29tcG9uZW50KENvbXBvbmVudCwgaW5jbHVkZVJlbW92ZWQpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1tDb21wb25lbnQuX3R5cGVJZF07XG5cbiAgICBpZiAoIWNvbXBvbmVudCAmJiBpbmNsdWRlUmVtb3ZlZCA9PT0gdHJ1ZSkge1xuICAgICAgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlW0NvbXBvbmVudC5fdHlwZUlkXTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiXG4gICAgICA/IHdyYXBJbW11dGFibGVDb21wb25lbnQoQ29tcG9uZW50LCBjb21wb25lbnQpXG4gICAgICA6IGNvbXBvbmVudDtcbiAgfVxuXG4gIGdldFJlbW92ZWRDb21wb25lbnQoQ29tcG9uZW50KSB7XG4gICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlW0NvbXBvbmVudC5fdHlwZUlkXTtcblxuICAgIHJldHVybiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCJcbiAgICAgID8gd3JhcEltbXV0YWJsZUNvbXBvbmVudChDb21wb25lbnQsIGNvbXBvbmVudClcbiAgICAgIDogY29tcG9uZW50O1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50cygpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50cztcbiAgfVxuXG4gIGdldENvbXBvbmVudHNUb1JlbW92ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50VHlwZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX0NvbXBvbmVudFR5cGVzO1xuICB9XG5cbiAgZ2V0TXV0YWJsZUNvbXBvbmVudChDb21wb25lbnQpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1tDb21wb25lbnQuX3R5cGVJZF07XG5cbiAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcXVlcnkgPSB0aGlzLnF1ZXJpZXNbaV07XG4gICAgICAvLyBAdG9kbyBhY2NlbGVyYXRlIHRoaXMgY2hlY2suIE1heWJlIGhhdmluZyBxdWVyeS5fQ29tcG9uZW50cyBhcyBhbiBvYmplY3RcbiAgICAgIC8vIEB0b2RvIGFkZCBOb3QgY29tcG9uZW50c1xuICAgICAgaWYgKHF1ZXJ5LnJlYWN0aXZlICYmIHF1ZXJ5LkNvbXBvbmVudHMuaW5kZXhPZihDb21wb25lbnQpICE9PSAtMSkge1xuICAgICAgICBxdWVyeS5ldmVudERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICBRdWVyeS5wcm90b3R5cGUuQ09NUE9ORU5UX0NIQU5HRUQsXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgICBjb21wb25lbnRcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgfVxuXG4gIGFkZENvbXBvbmVudChDb21wb25lbnQsIHZhbHVlcykge1xuICAgIHRoaXMuX2VudGl0eU1hbmFnZXIuZW50aXR5QWRkQ29tcG9uZW50KHRoaXMsIENvbXBvbmVudCwgdmFsdWVzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlbW92ZUNvbXBvbmVudChDb21wb25lbnQsIGZvcmNlSW1tZWRpYXRlKSB7XG4gICAgdGhpcy5fZW50aXR5TWFuYWdlci5lbnRpdHlSZW1vdmVDb21wb25lbnQodGhpcywgQ29tcG9uZW50LCBmb3JjZUltbWVkaWF0ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBoYXNDb21wb25lbnQoQ29tcG9uZW50LCBpbmNsdWRlUmVtb3ZlZCkge1xuICAgIHJldHVybiAoXG4gICAgICAhIX50aGlzLl9Db21wb25lbnRUeXBlcy5pbmRleE9mKENvbXBvbmVudCkgfHxcbiAgICAgIChpbmNsdWRlUmVtb3ZlZCA9PT0gdHJ1ZSAmJiB0aGlzLmhhc1JlbW92ZWRDb21wb25lbnQoQ29tcG9uZW50KSlcbiAgICApO1xuICB9XG5cbiAgaGFzUmVtb3ZlZENvbXBvbmVudChDb21wb25lbnQpIHtcbiAgICByZXR1cm4gISF+dGhpcy5fQ29tcG9uZW50VHlwZXNUb1JlbW92ZS5pbmRleE9mKENvbXBvbmVudCk7XG4gIH1cblxuICBoYXNBbGxDb21wb25lbnRzKENvbXBvbmVudHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IENvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghdGhpcy5oYXNDb21wb25lbnQoQ29tcG9uZW50c1tpXSkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBoYXNBbnlDb21wb25lbnRzKENvbXBvbmVudHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IENvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmhhc0NvbXBvbmVudChDb21wb25lbnRzW2ldKSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJlbW92ZUFsbENvbXBvbmVudHMoZm9yY2VJbW1lZGlhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5fZW50aXR5TWFuYWdlci5lbnRpdHlSZW1vdmVBbGxDb21wb25lbnRzKHRoaXMsIGZvcmNlSW1tZWRpYXRlKTtcbiAgfVxuXG4gIGNvcHkoc3JjKSB7XG4gICAgLy8gVE9ETzogVGhpcyBjYW4gZGVmaW5pdGVseSBiZSBvcHRpbWl6ZWRcbiAgICBmb3IgKHZhciBlY3N5Q29tcG9uZW50SWQgaW4gc3JjLl9jb21wb25lbnRzKSB7XG4gICAgICB2YXIgc3JjQ29tcG9uZW50ID0gc3JjLl9jb21wb25lbnRzW2Vjc3lDb21wb25lbnRJZF07XG4gICAgICB0aGlzLmFkZENvbXBvbmVudChzcmNDb21wb25lbnQuY29uc3RydWN0b3IpO1xuICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuZ2V0Q29tcG9uZW50KHNyY0NvbXBvbmVudC5jb25zdHJ1Y3Rvcik7XG4gICAgICBjb21wb25lbnQuY29weShzcmNDb21wb25lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBFbnRpdHkodGhpcy5fZW50aXR5TWFuYWdlcikuY29weSh0aGlzKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuaWQgPSB0aGlzLl9lbnRpdHlNYW5hZ2VyLl9uZXh0RW50aXR5SWQrKztcbiAgICB0aGlzLl9Db21wb25lbnRUeXBlcy5sZW5ndGggPSAwO1xuICAgIHRoaXMucXVlcmllcy5sZW5ndGggPSAwO1xuXG4gICAgZm9yICh2YXIgZWNzeUNvbXBvbmVudElkIGluIHRoaXMuX2NvbXBvbmVudHMpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb21wb25lbnRzW2Vjc3lDb21wb25lbnRJZF07XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKGZvcmNlSW1tZWRpYXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0eU1hbmFnZXIucmVtb3ZlRW50aXR5KHRoaXMsIGZvcmNlSW1tZWRpYXRlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JqZWN0UG9vbCB9IGZyb20gXCIuL09iamVjdFBvb2wuanNcIjtcbmltcG9ydCBRdWVyeU1hbmFnZXIgZnJvbSBcIi4vUXVlcnlNYW5hZ2VyLmpzXCI7XG5pbXBvcnQgRXZlbnREaXNwYXRjaGVyIGZyb20gXCIuL0V2ZW50RGlzcGF0Y2hlci5qc1wiO1xuaW1wb3J0IHsgU3lzdGVtU3RhdGVDb21wb25lbnQgfSBmcm9tIFwiLi9TeXN0ZW1TdGF0ZUNvbXBvbmVudC5qc1wiO1xuXG5jbGFzcyBFbnRpdHlQb29sIGV4dGVuZHMgT2JqZWN0UG9vbCB7XG4gIGNvbnN0cnVjdG9yKGVudGl0eU1hbmFnZXIsIGVudGl0eUNsYXNzLCBpbml0aWFsU2l6ZSkge1xuICAgIHN1cGVyKGVudGl0eUNsYXNzLCB1bmRlZmluZWQpO1xuICAgIHRoaXMuZW50aXR5TWFuYWdlciA9IGVudGl0eU1hbmFnZXI7XG5cbiAgICBpZiAodHlwZW9mIGluaXRpYWxTaXplICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLmV4cGFuZChpbml0aWFsU2l6ZSk7XG4gICAgfVxuICB9XG5cbiAgZXhwYW5kKGNvdW50KSB7XG4gICAgZm9yICh2YXIgbiA9IDA7IG4gPCBjb3VudDsgbisrKSB7XG4gICAgICB2YXIgY2xvbmUgPSBuZXcgdGhpcy5UKHRoaXMuZW50aXR5TWFuYWdlcik7XG4gICAgICBjbG9uZS5fcG9vbCA9IHRoaXM7XG4gICAgICB0aGlzLmZyZWVMaXN0LnB1c2goY2xvbmUpO1xuICAgIH1cbiAgICB0aGlzLmNvdW50ICs9IGNvdW50O1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBjbGFzcyBFbnRpdHlNYW5hZ2VyXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRpdHlNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3Iod29ybGQpIHtcbiAgICB0aGlzLndvcmxkID0gd29ybGQ7XG4gICAgdGhpcy5jb21wb25lbnRzTWFuYWdlciA9IHdvcmxkLmNvbXBvbmVudHNNYW5hZ2VyO1xuXG4gICAgLy8gQWxsIHRoZSBlbnRpdGllcyBpbiB0aGlzIGluc3RhbmNlXG4gICAgdGhpcy5fZW50aXRpZXMgPSBbXTtcbiAgICB0aGlzLl9uZXh0RW50aXR5SWQgPSAwO1xuXG4gICAgdGhpcy5fZW50aXRpZXNCeU5hbWVzID0ge307XG5cbiAgICB0aGlzLl9xdWVyeU1hbmFnZXIgPSBuZXcgUXVlcnlNYW5hZ2VyKHRoaXMpO1xuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyID0gbmV3IEV2ZW50RGlzcGF0Y2hlcigpO1xuICAgIHRoaXMuX2VudGl0eVBvb2wgPSBuZXcgRW50aXR5UG9vbChcbiAgICAgIHRoaXMsXG4gICAgICB0aGlzLndvcmxkLm9wdGlvbnMuZW50aXR5Q2xhc3MsXG4gICAgICB0aGlzLndvcmxkLm9wdGlvbnMuZW50aXR5UG9vbFNpemVcbiAgICApO1xuXG4gICAgLy8gRGVmZXJyZWQgZGVsZXRpb25cbiAgICB0aGlzLmVudGl0aWVzV2l0aENvbXBvbmVudHNUb1JlbW92ZSA9IFtdO1xuICAgIHRoaXMuZW50aXRpZXNUb1JlbW92ZSA9IFtdO1xuICAgIHRoaXMuZGVmZXJyZWRSZW1vdmFsRW5hYmxlZCA9IHRydWU7XG4gIH1cblxuICBnZXRFbnRpdHlCeU5hbWUobmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9lbnRpdGllc0J5TmFtZXNbbmFtZV07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGVudGl0eVxuICAgKi9cbiAgY3JlYXRlRW50aXR5KG5hbWUpIHtcbiAgICB2YXIgZW50aXR5ID0gdGhpcy5fZW50aXR5UG9vbC5hY3F1aXJlKCk7XG4gICAgZW50aXR5LmFsaXZlID0gdHJ1ZTtcbiAgICBlbnRpdHkubmFtZSA9IG5hbWUgfHwgXCJcIjtcbiAgICBpZiAobmFtZSkge1xuICAgICAgaWYgKHRoaXMuX2VudGl0aWVzQnlOYW1lc1tuYW1lXSkge1xuICAgICAgICBjb25zb2xlLndhcm4oYEVudGl0eSBuYW1lICcke25hbWV9JyBhbHJlYWR5IGV4aXN0YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbnRpdGllc0J5TmFtZXNbbmFtZV0gPSBlbnRpdHk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fZW50aXRpZXMucHVzaChlbnRpdHkpO1xuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoRU5USVRZX0NSRUFURUQsIGVudGl0eSk7XG4gICAgcmV0dXJuIGVudGl0eTtcbiAgfVxuXG4gIC8vIENPTVBPTkVOVFNcblxuICAvKipcbiAgICogQWRkIGEgY29tcG9uZW50IHRvIGFuIGVudGl0eVxuICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5IEVudGl0eSB3aGVyZSB0aGUgY29tcG9uZW50IHdpbGwgYmUgYWRkZWRcbiAgICogQHBhcmFtIHtDb21wb25lbnR9IENvbXBvbmVudCBDb21wb25lbnQgdG8gYmUgYWRkZWQgdG8gdGhlIGVudGl0eVxuICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzIE9wdGlvbmFsIHZhbHVlcyB0byByZXBsYWNlIHRoZSBkZWZhdWx0IGF0dHJpYnV0ZXNcbiAgICovXG4gIGVudGl0eUFkZENvbXBvbmVudChlbnRpdHksIENvbXBvbmVudCwgdmFsdWVzKSB7XG4gICAgLy8gQHRvZG8gUHJvYmFibHkgZGVmaW5lIENvbXBvbmVudC5fdHlwZUlkIHdpdGggYSBkZWZhdWx0IHZhbHVlIGFuZCBhdm9pZCB1c2luZyB0eXBlb2ZcbiAgICBpZiAoXG4gICAgICB0eXBlb2YgQ29tcG9uZW50Ll90eXBlSWQgPT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICF0aGlzLndvcmxkLmNvbXBvbmVudHNNYW5hZ2VyLl9Db21wb25lbnRzTWFwW0NvbXBvbmVudC5fdHlwZUlkXVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgQXR0ZW1wdGVkIHRvIGFkZCB1bnJlZ2lzdGVyZWQgY29tcG9uZW50IFwiJHtDb21wb25lbnQuZ2V0TmFtZSgpfVwiYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAofmVudGl0eS5fQ29tcG9uZW50VHlwZXMuaW5kZXhPZihDb21wb25lbnQpKSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBcIkNvbXBvbmVudCB0eXBlIGFscmVhZHkgZXhpc3RzIG9uIGVudGl0eS5cIixcbiAgICAgICAgICBlbnRpdHksXG4gICAgICAgICAgQ29tcG9uZW50LmdldE5hbWUoKVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGVudGl0eS5fQ29tcG9uZW50VHlwZXMucHVzaChDb21wb25lbnQpO1xuXG4gICAgaWYgKENvbXBvbmVudC5fX3Byb3RvX18gPT09IFN5c3RlbVN0YXRlQ29tcG9uZW50KSB7XG4gICAgICBlbnRpdHkubnVtU3RhdGVDb21wb25lbnRzKys7XG4gICAgfVxuXG4gICAgdmFyIGNvbXBvbmVudFBvb2wgPSB0aGlzLndvcmxkLmNvbXBvbmVudHNNYW5hZ2VyLmdldENvbXBvbmVudHNQb29sKFxuICAgICAgQ29tcG9uZW50XG4gICAgKTtcblxuICAgIHZhciBjb21wb25lbnQgPSBjb21wb25lbnRQb29sXG4gICAgICA/IGNvbXBvbmVudFBvb2wuYWNxdWlyZSgpXG4gICAgICA6IG5ldyBDb21wb25lbnQodmFsdWVzKTtcblxuICAgIGlmIChjb21wb25lbnRQb29sICYmIHZhbHVlcykge1xuICAgICAgY29tcG9uZW50LmNvcHkodmFsdWVzKTtcbiAgICB9XG5cbiAgICBlbnRpdHkuX2NvbXBvbmVudHNbQ29tcG9uZW50Ll90eXBlSWRdID0gY29tcG9uZW50O1xuXG4gICAgdGhpcy5fcXVlcnlNYW5hZ2VyLm9uRW50aXR5Q29tcG9uZW50QWRkZWQoZW50aXR5LCBDb21wb25lbnQpO1xuICAgIHRoaXMud29ybGQuY29tcG9uZW50c01hbmFnZXIuY29tcG9uZW50QWRkZWRUb0VudGl0eShDb21wb25lbnQpO1xuXG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChDT01QT05FTlRfQURERUQsIGVudGl0eSwgQ29tcG9uZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBjb21wb25lbnQgZnJvbSBhbiBlbnRpdHlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgd2hpY2ggd2lsbCBnZXQgcmVtb3ZlZCB0aGUgY29tcG9uZW50XG4gICAqIEBwYXJhbSB7Kn0gQ29tcG9uZW50IENvbXBvbmVudCB0byByZW1vdmUgZnJvbSB0aGUgZW50aXR5XG4gICAqIEBwYXJhbSB7Qm9vbH0gaW1tZWRpYXRlbHkgSWYgeW91IHdhbnQgdG8gcmVtb3ZlIHRoZSBjb21wb25lbnQgaW1tZWRpYXRlbHkgaW5zdGVhZCBvZiBkZWZlcnJlZCAoRGVmYXVsdCBpcyBmYWxzZSlcbiAgICovXG4gIGVudGl0eVJlbW92ZUNvbXBvbmVudChlbnRpdHksIENvbXBvbmVudCwgaW1tZWRpYXRlbHkpIHtcbiAgICB2YXIgaW5kZXggPSBlbnRpdHkuX0NvbXBvbmVudFR5cGVzLmluZGV4T2YoQ29tcG9uZW50KTtcbiAgICBpZiAoIX5pbmRleCkgcmV0dXJuO1xuXG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChDT01QT05FTlRfUkVNT1ZFLCBlbnRpdHksIENvbXBvbmVudCk7XG5cbiAgICBpZiAoaW1tZWRpYXRlbHkpIHtcbiAgICAgIHRoaXMuX2VudGl0eVJlbW92ZUNvbXBvbmVudFN5bmMoZW50aXR5LCBDb21wb25lbnQsIGluZGV4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGVudGl0eS5fQ29tcG9uZW50VHlwZXNUb1JlbW92ZS5sZW5ndGggPT09IDApXG4gICAgICAgIHRoaXMuZW50aXRpZXNXaXRoQ29tcG9uZW50c1RvUmVtb3ZlLnB1c2goZW50aXR5KTtcblxuICAgICAgZW50aXR5Ll9Db21wb25lbnRUeXBlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgZW50aXR5Ll9Db21wb25lbnRUeXBlc1RvUmVtb3ZlLnB1c2goQ29tcG9uZW50KTtcblxuICAgICAgZW50aXR5Ll9jb21wb25lbnRzVG9SZW1vdmVbQ29tcG9uZW50Ll90eXBlSWRdID1cbiAgICAgICAgZW50aXR5Ll9jb21wb25lbnRzW0NvbXBvbmVudC5fdHlwZUlkXTtcbiAgICAgIGRlbGV0ZSBlbnRpdHkuX2NvbXBvbmVudHNbQ29tcG9uZW50Ll90eXBlSWRdO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGVhY2ggaW5kZXhlZCBxdWVyeSB0byBzZWUgaWYgd2UgbmVlZCB0byByZW1vdmUgaXRcbiAgICB0aGlzLl9xdWVyeU1hbmFnZXIub25FbnRpdHlDb21wb25lbnRSZW1vdmVkKGVudGl0eSwgQ29tcG9uZW50KTtcblxuICAgIGlmIChDb21wb25lbnQuX19wcm90b19fID09PSBTeXN0ZW1TdGF0ZUNvbXBvbmVudCkge1xuICAgICAgZW50aXR5Lm51bVN0YXRlQ29tcG9uZW50cy0tO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgZW50aXR5IHdhcyBhIGdob3N0IHdhaXRpbmcgZm9yIHRoZSBsYXN0IHN5c3RlbSBzdGF0ZSBjb21wb25lbnQgdG8gYmUgcmVtb3ZlZFxuICAgICAgaWYgKGVudGl0eS5udW1TdGF0ZUNvbXBvbmVudHMgPT09IDAgJiYgIWVudGl0eS5hbGl2ZSkge1xuICAgICAgICBlbnRpdHkucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2VudGl0eVJlbW92ZUNvbXBvbmVudFN5bmMoZW50aXR5LCBDb21wb25lbnQsIGluZGV4KSB7XG4gICAgLy8gUmVtb3ZlIFQgbGlzdGluZyBvbiBlbnRpdHkgYW5kIHByb3BlcnR5IHJlZiwgdGhlbiBmcmVlIHRoZSBjb21wb25lbnQuXG4gICAgZW50aXR5Ll9Db21wb25lbnRUeXBlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuX2NvbXBvbmVudHNbQ29tcG9uZW50Ll90eXBlSWRdO1xuICAgIGRlbGV0ZSBlbnRpdHkuX2NvbXBvbmVudHNbQ29tcG9uZW50Ll90eXBlSWRdO1xuICAgIGNvbXBvbmVudC5kaXNwb3NlKCk7XG4gICAgdGhpcy53b3JsZC5jb21wb25lbnRzTWFuYWdlci5jb21wb25lbnRSZW1vdmVkRnJvbUVudGl0eShDb21wb25lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgdGhlIGNvbXBvbmVudHMgZnJvbSBhbiBlbnRpdHlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgZnJvbSB3aGljaCB0aGUgY29tcG9uZW50cyB3aWxsIGJlIHJlbW92ZWRcbiAgICovXG4gIGVudGl0eVJlbW92ZUFsbENvbXBvbmVudHMoZW50aXR5LCBpbW1lZGlhdGVseSkge1xuICAgIGxldCBDb21wb25lbnRzID0gZW50aXR5Ll9Db21wb25lbnRUeXBlcztcblxuICAgIGZvciAobGV0IGogPSBDb21wb25lbnRzLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICBpZiAoQ29tcG9uZW50c1tqXS5fX3Byb3RvX18gIT09IFN5c3RlbVN0YXRlQ29tcG9uZW50KVxuICAgICAgICB0aGlzLmVudGl0eVJlbW92ZUNvbXBvbmVudChlbnRpdHksIENvbXBvbmVudHNbal0sIGltbWVkaWF0ZWx5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBlbnRpdHkgZnJvbSB0aGlzIG1hbmFnZXIuIEl0IHdpbGwgY2xlYXIgYWxzbyBpdHMgY29tcG9uZW50c1xuICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5IEVudGl0eSB0byByZW1vdmUgZnJvbSB0aGUgbWFuYWdlclxuICAgKiBAcGFyYW0ge0Jvb2x9IGltbWVkaWF0ZWx5IElmIHlvdSB3YW50IHRvIHJlbW92ZSB0aGUgY29tcG9uZW50IGltbWVkaWF0ZWx5IGluc3RlYWQgb2YgZGVmZXJyZWQgKERlZmF1bHQgaXMgZmFsc2UpXG4gICAqL1xuICByZW1vdmVFbnRpdHkoZW50aXR5LCBpbW1lZGlhdGVseSkge1xuICAgIHZhciBpbmRleCA9IHRoaXMuX2VudGl0aWVzLmluZGV4T2YoZW50aXR5KTtcblxuICAgIGlmICghfmluZGV4KSB0aHJvdyBuZXcgRXJyb3IoXCJUcmllZCB0byByZW1vdmUgZW50aXR5IG5vdCBpbiBsaXN0XCIpO1xuXG4gICAgZW50aXR5LmFsaXZlID0gZmFsc2U7XG4gICAgdGhpcy5lbnRpdHlSZW1vdmVBbGxDb21wb25lbnRzKGVudGl0eSwgaW1tZWRpYXRlbHkpO1xuXG4gICAgaWYgKGVudGl0eS5udW1TdGF0ZUNvbXBvbmVudHMgPT09IDApIHtcbiAgICAgIC8vIFJlbW92ZSBmcm9tIGVudGl0eSBsaXN0XG4gICAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KEVOVElUWV9SRU1PVkVELCBlbnRpdHkpO1xuICAgICAgdGhpcy5fcXVlcnlNYW5hZ2VyLm9uRW50aXR5UmVtb3ZlZChlbnRpdHkpO1xuICAgICAgaWYgKGltbWVkaWF0ZWx5ID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuX3JlbGVhc2VFbnRpdHkoZW50aXR5LCBpbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVudGl0aWVzVG9SZW1vdmUucHVzaChlbnRpdHkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9yZWxlYXNlRW50aXR5KGVudGl0eSwgaW5kZXgpIHtcbiAgICB0aGlzLl9lbnRpdGllcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgaWYgKHRoaXMuX2VudGl0aWVzQnlOYW1lc1tlbnRpdHkubmFtZV0pIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9lbnRpdGllc0J5TmFtZXNbZW50aXR5Lm5hbWVdO1xuICAgIH1cbiAgICBlbnRpdHkuX3Bvb2wucmVsZWFzZShlbnRpdHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgZW50aXRpZXMgZnJvbSB0aGlzIG1hbmFnZXJcbiAgICovXG4gIHJlbW92ZUFsbEVudGl0aWVzKCkge1xuICAgIGZvciAodmFyIGkgPSB0aGlzLl9lbnRpdGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdGhpcy5yZW1vdmVFbnRpdHkodGhpcy5fZW50aXRpZXNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3NEZWZlcnJlZFJlbW92YWwoKSB7XG4gICAgaWYgKCF0aGlzLmRlZmVycmVkUmVtb3ZhbEVuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXNUb1JlbW92ZS5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRoaXMuZW50aXRpZXNUb1JlbW92ZVtpXTtcbiAgICAgIGxldCBpbmRleCA9IHRoaXMuX2VudGl0aWVzLmluZGV4T2YoZW50aXR5KTtcbiAgICAgIHRoaXMuX3JlbGVhc2VFbnRpdHkoZW50aXR5LCBpbmRleCk7XG4gICAgfVxuICAgIHRoaXMuZW50aXRpZXNUb1JlbW92ZS5sZW5ndGggPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVudGl0aWVzV2l0aENvbXBvbmVudHNUb1JlbW92ZS5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRoaXMuZW50aXRpZXNXaXRoQ29tcG9uZW50c1RvUmVtb3ZlW2ldO1xuICAgICAgd2hpbGUgKGVudGl0eS5fQ29tcG9uZW50VHlwZXNUb1JlbW92ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBDb21wb25lbnQgPSBlbnRpdHkuX0NvbXBvbmVudFR5cGVzVG9SZW1vdmUucG9wKCk7XG5cbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5fY29tcG9uZW50c1RvUmVtb3ZlW0NvbXBvbmVudC5fdHlwZUlkXTtcbiAgICAgICAgZGVsZXRlIGVudGl0eS5fY29tcG9uZW50c1RvUmVtb3ZlW0NvbXBvbmVudC5fdHlwZUlkXTtcbiAgICAgICAgY29tcG9uZW50LmRpc3Bvc2UoKTtcbiAgICAgICAgdGhpcy53b3JsZC5jb21wb25lbnRzTWFuYWdlci5jb21wb25lbnRSZW1vdmVkRnJvbUVudGl0eShDb21wb25lbnQpO1xuXG4gICAgICAgIC8vdGhpcy5fZW50aXR5UmVtb3ZlQ29tcG9uZW50U3luYyhlbnRpdHksIENvbXBvbmVudCwgaW5kZXgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZW50aXRpZXNXaXRoQ29tcG9uZW50c1RvUmVtb3ZlLmxlbmd0aCA9IDA7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgcXVlcnkgYmFzZWQgb24gYSBsaXN0IG9mIGNvbXBvbmVudHNcbiAgICogQHBhcmFtIHtBcnJheShDb21wb25lbnQpfSBDb21wb25lbnRzIExpc3Qgb2YgY29tcG9uZW50cyB0aGF0IHdpbGwgZm9ybSB0aGUgcXVlcnlcbiAgICovXG4gIHF1ZXJ5Q29tcG9uZW50cyhDb21wb25lbnRzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXJ5TWFuYWdlci5nZXRRdWVyeShDb21wb25lbnRzKTtcbiAgfVxuXG4gIC8vIEVYVFJBU1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gbnVtYmVyIG9mIGVudGl0aWVzXG4gICAqL1xuICBjb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW50aXRpZXMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBzb21lIHN0YXRzXG4gICAqL1xuICBzdGF0cygpIHtcbiAgICB2YXIgc3RhdHMgPSB7XG4gICAgICBudW1FbnRpdGllczogdGhpcy5fZW50aXRpZXMubGVuZ3RoLFxuICAgICAgbnVtUXVlcmllczogT2JqZWN0LmtleXModGhpcy5fcXVlcnlNYW5hZ2VyLl9xdWVyaWVzKS5sZW5ndGgsXG4gICAgICBxdWVyaWVzOiB0aGlzLl9xdWVyeU1hbmFnZXIuc3RhdHMoKSxcbiAgICAgIG51bUNvbXBvbmVudFBvb2w6IE9iamVjdC5rZXlzKHRoaXMuY29tcG9uZW50c01hbmFnZXIuX2NvbXBvbmVudFBvb2wpXG4gICAgICAgIC5sZW5ndGgsXG4gICAgICBjb21wb25lbnRQb29sOiB7fSxcbiAgICAgIGV2ZW50RGlzcGF0Y2hlcjogdGhpcy5ldmVudERpc3BhdGNoZXIuc3RhdHMsXG4gICAgfTtcblxuICAgIGZvciAodmFyIGVjc3lDb21wb25lbnRJZCBpbiB0aGlzLmNvbXBvbmVudHNNYW5hZ2VyLl9jb21wb25lbnRQb29sKSB7XG4gICAgICB2YXIgcG9vbCA9IHRoaXMuY29tcG9uZW50c01hbmFnZXIuX2NvbXBvbmVudFBvb2xbZWNzeUNvbXBvbmVudElkXTtcbiAgICAgIHN0YXRzLmNvbXBvbmVudFBvb2xbcG9vbC5ULmdldE5hbWUoKV0gPSB7XG4gICAgICAgIHVzZWQ6IHBvb2wudG90YWxVc2VkKCksXG4gICAgICAgIHNpemU6IHBvb2wuY291bnQsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0cztcbiAgfVxufVxuXG5jb25zdCBFTlRJVFlfQ1JFQVRFRCA9IFwiRW50aXR5TWFuYWdlciNFTlRJVFlfQ1JFQVRFXCI7XG5jb25zdCBFTlRJVFlfUkVNT1ZFRCA9IFwiRW50aXR5TWFuYWdlciNFTlRJVFlfUkVNT1ZFRFwiO1xuY29uc3QgQ09NUE9ORU5UX0FEREVEID0gXCJFbnRpdHlNYW5hZ2VyI0NPTVBPTkVOVF9BRERFRFwiO1xuY29uc3QgQ09NUE9ORU5UX1JFTU9WRSA9IFwiRW50aXR5TWFuYWdlciNDT01QT05FTlRfUkVNT1ZFXCI7XG4iLCIvKipcbiAqIEBwcml2YXRlXG4gKiBAY2xhc3MgRXZlbnREaXNwYXRjaGVyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50RGlzcGF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuICAgIHRoaXMuc3RhdHMgPSB7XG4gICAgICBmaXJlZDogMCxcbiAgICAgIGhhbmRsZWQ6IDAsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gZXZlbnQgbGlzdGVuZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBsaXN0ZW5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgQ2FsbGJhY2sgdG8gdHJpZ2dlciB3aGVuIHRoZSBldmVudCBpcyBmaXJlZFxuICAgKi9cbiAgYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyKSB7XG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcbiAgICBpZiAobGlzdGVuZXJzW2V2ZW50TmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgbGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICB9XG5cbiAgICBpZiAobGlzdGVuZXJzW2V2ZW50TmFtZV0uaW5kZXhPZihsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgICBsaXN0ZW5lcnNbZXZlbnROYW1lXS5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYW4gZXZlbnQgbGlzdGVuZXIgaXMgYWxyZWFkeSBhZGRlZCB0byB0aGUgbGlzdCBvZiBsaXN0ZW5lcnNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBjaGVja1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBDYWxsYmFjayBmb3IgdGhlIHNwZWNpZmllZCBldmVudFxuICAgKi9cbiAgaGFzRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdLmluZGV4T2YobGlzdGVuZXIpICE9PSAtMVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGV2ZW50IGxpc3RlbmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIENhbGxiYWNrIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50XG4gICAqL1xuICByZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgbGlzdGVuZXIpIHtcbiAgICB2YXIgbGlzdGVuZXJBcnJheSA9IHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgIGlmIChsaXN0ZW5lckFycmF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBpbmRleCA9IGxpc3RlbmVyQXJyYXkuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIGxpc3RlbmVyQXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYW4gZXZlbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBkaXNwYXRjaFxuICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5IChPcHRpb25hbCkgRW50aXR5IHRvIGVtaXRcbiAgICogQHBhcmFtIHtDb21wb25lbnR9IGNvbXBvbmVudFxuICAgKi9cbiAgZGlzcGF0Y2hFdmVudChldmVudE5hbWUsIGVudGl0eSwgY29tcG9uZW50KSB7XG4gICAgdGhpcy5zdGF0cy5maXJlZCsrO1xuXG4gICAgdmFyIGxpc3RlbmVyQXJyYXkgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICBpZiAobGlzdGVuZXJBcnJheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgYXJyYXkgPSBsaXN0ZW5lckFycmF5LnNsaWNlKDApO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFycmF5W2ldLmNhbGwodGhpcywgZW50aXR5LCBjb21wb25lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCBzdGF0cyBjb3VudGVyc1xuICAgKi9cbiAgcmVzZXRDb3VudGVycygpIHtcbiAgICB0aGlzLnN0YXRzLmZpcmVkID0gdGhpcy5zdGF0cy5oYW5kbGVkID0gMDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIE9iamVjdFBvb2wge1xuICAvLyBAdG9kbyBBZGQgaW5pdGlhbCBzaXplXG4gIGNvbnN0cnVjdG9yKFQsIGluaXRpYWxTaXplKSB7XG4gICAgdGhpcy5mcmVlTGlzdCA9IFtdO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHRoaXMuVCA9IFQ7XG4gICAgdGhpcy5pc09iamVjdFBvb2wgPSB0cnVlO1xuXG4gICAgaWYgKHR5cGVvZiBpbml0aWFsU2l6ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5leHBhbmQoaW5pdGlhbFNpemUpO1xuICAgIH1cbiAgfVxuXG4gIGFjcXVpcmUoKSB7XG4gICAgLy8gR3JvdyB0aGUgbGlzdCBieSAyMCVpc2ggaWYgd2UncmUgb3V0XG4gICAgaWYgKHRoaXMuZnJlZUxpc3QubGVuZ3RoIDw9IDApIHtcbiAgICAgIHRoaXMuZXhwYW5kKE1hdGgucm91bmQodGhpcy5jb3VudCAqIDAuMikgKyAxKTtcbiAgICB9XG5cbiAgICB2YXIgaXRlbSA9IHRoaXMuZnJlZUxpc3QucG9wKCk7XG5cbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIHJlbGVhc2UoaXRlbSkge1xuICAgIGl0ZW0ucmVzZXQoKTtcbiAgICB0aGlzLmZyZWVMaXN0LnB1c2goaXRlbSk7XG4gIH1cblxuICBleHBhbmQoY291bnQpIHtcbiAgICBmb3IgKHZhciBuID0gMDsgbiA8IGNvdW50OyBuKyspIHtcbiAgICAgIHZhciBjbG9uZSA9IG5ldyB0aGlzLlQoKTtcbiAgICAgIGNsb25lLl9wb29sID0gdGhpcztcbiAgICAgIHRoaXMuZnJlZUxpc3QucHVzaChjbG9uZSk7XG4gICAgfVxuICAgIHRoaXMuY291bnQgKz0gY291bnQ7XG4gIH1cblxuICB0b3RhbFNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQ7XG4gIH1cblxuICB0b3RhbEZyZWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJlZUxpc3QubGVuZ3RoO1xuICB9XG5cbiAgdG90YWxVc2VkKCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50IC0gdGhpcy5mcmVlTGlzdC5sZW5ndGg7XG4gIH1cbn1cbiIsImltcG9ydCBFdmVudERpc3BhdGNoZXIgZnJvbSBcIi4vRXZlbnREaXNwYXRjaGVyLmpzXCI7XG5pbXBvcnQgeyBxdWVyeUtleSB9IGZyb20gXCIuL1V0aWxzLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXkoQ29tcG9uZW50KX0gQ29tcG9uZW50cyBMaXN0IG9mIHR5cGVzIG9mIGNvbXBvbmVudHMgdG8gcXVlcnlcbiAgICovXG4gIGNvbnN0cnVjdG9yKENvbXBvbmVudHMsIG1hbmFnZXIpIHtcbiAgICB0aGlzLkNvbXBvbmVudHMgPSBbXTtcbiAgICB0aGlzLk5vdENvbXBvbmVudHMgPSBbXTtcblxuICAgIENvbXBvbmVudHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGNvbXBvbmVudCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICB0aGlzLk5vdENvbXBvbmVudHMucHVzaChjb21wb25lbnQuQ29tcG9uZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuQ29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5Db21wb25lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY3JlYXRlIGEgcXVlcnkgd2l0aG91dCBjb21wb25lbnRzXCIpO1xuICAgIH1cblxuICAgIHRoaXMuZW50aXRpZXMgPSBbXTtcblxuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyID0gbmV3IEV2ZW50RGlzcGF0Y2hlcigpO1xuXG4gICAgLy8gVGhpcyBxdWVyeSBpcyBiZWluZyB1c2VkIGJ5IGEgcmVhY3RpdmUgc3lzdGVtXG4gICAgdGhpcy5yZWFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5rZXkgPSBxdWVyeUtleShDb21wb25lbnRzKTtcblxuICAgIC8vIEZpbGwgdGhlIHF1ZXJ5IHdpdGggdGhlIGV4aXN0aW5nIGVudGl0aWVzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYW5hZ2VyLl9lbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVudGl0eSA9IG1hbmFnZXIuX2VudGl0aWVzW2ldO1xuICAgICAgaWYgKHRoaXMubWF0Y2goZW50aXR5KSkge1xuICAgICAgICAvLyBAdG9kbyA/Pz8gdGhpcy5hZGRFbnRpdHkoZW50aXR5KTsgPT4gcHJldmVudGluZyB0aGUgZXZlbnQgdG8gYmUgZ2VuZXJhdGVkXG4gICAgICAgIGVudGl0eS5xdWVyaWVzLnB1c2godGhpcyk7XG4gICAgICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgZW50aXR5IHRvIHRoaXMgcXVlcnlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eVxuICAgKi9cbiAgYWRkRW50aXR5KGVudGl0eSkge1xuICAgIGVudGl0eS5xdWVyaWVzLnB1c2godGhpcyk7XG4gICAgdGhpcy5lbnRpdGllcy5wdXNoKGVudGl0eSk7XG5cbiAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KFF1ZXJ5LnByb3RvdHlwZS5FTlRJVFlfQURERUQsIGVudGl0eSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGVudGl0eSBmcm9tIHRoaXMgcXVlcnlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eVxuICAgKi9cbiAgcmVtb3ZlRW50aXR5KGVudGl0eSkge1xuICAgIGxldCBpbmRleCA9IHRoaXMuZW50aXRpZXMuaW5kZXhPZihlbnRpdHkpO1xuICAgIGlmICh+aW5kZXgpIHtcbiAgICAgIHRoaXMuZW50aXRpZXMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgaW5kZXggPSBlbnRpdHkucXVlcmllcy5pbmRleE9mKHRoaXMpO1xuICAgICAgZW50aXR5LnF1ZXJpZXMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgdGhpcy5ldmVudERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgUXVlcnkucHJvdG90eXBlLkVOVElUWV9SRU1PVkVELFxuICAgICAgICBlbnRpdHlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2goZW50aXR5KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGVudGl0eS5oYXNBbGxDb21wb25lbnRzKHRoaXMuQ29tcG9uZW50cykgJiZcbiAgICAgICFlbnRpdHkuaGFzQW55Q29tcG9uZW50cyh0aGlzLk5vdENvbXBvbmVudHMpXG4gICAgKTtcbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAga2V5OiB0aGlzLmtleSxcbiAgICAgIHJlYWN0aXZlOiB0aGlzLnJlYWN0aXZlLFxuICAgICAgY29tcG9uZW50czoge1xuICAgICAgICBpbmNsdWRlZDogdGhpcy5Db21wb25lbnRzLm1hcCgoQykgPT4gQy5uYW1lKSxcbiAgICAgICAgbm90OiB0aGlzLk5vdENvbXBvbmVudHMubWFwKChDKSA9PiBDLm5hbWUpLFxuICAgICAgfSxcbiAgICAgIG51bUVudGl0aWVzOiB0aGlzLmVudGl0aWVzLmxlbmd0aCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBzdGF0cyBmb3IgdGhpcyBxdWVyeVxuICAgKi9cbiAgc3RhdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG51bUNvbXBvbmVudHM6IHRoaXMuQ29tcG9uZW50cy5sZW5ndGgsXG4gICAgICBudW1FbnRpdGllczogdGhpcy5lbnRpdGllcy5sZW5ndGgsXG4gICAgfTtcbiAgfVxufVxuXG5RdWVyeS5wcm90b3R5cGUuRU5USVRZX0FEREVEID0gXCJRdWVyeSNFTlRJVFlfQURERURcIjtcblF1ZXJ5LnByb3RvdHlwZS5FTlRJVFlfUkVNT1ZFRCA9IFwiUXVlcnkjRU5USVRZX1JFTU9WRURcIjtcblF1ZXJ5LnByb3RvdHlwZS5DT01QT05FTlRfQ0hBTkdFRCA9IFwiUXVlcnkjQ09NUE9ORU5UX0NIQU5HRURcIjtcbiIsImltcG9ydCBRdWVyeSBmcm9tIFwiLi9RdWVyeS5qc1wiO1xuaW1wb3J0IHsgcXVlcnlLZXkgfSBmcm9tIFwiLi9VdGlscy5qc1wiO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAY2xhc3MgUXVlcnlNYW5hZ2VyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5TWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkKSB7XG4gICAgdGhpcy5fd29ybGQgPSB3b3JsZDtcblxuICAgIC8vIFF1ZXJpZXMgaW5kZXhlZCBieSBhIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgY29tcG9uZW50cyBpdCBoYXNcbiAgICB0aGlzLl9xdWVyaWVzID0ge307XG4gIH1cblxuICBvbkVudGl0eVJlbW92ZWQoZW50aXR5KSB7XG4gICAgZm9yICh2YXIgcXVlcnlOYW1lIGluIHRoaXMuX3F1ZXJpZXMpIHtcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJpZXNbcXVlcnlOYW1lXTtcbiAgICAgIGlmIChlbnRpdHkucXVlcmllcy5pbmRleE9mKHF1ZXJ5KSAhPT0gLTEpIHtcbiAgICAgICAgcXVlcnkucmVtb3ZlRW50aXR5KGVudGl0eSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHdoZW4gYSBjb21wb25lbnQgaXMgYWRkZWQgdG8gYW4gZW50aXR5XG4gICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgRW50aXR5IHRoYXQganVzdCBnb3QgdGhlIG5ldyBjb21wb25lbnRcbiAgICogQHBhcmFtIHtDb21wb25lbnR9IENvbXBvbmVudCBDb21wb25lbnQgYWRkZWQgdG8gdGhlIGVudGl0eVxuICAgKi9cbiAgb25FbnRpdHlDb21wb25lbnRBZGRlZChlbnRpdHksIENvbXBvbmVudCkge1xuICAgIC8vIEB0b2RvIFVzZSBiaXRtYXNrIGZvciBjaGVja2luZyBjb21wb25lbnRzP1xuXG4gICAgLy8gQ2hlY2sgZWFjaCBpbmRleGVkIHF1ZXJ5IHRvIHNlZSBpZiB3ZSBuZWVkIHRvIGFkZCB0aGlzIGVudGl0eSB0byB0aGUgbGlzdFxuICAgIGZvciAodmFyIHF1ZXJ5TmFtZSBpbiB0aGlzLl9xdWVyaWVzKSB7XG4gICAgICB2YXIgcXVlcnkgPSB0aGlzLl9xdWVyaWVzW3F1ZXJ5TmFtZV07XG5cbiAgICAgIGlmIChcbiAgICAgICAgISF+cXVlcnkuTm90Q29tcG9uZW50cy5pbmRleE9mKENvbXBvbmVudCkgJiZcbiAgICAgICAgfnF1ZXJ5LmVudGl0aWVzLmluZGV4T2YoZW50aXR5KVxuICAgICAgKSB7XG4gICAgICAgIHF1ZXJ5LnJlbW92ZUVudGl0eShlbnRpdHkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoZSBlbnRpdHkgb25seSBpZjpcbiAgICAgIC8vIENvbXBvbmVudCBpcyBpbiB0aGUgcXVlcnlcbiAgICAgIC8vIGFuZCBFbnRpdHkgaGFzIEFMTCB0aGUgY29tcG9uZW50cyBvZiB0aGUgcXVlcnlcbiAgICAgIC8vIGFuZCBFbnRpdHkgaXMgbm90IGFscmVhZHkgaW4gdGhlIHF1ZXJ5XG4gICAgICBpZiAoXG4gICAgICAgICF+cXVlcnkuQ29tcG9uZW50cy5pbmRleE9mKENvbXBvbmVudCkgfHxcbiAgICAgICAgIXF1ZXJ5Lm1hdGNoKGVudGl0eSkgfHxcbiAgICAgICAgfnF1ZXJ5LmVudGl0aWVzLmluZGV4T2YoZW50aXR5KVxuICAgICAgKVxuICAgICAgICBjb250aW51ZTtcblxuICAgICAgcXVlcnkuYWRkRW50aXR5KGVudGl0eSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHdoZW4gYSBjb21wb25lbnQgaXMgcmVtb3ZlZCBmcm9tIGFuIGVudGl0eVxuICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5IEVudGl0eSB0byByZW1vdmUgdGhlIGNvbXBvbmVudCBmcm9tXG4gICAqIEBwYXJhbSB7Q29tcG9uZW50fSBDb21wb25lbnQgQ29tcG9uZW50IHRvIHJlbW92ZSBmcm9tIHRoZSBlbnRpdHlcbiAgICovXG4gIG9uRW50aXR5Q29tcG9uZW50UmVtb3ZlZChlbnRpdHksIENvbXBvbmVudCkge1xuICAgIGZvciAodmFyIHF1ZXJ5TmFtZSBpbiB0aGlzLl9xdWVyaWVzKSB7XG4gICAgICB2YXIgcXVlcnkgPSB0aGlzLl9xdWVyaWVzW3F1ZXJ5TmFtZV07XG5cbiAgICAgIGlmIChcbiAgICAgICAgISF+cXVlcnkuTm90Q29tcG9uZW50cy5pbmRleE9mKENvbXBvbmVudCkgJiZcbiAgICAgICAgIX5xdWVyeS5lbnRpdGllcy5pbmRleE9mKGVudGl0eSkgJiZcbiAgICAgICAgcXVlcnkubWF0Y2goZW50aXR5KVxuICAgICAgKSB7XG4gICAgICAgIHF1ZXJ5LmFkZEVudGl0eShlbnRpdHkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICAhIX5xdWVyeS5Db21wb25lbnRzLmluZGV4T2YoQ29tcG9uZW50KSAmJlxuICAgICAgICAhIX5xdWVyeS5lbnRpdGllcy5pbmRleE9mKGVudGl0eSkgJiZcbiAgICAgICAgIXF1ZXJ5Lm1hdGNoKGVudGl0eSlcbiAgICAgICkge1xuICAgICAgICBxdWVyeS5yZW1vdmVFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIHF1ZXJ5IGZvciB0aGUgc3BlY2lmaWVkIGNvbXBvbmVudHNcbiAgICogQHBhcmFtIHtDb21wb25lbnR9IENvbXBvbmVudHMgQ29tcG9uZW50cyB0aGF0IHRoZSBxdWVyeSBzaG91bGQgaGF2ZVxuICAgKi9cbiAgZ2V0UXVlcnkoQ29tcG9uZW50cykge1xuICAgIHZhciBrZXkgPSBxdWVyeUtleShDb21wb25lbnRzKTtcbiAgICB2YXIgcXVlcnkgPSB0aGlzLl9xdWVyaWVzW2tleV07XG4gICAgaWYgKCFxdWVyeSkge1xuICAgICAgdGhpcy5fcXVlcmllc1trZXldID0gcXVlcnkgPSBuZXcgUXVlcnkoQ29tcG9uZW50cywgdGhpcy5fd29ybGQpO1xuICAgIH1cbiAgICByZXR1cm4gcXVlcnk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHNvbWUgc3RhdHMgZnJvbSB0aGlzIGNsYXNzXG4gICAqL1xuICBzdGF0cygpIHtcbiAgICB2YXIgc3RhdHMgPSB7fTtcbiAgICBmb3IgKHZhciBxdWVyeU5hbWUgaW4gdGhpcy5fcXVlcmllcykge1xuICAgICAgc3RhdHNbcXVlcnlOYW1lXSA9IHRoaXMuX3F1ZXJpZXNbcXVlcnlOYW1lXS5zdGF0cygpO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdHM7XG4gIH1cbn1cbiIsIi8qIGdsb2JhbCBQZWVyICovXG5pbXBvcnQgeyBpbmplY3RTY3JpcHQsIGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuaW1wb3J0IHsgaGFzV2luZG93IH0gZnJvbSBcIi4uL1V0aWxzLmpzXCI7XG5cbmZ1bmN0aW9uIGhvb2tDb25zb2xlQW5kRXJyb3JzKGNvbm5lY3Rpb24pIHtcbiAgdmFyIHdyYXBGdW5jdGlvbnMgPSBbXCJlcnJvclwiLCBcIndhcm5pbmdcIiwgXCJsb2dcIl07XG4gIHdyYXBGdW5jdGlvbnMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIGZuID0gY29uc29sZVtrZXldLmJpbmQoY29uc29sZSk7XG4gICAgICBjb25zb2xlW2tleV0gPSAoLi4uYXJncykgPT4ge1xuICAgICAgICBjb25uZWN0aW9uLnNlbmQoe1xuICAgICAgICAgIG1ldGhvZDogXCJjb25zb2xlXCIsXG4gICAgICAgICAgdHlwZToga2V5LFxuICAgICAgICAgIGFyZ3M6IEpTT04uc3RyaW5naWZ5KGFyZ3MpLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKGVycm9yKSA9PiB7XG4gICAgY29ubmVjdGlvbi5zZW5kKHtcbiAgICAgIG1ldGhvZDogXCJlcnJvclwiLFxuICAgICAgZXJyb3I6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgbWVzc2FnZTogZXJyb3IuZXJyb3IubWVzc2FnZSxcbiAgICAgICAgc3RhY2s6IGVycm9yLmVycm9yLnN0YWNrLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpbmNsdWRlUmVtb3RlSWRIVE1MKHJlbW90ZUlkKSB7XG4gIGxldCBpbmZvRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgaW5mb0Rpdi5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzMzMztcbiAgICBjb2xvcjogI2FhYTtcbiAgICBkaXNwbGF5OmZsZXg7XG4gICAgZm9udC1mYW1pbHk6IEFyaWFsO1xuICAgIGZvbnQtc2l6ZTogMS4xZW07XG4gICAgaGVpZ2h0OiA0MHB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGxlZnQ6IDA7XG4gICAgb3BhY2l0eTogMC45O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICByaWdodDogMDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgdG9wOiAwO1xuICBgO1xuXG4gIGluZm9EaXYuaW5uZXJIVE1MID0gYE9wZW4gRUNTWSBkZXZ0b29scyB0byBjb25uZWN0IHRvIHRoaXMgcGFnZSB1c2luZyB0aGUgY29kZTombmJzcDs8YiBzdHlsZT1cImNvbG9yOiAjZmZmXCI+JHtyZW1vdGVJZH08L2I+Jm5ic3A7PGJ1dHRvbiBvbkNsaWNrPVwiZ2VuZXJhdGVOZXdDb2RlKClcIj5HZW5lcmF0ZSBuZXcgY29kZTwvYnV0dG9uPmA7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5mb0Rpdik7XG5cbiAgcmV0dXJuIGluZm9EaXY7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVSZW1vdGVEZXZ0b29scyhyZW1vdGVJZCkge1xuICBpZiAoIWhhc1dpbmRvdykge1xuICAgIGNvbnNvbGUud2FybihcIlJlbW90ZSBkZXZ0b29scyBub3QgYXZhaWxhYmxlIG91dHNpZGUgdGhlIGJyb3dzZXJcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgd2luZG93LmdlbmVyYXRlTmV3Q29kZSA9ICgpID0+IHtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgcmVtb3RlSWQgPSBnZW5lcmF0ZUlkKDYpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImVjc3lSZW1vdGVJZFwiLCByZW1vdGVJZCk7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZChmYWxzZSk7XG4gIH07XG5cbiAgcmVtb3RlSWQgPSByZW1vdGVJZCB8fCB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJlY3N5UmVtb3RlSWRcIik7XG4gIGlmICghcmVtb3RlSWQpIHtcbiAgICByZW1vdGVJZCA9IGdlbmVyYXRlSWQoNik7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZWNzeVJlbW90ZUlkXCIsIHJlbW90ZUlkKTtcbiAgfVxuXG4gIGxldCBpbmZvRGl2ID0gaW5jbHVkZVJlbW90ZUlkSFRNTChyZW1vdGVJZCk7XG5cbiAgd2luZG93Ll9fRUNTWV9SRU1PVEVfREVWVE9PTFNfSU5KRUNURUQgPSB0cnVlO1xuICB3aW5kb3cuX19FQ1NZX1JFTU9URV9ERVZUT09MUyA9IHt9O1xuXG4gIGxldCBWZXJzaW9uID0gXCJcIjtcblxuICAvLyBUaGlzIGlzIHVzZWQgdG8gY29sbGVjdCB0aGUgd29ybGRzIGNyZWF0ZWQgYmVmb3JlIHRoZSBjb21tdW5pY2F0aW9uIGlzIGJlaW5nIGVzdGFibGlzaGVkXG4gIGxldCB3b3JsZHNCZWZvcmVMb2FkaW5nID0gW107XG4gIGxldCBvbldvcmxkQ3JlYXRlZCA9IChlKSA9PiB7XG4gICAgdmFyIHdvcmxkID0gZS5kZXRhaWwud29ybGQ7XG4gICAgVmVyc2lvbiA9IGUuZGV0YWlsLnZlcnNpb247XG4gICAgd29ybGRzQmVmb3JlTG9hZGluZy5wdXNoKHdvcmxkKTtcbiAgfTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJlY3N5LXdvcmxkLWNyZWF0ZWRcIiwgb25Xb3JsZENyZWF0ZWQpO1xuXG4gIGxldCBvbkxvYWRlZCA9ICgpID0+IHtcbiAgICAvLyB2YXIgcGVlciA9IG5ldyBQZWVyKHJlbW90ZUlkKTtcbiAgICB2YXIgcGVlciA9IG5ldyBQZWVyKHJlbW90ZUlkLCB7XG4gICAgICBob3N0OiBcInBlZXJqcy5lY3N5LmlvXCIsXG4gICAgICBzZWN1cmU6IHRydWUsXG4gICAgICBwb3J0OiA0NDMsXG4gICAgICBjb25maWc6IHtcbiAgICAgICAgaWNlU2VydmVyczogW1xuICAgICAgICAgIHsgdXJsOiBcInN0dW46c3R1bi5sLmdvb2dsZS5jb206MTkzMDJcIiB9LFxuICAgICAgICAgIHsgdXJsOiBcInN0dW46c3R1bjEubC5nb29nbGUuY29tOjE5MzAyXCIgfSxcbiAgICAgICAgICB7IHVybDogXCJzdHVuOnN0dW4yLmwuZ29vZ2xlLmNvbToxOTMwMlwiIH0sXG4gICAgICAgICAgeyB1cmw6IFwic3R1bjpzdHVuMy5sLmdvb2dsZS5jb206MTkzMDJcIiB9LFxuICAgICAgICAgIHsgdXJsOiBcInN0dW46c3R1bjQubC5nb29nbGUuY29tOjE5MzAyXCIgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBkZWJ1ZzogMyxcbiAgICB9KTtcblxuICAgIHBlZXIub24oXCJvcGVuXCIsICgvKiBpZCAqLykgPT4ge1xuICAgICAgcGVlci5vbihcImNvbm5lY3Rpb25cIiwgKGNvbm5lY3Rpb24pID0+IHtcbiAgICAgICAgd2luZG93Ll9fRUNTWV9SRU1PVEVfREVWVE9PTFMuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gICAgICAgIGNvbm5lY3Rpb24ub24oXCJvcGVuXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBpbmZvRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgIGluZm9EaXYuaW5uZXJIVE1MID0gXCJDb25uZWN0ZWRcIjtcblxuICAgICAgICAgIC8vIFJlY2VpdmUgbWVzc2FnZXNcbiAgICAgICAgICBjb25uZWN0aW9uLm9uKFwiZGF0YVwiLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEudHlwZSA9PT0gXCJpbml0XCIpIHtcbiAgICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dC9qYXZhc2NyaXB0XCIpO1xuICAgICAgICAgICAgICBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG5cbiAgICAgICAgICAgICAgICAvLyBPbmNlIHRoZSBzY3JpcHQgaXMgaW5qZWN0ZWQgd2UgZG9uJ3QgbmVlZCB0byBsaXN0ZW5cbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgIFwiZWNzeS13b3JsZC1jcmVhdGVkXCIsXG4gICAgICAgICAgICAgICAgICBvbldvcmxkQ3JlYXRlZFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgd29ybGRzQmVmb3JlTG9hZGluZy5mb3JFYWNoKCh3b3JsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZWNzeS13b3JsZC1jcmVhdGVkXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7IHdvcmxkOiB3b3JsZCwgdmVyc2lvbjogVmVyc2lvbiB9LFxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHNjcmlwdC5pbm5lckhUTUwgPSBkYXRhLnNjcmlwdDtcbiAgICAgICAgICAgICAgKGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICBzY3JpcHQub25sb2FkKCk7XG5cbiAgICAgICAgICAgICAgaG9va0NvbnNvbGVBbmRFcnJvcnMoY29ubmVjdGlvbik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEudHlwZSA9PT0gXCJleGVjdXRlU2NyaXB0XCIpIHtcbiAgICAgICAgICAgICAgbGV0IHZhbHVlID0gZXZhbChkYXRhLnNjcmlwdCk7XG4gICAgICAgICAgICAgIGlmIChkYXRhLnJldHVybkV2YWwpIHtcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLnNlbmQoe1xuICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcImV2YWxSZXR1cm5cIixcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEluamVjdCBQZWVySlMgc2NyaXB0XG4gIGluamVjdFNjcmlwdChcbiAgICBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vcGVlcmpzQDAuMy4yMC9kaXN0L3BlZXIubWluLmpzXCIsXG4gICAgb25Mb2FkZWRcbiAgKTtcbn1cblxuaWYgKGhhc1dpbmRvdykge1xuICBjb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuXG4gIC8vIEB0b2RvIFByb3ZpZGUgYSB3YXkgdG8gZGlzYWJsZSBpdCBpZiBuZWVkZWRcbiAgaWYgKHVybFBhcmFtcy5oYXMoXCJlbmFibGUtcmVtb3RlLWRldnRvb2xzXCIpKSB7XG4gICAgZW5hYmxlUmVtb3RlRGV2dG9vbHMoKTtcbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlSWQobGVuZ3RoKSB7XG4gIHZhciByZXN1bHQgPSBcIlwiO1xuICB2YXIgY2hhcmFjdGVycyA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5XCI7XG4gIHZhciBjaGFyYWN0ZXJzTGVuZ3RoID0gY2hhcmFjdGVycy5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVyc0xlbmd0aCkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RTY3JpcHQoc3JjLCBvbkxvYWQpIHtcbiAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gIC8vIEB0b2RvIFVzZSBsaW5rIHRvIHRoZSBlY3N5LWRldnRvb2xzIHJlcG8/XG4gIHNjcmlwdC5zcmMgPSBzcmM7XG4gIHNjcmlwdC5vbmxvYWQgPSBvbkxvYWQ7XG4gIChkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbn1cbiIsImltcG9ydCBRdWVyeSBmcm9tIFwiLi9RdWVyeS5qc1wiO1xuaW1wb3J0IHsgY29tcG9uZW50UmVnaXN0ZXJlZCB9IGZyb20gXCIuL1V0aWxzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBTeXN0ZW0ge1xuICBjYW5FeGVjdXRlKCkge1xuICAgIGlmICh0aGlzLl9tYW5kYXRvcnlRdWVyaWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRydWU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX21hbmRhdG9yeVF1ZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMuX21hbmRhdG9yeVF1ZXJpZXNbaV07XG4gICAgICBpZiAocXVlcnkuZW50aXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuZ2V0TmFtZSgpO1xuICB9XG5cbiAgY29uc3RydWN0b3Iod29ybGQsIGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLndvcmxkID0gd29ybGQ7XG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICAgIC8vIEB0b2RvIEJldHRlciBuYW1pbmcgOilcbiAgICB0aGlzLl9xdWVyaWVzID0ge307XG4gICAgdGhpcy5xdWVyaWVzID0ge307XG5cbiAgICB0aGlzLnByaW9yaXR5ID0gMDtcblxuICAgIC8vIFVzZWQgZm9yIHN0YXRzXG4gICAgdGhpcy5leGVjdXRlVGltZSA9IDA7XG5cbiAgICBpZiAoYXR0cmlidXRlcyAmJiBhdHRyaWJ1dGVzLnByaW9yaXR5KSB7XG4gICAgICB0aGlzLnByaW9yaXR5ID0gYXR0cmlidXRlcy5wcmlvcml0eTtcbiAgICB9XG5cbiAgICB0aGlzLl9tYW5kYXRvcnlRdWVyaWVzID0gW107XG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yLnF1ZXJpZXMpIHtcbiAgICAgIGZvciAodmFyIHF1ZXJ5TmFtZSBpbiB0aGlzLmNvbnN0cnVjdG9yLnF1ZXJpZXMpIHtcbiAgICAgICAgdmFyIHF1ZXJ5Q29uZmlnID0gdGhpcy5jb25zdHJ1Y3Rvci5xdWVyaWVzW3F1ZXJ5TmFtZV07XG4gICAgICAgIHZhciBDb21wb25lbnRzID0gcXVlcnlDb25maWcuY29tcG9uZW50cztcbiAgICAgICAgaWYgKCFDb21wb25lbnRzIHx8IENvbXBvbmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2NvbXBvbmVudHMnIGF0dHJpYnV0ZSBjYW4ndCBiZSBlbXB0eSBpbiBhIHF1ZXJ5XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGV0ZWN0IGlmIHRoZSBjb21wb25lbnRzIGhhdmUgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWRcbiAgICAgICAgbGV0IHVucmVnaXN0ZXJlZENvbXBvbmVudHMgPSBDb21wb25lbnRzLmZpbHRlcihcbiAgICAgICAgICAoQ29tcG9uZW50KSA9PiAhY29tcG9uZW50UmVnaXN0ZXJlZChDb21wb25lbnQpXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHVucmVnaXN0ZXJlZENvbXBvbmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBUcmllZCB0byBjcmVhdGUgYSBxdWVyeSAnJHtcbiAgICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgICAgICAgICB9LiR7cXVlcnlOYW1lfScgd2l0aCB1bnJlZ2lzdGVyZWQgY29tcG9uZW50czogWyR7dW5yZWdpc3RlcmVkQ29tcG9uZW50c1xuICAgICAgICAgICAgICAubWFwKChjKSA9PiBjLmdldE5hbWUoKSlcbiAgICAgICAgICAgICAgLmpvaW4oXCIsIFwiKX1dYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcXVlcnkgPSB0aGlzLndvcmxkLmVudGl0eU1hbmFnZXIucXVlcnlDb21wb25lbnRzKENvbXBvbmVudHMpO1xuXG4gICAgICAgIHRoaXMuX3F1ZXJpZXNbcXVlcnlOYW1lXSA9IHF1ZXJ5O1xuICAgICAgICBpZiAocXVlcnlDb25maWcubWFuZGF0b3J5ID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhpcy5fbWFuZGF0b3J5UXVlcmllcy5wdXNoKHF1ZXJ5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnF1ZXJpZXNbcXVlcnlOYW1lXSA9IHtcbiAgICAgICAgICByZXN1bHRzOiBxdWVyeS5lbnRpdGllcyxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZWFjdGl2ZSBjb25maWd1cmF0aW9uIGFkZGVkL3JlbW92ZWQvY2hhbmdlZFxuICAgICAgICB2YXIgdmFsaWRFdmVudHMgPSBbXCJhZGRlZFwiLCBcInJlbW92ZWRcIiwgXCJjaGFuZ2VkXCJdO1xuXG4gICAgICAgIGNvbnN0IGV2ZW50TWFwcGluZyA9IHtcbiAgICAgICAgICBhZGRlZDogUXVlcnkucHJvdG90eXBlLkVOVElUWV9BRERFRCxcbiAgICAgICAgICByZW1vdmVkOiBRdWVyeS5wcm90b3R5cGUuRU5USVRZX1JFTU9WRUQsXG4gICAgICAgICAgY2hhbmdlZDogUXVlcnkucHJvdG90eXBlLkNPTVBPTkVOVF9DSEFOR0VELCAvLyBRdWVyeS5wcm90b3R5cGUuRU5USVRZX0NIQU5HRURcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAocXVlcnlDb25maWcubGlzdGVuKSB7XG4gICAgICAgICAgdmFsaWRFdmVudHMuZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZXhlY3V0ZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgYFN5c3RlbSAnJHt0aGlzLmdldE5hbWUoKX0nIGhhcyBkZWZpbmVkIGxpc3RlbiBldmVudHMgKCR7dmFsaWRFdmVudHMuam9pbihcbiAgICAgICAgICAgICAgICAgIFwiLCBcIlxuICAgICAgICAgICAgICAgICl9KSBmb3IgcXVlcnkgJyR7cXVlcnlOYW1lfScgYnV0IGl0IGRvZXMgbm90IGltcGxlbWVudCB0aGUgJ2V4ZWN1dGUnIG1ldGhvZC5gXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElzIHRoZSBldmVudCBlbmFibGVkIG9uIHRoaXMgc3lzdGVtJ3MgcXVlcnk/XG4gICAgICAgICAgICBpZiAocXVlcnlDb25maWcubGlzdGVuW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgICAgbGV0IGV2ZW50ID0gcXVlcnlDb25maWcubGlzdGVuW2V2ZW50TmFtZV07XG5cbiAgICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gXCJjaGFuZ2VkXCIpIHtcbiAgICAgICAgICAgICAgICBxdWVyeS5yZWFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAvLyBBbnkgY2hhbmdlIG9uIHRoZSBlbnRpdHkgZnJvbSB0aGUgY29tcG9uZW50cyBpbiB0aGUgcXVlcnlcbiAgICAgICAgICAgICAgICAgIGxldCBldmVudExpc3QgPSAodGhpcy5xdWVyaWVzW3F1ZXJ5TmFtZV1bZXZlbnROYW1lXSA9IFtdKTtcbiAgICAgICAgICAgICAgICAgIHF1ZXJ5LmV2ZW50RGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICAgICBRdWVyeS5wcm90b3R5cGUuQ09NUE9ORU5UX0NIQU5HRUQsXG4gICAgICAgICAgICAgICAgICAgIChlbnRpdHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBBdm9pZCBkdXBsaWNhdGVzXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50TGlzdC5pbmRleE9mKGVudGl0eSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QucHVzaChlbnRpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgICBsZXQgZXZlbnRMaXN0ID0gKHRoaXMucXVlcmllc1txdWVyeU5hbWVdW2V2ZW50TmFtZV0gPSBbXSk7XG4gICAgICAgICAgICAgICAgICBxdWVyeS5ldmVudERpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgUXVlcnkucHJvdG90eXBlLkNPTVBPTkVOVF9DSEFOR0VELFxuICAgICAgICAgICAgICAgICAgICAoZW50aXR5LCBjaGFuZ2VkQ29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gQXZvaWQgZHVwbGljYXRlc1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmluZGV4T2YoY2hhbmdlZENvbXBvbmVudC5jb25zdHJ1Y3RvcikgIT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QuaW5kZXhPZihlbnRpdHkpID09PSAtMVxuICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAvLyBDaGVja2luZyBqdXN0IHNwZWNpZmljIGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgIGxldCBjaGFuZ2VkTGlzdCA9ICh0aGlzLnF1ZXJpZXNbcXVlcnlOYW1lXVtldmVudE5hbWVdID0ge30pO1xuICAgICAgICAgICAgICAgICAgZXZlbnQuZm9yRWFjaChjb21wb25lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXZlbnRMaXN0ID0gKGNoYW5nZWRMaXN0W1xuICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFByb3BlcnR5TmFtZShjb21wb25lbnQpXG4gICAgICAgICAgICAgICAgICAgIF0gPSBbXSk7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5LmV2ZW50RGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICAgICAgIFF1ZXJ5LnByb3RvdHlwZS5DT01QT05FTlRfQ0hBTkdFRCxcbiAgICAgICAgICAgICAgICAgICAgICAoZW50aXR5LCBjaGFuZ2VkQ29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRDb21wb25lbnQuY29uc3RydWN0b3IgPT09IGNvbXBvbmVudCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QuaW5kZXhPZihlbnRpdHkpID09PSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TGlzdC5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgZXZlbnRMaXN0ID0gKHRoaXMucXVlcmllc1txdWVyeU5hbWVdW2V2ZW50TmFtZV0gPSBbXSk7XG5cbiAgICAgICAgICAgICAgICBxdWVyeS5ldmVudERpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgIGV2ZW50TWFwcGluZ1tldmVudE5hbWVdLFxuICAgICAgICAgICAgICAgICAgKGVudGl0eSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBAZml4bWUgb3ZlcmhlYWQ/XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudExpc3QuaW5kZXhPZihlbnRpdHkpID09PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QucHVzaChlbnRpdHkpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5leGVjdXRlVGltZSA9IDA7XG4gICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gIH1cblxuICBwbGF5KCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gIH1cblxuICAvLyBAcXVlc3Rpb24gcmVuYW1lIHRvIGNsZWFyIHF1ZXVlcz9cbiAgY2xlYXJFdmVudHMoKSB7XG4gICAgZm9yIChsZXQgcXVlcnlOYW1lIGluIHRoaXMucXVlcmllcykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5xdWVyaWVzW3F1ZXJ5TmFtZV07XG4gICAgICBpZiAocXVlcnkuYWRkZWQpIHtcbiAgICAgICAgcXVlcnkuYWRkZWQubGVuZ3RoID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChxdWVyeS5yZW1vdmVkKSB7XG4gICAgICAgIHF1ZXJ5LnJlbW92ZWQubGVuZ3RoID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChxdWVyeS5jaGFuZ2VkKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHF1ZXJ5LmNoYW5nZWQpKSB7XG4gICAgICAgICAgcXVlcnkuY2hhbmdlZC5sZW5ndGggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gcXVlcnkuY2hhbmdlZCkge1xuICAgICAgICAgICAgcXVlcnkuY2hhbmdlZFtuYW1lXS5sZW5ndGggPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICB2YXIganNvbiA9IHtcbiAgICAgIG5hbWU6IHRoaXMuZ2V0TmFtZSgpLFxuICAgICAgZW5hYmxlZDogdGhpcy5lbmFibGVkLFxuICAgICAgZXhlY3V0ZVRpbWU6IHRoaXMuZXhlY3V0ZVRpbWUsXG4gICAgICBwcmlvcml0eTogdGhpcy5wcmlvcml0eSxcbiAgICAgIHF1ZXJpZXM6IHt9LFxuICAgIH07XG5cbiAgICBpZiAodGhpcy5jb25zdHJ1Y3Rvci5xdWVyaWVzKSB7XG4gICAgICB2YXIgcXVlcmllcyA9IHRoaXMuY29uc3RydWN0b3IucXVlcmllcztcbiAgICAgIGZvciAobGV0IHF1ZXJ5TmFtZSBpbiBxdWVyaWVzKSB7XG4gICAgICAgIGxldCBxdWVyeSA9IHRoaXMucXVlcmllc1txdWVyeU5hbWVdO1xuICAgICAgICBsZXQgcXVlcnlEZWZpbml0aW9uID0gcXVlcmllc1txdWVyeU5hbWVdO1xuICAgICAgICBsZXQganNvblF1ZXJ5ID0gKGpzb24ucXVlcmllc1txdWVyeU5hbWVdID0ge1xuICAgICAgICAgIGtleTogdGhpcy5fcXVlcmllc1txdWVyeU5hbWVdLmtleSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAganNvblF1ZXJ5Lm1hbmRhdG9yeSA9IHF1ZXJ5RGVmaW5pdGlvbi5tYW5kYXRvcnkgPT09IHRydWU7XG4gICAgICAgIGpzb25RdWVyeS5yZWFjdGl2ZSA9XG4gICAgICAgICAgcXVlcnlEZWZpbml0aW9uLmxpc3RlbiAmJlxuICAgICAgICAgIChxdWVyeURlZmluaXRpb24ubGlzdGVuLmFkZGVkID09PSB0cnVlIHx8XG4gICAgICAgICAgICBxdWVyeURlZmluaXRpb24ubGlzdGVuLnJlbW92ZWQgPT09IHRydWUgfHxcbiAgICAgICAgICAgIHF1ZXJ5RGVmaW5pdGlvbi5saXN0ZW4uY2hhbmdlZCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheShxdWVyeURlZmluaXRpb24ubGlzdGVuLmNoYW5nZWQpKTtcblxuICAgICAgICBpZiAoanNvblF1ZXJ5LnJlYWN0aXZlKSB7XG4gICAgICAgICAganNvblF1ZXJ5Lmxpc3RlbiA9IHt9O1xuXG4gICAgICAgICAgY29uc3QgbWV0aG9kcyA9IFtcImFkZGVkXCIsIFwicmVtb3ZlZFwiLCBcImNoYW5nZWRcIl07XG4gICAgICAgICAgbWV0aG9kcy5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICAgICAgICAgIGlmIChxdWVyeVttZXRob2RdKSB7XG4gICAgICAgICAgICAgIGpzb25RdWVyeS5saXN0ZW5bbWV0aG9kXSA9IHtcbiAgICAgICAgICAgICAgICBlbnRpdGllczogcXVlcnlbbWV0aG9kXS5sZW5ndGgsXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ganNvbjtcbiAgfVxufVxuXG5TeXN0ZW0uaXNTeXN0ZW0gPSB0cnVlO1xuU3lzdGVtLmdldE5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmRpc3BsYXlOYW1lIHx8IHRoaXMubmFtZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBOb3QoQ29tcG9uZW50KSB7XG4gIHJldHVybiB7XG4gICAgb3BlcmF0b3I6IFwibm90XCIsXG4gICAgQ29tcG9uZW50OiBDb21wb25lbnQsXG4gIH07XG59XG4iLCJpbXBvcnQgeyBub3cgfSBmcm9tIFwiLi9VdGlscy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgU3lzdGVtTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkKSB7XG4gICAgdGhpcy5fc3lzdGVtcyA9IFtdO1xuICAgIHRoaXMuX2V4ZWN1dGVTeXN0ZW1zID0gW107IC8vIFN5c3RlbXMgdGhhdCBoYXZlIGBleGVjdXRlYCBtZXRob2RcbiAgICB0aGlzLndvcmxkID0gd29ybGQ7XG4gICAgdGhpcy5sYXN0RXhlY3V0ZWRTeXN0ZW0gPSBudWxsO1xuICB9XG5cbiAgcmVnaXN0ZXJTeXN0ZW0oU3lzdGVtQ2xhc3MsIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAoIVN5c3RlbUNsYXNzLmlzU3lzdGVtKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBTeXN0ZW0gJyR7U3lzdGVtQ2xhc3MubmFtZX0nIGRvZXMgbm90IGV4dGVuZCAnU3lzdGVtJyBjbGFzc2BcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ2V0U3lzdGVtKFN5c3RlbUNsYXNzKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFN5c3RlbSAnJHtTeXN0ZW1DbGFzcy5nZXROYW1lKCl9JyBhbHJlYWR5IHJlZ2lzdGVyZWQuYCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgc3lzdGVtID0gbmV3IFN5c3RlbUNsYXNzKHRoaXMud29ybGQsIGF0dHJpYnV0ZXMpO1xuICAgIGlmIChzeXN0ZW0uaW5pdCkgc3lzdGVtLmluaXQoYXR0cmlidXRlcyk7XG4gICAgc3lzdGVtLm9yZGVyID0gdGhpcy5fc3lzdGVtcy5sZW5ndGg7XG4gICAgdGhpcy5fc3lzdGVtcy5wdXNoKHN5c3RlbSk7XG4gICAgaWYgKHN5c3RlbS5leGVjdXRlKSB7XG4gICAgICB0aGlzLl9leGVjdXRlU3lzdGVtcy5wdXNoKHN5c3RlbSk7XG4gICAgICB0aGlzLnNvcnRTeXN0ZW1zKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdW5yZWdpc3RlclN5c3RlbShTeXN0ZW1DbGFzcykge1xuICAgIGxldCBzeXN0ZW0gPSB0aGlzLmdldFN5c3RlbShTeXN0ZW1DbGFzcyk7XG4gICAgaWYgKHN5c3RlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGBDYW4gdW5yZWdpc3RlciBzeXN0ZW0gJyR7U3lzdGVtQ2xhc3MuZ2V0TmFtZSgpfScuIEl0IGRvZXNuJ3QgZXhpc3QuYFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuX3N5c3RlbXMuc3BsaWNlKHRoaXMuX3N5c3RlbXMuaW5kZXhPZihzeXN0ZW0pLCAxKTtcblxuICAgIGlmIChzeXN0ZW0uZXhlY3V0ZSkge1xuICAgICAgdGhpcy5fZXhlY3V0ZVN5c3RlbXMuc3BsaWNlKHRoaXMuX2V4ZWN1dGVTeXN0ZW1zLmluZGV4T2Yoc3lzdGVtKSwgMSk7XG4gICAgfVxuXG4gICAgLy8gQHRvZG8gQWRkIHN5c3RlbS51bnJlZ2lzdGVyKCkgY2FsbCB0byBmcmVlIHJlc291cmNlc1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc29ydFN5c3RlbXMoKSB7XG4gICAgdGhpcy5fZXhlY3V0ZVN5c3RlbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEucHJpb3JpdHkgLSBiLnByaW9yaXR5IHx8IGEub3JkZXIgLSBiLm9yZGVyO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0U3lzdGVtKFN5c3RlbUNsYXNzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5c3RlbXMuZmluZCgocykgPT4gcyBpbnN0YW5jZW9mIFN5c3RlbUNsYXNzKTtcbiAgfVxuXG4gIGdldFN5c3RlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5c3RlbXM7XG4gIH1cblxuICByZW1vdmVTeXN0ZW0oU3lzdGVtQ2xhc3MpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLl9zeXN0ZW1zLmluZGV4T2YoU3lzdGVtQ2xhc3MpO1xuICAgIGlmICghfmluZGV4KSByZXR1cm47XG5cbiAgICB0aGlzLl9zeXN0ZW1zLnNwbGljZShpbmRleCwgMSk7XG4gIH1cblxuICBleGVjdXRlU3lzdGVtKHN5c3RlbSwgZGVsdGEsIHRpbWUpIHtcbiAgICBpZiAoc3lzdGVtLmluaXRpYWxpemVkKSB7XG4gICAgICBpZiAoc3lzdGVtLmNhbkV4ZWN1dGUoKSkge1xuICAgICAgICBsZXQgc3RhcnRUaW1lID0gbm93KCk7XG4gICAgICAgIHN5c3RlbS5leGVjdXRlKGRlbHRhLCB0aW1lKTtcbiAgICAgICAgc3lzdGVtLmV4ZWN1dGVUaW1lID0gbm93KCkgLSBzdGFydFRpbWU7XG4gICAgICAgIHRoaXMubGFzdEV4ZWN1dGVkU3lzdGVtID0gc3lzdGVtO1xuICAgICAgICBzeXN0ZW0uY2xlYXJFdmVudHMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuX2V4ZWN1dGVTeXN0ZW1zLmZvckVhY2goKHN5c3RlbSkgPT4gc3lzdGVtLnN0b3AoKSk7XG4gIH1cblxuICBleGVjdXRlKGRlbHRhLCB0aW1lLCBmb3JjZVBsYXkpIHtcbiAgICB0aGlzLl9leGVjdXRlU3lzdGVtcy5mb3JFYWNoKFxuICAgICAgKHN5c3RlbSkgPT5cbiAgICAgICAgKGZvcmNlUGxheSB8fCBzeXN0ZW0uZW5hYmxlZCkgJiYgdGhpcy5leGVjdXRlU3lzdGVtKHN5c3RlbSwgZGVsdGEsIHRpbWUpXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRzKCkge1xuICAgIHZhciBzdGF0cyA9IHtcbiAgICAgIG51bVN5c3RlbXM6IHRoaXMuX3N5c3RlbXMubGVuZ3RoLFxuICAgICAgc3lzdGVtczoge30sXG4gICAgfTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc3lzdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHN5c3RlbSA9IHRoaXMuX3N5c3RlbXNbaV07XG4gICAgICB2YXIgc3lzdGVtU3RhdHMgPSAoc3RhdHMuc3lzdGVtc1tzeXN0ZW0uZ2V0TmFtZSgpXSA9IHtcbiAgICAgICAgcXVlcmllczoge30sXG4gICAgICAgIGV4ZWN1dGVUaW1lOiBzeXN0ZW0uZXhlY3V0ZVRpbWUsXG4gICAgICB9KTtcbiAgICAgIGZvciAodmFyIG5hbWUgaW4gc3lzdGVtLmN0eCkge1xuICAgICAgICBzeXN0ZW1TdGF0cy5xdWVyaWVzW25hbWVdID0gc3lzdGVtLmN0eFtuYW1lXS5zdGF0cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0cztcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vQ29tcG9uZW50LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBTeXN0ZW1TdGF0ZUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5TeXN0ZW1TdGF0ZUNvbXBvbmVudC5pc1N5c3RlbVN0YXRlQ29tcG9uZW50ID0gdHJ1ZTtcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVGFnQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoZmFsc2UpO1xuICB9XG59XG5cblRhZ0NvbXBvbmVudC5pc1RhZ0NvbXBvbmVudCA9IHRydWU7XG4iLCJleHBvcnQgY29uc3QgY29weVZhbHVlID0gKHNyYykgPT4gc3JjO1xuXG5leHBvcnQgY29uc3QgY2xvbmVWYWx1ZSA9IChzcmMpID0+IHNyYztcblxuZXhwb3J0IGNvbnN0IGNvcHlBcnJheSA9IChzcmMsIGRlc3QpID0+IHtcbiAgaWYgKCFzcmMpIHtcbiAgICByZXR1cm4gc3JjO1xuICB9XG5cbiAgaWYgKCFkZXN0KSB7XG4gICAgcmV0dXJuIHNyYy5zbGljZSgpO1xuICB9XG5cbiAgZGVzdC5sZW5ndGggPSAwO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3JjLmxlbmd0aDsgaSsrKSB7XG4gICAgZGVzdC5wdXNoKHNyY1tpXSk7XG4gIH1cblxuICByZXR1cm4gZGVzdDtcbn07XG5cbmV4cG9ydCBjb25zdCBjbG9uZUFycmF5ID0gKHNyYykgPT4gc3JjICYmIHNyYy5zbGljZSgpO1xuXG5leHBvcnQgY29uc3QgY29weUpTT04gPSAoc3JjKSA9PiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHNyYykpO1xuXG5leHBvcnQgY29uc3QgY2xvbmVKU09OID0gKHNyYykgPT4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzcmMpKTtcblxuZXhwb3J0IGNvbnN0IGNvcHlDb3B5YWJsZSA9IChzcmMsIGRlc3QpID0+IHtcbiAgaWYgKCFzcmMpIHtcbiAgICByZXR1cm4gc3JjO1xuICB9XG5cbiAgaWYgKCFkZXN0KSB7XG4gICAgcmV0dXJuIHNyYy5jbG9uZSgpO1xuICB9XG5cbiAgcmV0dXJuIGRlc3QuY29weShzcmMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNsb25lQ2xvbmFibGUgPSAoc3JjKSA9PiBzcmMgJiYgc3JjLmNsb25lKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUeXBlKHR5cGVEZWZpbml0aW9uKSB7XG4gIHZhciBtYW5kYXRvcnlQcm9wZXJ0aWVzID0gW1wibmFtZVwiLCBcImRlZmF1bHRcIiwgXCJjb3B5XCIsIFwiY2xvbmVcIl07XG5cbiAgdmFyIHVuZGVmaW5lZFByb3BlcnRpZXMgPSBtYW5kYXRvcnlQcm9wZXJ0aWVzLmZpbHRlcigocCkgPT4ge1xuICAgIHJldHVybiAhdHlwZURlZmluaXRpb24uaGFzT3duUHJvcGVydHkocCk7XG4gIH0pO1xuXG4gIGlmICh1bmRlZmluZWRQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgY3JlYXRlVHlwZSBleHBlY3RzIGEgdHlwZSBkZWZpbml0aW9uIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOiAke3VuZGVmaW5lZFByb3BlcnRpZXMuam9pbihcbiAgICAgICAgXCIsIFwiXG4gICAgICApfWBcbiAgICApO1xuICB9XG5cbiAgdHlwZURlZmluaXRpb24uaXNUeXBlID0gdHJ1ZTtcblxuICByZXR1cm4gdHlwZURlZmluaXRpb247XG59XG5cbi8qKlxuICogU3RhbmRhcmQgdHlwZXNcbiAqL1xuZXhwb3J0IGNvbnN0IFR5cGVzID0ge1xuICBOdW1iZXI6IGNyZWF0ZVR5cGUoe1xuICAgIG5hbWU6IFwiTnVtYmVyXCIsXG4gICAgZGVmYXVsdDogMCxcbiAgICBjb3B5OiBjb3B5VmFsdWUsXG4gICAgY2xvbmU6IGNsb25lVmFsdWUsXG4gIH0pLFxuXG4gIEJvb2xlYW46IGNyZWF0ZVR5cGUoe1xuICAgIG5hbWU6IFwiQm9vbGVhblwiLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvcHk6IGNvcHlWYWx1ZSxcbiAgICBjbG9uZTogY2xvbmVWYWx1ZSxcbiAgfSksXG5cbiAgU3RyaW5nOiBjcmVhdGVUeXBlKHtcbiAgICBuYW1lOiBcIlN0cmluZ1wiLFxuICAgIGRlZmF1bHQ6IFwiXCIsXG4gICAgY29weTogY29weVZhbHVlLFxuICAgIGNsb25lOiBjbG9uZVZhbHVlLFxuICB9KSxcblxuICBBcnJheTogY3JlYXRlVHlwZSh7XG4gICAgbmFtZTogXCJBcnJheVwiLFxuICAgIGRlZmF1bHQ6IFtdLFxuICAgIGNvcHk6IGNvcHlBcnJheSxcbiAgICBjbG9uZTogY2xvbmVBcnJheSxcbiAgfSksXG5cbiAgUmVmOiBjcmVhdGVUeXBlKHtcbiAgICBuYW1lOiBcIlJlZlwiLFxuICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICBjb3B5OiBjb3B5VmFsdWUsXG4gICAgY2xvbmU6IGNsb25lVmFsdWUsXG4gIH0pLFxuXG4gIEpTT046IGNyZWF0ZVR5cGUoe1xuICAgIG5hbWU6IFwiSlNPTlwiLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29weTogY29weUpTT04sXG4gICAgY2xvbmU6IGNsb25lSlNPTixcbiAgfSksXG59O1xuIiwiLyoqXG4gKiBSZXR1cm4gdGhlIG5hbWUgb2YgYSBjb21wb25lbnRcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBDb21wb25lbnRcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKENvbXBvbmVudCkge1xuICByZXR1cm4gQ29tcG9uZW50Lm5hbWU7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgdmFsaWQgcHJvcGVydHkgbmFtZSBmb3IgdGhlIENvbXBvbmVudFxuICogQHBhcmFtIHtDb21wb25lbnR9IENvbXBvbmVudFxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvbmVudFByb3BlcnR5TmFtZShDb21wb25lbnQpIHtcbiAgcmV0dXJuIGdldE5hbWUoQ29tcG9uZW50KTtcbn1cblxuLyoqXG4gKiBHZXQgYSBrZXkgZnJvbSBhIGxpc3Qgb2YgY29tcG9uZW50c1xuICogQHBhcmFtIHtBcnJheShDb21wb25lbnQpfSBDb21wb25lbnRzIEFycmF5IG9mIGNvbXBvbmVudHMgdG8gZ2VuZXJhdGUgdGhlIGtleVxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHF1ZXJ5S2V5KENvbXBvbmVudHMpIHtcbiAgdmFyIGlkcyA9IFtdO1xuICBmb3IgKHZhciBuID0gMDsgbiA8IENvbXBvbmVudHMubGVuZ3RoOyBuKyspIHtcbiAgICB2YXIgVCA9IENvbXBvbmVudHNbbl07XG5cbiAgICBpZiAoIWNvbXBvbmVudFJlZ2lzdGVyZWQoVCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVHJpZWQgdG8gY3JlYXRlIGEgcXVlcnkgd2l0aCBhbiB1bnJlZ2lzdGVyZWQgY29tcG9uZW50YCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBUID09PSBcIm9iamVjdFwiKSB7XG4gICAgICB2YXIgb3BlcmF0b3IgPSBULm9wZXJhdG9yID09PSBcIm5vdFwiID8gXCIhXCIgOiBULm9wZXJhdG9yO1xuICAgICAgaWRzLnB1c2gob3BlcmF0b3IgKyBULkNvbXBvbmVudC5fdHlwZUlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWRzLnB1c2goVC5fdHlwZUlkKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaWRzLnNvcnQoKS5qb2luKFwiLVwiKTtcbn1cblxuLy8gRGV0ZWN0b3IgZm9yIGJyb3dzZXIncyBcIndpbmRvd1wiXG5leHBvcnQgY29uc3QgaGFzV2luZG93ID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIjtcblxuLy8gcGVyZm9ybWFuY2Uubm93KCkgXCJwb2x5ZmlsbFwiXG5leHBvcnQgY29uc3Qgbm93ID1cbiAgaGFzV2luZG93ICYmIHR5cGVvZiB3aW5kb3cucGVyZm9ybWFuY2UgIT09IFwidW5kZWZpbmVkXCJcbiAgICA/IHBlcmZvcm1hbmNlLm5vdy5iaW5kKHBlcmZvcm1hbmNlKVxuICAgIDogRGF0ZS5ub3cuYmluZChEYXRlKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvbmVudFJlZ2lzdGVyZWQoVCkge1xuICByZXR1cm4gKFxuICAgICh0eXBlb2YgVCA9PT0gXCJvYmplY3RcIiAmJiBULkNvbXBvbmVudC5fdHlwZUlkICE9PSB1bmRlZmluZWQpIHx8XG4gICAgKFQuaXNDb21wb25lbnQgJiYgVC5fdHlwZUlkICE9PSB1bmRlZmluZWQpXG4gICk7XG59XG4iLCJleHBvcnQgY29uc3QgVmVyc2lvbiA9IFwiMC4zLjFcIjtcbiIsImltcG9ydCB7IFN5c3RlbU1hbmFnZXIgfSBmcm9tIFwiLi9TeXN0ZW1NYW5hZ2VyLmpzXCI7XG5pbXBvcnQgeyBFbnRpdHlNYW5hZ2VyIH0gZnJvbSBcIi4vRW50aXR5TWFuYWdlci5qc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50TWFuYWdlciB9IGZyb20gXCIuL0NvbXBvbmVudE1hbmFnZXIuanNcIjtcbmltcG9ydCB7IFZlcnNpb24gfSBmcm9tIFwiLi9WZXJzaW9uLmpzXCI7XG5pbXBvcnQgeyBoYXNXaW5kb3csIG5vdyB9IGZyb20gXCIuL1V0aWxzLmpzXCI7XG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi9FbnRpdHkuanNcIjtcblxuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICBlbnRpdHlQb29sU2l6ZTogMCxcbiAgZW50aXR5Q2xhc3M6IEVudGl0eSxcbn07XG5cbmV4cG9ydCBjbGFzcyBXb3JsZCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbXBvbmVudHNNYW5hZ2VyID0gbmV3IENvbXBvbmVudE1hbmFnZXIodGhpcyk7XG4gICAgdGhpcy5lbnRpdHlNYW5hZ2VyID0gbmV3IEVudGl0eU1hbmFnZXIodGhpcyk7XG4gICAgdGhpcy5zeXN0ZW1NYW5hZ2VyID0gbmV3IFN5c3RlbU1hbmFnZXIodGhpcyk7XG5cbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5ldmVudFF1ZXVlcyA9IHt9O1xuXG4gICAgaWYgKGhhc1dpbmRvdyAmJiB0eXBlb2YgQ3VzdG9tRXZlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImVjc3ktd29ybGQtY3JlYXRlZFwiLCB7XG4gICAgICAgIGRldGFpbDogeyB3b3JsZDogdGhpcywgdmVyc2lvbjogVmVyc2lvbiB9LFxuICAgICAgfSk7XG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0VGltZSA9IG5vdygpIC8gMTAwMDtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tcG9uZW50KENvbXBvbmVudCwgb2JqZWN0UG9vbCkge1xuICAgIHRoaXMuY29tcG9uZW50c01hbmFnZXIucmVnaXN0ZXJDb21wb25lbnQoQ29tcG9uZW50LCBvYmplY3RQb29sKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlZ2lzdGVyU3lzdGVtKFN5c3RlbSwgYXR0cmlidXRlcykge1xuICAgIHRoaXMuc3lzdGVtTWFuYWdlci5yZWdpc3RlclN5c3RlbShTeXN0ZW0sIGF0dHJpYnV0ZXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaGFzUmVnaXN0ZXJlZENvbXBvbmVudChDb21wb25lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRzTWFuYWdlci5oYXNDb21wb25lbnQoQ29tcG9uZW50KTtcbiAgfVxuXG4gIHVucmVnaXN0ZXJTeXN0ZW0oU3lzdGVtKSB7XG4gICAgdGhpcy5zeXN0ZW1NYW5hZ2VyLnVucmVnaXN0ZXJTeXN0ZW0oU3lzdGVtKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldFN5c3RlbShTeXN0ZW1DbGFzcykge1xuICAgIHJldHVybiB0aGlzLnN5c3RlbU1hbmFnZXIuZ2V0U3lzdGVtKFN5c3RlbUNsYXNzKTtcbiAgfVxuXG4gIGdldFN5c3RlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3lzdGVtTWFuYWdlci5nZXRTeXN0ZW1zKCk7XG4gIH1cblxuICBleGVjdXRlKGRlbHRhLCB0aW1lKSB7XG4gICAgaWYgKCFkZWx0YSkge1xuICAgICAgdGltZSA9IG5vdygpIC8gMTAwMDtcbiAgICAgIGRlbHRhID0gdGltZSAtIHRoaXMubGFzdFRpbWU7XG4gICAgICB0aGlzLmxhc3RUaW1lID0gdGltZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbmFibGVkKSB7XG4gICAgICB0aGlzLnN5c3RlbU1hbmFnZXIuZXhlY3V0ZShkZWx0YSwgdGltZSk7XG4gICAgICB0aGlzLmVudGl0eU1hbmFnZXIucHJvY2Vzc0RlZmVycmVkUmVtb3ZhbCgpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gIH1cblxuICBwbGF5KCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gIH1cblxuICBjcmVhdGVFbnRpdHkobmFtZSkge1xuICAgIHJldHVybiB0aGlzLmVudGl0eU1hbmFnZXIuY3JlYXRlRW50aXR5KG5hbWUpO1xuICB9XG5cbiAgc3RhdHMoKSB7XG4gICAgdmFyIHN0YXRzID0ge1xuICAgICAgZW50aXRpZXM6IHRoaXMuZW50aXR5TWFuYWdlci5zdGF0cygpLFxuICAgICAgc3lzdGVtOiB0aGlzLnN5c3RlbU1hbmFnZXIuc3RhdHMoKSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHN0YXRzO1xuICB9XG59XG4iLCJjb25zdCBwcm94eU1hcCA9IG5ldyBXZWFrTWFwKCk7XG5cbmNvbnN0IHByb3h5SGFuZGxlciA9IHtcbiAgc2V0KHRhcmdldCwgcHJvcCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBUcmllZCB0byB3cml0ZSB0byBcIiR7dGFyZ2V0LmNvbnN0cnVjdG9yLmdldE5hbWUoKX0jJHtTdHJpbmcoXG4gICAgICAgIHByb3BcbiAgICAgICl9XCIgb24gaW1tdXRhYmxlIGNvbXBvbmVudC4gVXNlIC5nZXRNdXRhYmxlQ29tcG9uZW50KCkgdG8gbW9kaWZ5IGEgY29tcG9uZW50LmBcbiAgICApO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd3JhcEltbXV0YWJsZUNvbXBvbmVudChULCBjb21wb25lbnQpIHtcbiAgaWYgKGNvbXBvbmVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxldCB3cmFwcGVkQ29tcG9uZW50ID0gcHJveHlNYXAuZ2V0KGNvbXBvbmVudCk7XG5cbiAgaWYgKCF3cmFwcGVkQ29tcG9uZW50KSB7XG4gICAgd3JhcHBlZENvbXBvbmVudCA9IG5ldyBQcm94eShjb21wb25lbnQsIHByb3h5SGFuZGxlcik7XG4gICAgcHJveHlNYXAuc2V0KGNvbXBvbmVudCwgd3JhcHBlZENvbXBvbmVudCk7XG4gIH1cblxuICByZXR1cm4gd3JhcHBlZENvbXBvbmVudDtcbn1cbiIsImV4cG9ydCB7IFdvcmxkIH0gZnJvbSBcIi4vV29ybGQuanNcIjtcbmV4cG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcIi4vU3lzdGVtLmpzXCI7XG5leHBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9Db21wb25lbnQuanNcIjtcbmV4cG9ydCB7IFN5c3RlbVN0YXRlQ29tcG9uZW50IH0gZnJvbSBcIi4vU3lzdGVtU3RhdGVDb21wb25lbnQuanNcIjtcbmV4cG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCIuL1RhZ0NvbXBvbmVudC5qc1wiO1xuZXhwb3J0IHsgT2JqZWN0UG9vbCB9IGZyb20gXCIuL09iamVjdFBvb2wuanNcIjtcbmV4cG9ydCB7XG4gIFR5cGVzLFxuICBjcmVhdGVUeXBlLFxuICBjb3B5VmFsdWUsXG4gIGNsb25lVmFsdWUsXG4gIGNvcHlBcnJheSxcbiAgY2xvbmVBcnJheSxcbiAgY29weUpTT04sXG4gIGNsb25lSlNPTixcbiAgY29weUNvcHlhYmxlLFxuICBjbG9uZUNsb25hYmxlLFxufSBmcm9tIFwiLi9UeXBlcy5qc1wiO1xuZXhwb3J0IHsgVmVyc2lvbiB9IGZyb20gXCIuL1ZlcnNpb24uanNcIjtcbmV4cG9ydCB7IGVuYWJsZVJlbW90ZURldnRvb2xzIH0gZnJvbSBcIi4vUmVtb3RlRGV2VG9vbHMvaW5kZXguanNcIjtcbmV4cG9ydCB7IEVudGl0eSBhcyBfRW50aXR5IH0gZnJvbSBcIi4vRW50aXR5LmpzXCI7XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi8uLi9VdGlscy9WZWN0b3IyXCI7XG5cbmV4cG9ydCBjbGFzcyBMaW5lRGF0YSBleHRlbmRzIENvbXBvbmVudDxMaW5lRGF0YT4ge1xuICBwb2ludHM6IEFycmF5PFZlY3RvcjI+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIERpc2FibGUgdGhlIGRlZmF1bHQgc2NoZW1hIGJlaGF2aW9yLlxuICAgIHN1cGVyKGZhbHNlKTtcblxuICAgIC8vIEN1c3RvbSBkYXRhIHNldHVwLlxuICAgIHRoaXMucG9pbnRzID0gbmV3IEFycmF5PFZlY3RvcjI+KCk7XG4gIH1cblxuICBjb3B5KHNvdXJjZTogdGhpcyk6IHRoaXMge1xuICAgIHRoaXMucG9pbnRzLmxlbmd0aCA9IHNvdXJjZS5wb2ludHMubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3VyY2UucG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzb3VyY2VQb2ludCA9IHNvdXJjZS5wb2ludHNbaV07XG4gICAgICB0aGlzLnBvaW50c1tpXSA9IHNvdXJjZVBvaW50LmNsb25lKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBObyBuZWVkIHRvIG92ZXJyaWRlIGRlZmF1bHQgY2xvbmUoKSBiZWhhdmlvci5cbiAgLy8gSWYgcGFyYW1ldGVycyBhcmUgbmVlZGVkIGZvciB0aGUgY29uc3RydWN0b3IsIHdyaXRlIGEgY3VzdG9tIGNsb25lKCkgbWV0aG9kLlxuICAvLyBjbG9uZSgpOiB0aGlzIHtcbiAgLy8gICByZXR1cm4gbmV3ICh0aGlzLmNvbnN0cnVjdG9yKCkpLmNvcHkodGhpcyk7XG4gIC8vIH1cblxuICByZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLnBvaW50cy5mb3JFYWNoKChwb2ludCkgPT4ge1xuICAgICAgcG9pbnQueCA9IDA7XG4gICAgICBwb2ludC55ID0gMDtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRTY2hlbWEsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFZhbHVlRGF0YSBleHRlbmRzIENvbXBvbmVudDxWYWx1ZURhdGE+IHtcbiAgaW50VmFsOiBudW1iZXI7XG4gIHN0clZhbDogc3RyaW5nO1xuXG4gIHN0YXRpYyBzY2hlbWE6IENvbXBvbmVudFNjaGVtYSA9IHtcbiAgICBpbnRWYWw6IHtcbiAgICAgIHR5cGU6IFR5cGVzLk51bWJlcixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBzdHJWYWw6IHtcbiAgICAgIHR5cGU6IFR5cGVzLlN0cmluZyxcbiAgICAgIGRlZmF1bHQ6IFwiXCIsXG4gICAgfSxcbiAgfTtcbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBWZWN0b3IyLCBWZWN0b3IyVHlwZSB9IGZyb20gXCIuLi8uLi9VdGlscy9WZWN0b3IyXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0yRERhdGEgZXh0ZW5kcyBDb21wb25lbnQ8VHJhbnNmb3JtMkREYXRhPiB7XG4gIHBvc2l0aW9uOiBWZWN0b3IyO1xuXG4gIHN0YXRpYyBzY2hlbWEgPSB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHR5cGU6IFZlY3RvcjJUeXBlLFxuICAgICAgZGVmYXVsdDogbmV3IFZlY3RvcjIoMCwgMCksXG4gICAgfSxcbiAgfTtcbn1cbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IExpbmVEYXRhIH0gZnJvbSBcIi4vRGF0YUNvbXBvbmVudHMvRGVtbzEvTGluZURhdGFcIjtcbmltcG9ydCB7IFZhbHVlRGF0YSB9IGZyb20gXCIuL0RhdGFDb21wb25lbnRzL0RlbW8xL1ZhbHVlRGF0YVwiO1xuaW1wb3J0IHsgVHJhbnNmb3JtMkREYXRhIH0gZnJvbSBcIi4vRGF0YUNvbXBvbmVudHMvRGVtbzIvVHJhbnNmb3JtMkREYXRhXCI7XG5cbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi9VdGlscy9WZWN0b3IyXCI7XG5cbi8vIDEuIENyZWF0ZSBhIHdvcmxkXG5jb25zdCBtYWluV29ybGQ6IFdvcmxkID0gbmV3IFdvcmxkKHtcbiAgZW50aXR5UG9vbFNpemU6IDEwMDAwLFxufSk7XG5cbi8vIDIuMSBCYXNpYyBDb21wb25lbnRzXG4vLyAyLjEuMSBDcmVhdGUgYSBjb21wb25lbnRcbi8vIDIuMS4yIENoYW5nZSB0aGUgdmFsdWUgb2YgdGhlIGNvbXBvbmVudFxuY29uc3QgQmFzaWNDb21wb25lbnREZW1vID0gKCkgPT4ge1xuICBsZXQgZGVidWdUZXh0QXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVidWcxXCIpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gIGxldCBkZWJ1Z0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgIFwiZGVidWdCdXR0b24xXCJcbiAgKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcblxuICAvLyBSZXR1cm4gaWYgdGhlIGRlYnVnIGVsZW1lbnRzIGFyZSBub3QgZm91bmQuXG4gIGlmICghZGVidWdUZXh0QXJlYSB8fCAhZGVidWdCdXR0b24pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBDcmVhdGUgYSBuZXcgY29tcG9uZW50LlxuICBjb25zdCB2YWx1ZURhdGE6IFZhbHVlRGF0YSA9IG5ldyBWYWx1ZURhdGEoKTtcbiAgZGVidWdUZXh0QXJlYS5pbm5lckhUTUwgKz1cbiAgICBcIkluaXRpYWwgVmFsdWVEYXRhOiBcIiArIEpTT04uc3RyaW5naWZ5KHZhbHVlRGF0YSkgKyBcIlxcblwiO1xuXG4gIGNvbnN0IENoYW5nZVZhbHVlRGF0YSA9ICgpID0+IHtcbiAgICAvLyBDaGFuZ2UgdGhlIHZhbHVlIG9mIHRoZSBjb21wb25lbnQuXG4gICAgdmFsdWVEYXRhLmludFZhbCArPSAxMDtcbiAgICB2YWx1ZURhdGEuc3RyVmFsID0gXCJIZWxsbyBXb3JsZCFcIjtcbiAgICBkZWJ1Z1RleHRBcmVhLmlubmVySFRNTCArPVxuICAgICAgXCJDdXJyZW50IFZhbHVlRGF0YTogXCIgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZURhdGEpICsgXCJcXG5cIjtcbiAgfTtcblxuICBkZWJ1Z0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgQ2hhbmdlVmFsdWVEYXRhKTtcbn07XG5cbi8vIDIuMiBDdXN0b20gVHlwZXNcbi8vIDIuMi4xIENyZWF0ZSBhIGNvbXBvbmVudCB3aXRoIGEgY3VzdG9tIHR5cGVcbi8vIDIuMi4yIENoYW5nZSB0aGUgdmFsdWUgb2YgdGhlIGNvbXBvbmVudFxuY29uc3QgQ3VzdG9tVHlwZURlbW8gPSAoKSA9PiB7XG4gIGxldCBkZWJ1Z1RleHRBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWJ1ZzJcIikgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgbGV0IGRlYnVnQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgXCJkZWJ1Z0J1dHRvbjJcIlxuICApIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuXG4gIC8vIFJldHVybiBpZiB0aGUgZGVidWcgZWxlbWVudHMgYXJlIG5vdCBmb3VuZC5cbiAgaWYgKCFkZWJ1Z1RleHRBcmVhIHx8ICFkZWJ1Z0J1dHRvbikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIG5ldyB0cmFuc2Zvcm0gY29tcG9uZW50LlxuICBjb25zdCB0cmFuc2Zvcm0yRDogVHJhbnNmb3JtMkREYXRhID0gbmV3IFRyYW5zZm9ybTJERGF0YSgpO1xuICBkZWJ1Z1RleHRBcmVhLmlubmVySFRNTCArPVxuICAgIFwiSW5pdGlhbCBUcmFuc2Zvcm0yRDogXCIgKyBKU09OLnN0cmluZ2lmeSh0cmFuc2Zvcm0yRCkgKyBcIlxcblwiO1xuXG4gIGNvbnN0IENoYW5nZVRyYW5zZm9ybTJEID0gKCkgPT4ge1xuICAgIC8vIENoYW5nZSB0aGUgdmFsdWUgb2YgdGhlIGNvbXBvbmVudC5cbiAgICB0cmFuc2Zvcm0yRC5wb3NpdGlvbi54ICs9IDEwO1xuICAgIHRyYW5zZm9ybTJELnBvc2l0aW9uLnkgKz0gMTA7XG4gICAgZGVidWdUZXh0QXJlYS5pbm5lckhUTUwgKz1cbiAgICAgIFwiQ3VycmVudCBUcmFuc2Zvcm0yRDogXCIgKyBKU09OLnN0cmluZ2lmeSh0cmFuc2Zvcm0yRCkgKyBcIlxcblwiO1xuICB9O1xuXG4gIGRlYnVnQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBDaGFuZ2VUcmFuc2Zvcm0yRCk7XG59O1xuXG5jb25zdCBDdXN0b21Db21wb25lbnREZW1vID0gKCkgPT4ge1xuICBsZXQgZGVidWdUZXh0QXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVidWczXCIpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gIGxldCByYW5kb21PcmlnaW5hbEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgIFwiZGVidWdCdXR0b24zXCJcbiAgKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgbGV0IGNvcHlDb21wb25lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICBcImRlYnVnQnV0dG9uNFwiXG4gICkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cbiAgLy8gUmV0dXJuIGlmIHRoZSBkZWJ1ZyBlbGVtZW50cyBhcmUgbm90IGZvdW5kLlxuICBpZiAoIWRlYnVnVGV4dEFyZWEgfHwgIXJhbmRvbU9yaWdpbmFsQnV0dG9uIHx8ICFjb3B5Q29tcG9uZW50KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQ3JlYXRlIDIgbmV3IExpbmVEYXRhIGNvbXBvbmVudC5cbiAgY29uc3QgbGluZURhdGE6IExpbmVEYXRhID0gbmV3IExpbmVEYXRhKCk7XG4gIGNvbnN0IGxpbmVEYXRhMjogTGluZURhdGEgPSBuZXcgTGluZURhdGEoKTtcbiAgZGVidWdUZXh0QXJlYS5pbm5lckhUTUwgPVxuICAgIFwiSW5pdGlhbCBMaW5lRGF0YTogXCIgK1xuICAgIEpTT04uc3RyaW5naWZ5KGxpbmVEYXRhKSArXG4gICAgXCJcXG5cIiArXG4gICAgXCJJbml0aWFsIExpbmVEYXRhMjogXCIgK1xuICAgIEpTT04uc3RyaW5naWZ5KGxpbmVEYXRhMikgK1xuICAgIFwiXFxuXCI7XG5cbiAgY29uc3QgUmFuZG9tT3JpZ2luYWwgPSAoKSA9PiB7XG4gICAgLy8gQ2xlYXIgdGhlIHBvaW50cyBhcnJheS5cbiAgICBsaW5lRGF0YS5wb2ludHMubGVuZ3RoID0gMDtcblxuICAgIC8vIEFkZCByYW5kb20gcG9pbnRzIHRvIHRoZSBvcmlnaW5hbCBsaW5lLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBsaW5lRGF0YS5wb2ludHMucHVzaChuZXcgVmVjdG9yMihNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpKSk7XG4gICAgfVxuXG4gICAgZGVidWdUZXh0QXJlYS5pbm5lckhUTUwgPVxuICAgICAgXCJDdXJyZW50IExpbmVEYXRhOiBcIiArXG4gICAgICBKU09OLnN0cmluZ2lmeShsaW5lRGF0YSkgK1xuICAgICAgXCJcXG5cIiArXG4gICAgICBcIkN1cnJlbnQgTGluZURhdGEyOiBcIiArXG4gICAgICBKU09OLnN0cmluZ2lmeShsaW5lRGF0YTIpICtcbiAgICAgIFwiXFxuXCI7XG4gIH07XG5cbiAgY29uc3QgQ29weUNvbXBvbmVudCA9ICgpID0+IHtcbiAgICAvLyBDb3B5IHRoZSBvcmlnaW5hbCBsaW5lIHRvIHRoZSBzZWNvbmQgbGluZS5cbiAgICBsaW5lRGF0YTIuY29weShsaW5lRGF0YSk7XG5cbiAgICBkZWJ1Z1RleHRBcmVhLmlubmVySFRNTCA9XG4gICAgICBcIkN1cnJlbnQgTGluZURhdGE6IFwiICtcbiAgICAgIEpTT04uc3RyaW5naWZ5KGxpbmVEYXRhKSArXG4gICAgICBcIlxcblwiICtcbiAgICAgIFwiQ3VycmVudCBMaW5lRGF0YTI6IFwiICtcbiAgICAgIEpTT04uc3RyaW5naWZ5KGxpbmVEYXRhMikgK1xuICAgICAgXCJcXG5cIjtcbiAgfTtcblxuICByYW5kb21PcmlnaW5hbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgUmFuZG9tT3JpZ2luYWwpO1xuICBjb3B5Q29tcG9uZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBDb3B5Q29tcG9uZW50KTtcbn07XG5cbmV4cG9ydCBjb25zdCBkZW1vMSA9ICgpID0+IHtcbiAgLy8gMi4gQ29tcG9uZW50c1xuICBCYXNpY0NvbXBvbmVudERlbW8oKTtcbiAgQ3VzdG9tVHlwZURlbW8oKTtcbiAgQ3VzdG9tQ29tcG9uZW50RGVtbygpO1xufTtcbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFRyYW5zZm9ybTJERGF0YSB9IGZyb20gXCIuL0RhdGFDb21wb25lbnRzL0RlbW8yL1RyYW5zZm9ybTJERGF0YVwiO1xuaW1wb3J0IHsgQ2xlYXJDYW52YXNTeXN0ZW0gfSBmcm9tIFwiLi9TeXN0ZW1zL0NsZWFyQ2FudmFzU3lzdGVtXCI7XG5pbXBvcnQgeyBEZWJ1Z1JlbmRlclN5c3RlbSB9IGZyb20gXCIuL1N5c3RlbXMvRGVidWdSZW5kZXJTeXN0ZW1cIjtcbmltcG9ydCB7IExvYWRTY2VuZVN5c3RlbSB9IGZyb20gXCIuL1N5c3RlbXMvTG9hZFNjZW5lU3lzdGVtXCI7XG5cbmNvbnN0IHdvcmxkID0gbmV3IFdvcmxkKHtcbiAgZW50aXR5UG9vbFNpemU6IDEwMDAwLFxufSk7XG5cbmNvbnN0IG1haW5VcGRhdGUgPSAoKSA9PiB7XG4gIHdvcmxkLmV4ZWN1dGUoKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW5VcGRhdGUpO1xufTtcblxuZXhwb3J0IGNvbnN0IGRlbW8yID0gKCkgPT4ge1xuICAvLyBHZXQgbWFpbiBjYW52YXMuXG4gIGxldCBtYWluQ2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluQ2FudmFzXCIpO1xuXG4gIC8vIFJlZ2lzdGVyIGFsbCBjb21wb25lbnRzLlxuICB3b3JsZC5yZWdpc3RlckNvbXBvbmVudChUcmFuc2Zvcm0yRERhdGEpO1xuXG4gIC8vIFJlZ2lzdGVyIGFsbCBzeXN0ZW1zLlxuICB3b3JsZFxuICAgIC5yZWdpc3RlclN5c3RlbShMb2FkU2NlbmVTeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKENsZWFyQ2FudmFzU3lzdGVtLCB7XG4gICAgICBjYW52YXM6IG1haW5DYW52YXMsXG4gICAgfSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oRGVidWdSZW5kZXJTeXN0ZW0sIHtcbiAgICAgIGNhbnZhczogbWFpbkNhbnZhcyxcbiAgICB9KTtcblxuICAvLyBTdGFydCBtYWluIGxvb3AuXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluVXBkYXRlKTtcbn07XG4iLCJpbXBvcnQgeyBkZW1vMSB9IGZyb20gXCIuL0RlbW8xXCI7XG5pbXBvcnQgeyBkZW1vMiB9IGZyb20gXCIuL0RlbW8yXCI7XG5cbmNvbnN0IG1haW4gPSAoKSA9PiB7XG4gIGRlbW8xKCk7XG4gIGRlbW8yKCk7XG59O1xuXG53aW5kb3cub25sb2FkID0gbWFpbjtcbiIsImltcG9ydCB7IEF0dHJpYnV0ZXMsIFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBDbGVhckNhbnZhc1N5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGNhbnZhc0NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICBpbml0KGF0dHJpYnV0ZXM/OiBBdHRyaWJ1dGVzKTogdm9pZCB7XG4gICAgLy8gR2V0IHRoZSBjYW52YXMgZWxlbWVudC5cbiAgICB0aGlzLmNhbnZhcyA9IGF0dHJpYnV0ZXMuY2FudmFzIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgIHRoaXMuY2FudmFzQ29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXG4gICAgICBcIjJkXCJcbiAgICApIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgfVxuXG4gIGV4ZWN1dGUoZGVsdGE6IG51bWJlciwgdGltZTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gQ2xlYXIgdGhlIGNhbnZhcy5cbiAgICB0aGlzLmNhbnZhc0NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBdHRyaWJ1dGVzLCBTeXN0ZW0sIFN5c3RlbVF1ZXJpZXMgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVHJhbnNmb3JtMkREYXRhIH0gZnJvbSBcIi4uL0RhdGFDb21wb25lbnRzL0RlbW8yL1RyYW5zZm9ybTJERGF0YVwiO1xuXG5leHBvcnQgY2xhc3MgRGVidWdSZW5kZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBzdGF0aWMgcXVlcmllczogU3lzdGVtUXVlcmllcyA9IHtcbiAgICB0cmFuc2Zvcm1FbnRpdGllczoge1xuICAgICAgY29tcG9uZW50czogW1RyYW5zZm9ybTJERGF0YV0sXG4gICAgfSxcbiAgfTtcblxuICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuICBjYW52YXNDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgaW5pdChhdHRyaWJ1dGVzPzogQXR0cmlidXRlcyk6IHZvaWQge1xuICAgIC8vIEdldCB0aGUgY2FudmFzIGVsZW1lbnQuXG4gICAgdGhpcy5jYW52YXMgPSBhdHRyaWJ1dGVzLmNhbnZhcyBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICB0aGlzLmNhbnZhc0NvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFxuICAgICAgXCIyZFwiXG4gICAgKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIH1cblxuICBleGVjdXRlKGRlbHRhOiBudW1iZXIsIHRpbWU6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIFJlbmRlciBQb3NpdGlvbiBmb3IgYWxsIHRoZSB0cmFuc2Zvcm0gZW50aXRpZXMuXG4gICAgdGhpcy5xdWVyaWVzLnRyYW5zZm9ybUVudGl0aWVzLnJlc3VsdHMuZm9yRWFjaCgoZW50aXR5KSA9PiB7XG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0yRERhdGEpO1xuICAgICAgbGV0IHggPSB0cmFuc2Zvcm0ucG9zaXRpb24ueDtcbiAgICAgIGxldCB5ID0gdHJhbnNmb3JtLnBvc2l0aW9uLnk7XG5cbiAgICAgIC8vIERyYXcgYSBjaXJjbGUgYXQgdGhlIHBvc2l0aW9uLlxuICAgICAgdGhpcy5jYW52YXNDb250ZXh0LnNhdmUoKTtcbiAgICAgIHRoaXMuY2FudmFzQ29udGV4dC50cmFuc2xhdGUoeCwgeSk7XG5cbiAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSBcInJlZFwiO1xuICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmFyYygwLCAwLCAyMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmZpbGwoKTtcblxuICAgICAgdGhpcy5jYW52YXNDb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQXR0cmlidXRlcywgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFRyYW5zZm9ybTJERGF0YSB9IGZyb20gXCIuLi9EYXRhQ29tcG9uZW50cy9EZW1vMi9UcmFuc2Zvcm0yRERhdGFcIjtcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vVXRpbHMvVmVjdG9yMlwiO1xuXG4vKipcbiAqIFN5c3RlbSB0byBsb2FkIHRoZSBzY2VuZS5cbiAqL1xuZXhwb3J0IGNsYXNzIExvYWRTY2VuZVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoYXR0cmlidXRlcz86IEF0dHJpYnV0ZXMpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyhcIkxvYWRTY2VuZVN5c3RlbS5pbml0KClcIik7XG5cbiAgICAvLyBJbnN0YW50aWF0ZSBhIG5ldyBlbnRpdHkuXG4gICAgbGV0IGVudGl0eUluc3RhbmNlID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKTtcbiAgICAvLyBBZGQgVHJhbnNmb3JtMkREYXRhIGNvbXBvbmVudCB0byB0aGUgZW50aXR5LlxuICAgIGVudGl0eUluc3RhbmNlLmFkZENvbXBvbmVudChUcmFuc2Zvcm0yRERhdGEsIHtcbiAgICAgIHBvc2l0aW9uOiBuZXcgVmVjdG9yMigwLCAwKSxcbiAgICB9KTtcbiAgfVxuXG4gIGV4ZWN1dGUoZGVsdGE6IG51bWJlciwgdGltZTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gRG8gbm90aGluZy5cbiAgfVxufVxuIiwiaW1wb3J0IHsgY2xvbmVDbG9uYWJsZSwgY29weUNvcHlhYmxlLCBjcmVhdGVUeXBlIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFZlY3RvcjIge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIgPSAwLCB5OiBudW1iZXIgPSAwKSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICB9XG5cbiAgc2V0KHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICB9XG5cbiAgY29weSh2OiBWZWN0b3IyKSB7XG4gICAgdGhpcy54ID0gdi54O1xuICAgIHRoaXMueSA9IHYueTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFZlY3RvcjJUeXBlID0gY3JlYXRlVHlwZSh7XG4gIG5hbWU6IFwiVmVjdG9yMlwiLFxuICBkZWZhdWx0OiBuZXcgVmVjdG9yMigwLCAwKSxcbiAgY29weTogY29weUNvcHlhYmxlPFZlY3RvcjI+LFxuICBjbG9uZTogY2xvbmVDbG9uYWJsZTxWZWN0b3IyPixcbn0pO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvTWFpbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==