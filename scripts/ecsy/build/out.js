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

/***/ "./src/DataComponents/LineData.ts":
/*!****************************************!*\
  !*** ./src/DataComponents/LineData.ts ***!
  \****************************************/
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

/***/ "./src/DataComponents/Transform2DData.ts":
/*!***********************************************!*\
  !*** ./src/DataComponents/Transform2DData.ts ***!
  \***********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ecsy */ "./node_modules/ecsy/src/index.js"), __webpack_require__(/*! ../Utils/Vector2 */ "./src/Utils/Vector2.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ecsy_1, Vector2_1) {
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

/***/ "./src/DataComponents/ValueData.ts":
/*!*****************************************!*\
  !*** ./src/DataComponents/ValueData.ts ***!
  \*****************************************/
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

/***/ "./src/Main.ts":
/*!*********************!*\
  !*** ./src/Main.ts ***!
  \*********************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ecsy */ "./node_modules/ecsy/src/index.js"), __webpack_require__(/*! ./DataComponents/LineData */ "./src/DataComponents/LineData.ts"), __webpack_require__(/*! ./DataComponents/Transform2DData */ "./src/DataComponents/Transform2DData.ts"), __webpack_require__(/*! ./DataComponents/ValueData */ "./src/DataComponents/ValueData.ts"), __webpack_require__(/*! ./Utils/Vector2 */ "./src/Utils/Vector2.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ecsy_1, LineData_1, Transform2DData_1, ValueData_1, Vector2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", ({ value: true }));
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
    const main = () => {
        // 2. Components
        BasicComponentDemo();
        CustomTypeDemo();
        CustomComponentDemo();
    };
    window.onload = main;
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
        constructor(x, y) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Vjc3kvc3JjL0NvbXBvbmVudE1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Vjc3kvc3JjL0VudGl0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvRW50aXR5TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvRXZlbnREaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9PYmplY3RQb29sLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9RdWVyeS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvUXVlcnlNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9SZW1vdGVEZXZUb29scy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvUmVtb3RlRGV2VG9vbHMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Vjc3kvc3JjL1N5c3RlbS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvU3lzdGVtTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvU3lzdGVtU3RhdGVDb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Vjc3kvc3JjL1RhZ0NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvVHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Vjc3kvc3JjL1V0aWxzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9WZXJzaW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lY3N5L3NyYy9Xb3JsZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvV3JhcEltbXV0YWJsZUNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWNzeS9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0RhdGFDb21wb25lbnRzL0xpbmVEYXRhLnRzIiwid2VicGFjazovLy8uL3NyYy9EYXRhQ29tcG9uZW50cy9UcmFuc2Zvcm0yRERhdGEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0RhdGFDb21wb25lbnRzL1ZhbHVlRGF0YS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVXRpbHMvVmVjdG9yMi50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgaWYgKHByb3BzICE9PSBmYWxzZSkge1xuICAgICAgY29uc3Qgc2NoZW1hID0gdGhpcy5jb25zdHJ1Y3Rvci5zY2hlbWE7XG5cbiAgICAgIGZvciAoY29uc3Qga2V5IGluIHNjaGVtYSkge1xuICAgICAgICBpZiAocHJvcHMgJiYgcHJvcHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHByb3BzW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3Qgc2NoZW1hUHJvcCA9IHNjaGVtYVtrZXldO1xuICAgICAgICAgIGlmIChzY2hlbWFQcm9wLmhhc093blByb3BlcnR5KFwiZGVmYXVsdFwiKSkge1xuICAgICAgICAgICAgdGhpc1trZXldID0gc2NoZW1hUHJvcC50eXBlLmNsb25lKHNjaGVtYVByb3AuZGVmYXVsdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBzY2hlbWFQcm9wLnR5cGU7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSB0eXBlLmNsb25lKHR5cGUuZGVmYXVsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgcHJvcHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmNoZWNrVW5kZWZpbmVkQXR0cmlidXRlcyhwcm9wcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fcG9vbCA9IG51bGw7XG4gIH1cblxuICBjb3B5KHNvdXJjZSkge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXMuY29uc3RydWN0b3Iuc2NoZW1hO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gc2NoZW1hKSB7XG4gICAgICBjb25zdCBwcm9wID0gc2NoZW1hW2tleV07XG5cbiAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICB0aGlzW2tleV0gPSBwcm9wLnR5cGUuY29weShzb3VyY2Vba2V5XSwgdGhpc1trZXldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBAREVCVUdcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICB0aGlzLmNoZWNrVW5kZWZpbmVkQXR0cmlidXRlcyhzb3VyY2UpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKCkuY29weSh0aGlzKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXMuY29uc3RydWN0b3Iuc2NoZW1hO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gc2NoZW1hKSB7XG4gICAgICBjb25zdCBzY2hlbWFQcm9wID0gc2NoZW1hW2tleV07XG5cbiAgICAgIGlmIChzY2hlbWFQcm9wLmhhc093blByb3BlcnR5KFwiZGVmYXVsdFwiKSkge1xuICAgICAgICB0aGlzW2tleV0gPSBzY2hlbWFQcm9wLnR5cGUuY29weShzY2hlbWFQcm9wLmRlZmF1bHQsIHRoaXNba2V5XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0eXBlID0gc2NoZW1hUHJvcC50eXBlO1xuICAgICAgICB0aGlzW2tleV0gPSB0eXBlLmNvcHkodHlwZS5kZWZhdWx0LCB0aGlzW2tleV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKHRoaXMuX3Bvb2wpIHtcbiAgICAgIHRoaXMuX3Bvb2wucmVsZWFzZSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBnZXROYW1lKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmdldE5hbWUoKTtcbiAgfVxuXG4gIGNoZWNrVW5kZWZpbmVkQXR0cmlidXRlcyhzcmMpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzLmNvbnN0cnVjdG9yLnNjaGVtYTtcblxuICAgIC8vIENoZWNrIHRoYXQgdGhlIGF0dHJpYnV0ZXMgZGVmaW5lZCBpbiBzb3VyY2UgYXJlIGFsc28gZGVmaW5lZCBpbiB0aGUgc2NoZW1hXG4gICAgT2JqZWN0LmtleXMoc3JjKS5mb3JFYWNoKChzcmNLZXkpID0+IHtcbiAgICAgIGlmICghc2NoZW1hLmhhc093blByb3BlcnR5KHNyY0tleSkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIGBUcnlpbmcgdG8gc2V0IGF0dHJpYnV0ZSAnJHtzcmNLZXl9JyBub3QgZGVmaW5lZCBpbiB0aGUgJyR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfScgc2NoZW1hLiBQbGVhc2UgZml4IHRoZSBzY2hlbWEsIHRoZSBhdHRyaWJ1dGUgdmFsdWUgd29uJ3QgYmUgc2V0YFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbkNvbXBvbmVudC5zY2hlbWEgPSB7fTtcbkNvbXBvbmVudC5pc0NvbXBvbmVudCA9IHRydWU7XG5Db21wb25lbnQuZ2V0TmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuZGlzcGxheU5hbWUgfHwgdGhpcy5uYW1lO1xufTtcbiIsImltcG9ydCB7IE9iamVjdFBvb2wgfSBmcm9tIFwiLi9PYmplY3RQb29sLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5Db21wb25lbnRzID0gW107XG4gICAgdGhpcy5fQ29tcG9uZW50c01hcCA9IHt9O1xuXG4gICAgdGhpcy5fY29tcG9uZW50UG9vbCA9IHt9O1xuICAgIHRoaXMubnVtQ29tcG9uZW50cyA9IHt9O1xuICAgIHRoaXMubmV4dENvbXBvbmVudElkID0gMDtcbiAgfVxuXG4gIGhhc0NvbXBvbmVudChDb21wb25lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5Db21wb25lbnRzLmluZGV4T2YoQ29tcG9uZW50KSAhPT0gLTE7XG4gIH1cblxuICByZWdpc3RlckNvbXBvbmVudChDb21wb25lbnQsIG9iamVjdFBvb2wpIHtcbiAgICBpZiAodGhpcy5Db21wb25lbnRzLmluZGV4T2YoQ29tcG9uZW50KSAhPT0gLTEpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgYENvbXBvbmVudCB0eXBlOiAnJHtDb21wb25lbnQuZ2V0TmFtZSgpfScgYWxyZWFkeSByZWdpc3RlcmVkLmBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2NoZW1hID0gQ29tcG9uZW50LnNjaGVtYTtcblxuICAgIGlmICghc2NoZW1hKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBDb21wb25lbnQgXCIke0NvbXBvbmVudC5nZXROYW1lKCl9XCIgaGFzIG5vIHNjaGVtYSBwcm9wZXJ0eS5gXG4gICAgICApO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgcHJvcE5hbWUgaW4gc2NoZW1hKSB7XG4gICAgICBjb25zdCBwcm9wID0gc2NoZW1hW3Byb3BOYW1lXTtcblxuICAgICAgaWYgKCFwcm9wLnR5cGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBJbnZhbGlkIHNjaGVtYSBmb3IgY29tcG9uZW50IFwiJHtDb21wb25lbnQuZ2V0TmFtZSgpfVwiLiBNaXNzaW5nIHR5cGUgZm9yIFwiJHtwcm9wTmFtZX1cIiBwcm9wZXJ0eS5gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgQ29tcG9uZW50Ll90eXBlSWQgPSB0aGlzLm5leHRDb21wb25lbnRJZCsrO1xuICAgIHRoaXMuQ29tcG9uZW50cy5wdXNoKENvbXBvbmVudCk7XG4gICAgdGhpcy5fQ29tcG9uZW50c01hcFtDb21wb25lbnQuX3R5cGVJZF0gPSBDb21wb25lbnQ7XG4gICAgdGhpcy5udW1Db21wb25lbnRzW0NvbXBvbmVudC5fdHlwZUlkXSA9IDA7XG5cbiAgICBpZiAob2JqZWN0UG9vbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvYmplY3RQb29sID0gbmV3IE9iamVjdFBvb2woQ29tcG9uZW50KTtcbiAgICB9IGVsc2UgaWYgKG9iamVjdFBvb2wgPT09IGZhbHNlKSB7XG4gICAgICBvYmplY3RQb29sID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbXBvbmVudFBvb2xbQ29tcG9uZW50Ll90eXBlSWRdID0gb2JqZWN0UG9vbDtcbiAgfVxuXG4gIGNvbXBvbmVudEFkZGVkVG9FbnRpdHkoQ29tcG9uZW50KSB7XG4gICAgdGhpcy5udW1Db21wb25lbnRzW0NvbXBvbmVudC5fdHlwZUlkXSsrO1xuICB9XG5cbiAgY29tcG9uZW50UmVtb3ZlZEZyb21FbnRpdHkoQ29tcG9uZW50KSB7XG4gICAgdGhpcy5udW1Db21wb25lbnRzW0NvbXBvbmVudC5fdHlwZUlkXS0tO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50c1Bvb2woQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudFBvb2xbQ29tcG9uZW50Ll90eXBlSWRdO1xuICB9XG59XG4iLCJpbXBvcnQgUXVlcnkgZnJvbSBcIi4vUXVlcnkuanNcIjtcbmltcG9ydCB3cmFwSW1tdXRhYmxlQ29tcG9uZW50IGZyb20gXCIuL1dyYXBJbW11dGFibGVDb21wb25lbnQuanNcIjtcblxuZXhwb3J0IGNsYXNzIEVudGl0eSB7XG4gIGNvbnN0cnVjdG9yKGVudGl0eU1hbmFnZXIpIHtcbiAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyID0gZW50aXR5TWFuYWdlciB8fCBudWxsO1xuXG4gICAgLy8gVW5pcXVlIElEIGZvciB0aGlzIGVudGl0eVxuICAgIHRoaXMuaWQgPSBlbnRpdHlNYW5hZ2VyLl9uZXh0RW50aXR5SWQrKztcblxuICAgIC8vIExpc3Qgb2YgY29tcG9uZW50cyB0eXBlcyB0aGUgZW50aXR5IGhhc1xuICAgIHRoaXMuX0NvbXBvbmVudFR5cGVzID0gW107XG5cbiAgICAvLyBJbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50c1xuICAgIHRoaXMuX2NvbXBvbmVudHMgPSB7fTtcblxuICAgIHRoaXMuX2NvbXBvbmVudHNUb1JlbW92ZSA9IHt9O1xuXG4gICAgLy8gUXVlcmllcyB3aGVyZSB0aGUgZW50aXR5IGlzIGFkZGVkXG4gICAgdGhpcy5xdWVyaWVzID0gW107XG5cbiAgICAvLyBVc2VkIGZvciBkZWZlcnJlZCByZW1vdmFsXG4gICAgdGhpcy5fQ29tcG9uZW50VHlwZXNUb1JlbW92ZSA9IFtdO1xuXG4gICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xuXG4gICAgLy9pZiB0aGVyZSBhcmUgc3RhdGUgY29tcG9uZW50cyBvbiBhIGVudGl0eSwgaXQgY2FuJ3QgYmUgcmVtb3ZlZCBjb21wbGV0ZWx5XG4gICAgdGhpcy5udW1TdGF0ZUNvbXBvbmVudHMgPSAwO1xuICB9XG5cbiAgLy8gQ09NUE9ORU5UU1xuXG4gIGdldENvbXBvbmVudChDb21wb25lbnQsIGluY2x1ZGVSZW1vdmVkKSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuX2NvbXBvbmVudHNbQ29tcG9uZW50Ll90eXBlSWRdO1xuXG4gICAgaWYgKCFjb21wb25lbnQgJiYgaW5jbHVkZVJlbW92ZWQgPT09IHRydWUpIHtcbiAgICAgIGNvbXBvbmVudCA9IHRoaXMuX2NvbXBvbmVudHNUb1JlbW92ZVtDb21wb25lbnQuX3R5cGVJZF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIlxuICAgICAgPyB3cmFwSW1tdXRhYmxlQ29tcG9uZW50KENvbXBvbmVudCwgY29tcG9uZW50KVxuICAgICAgOiBjb21wb25lbnQ7XG4gIH1cblxuICBnZXRSZW1vdmVkQ29tcG9uZW50KENvbXBvbmVudCkge1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuX2NvbXBvbmVudHNUb1JlbW92ZVtDb21wb25lbnQuX3R5cGVJZF07XG5cbiAgICByZXR1cm4gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiXG4gICAgICA/IHdyYXBJbW11dGFibGVDb21wb25lbnQoQ29tcG9uZW50LCBjb21wb25lbnQpXG4gICAgICA6IGNvbXBvbmVudDtcbiAgfVxuXG4gIGdldENvbXBvbmVudHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHM7XG4gIH1cblxuICBnZXRDb21wb25lbnRzVG9SZW1vdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHNUb1JlbW92ZTtcbiAgfVxuXG4gIGdldENvbXBvbmVudFR5cGVzKCkge1xuICAgIHJldHVybiB0aGlzLl9Db21wb25lbnRUeXBlcztcbiAgfVxuXG4gIGdldE11dGFibGVDb21wb25lbnQoQ29tcG9uZW50KSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuX2NvbXBvbmVudHNbQ29tcG9uZW50Ll90eXBlSWRdO1xuXG4gICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5xdWVyaWVzW2ldO1xuICAgICAgLy8gQHRvZG8gYWNjZWxlcmF0ZSB0aGlzIGNoZWNrLiBNYXliZSBoYXZpbmcgcXVlcnkuX0NvbXBvbmVudHMgYXMgYW4gb2JqZWN0XG4gICAgICAvLyBAdG9kbyBhZGQgTm90IGNvbXBvbmVudHNcbiAgICAgIGlmIChxdWVyeS5yZWFjdGl2ZSAmJiBxdWVyeS5Db21wb25lbnRzLmluZGV4T2YoQ29tcG9uZW50KSAhPT0gLTEpIHtcbiAgICAgICAgcXVlcnkuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgUXVlcnkucHJvdG90eXBlLkNPTVBPTkVOVF9DSEFOR0VELFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgY29tcG9uZW50XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb21wb25lbnQ7XG4gIH1cblxuICBhZGRDb21wb25lbnQoQ29tcG9uZW50LCB2YWx1ZXMpIHtcbiAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLmVudGl0eUFkZENvbXBvbmVudCh0aGlzLCBDb21wb25lbnQsIHZhbHVlcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZW1vdmVDb21wb25lbnQoQ29tcG9uZW50LCBmb3JjZUltbWVkaWF0ZSkge1xuICAgIHRoaXMuX2VudGl0eU1hbmFnZXIuZW50aXR5UmVtb3ZlQ29tcG9uZW50KHRoaXMsIENvbXBvbmVudCwgZm9yY2VJbW1lZGlhdGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaGFzQ29tcG9uZW50KENvbXBvbmVudCwgaW5jbHVkZVJlbW92ZWQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgISF+dGhpcy5fQ29tcG9uZW50VHlwZXMuaW5kZXhPZihDb21wb25lbnQpIHx8XG4gICAgICAoaW5jbHVkZVJlbW92ZWQgPT09IHRydWUgJiYgdGhpcy5oYXNSZW1vdmVkQ29tcG9uZW50KENvbXBvbmVudCkpXG4gICAgKTtcbiAgfVxuXG4gIGhhc1JlbW92ZWRDb21wb25lbnQoQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuICEhfnRoaXMuX0NvbXBvbmVudFR5cGVzVG9SZW1vdmUuaW5kZXhPZihDb21wb25lbnQpO1xuICB9XG5cbiAgaGFzQWxsQ29tcG9uZW50cyhDb21wb25lbnRzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzQ29tcG9uZW50KENvbXBvbmVudHNbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaGFzQW55Q29tcG9uZW50cyhDb21wb25lbnRzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5oYXNDb21wb25lbnQoQ29tcG9uZW50c1tpXSkpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZW1vdmVBbGxDb21wb25lbnRzKGZvcmNlSW1tZWRpYXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0eU1hbmFnZXIuZW50aXR5UmVtb3ZlQWxsQ29tcG9uZW50cyh0aGlzLCBmb3JjZUltbWVkaWF0ZSk7XG4gIH1cblxuICBjb3B5KHNyYykge1xuICAgIC8vIFRPRE86IFRoaXMgY2FuIGRlZmluaXRlbHkgYmUgb3B0aW1pemVkXG4gICAgZm9yICh2YXIgZWNzeUNvbXBvbmVudElkIGluIHNyYy5fY29tcG9uZW50cykge1xuICAgICAgdmFyIHNyY0NvbXBvbmVudCA9IHNyYy5fY29tcG9uZW50c1tlY3N5Q29tcG9uZW50SWRdO1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoc3JjQ29tcG9uZW50LmNvbnN0cnVjdG9yKTtcbiAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmdldENvbXBvbmVudChzcmNDb21wb25lbnQuY29uc3RydWN0b3IpO1xuICAgICAgY29tcG9uZW50LmNvcHkoc3JjQ29tcG9uZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgRW50aXR5KHRoaXMuX2VudGl0eU1hbmFnZXIpLmNvcHkodGhpcyk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmlkID0gdGhpcy5fZW50aXR5TWFuYWdlci5fbmV4dEVudGl0eUlkKys7XG4gICAgdGhpcy5fQ29tcG9uZW50VHlwZXMubGVuZ3RoID0gMDtcbiAgICB0aGlzLnF1ZXJpZXMubGVuZ3RoID0gMDtcblxuICAgIGZvciAodmFyIGVjc3lDb21wb25lbnRJZCBpbiB0aGlzLl9jb21wb25lbnRzKSB7XG4gICAgICBkZWxldGUgdGhpcy5fY29tcG9uZW50c1tlY3N5Q29tcG9uZW50SWRdO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShmb3JjZUltbWVkaWF0ZSkge1xuICAgIHJldHVybiB0aGlzLl9lbnRpdHlNYW5hZ2VyLnJlbW92ZUVudGl0eSh0aGlzLCBmb3JjZUltbWVkaWF0ZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE9iamVjdFBvb2wgfSBmcm9tIFwiLi9PYmplY3RQb29sLmpzXCI7XG5pbXBvcnQgUXVlcnlNYW5hZ2VyIGZyb20gXCIuL1F1ZXJ5TWFuYWdlci5qc1wiO1xuaW1wb3J0IEV2ZW50RGlzcGF0Y2hlciBmcm9tIFwiLi9FdmVudERpc3BhdGNoZXIuanNcIjtcbmltcG9ydCB7IFN5c3RlbVN0YXRlQ29tcG9uZW50IH0gZnJvbSBcIi4vU3lzdGVtU3RhdGVDb21wb25lbnQuanNcIjtcblxuY2xhc3MgRW50aXR5UG9vbCBleHRlbmRzIE9iamVjdFBvb2wge1xuICBjb25zdHJ1Y3RvcihlbnRpdHlNYW5hZ2VyLCBlbnRpdHlDbGFzcywgaW5pdGlhbFNpemUpIHtcbiAgICBzdXBlcihlbnRpdHlDbGFzcywgdW5kZWZpbmVkKTtcbiAgICB0aGlzLmVudGl0eU1hbmFnZXIgPSBlbnRpdHlNYW5hZ2VyO1xuXG4gICAgaWYgKHR5cGVvZiBpbml0aWFsU2l6ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5leHBhbmQoaW5pdGlhbFNpemUpO1xuICAgIH1cbiAgfVxuXG4gIGV4cGFuZChjb3VudCkge1xuICAgIGZvciAodmFyIG4gPSAwOyBuIDwgY291bnQ7IG4rKykge1xuICAgICAgdmFyIGNsb25lID0gbmV3IHRoaXMuVCh0aGlzLmVudGl0eU1hbmFnZXIpO1xuICAgICAgY2xvbmUuX3Bvb2wgPSB0aGlzO1xuICAgICAgdGhpcy5mcmVlTGlzdC5wdXNoKGNsb25lKTtcbiAgICB9XG4gICAgdGhpcy5jb3VudCArPSBjb3VudDtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAY2xhc3MgRW50aXR5TWFuYWdlclxuICovXG5leHBvcnQgY2xhc3MgRW50aXR5TWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkKSB7XG4gICAgdGhpcy53b3JsZCA9IHdvcmxkO1xuICAgIHRoaXMuY29tcG9uZW50c01hbmFnZXIgPSB3b3JsZC5jb21wb25lbnRzTWFuYWdlcjtcblxuICAgIC8vIEFsbCB0aGUgZW50aXRpZXMgaW4gdGhpcyBpbnN0YW5jZVxuICAgIHRoaXMuX2VudGl0aWVzID0gW107XG4gICAgdGhpcy5fbmV4dEVudGl0eUlkID0gMDtcblxuICAgIHRoaXMuX2VudGl0aWVzQnlOYW1lcyA9IHt9O1xuXG4gICAgdGhpcy5fcXVlcnlNYW5hZ2VyID0gbmV3IFF1ZXJ5TWFuYWdlcih0aGlzKTtcbiAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlciA9IG5ldyBFdmVudERpc3BhdGNoZXIoKTtcbiAgICB0aGlzLl9lbnRpdHlQb29sID0gbmV3IEVudGl0eVBvb2woXG4gICAgICB0aGlzLFxuICAgICAgdGhpcy53b3JsZC5vcHRpb25zLmVudGl0eUNsYXNzLFxuICAgICAgdGhpcy53b3JsZC5vcHRpb25zLmVudGl0eVBvb2xTaXplXG4gICAgKTtcblxuICAgIC8vIERlZmVycmVkIGRlbGV0aW9uXG4gICAgdGhpcy5lbnRpdGllc1dpdGhDb21wb25lbnRzVG9SZW1vdmUgPSBbXTtcbiAgICB0aGlzLmVudGl0aWVzVG9SZW1vdmUgPSBbXTtcbiAgICB0aGlzLmRlZmVycmVkUmVtb3ZhbEVuYWJsZWQgPSB0cnVlO1xuICB9XG5cbiAgZ2V0RW50aXR5QnlOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZW50aXRpZXNCeU5hbWVzW25hbWVdO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBlbnRpdHlcbiAgICovXG4gIGNyZWF0ZUVudGl0eShuYW1lKSB7XG4gICAgdmFyIGVudGl0eSA9IHRoaXMuX2VudGl0eVBvb2wuYWNxdWlyZSgpO1xuICAgIGVudGl0eS5hbGl2ZSA9IHRydWU7XG4gICAgZW50aXR5Lm5hbWUgPSBuYW1lIHx8IFwiXCI7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIGlmICh0aGlzLl9lbnRpdGllc0J5TmFtZXNbbmFtZV0pIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBFbnRpdHkgbmFtZSAnJHtuYW1lfScgYWxyZWFkeSBleGlzdGApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZW50aXRpZXNCeU5hbWVzW25hbWVdID0gZW50aXR5O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2VudGl0aWVzLnB1c2goZW50aXR5KTtcbiAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KEVOVElUWV9DUkVBVEVELCBlbnRpdHkpO1xuICAgIHJldHVybiBlbnRpdHk7XG4gIH1cblxuICAvLyBDT01QT05FTlRTXG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbXBvbmVudCB0byBhbiBlbnRpdHlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgd2hlcmUgdGhlIGNvbXBvbmVudCB3aWxsIGJlIGFkZGVkXG4gICAqIEBwYXJhbSB7Q29tcG9uZW50fSBDb21wb25lbnQgQ29tcG9uZW50IHRvIGJlIGFkZGVkIHRvIHRoZSBlbnRpdHlcbiAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyBPcHRpb25hbCB2YWx1ZXMgdG8gcmVwbGFjZSB0aGUgZGVmYXVsdCBhdHRyaWJ1dGVzXG4gICAqL1xuICBlbnRpdHlBZGRDb21wb25lbnQoZW50aXR5LCBDb21wb25lbnQsIHZhbHVlcykge1xuICAgIC8vIEB0b2RvIFByb2JhYmx5IGRlZmluZSBDb21wb25lbnQuX3R5cGVJZCB3aXRoIGEgZGVmYXVsdCB2YWx1ZSBhbmQgYXZvaWQgdXNpbmcgdHlwZW9mXG4gICAgaWYgKFxuICAgICAgdHlwZW9mIENvbXBvbmVudC5fdHlwZUlkID09PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAhdGhpcy53b3JsZC5jb21wb25lbnRzTWFuYWdlci5fQ29tcG9uZW50c01hcFtDb21wb25lbnQuX3R5cGVJZF1cbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEF0dGVtcHRlZCB0byBhZGQgdW5yZWdpc3RlcmVkIGNvbXBvbmVudCBcIiR7Q29tcG9uZW50LmdldE5hbWUoKX1cImBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKH5lbnRpdHkuX0NvbXBvbmVudFR5cGVzLmluZGV4T2YoQ29tcG9uZW50KSkge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgXCJDb21wb25lbnQgdHlwZSBhbHJlYWR5IGV4aXN0cyBvbiBlbnRpdHkuXCIsXG4gICAgICAgICAgZW50aXR5LFxuICAgICAgICAgIENvbXBvbmVudC5nZXROYW1lKClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlbnRpdHkuX0NvbXBvbmVudFR5cGVzLnB1c2goQ29tcG9uZW50KTtcblxuICAgIGlmIChDb21wb25lbnQuX19wcm90b19fID09PSBTeXN0ZW1TdGF0ZUNvbXBvbmVudCkge1xuICAgICAgZW50aXR5Lm51bVN0YXRlQ29tcG9uZW50cysrO1xuICAgIH1cblxuICAgIHZhciBjb21wb25lbnRQb29sID0gdGhpcy53b3JsZC5jb21wb25lbnRzTWFuYWdlci5nZXRDb21wb25lbnRzUG9vbChcbiAgICAgIENvbXBvbmVudFxuICAgICk7XG5cbiAgICB2YXIgY29tcG9uZW50ID0gY29tcG9uZW50UG9vbFxuICAgICAgPyBjb21wb25lbnRQb29sLmFjcXVpcmUoKVxuICAgICAgOiBuZXcgQ29tcG9uZW50KHZhbHVlcyk7XG5cbiAgICBpZiAoY29tcG9uZW50UG9vbCAmJiB2YWx1ZXMpIHtcbiAgICAgIGNvbXBvbmVudC5jb3B5KHZhbHVlcyk7XG4gICAgfVxuXG4gICAgZW50aXR5Ll9jb21wb25lbnRzW0NvbXBvbmVudC5fdHlwZUlkXSA9IGNvbXBvbmVudDtcblxuICAgIHRoaXMuX3F1ZXJ5TWFuYWdlci5vbkVudGl0eUNvbXBvbmVudEFkZGVkKGVudGl0eSwgQ29tcG9uZW50KTtcbiAgICB0aGlzLndvcmxkLmNvbXBvbmVudHNNYW5hZ2VyLmNvbXBvbmVudEFkZGVkVG9FbnRpdHkoQ29tcG9uZW50KTtcblxuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoQ09NUE9ORU5UX0FEREVELCBlbnRpdHksIENvbXBvbmVudCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgY29tcG9uZW50IGZyb20gYW4gZW50aXR5XG4gICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgRW50aXR5IHdoaWNoIHdpbGwgZ2V0IHJlbW92ZWQgdGhlIGNvbXBvbmVudFxuICAgKiBAcGFyYW0geyp9IENvbXBvbmVudCBDb21wb25lbnQgdG8gcmVtb3ZlIGZyb20gdGhlIGVudGl0eVxuICAgKiBAcGFyYW0ge0Jvb2x9IGltbWVkaWF0ZWx5IElmIHlvdSB3YW50IHRvIHJlbW92ZSB0aGUgY29tcG9uZW50IGltbWVkaWF0ZWx5IGluc3RlYWQgb2YgZGVmZXJyZWQgKERlZmF1bHQgaXMgZmFsc2UpXG4gICAqL1xuICBlbnRpdHlSZW1vdmVDb21wb25lbnQoZW50aXR5LCBDb21wb25lbnQsIGltbWVkaWF0ZWx5KSB7XG4gICAgdmFyIGluZGV4ID0gZW50aXR5Ll9Db21wb25lbnRUeXBlcy5pbmRleE9mKENvbXBvbmVudCk7XG4gICAgaWYgKCF+aW5kZXgpIHJldHVybjtcblxuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoQ09NUE9ORU5UX1JFTU9WRSwgZW50aXR5LCBDb21wb25lbnQpO1xuXG4gICAgaWYgKGltbWVkaWF0ZWx5KSB7XG4gICAgICB0aGlzLl9lbnRpdHlSZW1vdmVDb21wb25lbnRTeW5jKGVudGl0eSwgQ29tcG9uZW50LCBpbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChlbnRpdHkuX0NvbXBvbmVudFR5cGVzVG9SZW1vdmUubGVuZ3RoID09PSAwKVxuICAgICAgICB0aGlzLmVudGl0aWVzV2l0aENvbXBvbmVudHNUb1JlbW92ZS5wdXNoKGVudGl0eSk7XG5cbiAgICAgIGVudGl0eS5fQ29tcG9uZW50VHlwZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIGVudGl0eS5fQ29tcG9uZW50VHlwZXNUb1JlbW92ZS5wdXNoKENvbXBvbmVudCk7XG5cbiAgICAgIGVudGl0eS5fY29tcG9uZW50c1RvUmVtb3ZlW0NvbXBvbmVudC5fdHlwZUlkXSA9XG4gICAgICAgIGVudGl0eS5fY29tcG9uZW50c1tDb21wb25lbnQuX3R5cGVJZF07XG4gICAgICBkZWxldGUgZW50aXR5Ll9jb21wb25lbnRzW0NvbXBvbmVudC5fdHlwZUlkXTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBlYWNoIGluZGV4ZWQgcXVlcnkgdG8gc2VlIGlmIHdlIG5lZWQgdG8gcmVtb3ZlIGl0XG4gICAgdGhpcy5fcXVlcnlNYW5hZ2VyLm9uRW50aXR5Q29tcG9uZW50UmVtb3ZlZChlbnRpdHksIENvbXBvbmVudCk7XG5cbiAgICBpZiAoQ29tcG9uZW50Ll9fcHJvdG9fXyA9PT0gU3lzdGVtU3RhdGVDb21wb25lbnQpIHtcbiAgICAgIGVudGl0eS5udW1TdGF0ZUNvbXBvbmVudHMtLTtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIGVudGl0eSB3YXMgYSBnaG9zdCB3YWl0aW5nIGZvciB0aGUgbGFzdCBzeXN0ZW0gc3RhdGUgY29tcG9uZW50IHRvIGJlIHJlbW92ZWRcbiAgICAgIGlmIChlbnRpdHkubnVtU3RhdGVDb21wb25lbnRzID09PSAwICYmICFlbnRpdHkuYWxpdmUpIHtcbiAgICAgICAgZW50aXR5LnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9lbnRpdHlSZW1vdmVDb21wb25lbnRTeW5jKGVudGl0eSwgQ29tcG9uZW50LCBpbmRleCkge1xuICAgIC8vIFJlbW92ZSBUIGxpc3Rpbmcgb24gZW50aXR5IGFuZCBwcm9wZXJ0eSByZWYsIHRoZW4gZnJlZSB0aGUgY29tcG9uZW50LlxuICAgIGVudGl0eS5fQ29tcG9uZW50VHlwZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5Ll9jb21wb25lbnRzW0NvbXBvbmVudC5fdHlwZUlkXTtcbiAgICBkZWxldGUgZW50aXR5Ll9jb21wb25lbnRzW0NvbXBvbmVudC5fdHlwZUlkXTtcbiAgICBjb21wb25lbnQuZGlzcG9zZSgpO1xuICAgIHRoaXMud29ybGQuY29tcG9uZW50c01hbmFnZXIuY29tcG9uZW50UmVtb3ZlZEZyb21FbnRpdHkoQ29tcG9uZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHRoZSBjb21wb25lbnRzIGZyb20gYW4gZW50aXR5XG4gICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgRW50aXR5IGZyb20gd2hpY2ggdGhlIGNvbXBvbmVudHMgd2lsbCBiZSByZW1vdmVkXG4gICAqL1xuICBlbnRpdHlSZW1vdmVBbGxDb21wb25lbnRzKGVudGl0eSwgaW1tZWRpYXRlbHkpIHtcbiAgICBsZXQgQ29tcG9uZW50cyA9IGVudGl0eS5fQ29tcG9uZW50VHlwZXM7XG5cbiAgICBmb3IgKGxldCBqID0gQ29tcG9uZW50cy5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgaWYgKENvbXBvbmVudHNbal0uX19wcm90b19fICE9PSBTeXN0ZW1TdGF0ZUNvbXBvbmVudClcbiAgICAgICAgdGhpcy5lbnRpdHlSZW1vdmVDb21wb25lbnQoZW50aXR5LCBDb21wb25lbnRzW2pdLCBpbW1lZGlhdGVseSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZW50aXR5IGZyb20gdGhpcyBtYW5hZ2VyLiBJdCB3aWxsIGNsZWFyIGFsc28gaXRzIGNvbXBvbmVudHNcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgdG8gcmVtb3ZlIGZyb20gdGhlIG1hbmFnZXJcbiAgICogQHBhcmFtIHtCb29sfSBpbW1lZGlhdGVseSBJZiB5b3Ugd2FudCB0byByZW1vdmUgdGhlIGNvbXBvbmVudCBpbW1lZGlhdGVseSBpbnN0ZWFkIG9mIGRlZmVycmVkIChEZWZhdWx0IGlzIGZhbHNlKVxuICAgKi9cbiAgcmVtb3ZlRW50aXR5KGVudGl0eSwgaW1tZWRpYXRlbHkpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLl9lbnRpdGllcy5pbmRleE9mKGVudGl0eSk7XG5cbiAgICBpZiAoIX5pbmRleCkgdGhyb3cgbmV3IEVycm9yKFwiVHJpZWQgdG8gcmVtb3ZlIGVudGl0eSBub3QgaW4gbGlzdFwiKTtcblxuICAgIGVudGl0eS5hbGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuZW50aXR5UmVtb3ZlQWxsQ29tcG9uZW50cyhlbnRpdHksIGltbWVkaWF0ZWx5KTtcblxuICAgIGlmIChlbnRpdHkubnVtU3RhdGVDb21wb25lbnRzID09PSAwKSB7XG4gICAgICAvLyBSZW1vdmUgZnJvbSBlbnRpdHkgbGlzdFxuICAgICAgdGhpcy5ldmVudERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChFTlRJVFlfUkVNT1ZFRCwgZW50aXR5KTtcbiAgICAgIHRoaXMuX3F1ZXJ5TWFuYWdlci5vbkVudGl0eVJlbW92ZWQoZW50aXR5KTtcbiAgICAgIGlmIChpbW1lZGlhdGVseSA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLl9yZWxlYXNlRW50aXR5KGVudGl0eSwgaW5kZXgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbnRpdGllc1RvUmVtb3ZlLnB1c2goZW50aXR5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfcmVsZWFzZUVudGl0eShlbnRpdHksIGluZGV4KSB7XG4gICAgdGhpcy5fZW50aXRpZXMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIGlmICh0aGlzLl9lbnRpdGllc0J5TmFtZXNbZW50aXR5Lm5hbWVdKSB7XG4gICAgICBkZWxldGUgdGhpcy5fZW50aXRpZXNCeU5hbWVzW2VudGl0eS5uYW1lXTtcbiAgICB9XG4gICAgZW50aXR5Ll9wb29sLnJlbGVhc2UoZW50aXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIGVudGl0aWVzIGZyb20gdGhpcyBtYW5hZ2VyXG4gICAqL1xuICByZW1vdmVBbGxFbnRpdGllcygpIHtcbiAgICBmb3IgKHZhciBpID0gdGhpcy5fZW50aXRpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRoaXMucmVtb3ZlRW50aXR5KHRoaXMuX2VudGl0aWVzW2ldKTtcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzRGVmZXJyZWRSZW1vdmFsKCkge1xuICAgIGlmICghdGhpcy5kZWZlcnJlZFJlbW92YWxFbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVudGl0aWVzVG9SZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSB0aGlzLmVudGl0aWVzVG9SZW1vdmVbaV07XG4gICAgICBsZXQgaW5kZXggPSB0aGlzLl9lbnRpdGllcy5pbmRleE9mKGVudGl0eSk7XG4gICAgICB0aGlzLl9yZWxlYXNlRW50aXR5KGVudGl0eSwgaW5kZXgpO1xuICAgIH1cbiAgICB0aGlzLmVudGl0aWVzVG9SZW1vdmUubGVuZ3RoID0gMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllc1dpdGhDb21wb25lbnRzVG9SZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSB0aGlzLmVudGl0aWVzV2l0aENvbXBvbmVudHNUb1JlbW92ZVtpXTtcbiAgICAgIHdoaWxlIChlbnRpdHkuX0NvbXBvbmVudFR5cGVzVG9SZW1vdmUubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgQ29tcG9uZW50ID0gZW50aXR5Ll9Db21wb25lbnRUeXBlc1RvUmVtb3ZlLnBvcCgpO1xuXG4gICAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuX2NvbXBvbmVudHNUb1JlbW92ZVtDb21wb25lbnQuX3R5cGVJZF07XG4gICAgICAgIGRlbGV0ZSBlbnRpdHkuX2NvbXBvbmVudHNUb1JlbW92ZVtDb21wb25lbnQuX3R5cGVJZF07XG4gICAgICAgIGNvbXBvbmVudC5kaXNwb3NlKCk7XG4gICAgICAgIHRoaXMud29ybGQuY29tcG9uZW50c01hbmFnZXIuY29tcG9uZW50UmVtb3ZlZEZyb21FbnRpdHkoQ29tcG9uZW50KTtcblxuICAgICAgICAvL3RoaXMuX2VudGl0eVJlbW92ZUNvbXBvbmVudFN5bmMoZW50aXR5LCBDb21wb25lbnQsIGluZGV4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmVudGl0aWVzV2l0aENvbXBvbmVudHNUb1JlbW92ZS5sZW5ndGggPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIHF1ZXJ5IGJhc2VkIG9uIGEgbGlzdCBvZiBjb21wb25lbnRzXG4gICAqIEBwYXJhbSB7QXJyYXkoQ29tcG9uZW50KX0gQ29tcG9uZW50cyBMaXN0IG9mIGNvbXBvbmVudHMgdGhhdCB3aWxsIGZvcm0gdGhlIHF1ZXJ5XG4gICAqL1xuICBxdWVyeUNvbXBvbmVudHMoQ29tcG9uZW50cykge1xuICAgIHJldHVybiB0aGlzLl9xdWVyeU1hbmFnZXIuZ2V0UXVlcnkoQ29tcG9uZW50cyk7XG4gIH1cblxuICAvLyBFWFRSQVNcblxuICAvKipcbiAgICogUmV0dXJuIG51bWJlciBvZiBlbnRpdGllc1xuICAgKi9cbiAgY291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc29tZSBzdGF0c1xuICAgKi9cbiAgc3RhdHMoKSB7XG4gICAgdmFyIHN0YXRzID0ge1xuICAgICAgbnVtRW50aXRpZXM6IHRoaXMuX2VudGl0aWVzLmxlbmd0aCxcbiAgICAgIG51bVF1ZXJpZXM6IE9iamVjdC5rZXlzKHRoaXMuX3F1ZXJ5TWFuYWdlci5fcXVlcmllcykubGVuZ3RoLFxuICAgICAgcXVlcmllczogdGhpcy5fcXVlcnlNYW5hZ2VyLnN0YXRzKCksXG4gICAgICBudW1Db21wb25lbnRQb29sOiBPYmplY3Qua2V5cyh0aGlzLmNvbXBvbmVudHNNYW5hZ2VyLl9jb21wb25lbnRQb29sKVxuICAgICAgICAubGVuZ3RoLFxuICAgICAgY29tcG9uZW50UG9vbDoge30sXG4gICAgICBldmVudERpc3BhdGNoZXI6IHRoaXMuZXZlbnREaXNwYXRjaGVyLnN0YXRzLFxuICAgIH07XG5cbiAgICBmb3IgKHZhciBlY3N5Q29tcG9uZW50SWQgaW4gdGhpcy5jb21wb25lbnRzTWFuYWdlci5fY29tcG9uZW50UG9vbCkge1xuICAgICAgdmFyIHBvb2wgPSB0aGlzLmNvbXBvbmVudHNNYW5hZ2VyLl9jb21wb25lbnRQb29sW2Vjc3lDb21wb25lbnRJZF07XG4gICAgICBzdGF0cy5jb21wb25lbnRQb29sW3Bvb2wuVC5nZXROYW1lKCldID0ge1xuICAgICAgICB1c2VkOiBwb29sLnRvdGFsVXNlZCgpLFxuICAgICAgICBzaXplOiBwb29sLmNvdW50LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdHM7XG4gIH1cbn1cblxuY29uc3QgRU5USVRZX0NSRUFURUQgPSBcIkVudGl0eU1hbmFnZXIjRU5USVRZX0NSRUFURVwiO1xuY29uc3QgRU5USVRZX1JFTU9WRUQgPSBcIkVudGl0eU1hbmFnZXIjRU5USVRZX1JFTU9WRURcIjtcbmNvbnN0IENPTVBPTkVOVF9BRERFRCA9IFwiRW50aXR5TWFuYWdlciNDT01QT05FTlRfQURERURcIjtcbmNvbnN0IENPTVBPTkVOVF9SRU1PVkUgPSBcIkVudGl0eU1hbmFnZXIjQ09NUE9ORU5UX1JFTU9WRVwiO1xuIiwiLyoqXG4gKiBAcHJpdmF0ZVxuICogQGNsYXNzIEV2ZW50RGlzcGF0Y2hlclxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudERpc3BhdGNoZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLnN0YXRzID0ge1xuICAgICAgZmlyZWQ6IDAsXG4gICAgICBoYW5kbGVkOiAwLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGV2ZW50IGxpc3RlbmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgTmFtZSBvZiB0aGUgZXZlbnQgdG8gbGlzdGVuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIENhbGxiYWNrIHRvIHRyaWdnZXIgd2hlbiB0aGUgZXZlbnQgaXMgZmlyZWRcbiAgICovXG4gIGFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lcikge1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XG4gICAgaWYgKGxpc3RlbmVyc1tldmVudE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGxpc3RlbmVyc1tldmVudE5hbWVdID0gW107XG4gICAgfVxuXG4gICAgaWYgKGxpc3RlbmVyc1tldmVudE5hbWVdLmluZGV4T2YobGlzdGVuZXIpID09PSAtMSkge1xuICAgICAgbGlzdGVuZXJzW2V2ZW50TmFtZV0ucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGFuIGV2ZW50IGxpc3RlbmVyIGlzIGFscmVhZHkgYWRkZWQgdG8gdGhlIGxpc3Qgb2YgbGlzdGVuZXJzXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgTmFtZSBvZiB0aGUgZXZlbnQgdG8gY2hlY2tcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgQ2FsbGJhY2sgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnRcbiAgICovXG4gIGhhc0V2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lcikge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXS5pbmRleE9mKGxpc3RlbmVyKSAhPT0gLTFcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBldmVudCBsaXN0ZW5lclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIE5hbWUgb2YgdGhlIGV2ZW50IHRvIHJlbW92ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBDYWxsYmFjayBmb3IgdGhlIHNwZWNpZmllZCBldmVudFxuICAgKi9cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyKSB7XG4gICAgdmFyIGxpc3RlbmVyQXJyYXkgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICBpZiAobGlzdGVuZXJBcnJheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgaW5kZXggPSBsaXN0ZW5lckFycmF5LmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBsaXN0ZW5lckFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFuIGV2ZW50XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgTmFtZSBvZiB0aGUgZXZlbnQgdG8gZGlzcGF0Y2hcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSAoT3B0aW9uYWwpIEVudGl0eSB0byBlbWl0XG4gICAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wb25lbnRcbiAgICovXG4gIGRpc3BhdGNoRXZlbnQoZXZlbnROYW1lLCBlbnRpdHksIGNvbXBvbmVudCkge1xuICAgIHRoaXMuc3RhdHMuZmlyZWQrKztcblxuICAgIHZhciBsaXN0ZW5lckFycmF5ID0gdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgaWYgKGxpc3RlbmVyQXJyYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGFycmF5ID0gbGlzdGVuZXJBcnJheS5zbGljZSgwKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBhcnJheVtpXS5jYWxsKHRoaXMsIGVudGl0eSwgY29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgc3RhdHMgY291bnRlcnNcbiAgICovXG4gIHJlc2V0Q291bnRlcnMoKSB7XG4gICAgdGhpcy5zdGF0cy5maXJlZCA9IHRoaXMuc3RhdHMuaGFuZGxlZCA9IDA7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBPYmplY3RQb29sIHtcbiAgLy8gQHRvZG8gQWRkIGluaXRpYWwgc2l6ZVxuICBjb25zdHJ1Y3RvcihULCBpbml0aWFsU2l6ZSkge1xuICAgIHRoaXMuZnJlZUxpc3QgPSBbXTtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICB0aGlzLlQgPSBUO1xuICAgIHRoaXMuaXNPYmplY3RQb29sID0gdHJ1ZTtcblxuICAgIGlmICh0eXBlb2YgaW5pdGlhbFNpemUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMuZXhwYW5kKGluaXRpYWxTaXplKTtcbiAgICB9XG4gIH1cblxuICBhY3F1aXJlKCkge1xuICAgIC8vIEdyb3cgdGhlIGxpc3QgYnkgMjAlaXNoIGlmIHdlJ3JlIG91dFxuICAgIGlmICh0aGlzLmZyZWVMaXN0Lmxlbmd0aCA8PSAwKSB7XG4gICAgICB0aGlzLmV4cGFuZChNYXRoLnJvdW5kKHRoaXMuY291bnQgKiAwLjIpICsgMSk7XG4gICAgfVxuXG4gICAgdmFyIGl0ZW0gPSB0aGlzLmZyZWVMaXN0LnBvcCgpO1xuXG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICByZWxlYXNlKGl0ZW0pIHtcbiAgICBpdGVtLnJlc2V0KCk7XG4gICAgdGhpcy5mcmVlTGlzdC5wdXNoKGl0ZW0pO1xuICB9XG5cbiAgZXhwYW5kKGNvdW50KSB7XG4gICAgZm9yICh2YXIgbiA9IDA7IG4gPCBjb3VudDsgbisrKSB7XG4gICAgICB2YXIgY2xvbmUgPSBuZXcgdGhpcy5UKCk7XG4gICAgICBjbG9uZS5fcG9vbCA9IHRoaXM7XG4gICAgICB0aGlzLmZyZWVMaXN0LnB1c2goY2xvbmUpO1xuICAgIH1cbiAgICB0aGlzLmNvdW50ICs9IGNvdW50O1xuICB9XG5cbiAgdG90YWxTaXplKCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50O1xuICB9XG5cbiAgdG90YWxGcmVlKCkge1xuICAgIHJldHVybiB0aGlzLmZyZWVMaXN0Lmxlbmd0aDtcbiAgfVxuXG4gIHRvdGFsVXNlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudCAtIHRoaXMuZnJlZUxpc3QubGVuZ3RoO1xuICB9XG59XG4iLCJpbXBvcnQgRXZlbnREaXNwYXRjaGVyIGZyb20gXCIuL0V2ZW50RGlzcGF0Y2hlci5qc1wiO1xuaW1wb3J0IHsgcXVlcnlLZXkgfSBmcm9tIFwiLi9VdGlscy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVyeSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5KENvbXBvbmVudCl9IENvbXBvbmVudHMgTGlzdCBvZiB0eXBlcyBvZiBjb21wb25lbnRzIHRvIHF1ZXJ5XG4gICAqL1xuICBjb25zdHJ1Y3RvcihDb21wb25lbnRzLCBtYW5hZ2VyKSB7XG4gICAgdGhpcy5Db21wb25lbnRzID0gW107XG4gICAgdGhpcy5Ob3RDb21wb25lbnRzID0gW107XG5cbiAgICBDb21wb25lbnRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgdGhpcy5Ob3RDb21wb25lbnRzLnB1c2goY29tcG9uZW50LkNvbXBvbmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLkNvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuQ29tcG9uZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNyZWF0ZSBhIHF1ZXJ5IHdpdGhvdXQgY29tcG9uZW50c1wiKTtcbiAgICB9XG5cbiAgICB0aGlzLmVudGl0aWVzID0gW107XG5cbiAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlciA9IG5ldyBFdmVudERpc3BhdGNoZXIoKTtcblxuICAgIC8vIFRoaXMgcXVlcnkgaXMgYmVpbmcgdXNlZCBieSBhIHJlYWN0aXZlIHN5c3RlbVxuICAgIHRoaXMucmVhY3RpdmUgPSBmYWxzZTtcblxuICAgIHRoaXMua2V5ID0gcXVlcnlLZXkoQ29tcG9uZW50cyk7XG5cbiAgICAvLyBGaWxsIHRoZSBxdWVyeSB3aXRoIHRoZSBleGlzdGluZyBlbnRpdGllc1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFuYWdlci5fZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlbnRpdHkgPSBtYW5hZ2VyLl9lbnRpdGllc1tpXTtcbiAgICAgIGlmICh0aGlzLm1hdGNoKGVudGl0eSkpIHtcbiAgICAgICAgLy8gQHRvZG8gPz8/IHRoaXMuYWRkRW50aXR5KGVudGl0eSk7ID0+IHByZXZlbnRpbmcgdGhlIGV2ZW50IHRvIGJlIGdlbmVyYXRlZFxuICAgICAgICBlbnRpdHkucXVlcmllcy5wdXNoKHRoaXMpO1xuICAgICAgICB0aGlzLmVudGl0aWVzLnB1c2goZW50aXR5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGVudGl0eSB0byB0aGlzIHF1ZXJ5XG4gICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHlcbiAgICovXG4gIGFkZEVudGl0eShlbnRpdHkpIHtcbiAgICBlbnRpdHkucXVlcmllcy5wdXNoKHRoaXMpO1xuICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xuXG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChRdWVyeS5wcm90b3R5cGUuRU5USVRZX0FEREVELCBlbnRpdHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBlbnRpdHkgZnJvbSB0aGlzIHF1ZXJ5XG4gICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHlcbiAgICovXG4gIHJlbW92ZUVudGl0eShlbnRpdHkpIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmVudGl0aWVzLmluZGV4T2YoZW50aXR5KTtcbiAgICBpZiAofmluZGV4KSB7XG4gICAgICB0aGlzLmVudGl0aWVzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgIGluZGV4ID0gZW50aXR5LnF1ZXJpZXMuaW5kZXhPZih0aGlzKTtcbiAgICAgIGVudGl0eS5xdWVyaWVzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIFF1ZXJ5LnByb3RvdHlwZS5FTlRJVFlfUkVNT1ZFRCxcbiAgICAgICAgZW50aXR5XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIG1hdGNoKGVudGl0eSkge1xuICAgIHJldHVybiAoXG4gICAgICBlbnRpdHkuaGFzQWxsQ29tcG9uZW50cyh0aGlzLkNvbXBvbmVudHMpICYmXG4gICAgICAhZW50aXR5Lmhhc0FueUNvbXBvbmVudHModGhpcy5Ob3RDb21wb25lbnRzKVxuICAgICk7XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGtleTogdGhpcy5rZXksXG4gICAgICByZWFjdGl2ZTogdGhpcy5yZWFjdGl2ZSxcbiAgICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgaW5jbHVkZWQ6IHRoaXMuQ29tcG9uZW50cy5tYXAoKEMpID0+IEMubmFtZSksXG4gICAgICAgIG5vdDogdGhpcy5Ob3RDb21wb25lbnRzLm1hcCgoQykgPT4gQy5uYW1lKSxcbiAgICAgIH0sXG4gICAgICBudW1FbnRpdGllczogdGhpcy5lbnRpdGllcy5sZW5ndGgsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc3RhdHMgZm9yIHRoaXMgcXVlcnlcbiAgICovXG4gIHN0YXRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBudW1Db21wb25lbnRzOiB0aGlzLkNvbXBvbmVudHMubGVuZ3RoLFxuICAgICAgbnVtRW50aXRpZXM6IHRoaXMuZW50aXRpZXMubGVuZ3RoLFxuICAgIH07XG4gIH1cbn1cblxuUXVlcnkucHJvdG90eXBlLkVOVElUWV9BRERFRCA9IFwiUXVlcnkjRU5USVRZX0FEREVEXCI7XG5RdWVyeS5wcm90b3R5cGUuRU5USVRZX1JFTU9WRUQgPSBcIlF1ZXJ5I0VOVElUWV9SRU1PVkVEXCI7XG5RdWVyeS5wcm90b3R5cGUuQ09NUE9ORU5UX0NIQU5HRUQgPSBcIlF1ZXJ5I0NPTVBPTkVOVF9DSEFOR0VEXCI7XG4iLCJpbXBvcnQgUXVlcnkgZnJvbSBcIi4vUXVlcnkuanNcIjtcbmltcG9ydCB7IHF1ZXJ5S2V5IH0gZnJvbSBcIi4vVXRpbHMuanNcIjtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQGNsYXNzIFF1ZXJ5TWFuYWdlclxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVyeU1hbmFnZXIge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCkge1xuICAgIHRoaXMuX3dvcmxkID0gd29ybGQ7XG5cbiAgICAvLyBRdWVyaWVzIGluZGV4ZWQgYnkgYSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNvbXBvbmVudHMgaXQgaGFzXG4gICAgdGhpcy5fcXVlcmllcyA9IHt9O1xuICB9XG5cbiAgb25FbnRpdHlSZW1vdmVkKGVudGl0eSkge1xuICAgIGZvciAodmFyIHF1ZXJ5TmFtZSBpbiB0aGlzLl9xdWVyaWVzKSB7XG4gICAgICB2YXIgcXVlcnkgPSB0aGlzLl9xdWVyaWVzW3F1ZXJ5TmFtZV07XG4gICAgICBpZiAoZW50aXR5LnF1ZXJpZXMuaW5kZXhPZihxdWVyeSkgIT09IC0xKSB7XG4gICAgICAgIHF1ZXJ5LnJlbW92ZUVudGl0eShlbnRpdHkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB3aGVuIGEgY29tcG9uZW50IGlzIGFkZGVkIHRvIGFuIGVudGl0eVxuICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5IEVudGl0eSB0aGF0IGp1c3QgZ290IHRoZSBuZXcgY29tcG9uZW50XG4gICAqIEBwYXJhbSB7Q29tcG9uZW50fSBDb21wb25lbnQgQ29tcG9uZW50IGFkZGVkIHRvIHRoZSBlbnRpdHlcbiAgICovXG4gIG9uRW50aXR5Q29tcG9uZW50QWRkZWQoZW50aXR5LCBDb21wb25lbnQpIHtcbiAgICAvLyBAdG9kbyBVc2UgYml0bWFzayBmb3IgY2hlY2tpbmcgY29tcG9uZW50cz9cblxuICAgIC8vIENoZWNrIGVhY2ggaW5kZXhlZCBxdWVyeSB0byBzZWUgaWYgd2UgbmVlZCB0byBhZGQgdGhpcyBlbnRpdHkgdG8gdGhlIGxpc3RcbiAgICBmb3IgKHZhciBxdWVyeU5hbWUgaW4gdGhpcy5fcXVlcmllcykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcmllc1txdWVyeU5hbWVdO1xuXG4gICAgICBpZiAoXG4gICAgICAgICEhfnF1ZXJ5Lk5vdENvbXBvbmVudHMuaW5kZXhPZihDb21wb25lbnQpICYmXG4gICAgICAgIH5xdWVyeS5lbnRpdGllcy5pbmRleE9mKGVudGl0eSlcbiAgICAgICkge1xuICAgICAgICBxdWVyeS5yZW1vdmVFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGUgZW50aXR5IG9ubHkgaWY6XG4gICAgICAvLyBDb21wb25lbnQgaXMgaW4gdGhlIHF1ZXJ5XG4gICAgICAvLyBhbmQgRW50aXR5IGhhcyBBTEwgdGhlIGNvbXBvbmVudHMgb2YgdGhlIHF1ZXJ5XG4gICAgICAvLyBhbmQgRW50aXR5IGlzIG5vdCBhbHJlYWR5IGluIHRoZSBxdWVyeVxuICAgICAgaWYgKFxuICAgICAgICAhfnF1ZXJ5LkNvbXBvbmVudHMuaW5kZXhPZihDb21wb25lbnQpIHx8XG4gICAgICAgICFxdWVyeS5tYXRjaChlbnRpdHkpIHx8XG4gICAgICAgIH5xdWVyeS5lbnRpdGllcy5pbmRleE9mKGVudGl0eSlcbiAgICAgIClcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHF1ZXJ5LmFkZEVudGl0eShlbnRpdHkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB3aGVuIGEgY29tcG9uZW50IGlzIHJlbW92ZWQgZnJvbSBhbiBlbnRpdHlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgdG8gcmVtb3ZlIHRoZSBjb21wb25lbnQgZnJvbVxuICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gQ29tcG9uZW50IENvbXBvbmVudCB0byByZW1vdmUgZnJvbSB0aGUgZW50aXR5XG4gICAqL1xuICBvbkVudGl0eUNvbXBvbmVudFJlbW92ZWQoZW50aXR5LCBDb21wb25lbnQpIHtcbiAgICBmb3IgKHZhciBxdWVyeU5hbWUgaW4gdGhpcy5fcXVlcmllcykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcmllc1txdWVyeU5hbWVdO1xuXG4gICAgICBpZiAoXG4gICAgICAgICEhfnF1ZXJ5Lk5vdENvbXBvbmVudHMuaW5kZXhPZihDb21wb25lbnQpICYmXG4gICAgICAgICF+cXVlcnkuZW50aXRpZXMuaW5kZXhPZihlbnRpdHkpICYmXG4gICAgICAgIHF1ZXJ5Lm1hdGNoKGVudGl0eSlcbiAgICAgICkge1xuICAgICAgICBxdWVyeS5hZGRFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgISF+cXVlcnkuQ29tcG9uZW50cy5pbmRleE9mKENvbXBvbmVudCkgJiZcbiAgICAgICAgISF+cXVlcnkuZW50aXRpZXMuaW5kZXhPZihlbnRpdHkpICYmXG4gICAgICAgICFxdWVyeS5tYXRjaChlbnRpdHkpXG4gICAgICApIHtcbiAgICAgICAgcXVlcnkucmVtb3ZlRW50aXR5KGVudGl0eSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBxdWVyeSBmb3IgdGhlIHNwZWNpZmllZCBjb21wb25lbnRzXG4gICAqIEBwYXJhbSB7Q29tcG9uZW50fSBDb21wb25lbnRzIENvbXBvbmVudHMgdGhhdCB0aGUgcXVlcnkgc2hvdWxkIGhhdmVcbiAgICovXG4gIGdldFF1ZXJ5KENvbXBvbmVudHMpIHtcbiAgICB2YXIga2V5ID0gcXVlcnlLZXkoQ29tcG9uZW50cyk7XG4gICAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcmllc1trZXldO1xuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHRoaXMuX3F1ZXJpZXNba2V5XSA9IHF1ZXJ5ID0gbmV3IFF1ZXJ5KENvbXBvbmVudHMsIHRoaXMuX3dvcmxkKTtcbiAgICB9XG4gICAgcmV0dXJuIHF1ZXJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBzb21lIHN0YXRzIGZyb20gdGhpcyBjbGFzc1xuICAgKi9cbiAgc3RhdHMoKSB7XG4gICAgdmFyIHN0YXRzID0ge307XG4gICAgZm9yICh2YXIgcXVlcnlOYW1lIGluIHRoaXMuX3F1ZXJpZXMpIHtcbiAgICAgIHN0YXRzW3F1ZXJ5TmFtZV0gPSB0aGlzLl9xdWVyaWVzW3F1ZXJ5TmFtZV0uc3RhdHMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRzO1xuICB9XG59XG4iLCIvKiBnbG9iYWwgUGVlciAqL1xuaW1wb3J0IHsgaW5qZWN0U2NyaXB0LCBnZW5lcmF0ZUlkIH0gZnJvbSBcIi4vdXRpbHMuanNcIjtcbmltcG9ydCB7IGhhc1dpbmRvdyB9IGZyb20gXCIuLi9VdGlscy5qc1wiO1xuXG5mdW5jdGlvbiBob29rQ29uc29sZUFuZEVycm9ycyhjb25uZWN0aW9uKSB7XG4gIHZhciB3cmFwRnVuY3Rpb25zID0gW1wiZXJyb3JcIiwgXCJ3YXJuaW5nXCIsIFwibG9nXCJdO1xuICB3cmFwRnVuY3Rpb25zLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGlmICh0eXBlb2YgY29uc29sZVtrZXldID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHZhciBmbiA9IGNvbnNvbGVba2V5XS5iaW5kKGNvbnNvbGUpO1xuICAgICAgY29uc29sZVtrZXldID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgY29ubmVjdGlvbi5zZW5kKHtcbiAgICAgICAgICBtZXRob2Q6IFwiY29uc29sZVwiLFxuICAgICAgICAgIHR5cGU6IGtleSxcbiAgICAgICAgICBhcmdzOiBKU09OLnN0cmluZ2lmeShhcmdzKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIChlcnJvcikgPT4ge1xuICAgIGNvbm5lY3Rpb24uc2VuZCh7XG4gICAgICBtZXRob2Q6IFwiZXJyb3JcIixcbiAgICAgIGVycm9yOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIG1lc3NhZ2U6IGVycm9yLmVycm9yLm1lc3NhZ2UsXG4gICAgICAgIHN0YWNrOiBlcnJvci5lcnJvci5zdGFjayxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaW5jbHVkZVJlbW90ZUlkSFRNTChyZW1vdGVJZCkge1xuICBsZXQgaW5mb0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGluZm9EaXYuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICMzMzM7XG4gICAgY29sb3I6ICNhYWE7XG4gICAgZGlzcGxheTpmbGV4O1xuICAgIGZvbnQtZmFtaWx5OiBBcmlhbDtcbiAgICBmb250LXNpemU6IDEuMWVtO1xuICAgIGhlaWdodDogNDBweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBsZWZ0OiAwO1xuICAgIG9wYWNpdHk6IDAuOTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgcmlnaHQ6IDA7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHRvcDogMDtcbiAgYDtcblxuICBpbmZvRGl2LmlubmVySFRNTCA9IGBPcGVuIEVDU1kgZGV2dG9vbHMgdG8gY29ubmVjdCB0byB0aGlzIHBhZ2UgdXNpbmcgdGhlIGNvZGU6Jm5ic3A7PGIgc3R5bGU9XCJjb2xvcjogI2ZmZlwiPiR7cmVtb3RlSWR9PC9iPiZuYnNwOzxidXR0b24gb25DbGljaz1cImdlbmVyYXRlTmV3Q29kZSgpXCI+R2VuZXJhdGUgbmV3IGNvZGU8L2J1dHRvbj5gO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGluZm9EaXYpO1xuXG4gIHJldHVybiBpbmZvRGl2O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlUmVtb3RlRGV2dG9vbHMocmVtb3RlSWQpIHtcbiAgaWYgKCFoYXNXaW5kb3cpIHtcbiAgICBjb25zb2xlLndhcm4oXCJSZW1vdGUgZGV2dG9vbHMgbm90IGF2YWlsYWJsZSBvdXRzaWRlIHRoZSBicm93c2VyXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHdpbmRvdy5nZW5lcmF0ZU5ld0NvZGUgPSAoKSA9PiB7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIHJlbW90ZUlkID0gZ2VuZXJhdGVJZCg2KTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJlY3N5UmVtb3RlSWRcIiwgcmVtb3RlSWQpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoZmFsc2UpO1xuICB9O1xuXG4gIHJlbW90ZUlkID0gcmVtb3RlSWQgfHwgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZWNzeVJlbW90ZUlkXCIpO1xuICBpZiAoIXJlbW90ZUlkKSB7XG4gICAgcmVtb3RlSWQgPSBnZW5lcmF0ZUlkKDYpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImVjc3lSZW1vdGVJZFwiLCByZW1vdGVJZCk7XG4gIH1cblxuICBsZXQgaW5mb0RpdiA9IGluY2x1ZGVSZW1vdGVJZEhUTUwocmVtb3RlSWQpO1xuXG4gIHdpbmRvdy5fX0VDU1lfUkVNT1RFX0RFVlRPT0xTX0lOSkVDVEVEID0gdHJ1ZTtcbiAgd2luZG93Ll9fRUNTWV9SRU1PVEVfREVWVE9PTFMgPSB7fTtcblxuICBsZXQgVmVyc2lvbiA9IFwiXCI7XG5cbiAgLy8gVGhpcyBpcyB1c2VkIHRvIGNvbGxlY3QgdGhlIHdvcmxkcyBjcmVhdGVkIGJlZm9yZSB0aGUgY29tbXVuaWNhdGlvbiBpcyBiZWluZyBlc3RhYmxpc2hlZFxuICBsZXQgd29ybGRzQmVmb3JlTG9hZGluZyA9IFtdO1xuICBsZXQgb25Xb3JsZENyZWF0ZWQgPSAoZSkgPT4ge1xuICAgIHZhciB3b3JsZCA9IGUuZGV0YWlsLndvcmxkO1xuICAgIFZlcnNpb24gPSBlLmRldGFpbC52ZXJzaW9uO1xuICAgIHdvcmxkc0JlZm9yZUxvYWRpbmcucHVzaCh3b3JsZCk7XG4gIH07XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZWNzeS13b3JsZC1jcmVhdGVkXCIsIG9uV29ybGRDcmVhdGVkKTtcblxuICBsZXQgb25Mb2FkZWQgPSAoKSA9PiB7XG4gICAgLy8gdmFyIHBlZXIgPSBuZXcgUGVlcihyZW1vdGVJZCk7XG4gICAgdmFyIHBlZXIgPSBuZXcgUGVlcihyZW1vdGVJZCwge1xuICAgICAgaG9zdDogXCJwZWVyanMuZWNzeS5pb1wiLFxuICAgICAgc2VjdXJlOiB0cnVlLFxuICAgICAgcG9ydDogNDQzLFxuICAgICAgY29uZmlnOiB7XG4gICAgICAgIGljZVNlcnZlcnM6IFtcbiAgICAgICAgICB7IHVybDogXCJzdHVuOnN0dW4ubC5nb29nbGUuY29tOjE5MzAyXCIgfSxcbiAgICAgICAgICB7IHVybDogXCJzdHVuOnN0dW4xLmwuZ29vZ2xlLmNvbToxOTMwMlwiIH0sXG4gICAgICAgICAgeyB1cmw6IFwic3R1bjpzdHVuMi5sLmdvb2dsZS5jb206MTkzMDJcIiB9LFxuICAgICAgICAgIHsgdXJsOiBcInN0dW46c3R1bjMubC5nb29nbGUuY29tOjE5MzAyXCIgfSxcbiAgICAgICAgICB7IHVybDogXCJzdHVuOnN0dW40LmwuZ29vZ2xlLmNvbToxOTMwMlwiIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgZGVidWc6IDMsXG4gICAgfSk7XG5cbiAgICBwZWVyLm9uKFwib3BlblwiLCAoLyogaWQgKi8pID0+IHtcbiAgICAgIHBlZXIub24oXCJjb25uZWN0aW9uXCIsIChjb25uZWN0aW9uKSA9PiB7XG4gICAgICAgIHdpbmRvdy5fX0VDU1lfUkVNT1RFX0RFVlRPT0xTLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgICAgICBjb25uZWN0aW9uLm9uKFwib3BlblwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gaW5mb0Rpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICBpbmZvRGl2LmlubmVySFRNTCA9IFwiQ29ubmVjdGVkXCI7XG5cbiAgICAgICAgICAvLyBSZWNlaXZlIG1lc3NhZ2VzXG4gICAgICAgICAgY29ubmVjdGlvbi5vbihcImRhdGFcIiwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLnR5cGUgPT09IFwiaW5pdFwiKSB7XG4gICAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgICBzY3JpcHQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHQvamF2YXNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuXG4gICAgICAgICAgICAgICAgLy8gT25jZSB0aGUgc2NyaXB0IGlzIGluamVjdGVkIHdlIGRvbid0IG5lZWQgdG8gbGlzdGVuXG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgICBcImVjc3ktd29ybGQtY3JlYXRlZFwiLFxuICAgICAgICAgICAgICAgICAgb25Xb3JsZENyZWF0ZWRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHdvcmxkc0JlZm9yZUxvYWRpbmcuZm9yRWFjaCgod29ybGQpID0+IHtcbiAgICAgICAgICAgICAgICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImVjc3ktd29ybGQtY3JlYXRlZFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogeyB3b3JsZDogd29ybGQsIHZlcnNpb246IFZlcnNpb24gfSxcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBzY3JpcHQuaW5uZXJIVE1MID0gZGF0YS5zY3JpcHQ7XG4gICAgICAgICAgICAgIChkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCgpO1xuXG4gICAgICAgICAgICAgIGhvb2tDb25zb2xlQW5kRXJyb3JzKGNvbm5lY3Rpb24pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnR5cGUgPT09IFwiZXhlY3V0ZVNjcmlwdFwiKSB7XG4gICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGV2YWwoZGF0YS5zY3JpcHQpO1xuICAgICAgICAgICAgICBpZiAoZGF0YS5yZXR1cm5FdmFsKSB7XG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbi5zZW5kKHtcbiAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJldmFsUmV0dXJuXCIsXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbmplY3QgUGVlckpTIHNjcmlwdFxuICBpbmplY3RTY3JpcHQoXG4gICAgXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL3BlZXJqc0AwLjMuMjAvZGlzdC9wZWVyLm1pbi5qc1wiLFxuICAgIG9uTG9hZGVkXG4gICk7XG59XG5cbmlmIChoYXNXaW5kb3cpIHtcbiAgY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcblxuICAvLyBAdG9kbyBQcm92aWRlIGEgd2F5IHRvIGRpc2FibGUgaXQgaWYgbmVlZGVkXG4gIGlmICh1cmxQYXJhbXMuaGFzKFwiZW5hYmxlLXJlbW90ZS1kZXZ0b29sc1wiKSkge1xuICAgIGVuYWJsZVJlbW90ZURldnRvb2xzKCk7XG4gIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlkKGxlbmd0aCkge1xuICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgdmFyIGNoYXJhY3RlcnMgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OVwiO1xuICB2YXIgY2hhcmFjdGVyc0xlbmd0aCA9IGNoYXJhY3RlcnMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnNMZW5ndGgpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0U2NyaXB0KHNyYywgb25Mb2FkKSB7XG4gIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAvLyBAdG9kbyBVc2UgbGluayB0byB0aGUgZWNzeS1kZXZ0b29scyByZXBvP1xuICBzY3JpcHQuc3JjID0gc3JjO1xuICBzY3JpcHQub25sb2FkID0gb25Mb2FkO1xuICAoZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmFwcGVuZENoaWxkKHNjcmlwdCk7XG59XG4iLCJpbXBvcnQgUXVlcnkgZnJvbSBcIi4vUXVlcnkuanNcIjtcbmltcG9ydCB7IGNvbXBvbmVudFJlZ2lzdGVyZWQgfSBmcm9tIFwiLi9VdGlscy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgU3lzdGVtIHtcbiAgY2FuRXhlY3V0ZSgpIHtcbiAgICBpZiAodGhpcy5fbWFuZGF0b3J5UXVlcmllcy5sZW5ndGggPT09IDApIHJldHVybiB0cnVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9tYW5kYXRvcnlRdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcXVlcnkgPSB0aGlzLl9tYW5kYXRvcnlRdWVyaWVzW2ldO1xuICAgICAgaWYgKHF1ZXJ5LmVudGl0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBnZXROYW1lKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmdldE5hbWUoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBhdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy53b3JsZCA9IHdvcmxkO1xuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAvLyBAdG9kbyBCZXR0ZXIgbmFtaW5nIDopXG4gICAgdGhpcy5fcXVlcmllcyA9IHt9O1xuICAgIHRoaXMucXVlcmllcyA9IHt9O1xuXG4gICAgdGhpcy5wcmlvcml0eSA9IDA7XG5cbiAgICAvLyBVc2VkIGZvciBzdGF0c1xuICAgIHRoaXMuZXhlY3V0ZVRpbWUgPSAwO1xuXG4gICAgaWYgKGF0dHJpYnV0ZXMgJiYgYXR0cmlidXRlcy5wcmlvcml0eSkge1xuICAgICAgdGhpcy5wcmlvcml0eSA9IGF0dHJpYnV0ZXMucHJpb3JpdHk7XG4gICAgfVxuXG4gICAgdGhpcy5fbWFuZGF0b3J5UXVlcmllcyA9IFtdO1xuXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5jb25zdHJ1Y3Rvci5xdWVyaWVzKSB7XG4gICAgICBmb3IgKHZhciBxdWVyeU5hbWUgaW4gdGhpcy5jb25zdHJ1Y3Rvci5xdWVyaWVzKSB7XG4gICAgICAgIHZhciBxdWVyeUNvbmZpZyA9IHRoaXMuY29uc3RydWN0b3IucXVlcmllc1txdWVyeU5hbWVdO1xuICAgICAgICB2YXIgQ29tcG9uZW50cyA9IHF1ZXJ5Q29uZmlnLmNvbXBvbmVudHM7XG4gICAgICAgIGlmICghQ29tcG9uZW50cyB8fCBDb21wb25lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIidjb21wb25lbnRzJyBhdHRyaWJ1dGUgY2FuJ3QgYmUgZW1wdHkgaW4gYSBxdWVyeVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERldGVjdCBpZiB0aGUgY29tcG9uZW50cyBoYXZlIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkXG4gICAgICAgIGxldCB1bnJlZ2lzdGVyZWRDb21wb25lbnRzID0gQ29tcG9uZW50cy5maWx0ZXIoXG4gICAgICAgICAgKENvbXBvbmVudCkgPT4gIWNvbXBvbmVudFJlZ2lzdGVyZWQoQ29tcG9uZW50KVxuICAgICAgICApO1xuXG4gICAgICAgIGlmICh1bnJlZ2lzdGVyZWRDb21wb25lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgVHJpZWQgdG8gY3JlYXRlIGEgcXVlcnkgJyR7XG4gICAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IubmFtZVxuICAgICAgICAgICAgfS4ke3F1ZXJ5TmFtZX0nIHdpdGggdW5yZWdpc3RlcmVkIGNvbXBvbmVudHM6IFske3VucmVnaXN0ZXJlZENvbXBvbmVudHNcbiAgICAgICAgICAgICAgLm1hcCgoYykgPT4gYy5nZXROYW1lKCkpXG4gICAgICAgICAgICAgIC5qb2luKFwiLCBcIil9XWBcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy53b3JsZC5lbnRpdHlNYW5hZ2VyLnF1ZXJ5Q29tcG9uZW50cyhDb21wb25lbnRzKTtcblxuICAgICAgICB0aGlzLl9xdWVyaWVzW3F1ZXJ5TmFtZV0gPSBxdWVyeTtcbiAgICAgICAgaWYgKHF1ZXJ5Q29uZmlnLm1hbmRhdG9yeSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMuX21hbmRhdG9yeVF1ZXJpZXMucHVzaChxdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5xdWVyaWVzW3F1ZXJ5TmFtZV0gPSB7XG4gICAgICAgICAgcmVzdWx0czogcXVlcnkuZW50aXRpZXMsXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmVhY3RpdmUgY29uZmlndXJhdGlvbiBhZGRlZC9yZW1vdmVkL2NoYW5nZWRcbiAgICAgICAgdmFyIHZhbGlkRXZlbnRzID0gW1wiYWRkZWRcIiwgXCJyZW1vdmVkXCIsIFwiY2hhbmdlZFwiXTtcblxuICAgICAgICBjb25zdCBldmVudE1hcHBpbmcgPSB7XG4gICAgICAgICAgYWRkZWQ6IFF1ZXJ5LnByb3RvdHlwZS5FTlRJVFlfQURERUQsXG4gICAgICAgICAgcmVtb3ZlZDogUXVlcnkucHJvdG90eXBlLkVOVElUWV9SRU1PVkVELFxuICAgICAgICAgIGNoYW5nZWQ6IFF1ZXJ5LnByb3RvdHlwZS5DT01QT05FTlRfQ0hBTkdFRCwgLy8gUXVlcnkucHJvdG90eXBlLkVOVElUWV9DSEFOR0VEXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHF1ZXJ5Q29uZmlnLmxpc3Rlbikge1xuICAgICAgICAgIHZhbGlkRXZlbnRzLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmV4ZWN1dGUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgIGBTeXN0ZW0gJyR7dGhpcy5nZXROYW1lKCl9JyBoYXMgZGVmaW5lZCBsaXN0ZW4gZXZlbnRzICgke3ZhbGlkRXZlbnRzLmpvaW4oXG4gICAgICAgICAgICAgICAgICBcIiwgXCJcbiAgICAgICAgICAgICAgICApfSkgZm9yIHF1ZXJ5ICcke3F1ZXJ5TmFtZX0nIGJ1dCBpdCBkb2VzIG5vdCBpbXBsZW1lbnQgdGhlICdleGVjdXRlJyBtZXRob2QuYFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJcyB0aGUgZXZlbnQgZW5hYmxlZCBvbiB0aGlzIHN5c3RlbSdzIHF1ZXJ5P1xuICAgICAgICAgICAgaWYgKHF1ZXJ5Q29uZmlnLmxpc3RlbltldmVudE5hbWVdKSB7XG4gICAgICAgICAgICAgIGxldCBldmVudCA9IHF1ZXJ5Q29uZmlnLmxpc3RlbltldmVudE5hbWVdO1xuXG4gICAgICAgICAgICAgIGlmIChldmVudE5hbWUgPT09IFwiY2hhbmdlZFwiKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkucmVhY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChldmVudCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgLy8gQW55IGNoYW5nZSBvbiB0aGUgZW50aXR5IGZyb20gdGhlIGNvbXBvbmVudHMgaW4gdGhlIHF1ZXJ5XG4gICAgICAgICAgICAgICAgICBsZXQgZXZlbnRMaXN0ID0gKHRoaXMucXVlcmllc1txdWVyeU5hbWVdW2V2ZW50TmFtZV0gPSBbXSk7XG4gICAgICAgICAgICAgICAgICBxdWVyeS5ldmVudERpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgUXVlcnkucHJvdG90eXBlLkNPTVBPTkVOVF9DSEFOR0VELFxuICAgICAgICAgICAgICAgICAgICAoZW50aXR5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gQXZvaWQgZHVwbGljYXRlc1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudExpc3QuaW5kZXhPZihlbnRpdHkpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGV2ZW50KSkge1xuICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50TGlzdCA9ICh0aGlzLnF1ZXJpZXNbcXVlcnlOYW1lXVtldmVudE5hbWVdID0gW10pO1xuICAgICAgICAgICAgICAgICAgcXVlcnkuZXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgICAgIFF1ZXJ5LnByb3RvdHlwZS5DT01QT05FTlRfQ0hBTkdFRCxcbiAgICAgICAgICAgICAgICAgICAgKGVudGl0eSwgY2hhbmdlZENvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIC8vIEF2b2lkIGR1cGxpY2F0ZXNcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5pbmRleE9mKGNoYW5nZWRDb21wb25lbnQuY29uc3RydWN0b3IpICE9PSAtMSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LmluZGV4T2YoZW50aXR5KSA9PT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TGlzdC5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgLy8gQ2hlY2tpbmcganVzdCBzcGVjaWZpYyBjb21wb25lbnRzXG4gICAgICAgICAgICAgICAgICBsZXQgY2hhbmdlZExpc3QgPSAodGhpcy5xdWVyaWVzW3F1ZXJ5TmFtZV1bZXZlbnROYW1lXSA9IHt9KTtcbiAgICAgICAgICAgICAgICAgIGV2ZW50LmZvckVhY2goY29tcG9uZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50TGlzdCA9IChjaGFuZ2VkTGlzdFtcbiAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRQcm9wZXJ0eU5hbWUoY29tcG9uZW50KVxuICAgICAgICAgICAgICAgICAgICBdID0gW10pO1xuICAgICAgICAgICAgICAgICAgICBxdWVyeS5ldmVudERpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgICBRdWVyeS5wcm90b3R5cGUuQ09NUE9ORU5UX0NIQU5HRUQsXG4gICAgICAgICAgICAgICAgICAgICAgKGVudGl0eSwgY2hhbmdlZENvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkQ29tcG9uZW50LmNvbnN0cnVjdG9yID09PSBjb21wb25lbnQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LmluZGV4T2YoZW50aXR5KSA9PT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QucHVzaChlbnRpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGV2ZW50TGlzdCA9ICh0aGlzLnF1ZXJpZXNbcXVlcnlOYW1lXVtldmVudE5hbWVdID0gW10pO1xuXG4gICAgICAgICAgICAgICAgcXVlcnkuZXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgICBldmVudE1hcHBpbmdbZXZlbnROYW1lXSxcbiAgICAgICAgICAgICAgICAgIChlbnRpdHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQGZpeG1lIG92ZXJoZWFkP1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnRMaXN0LmluZGV4T2YoZW50aXR5KSA9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuZXhlY3V0ZVRpbWUgPSAwO1xuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgcGxheSgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICB9XG5cbiAgLy8gQHF1ZXN0aW9uIHJlbmFtZSB0byBjbGVhciBxdWV1ZXM/XG4gIGNsZWFyRXZlbnRzKCkge1xuICAgIGZvciAobGV0IHF1ZXJ5TmFtZSBpbiB0aGlzLnF1ZXJpZXMpIHtcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMucXVlcmllc1txdWVyeU5hbWVdO1xuICAgICAgaWYgKHF1ZXJ5LmFkZGVkKSB7XG4gICAgICAgIHF1ZXJ5LmFkZGVkLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgICBpZiAocXVlcnkucmVtb3ZlZCkge1xuICAgICAgICBxdWVyeS5yZW1vdmVkLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgICBpZiAocXVlcnkuY2hhbmdlZCkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShxdWVyeS5jaGFuZ2VkKSkge1xuICAgICAgICAgIHF1ZXJ5LmNoYW5nZWQubGVuZ3RoID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIHF1ZXJ5LmNoYW5nZWQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LmNoYW5nZWRbbmFtZV0ubGVuZ3RoID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgdmFyIGpzb24gPSB7XG4gICAgICBuYW1lOiB0aGlzLmdldE5hbWUoKSxcbiAgICAgIGVuYWJsZWQ6IHRoaXMuZW5hYmxlZCxcbiAgICAgIGV4ZWN1dGVUaW1lOiB0aGlzLmV4ZWN1dGVUaW1lLFxuICAgICAgcHJpb3JpdHk6IHRoaXMucHJpb3JpdHksXG4gICAgICBxdWVyaWVzOiB7fSxcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuY29uc3RydWN0b3IucXVlcmllcykge1xuICAgICAgdmFyIHF1ZXJpZXMgPSB0aGlzLmNvbnN0cnVjdG9yLnF1ZXJpZXM7XG4gICAgICBmb3IgKGxldCBxdWVyeU5hbWUgaW4gcXVlcmllcykge1xuICAgICAgICBsZXQgcXVlcnkgPSB0aGlzLnF1ZXJpZXNbcXVlcnlOYW1lXTtcbiAgICAgICAgbGV0IHF1ZXJ5RGVmaW5pdGlvbiA9IHF1ZXJpZXNbcXVlcnlOYW1lXTtcbiAgICAgICAgbGV0IGpzb25RdWVyeSA9IChqc29uLnF1ZXJpZXNbcXVlcnlOYW1lXSA9IHtcbiAgICAgICAgICBrZXk6IHRoaXMuX3F1ZXJpZXNbcXVlcnlOYW1lXS5rZXksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGpzb25RdWVyeS5tYW5kYXRvcnkgPSBxdWVyeURlZmluaXRpb24ubWFuZGF0b3J5ID09PSB0cnVlO1xuICAgICAgICBqc29uUXVlcnkucmVhY3RpdmUgPVxuICAgICAgICAgIHF1ZXJ5RGVmaW5pdGlvbi5saXN0ZW4gJiZcbiAgICAgICAgICAocXVlcnlEZWZpbml0aW9uLmxpc3Rlbi5hZGRlZCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgcXVlcnlEZWZpbml0aW9uLmxpc3Rlbi5yZW1vdmVkID09PSB0cnVlIHx8XG4gICAgICAgICAgICBxdWVyeURlZmluaXRpb24ubGlzdGVuLmNoYW5nZWQgPT09IHRydWUgfHxcbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkocXVlcnlEZWZpbml0aW9uLmxpc3Rlbi5jaGFuZ2VkKSk7XG5cbiAgICAgICAgaWYgKGpzb25RdWVyeS5yZWFjdGl2ZSkge1xuICAgICAgICAgIGpzb25RdWVyeS5saXN0ZW4gPSB7fTtcblxuICAgICAgICAgIGNvbnN0IG1ldGhvZHMgPSBbXCJhZGRlZFwiLCBcInJlbW92ZWRcIiwgXCJjaGFuZ2VkXCJdO1xuICAgICAgICAgIG1ldGhvZHMuZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gICAgICAgICAgICBpZiAocXVlcnlbbWV0aG9kXSkge1xuICAgICAgICAgICAgICBqc29uUXVlcnkubGlzdGVuW21ldGhvZF0gPSB7XG4gICAgICAgICAgICAgICAgZW50aXRpZXM6IHF1ZXJ5W21ldGhvZF0ubGVuZ3RoLFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGpzb247XG4gIH1cbn1cblxuU3lzdGVtLmlzU3lzdGVtID0gdHJ1ZTtcblN5c3RlbS5nZXROYW1lID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5kaXNwbGF5TmFtZSB8fCB0aGlzLm5hbWU7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gTm90KENvbXBvbmVudCkge1xuICByZXR1cm4ge1xuICAgIG9wZXJhdG9yOiBcIm5vdFwiLFxuICAgIENvbXBvbmVudDogQ29tcG9uZW50LFxuICB9O1xufVxuIiwiaW1wb3J0IHsgbm93IH0gZnJvbSBcIi4vVXRpbHMuanNcIjtcblxuZXhwb3J0IGNsYXNzIFN5c3RlbU1hbmFnZXIge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCkge1xuICAgIHRoaXMuX3N5c3RlbXMgPSBbXTtcbiAgICB0aGlzLl9leGVjdXRlU3lzdGVtcyA9IFtdOyAvLyBTeXN0ZW1zIHRoYXQgaGF2ZSBgZXhlY3V0ZWAgbWV0aG9kXG4gICAgdGhpcy53b3JsZCA9IHdvcmxkO1xuICAgIHRoaXMubGFzdEV4ZWN1dGVkU3lzdGVtID0gbnVsbDtcbiAgfVxuXG4gIHJlZ2lzdGVyU3lzdGVtKFN5c3RlbUNsYXNzLCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKCFTeXN0ZW1DbGFzcy5pc1N5c3RlbSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgU3lzdGVtICcke1N5c3RlbUNsYXNzLm5hbWV9JyBkb2VzIG5vdCBleHRlbmQgJ1N5c3RlbScgY2xhc3NgXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmdldFN5c3RlbShTeXN0ZW1DbGFzcykgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS53YXJuKGBTeXN0ZW0gJyR7U3lzdGVtQ2xhc3MuZ2V0TmFtZSgpfScgYWxyZWFkeSByZWdpc3RlcmVkLmApO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIHN5c3RlbSA9IG5ldyBTeXN0ZW1DbGFzcyh0aGlzLndvcmxkLCBhdHRyaWJ1dGVzKTtcbiAgICBpZiAoc3lzdGVtLmluaXQpIHN5c3RlbS5pbml0KGF0dHJpYnV0ZXMpO1xuICAgIHN5c3RlbS5vcmRlciA9IHRoaXMuX3N5c3RlbXMubGVuZ3RoO1xuICAgIHRoaXMuX3N5c3RlbXMucHVzaChzeXN0ZW0pO1xuICAgIGlmIChzeXN0ZW0uZXhlY3V0ZSkge1xuICAgICAgdGhpcy5fZXhlY3V0ZVN5c3RlbXMucHVzaChzeXN0ZW0pO1xuICAgICAgdGhpcy5zb3J0U3lzdGVtcygpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVucmVnaXN0ZXJTeXN0ZW0oU3lzdGVtQ2xhc3MpIHtcbiAgICBsZXQgc3lzdGVtID0gdGhpcy5nZXRTeXN0ZW0oU3lzdGVtQ2xhc3MpO1xuICAgIGlmIChzeXN0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBgQ2FuIHVucmVnaXN0ZXIgc3lzdGVtICcke1N5c3RlbUNsYXNzLmdldE5hbWUoKX0nLiBJdCBkb2Vzbid0IGV4aXN0LmBcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLl9zeXN0ZW1zLnNwbGljZSh0aGlzLl9zeXN0ZW1zLmluZGV4T2Yoc3lzdGVtKSwgMSk7XG5cbiAgICBpZiAoc3lzdGVtLmV4ZWN1dGUpIHtcbiAgICAgIHRoaXMuX2V4ZWN1dGVTeXN0ZW1zLnNwbGljZSh0aGlzLl9leGVjdXRlU3lzdGVtcy5pbmRleE9mKHN5c3RlbSksIDEpO1xuICAgIH1cblxuICAgIC8vIEB0b2RvIEFkZCBzeXN0ZW0udW5yZWdpc3RlcigpIGNhbGwgdG8gZnJlZSByZXNvdXJjZXNcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNvcnRTeXN0ZW1zKCkge1xuICAgIHRoaXMuX2V4ZWN1dGVTeXN0ZW1zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLnByaW9yaXR5IC0gYi5wcmlvcml0eSB8fCBhLm9yZGVyIC0gYi5vcmRlcjtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFN5c3RlbShTeXN0ZW1DbGFzcykge1xuICAgIHJldHVybiB0aGlzLl9zeXN0ZW1zLmZpbmQoKHMpID0+IHMgaW5zdGFuY2VvZiBTeXN0ZW1DbGFzcyk7XG4gIH1cblxuICBnZXRTeXN0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9zeXN0ZW1zO1xuICB9XG5cbiAgcmVtb3ZlU3lzdGVtKFN5c3RlbUNsYXNzKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5fc3lzdGVtcy5pbmRleE9mKFN5c3RlbUNsYXNzKTtcbiAgICBpZiAoIX5pbmRleCkgcmV0dXJuO1xuXG4gICAgdGhpcy5fc3lzdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG5cbiAgZXhlY3V0ZVN5c3RlbShzeXN0ZW0sIGRlbHRhLCB0aW1lKSB7XG4gICAgaWYgKHN5c3RlbS5pbml0aWFsaXplZCkge1xuICAgICAgaWYgKHN5c3RlbS5jYW5FeGVjdXRlKCkpIHtcbiAgICAgICAgbGV0IHN0YXJ0VGltZSA9IG5vdygpO1xuICAgICAgICBzeXN0ZW0uZXhlY3V0ZShkZWx0YSwgdGltZSk7XG4gICAgICAgIHN5c3RlbS5leGVjdXRlVGltZSA9IG5vdygpIC0gc3RhcnRUaW1lO1xuICAgICAgICB0aGlzLmxhc3RFeGVjdXRlZFN5c3RlbSA9IHN5c3RlbTtcbiAgICAgICAgc3lzdGVtLmNsZWFyRXZlbnRzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9leGVjdXRlU3lzdGVtcy5mb3JFYWNoKChzeXN0ZW0pID0+IHN5c3RlbS5zdG9wKCkpO1xuICB9XG5cbiAgZXhlY3V0ZShkZWx0YSwgdGltZSwgZm9yY2VQbGF5KSB7XG4gICAgdGhpcy5fZXhlY3V0ZVN5c3RlbXMuZm9yRWFjaChcbiAgICAgIChzeXN0ZW0pID0+XG4gICAgICAgIChmb3JjZVBsYXkgfHwgc3lzdGVtLmVuYWJsZWQpICYmIHRoaXMuZXhlY3V0ZVN5c3RlbShzeXN0ZW0sIGRlbHRhLCB0aW1lKVxuICAgICk7XG4gIH1cblxuICBzdGF0cygpIHtcbiAgICB2YXIgc3RhdHMgPSB7XG4gICAgICBudW1TeXN0ZW1zOiB0aGlzLl9zeXN0ZW1zLmxlbmd0aCxcbiAgICAgIHN5c3RlbXM6IHt9LFxuICAgIH07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3N5c3RlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzeXN0ZW0gPSB0aGlzLl9zeXN0ZW1zW2ldO1xuICAgICAgdmFyIHN5c3RlbVN0YXRzID0gKHN0YXRzLnN5c3RlbXNbc3lzdGVtLmdldE5hbWUoKV0gPSB7XG4gICAgICAgIHF1ZXJpZXM6IHt9LFxuICAgICAgICBleGVjdXRlVGltZTogc3lzdGVtLmV4ZWN1dGVUaW1lLFxuICAgICAgfSk7XG4gICAgICBmb3IgKHZhciBuYW1lIGluIHN5c3RlbS5jdHgpIHtcbiAgICAgICAgc3lzdGVtU3RhdHMucXVlcmllc1tuYW1lXSA9IHN5c3RlbS5jdHhbbmFtZV0uc3RhdHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdHM7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgU3lzdGVtU3RhdGVDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge31cblxuU3lzdGVtU3RhdGVDb21wb25lbnQuaXNTeXN0ZW1TdGF0ZUNvbXBvbmVudCA9IHRydWU7XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9Db21wb25lbnQuanNcIjtcblxuZXhwb3J0IGNsYXNzIFRhZ0NvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGZhbHNlKTtcbiAgfVxufVxuXG5UYWdDb21wb25lbnQuaXNUYWdDb21wb25lbnQgPSB0cnVlO1xuIiwiZXhwb3J0IGNvbnN0IGNvcHlWYWx1ZSA9IChzcmMpID0+IHNyYztcblxuZXhwb3J0IGNvbnN0IGNsb25lVmFsdWUgPSAoc3JjKSA9PiBzcmM7XG5cbmV4cG9ydCBjb25zdCBjb3B5QXJyYXkgPSAoc3JjLCBkZXN0KSA9PiB7XG4gIGlmICghc3JjKSB7XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuXG4gIGlmICghZGVzdCkge1xuICAgIHJldHVybiBzcmMuc2xpY2UoKTtcbiAgfVxuXG4gIGRlc3QubGVuZ3RoID0gMDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNyYy5sZW5ndGg7IGkrKykge1xuICAgIGRlc3QucHVzaChzcmNbaV0pO1xuICB9XG5cbiAgcmV0dXJuIGRlc3Q7XG59O1xuXG5leHBvcnQgY29uc3QgY2xvbmVBcnJheSA9IChzcmMpID0+IHNyYyAmJiBzcmMuc2xpY2UoKTtcblxuZXhwb3J0IGNvbnN0IGNvcHlKU09OID0gKHNyYykgPT4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzcmMpKTtcblxuZXhwb3J0IGNvbnN0IGNsb25lSlNPTiA9IChzcmMpID0+IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc3JjKSk7XG5cbmV4cG9ydCBjb25zdCBjb3B5Q29weWFibGUgPSAoc3JjLCBkZXN0KSA9PiB7XG4gIGlmICghc3JjKSB7XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuXG4gIGlmICghZGVzdCkge1xuICAgIHJldHVybiBzcmMuY2xvbmUoKTtcbiAgfVxuXG4gIHJldHVybiBkZXN0LmNvcHkoc3JjKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjbG9uZUNsb25hYmxlID0gKHNyYykgPT4gc3JjICYmIHNyYy5jbG9uZSgpO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHlwZSh0eXBlRGVmaW5pdGlvbikge1xuICB2YXIgbWFuZGF0b3J5UHJvcGVydGllcyA9IFtcIm5hbWVcIiwgXCJkZWZhdWx0XCIsIFwiY29weVwiLCBcImNsb25lXCJdO1xuXG4gIHZhciB1bmRlZmluZWRQcm9wZXJ0aWVzID0gbWFuZGF0b3J5UHJvcGVydGllcy5maWx0ZXIoKHApID0+IHtcbiAgICByZXR1cm4gIXR5cGVEZWZpbml0aW9uLmhhc093blByb3BlcnR5KHApO1xuICB9KTtcblxuICBpZiAodW5kZWZpbmVkUHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYGNyZWF0ZVR5cGUgZXhwZWN0cyBhIHR5cGUgZGVmaW5pdGlvbiB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczogJHt1bmRlZmluZWRQcm9wZXJ0aWVzLmpvaW4oXG4gICAgICAgIFwiLCBcIlxuICAgICAgKX1gXG4gICAgKTtcbiAgfVxuXG4gIHR5cGVEZWZpbml0aW9uLmlzVHlwZSA9IHRydWU7XG5cbiAgcmV0dXJuIHR5cGVEZWZpbml0aW9uO1xufVxuXG4vKipcbiAqIFN0YW5kYXJkIHR5cGVzXG4gKi9cbmV4cG9ydCBjb25zdCBUeXBlcyA9IHtcbiAgTnVtYmVyOiBjcmVhdGVUeXBlKHtcbiAgICBuYW1lOiBcIk51bWJlclwiLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgY29weTogY29weVZhbHVlLFxuICAgIGNsb25lOiBjbG9uZVZhbHVlLFxuICB9KSxcblxuICBCb29sZWFuOiBjcmVhdGVUeXBlKHtcbiAgICBuYW1lOiBcIkJvb2xlYW5cIixcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBjb3B5OiBjb3B5VmFsdWUsXG4gICAgY2xvbmU6IGNsb25lVmFsdWUsXG4gIH0pLFxuXG4gIFN0cmluZzogY3JlYXRlVHlwZSh7XG4gICAgbmFtZTogXCJTdHJpbmdcIixcbiAgICBkZWZhdWx0OiBcIlwiLFxuICAgIGNvcHk6IGNvcHlWYWx1ZSxcbiAgICBjbG9uZTogY2xvbmVWYWx1ZSxcbiAgfSksXG5cbiAgQXJyYXk6IGNyZWF0ZVR5cGUoe1xuICAgIG5hbWU6IFwiQXJyYXlcIixcbiAgICBkZWZhdWx0OiBbXSxcbiAgICBjb3B5OiBjb3B5QXJyYXksXG4gICAgY2xvbmU6IGNsb25lQXJyYXksXG4gIH0pLFxuXG4gIFJlZjogY3JlYXRlVHlwZSh7XG4gICAgbmFtZTogXCJSZWZcIixcbiAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgY29weTogY29weVZhbHVlLFxuICAgIGNsb25lOiBjbG9uZVZhbHVlLFxuICB9KSxcblxuICBKU09OOiBjcmVhdGVUeXBlKHtcbiAgICBuYW1lOiBcIkpTT05cIixcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvcHk6IGNvcHlKU09OLFxuICAgIGNsb25lOiBjbG9uZUpTT04sXG4gIH0pLFxufTtcbiIsIi8qKlxuICogUmV0dXJuIHRoZSBuYW1lIG9mIGEgY29tcG9uZW50XG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gQ29tcG9uZW50XG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZShDb21wb25lbnQpIHtcbiAgcmV0dXJuIENvbXBvbmVudC5uYW1lO1xufVxuXG4vKipcbiAqIFJldHVybiBhIHZhbGlkIHByb3BlcnR5IG5hbWUgZm9yIHRoZSBDb21wb25lbnRcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBDb21wb25lbnRcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wb25lbnRQcm9wZXJ0eU5hbWUoQ29tcG9uZW50KSB7XG4gIHJldHVybiBnZXROYW1lKENvbXBvbmVudCk7XG59XG5cbi8qKlxuICogR2V0IGEga2V5IGZyb20gYSBsaXN0IG9mIGNvbXBvbmVudHNcbiAqIEBwYXJhbSB7QXJyYXkoQ29tcG9uZW50KX0gQ29tcG9uZW50cyBBcnJheSBvZiBjb21wb25lbnRzIHRvIGdlbmVyYXRlIHRoZSBrZXlcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBxdWVyeUtleShDb21wb25lbnRzKSB7XG4gIHZhciBpZHMgPSBbXTtcbiAgZm9yICh2YXIgbiA9IDA7IG4gPCBDb21wb25lbnRzLmxlbmd0aDsgbisrKSB7XG4gICAgdmFyIFQgPSBDb21wb25lbnRzW25dO1xuXG4gICAgaWYgKCFjb21wb25lbnRSZWdpc3RlcmVkKFQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRyaWVkIHRvIGNyZWF0ZSBhIHF1ZXJ5IHdpdGggYW4gdW5yZWdpc3RlcmVkIGNvbXBvbmVudGApO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgVCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgdmFyIG9wZXJhdG9yID0gVC5vcGVyYXRvciA9PT0gXCJub3RcIiA/IFwiIVwiIDogVC5vcGVyYXRvcjtcbiAgICAgIGlkcy5wdXNoKG9wZXJhdG9yICsgVC5Db21wb25lbnQuX3R5cGVJZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkcy5wdXNoKFQuX3R5cGVJZCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGlkcy5zb3J0KCkuam9pbihcIi1cIik7XG59XG5cbi8vIERldGVjdG9yIGZvciBicm93c2VyJ3MgXCJ3aW5kb3dcIlxuZXhwb3J0IGNvbnN0IGhhc1dpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI7XG5cbi8vIHBlcmZvcm1hbmNlLm5vdygpIFwicG9seWZpbGxcIlxuZXhwb3J0IGNvbnN0IG5vdyA9XG4gIGhhc1dpbmRvdyAmJiB0eXBlb2Ygd2luZG93LnBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiXG4gICAgPyBwZXJmb3JtYW5jZS5ub3cuYmluZChwZXJmb3JtYW5jZSlcbiAgICA6IERhdGUubm93LmJpbmQoRGF0ZSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb25lbnRSZWdpc3RlcmVkKFQpIHtcbiAgcmV0dXJuIChcbiAgICAodHlwZW9mIFQgPT09IFwib2JqZWN0XCIgJiYgVC5Db21wb25lbnQuX3R5cGVJZCAhPT0gdW5kZWZpbmVkKSB8fFxuICAgIChULmlzQ29tcG9uZW50ICYmIFQuX3R5cGVJZCAhPT0gdW5kZWZpbmVkKVxuICApO1xufVxuIiwiZXhwb3J0IGNvbnN0IFZlcnNpb24gPSBcIjAuMy4xXCI7XG4iLCJpbXBvcnQgeyBTeXN0ZW1NYW5hZ2VyIH0gZnJvbSBcIi4vU3lzdGVtTWFuYWdlci5qc1wiO1xuaW1wb3J0IHsgRW50aXR5TWFuYWdlciB9IGZyb20gXCIuL0VudGl0eU1hbmFnZXIuanNcIjtcbmltcG9ydCB7IENvbXBvbmVudE1hbmFnZXIgfSBmcm9tIFwiLi9Db21wb25lbnRNYW5hZ2VyLmpzXCI7XG5pbXBvcnQgeyBWZXJzaW9uIH0gZnJvbSBcIi4vVmVyc2lvbi5qc1wiO1xuaW1wb3J0IHsgaGFzV2luZG93LCBub3cgfSBmcm9tIFwiLi9VdGlscy5qc1wiO1xuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4vRW50aXR5LmpzXCI7XG5cbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgZW50aXR5UG9vbFNpemU6IDAsXG4gIGVudGl0eUNsYXNzOiBFbnRpdHksXG59O1xuXG5leHBvcnQgY2xhc3MgV29ybGQge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb21wb25lbnRzTWFuYWdlciA9IG5ldyBDb21wb25lbnRNYW5hZ2VyKHRoaXMpO1xuICAgIHRoaXMuZW50aXR5TWFuYWdlciA9IG5ldyBFbnRpdHlNYW5hZ2VyKHRoaXMpO1xuICAgIHRoaXMuc3lzdGVtTWFuYWdlciA9IG5ldyBTeXN0ZW1NYW5hZ2VyKHRoaXMpO1xuXG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICAgIHRoaXMuZXZlbnRRdWV1ZXMgPSB7fTtcblxuICAgIGlmIChoYXNXaW5kb3cgJiYgdHlwZW9mIEN1c3RvbUV2ZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJlY3N5LXdvcmxkLWNyZWF0ZWRcIiwge1xuICAgICAgICBkZXRhaWw6IHsgd29ybGQ6IHRoaXMsIHZlcnNpb246IFZlcnNpb24gfSxcbiAgICAgIH0pO1xuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH1cblxuICAgIHRoaXMubGFzdFRpbWUgPSBub3coKSAvIDEwMDA7XG4gIH1cblxuICByZWdpc3RlckNvbXBvbmVudChDb21wb25lbnQsIG9iamVjdFBvb2wpIHtcbiAgICB0aGlzLmNvbXBvbmVudHNNYW5hZ2VyLnJlZ2lzdGVyQ29tcG9uZW50KENvbXBvbmVudCwgb2JqZWN0UG9vbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZWdpc3RlclN5c3RlbShTeXN0ZW0sIGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLnN5c3RlbU1hbmFnZXIucmVnaXN0ZXJTeXN0ZW0oU3lzdGVtLCBhdHRyaWJ1dGVzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGhhc1JlZ2lzdGVyZWRDb21wb25lbnQoQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuY29tcG9uZW50c01hbmFnZXIuaGFzQ29tcG9uZW50KENvbXBvbmVudCk7XG4gIH1cblxuICB1bnJlZ2lzdGVyU3lzdGVtKFN5c3RlbSkge1xuICAgIHRoaXMuc3lzdGVtTWFuYWdlci51bnJlZ2lzdGVyU3lzdGVtKFN5c3RlbSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXRTeXN0ZW0oU3lzdGVtQ2xhc3MpIHtcbiAgICByZXR1cm4gdGhpcy5zeXN0ZW1NYW5hZ2VyLmdldFN5c3RlbShTeXN0ZW1DbGFzcyk7XG4gIH1cblxuICBnZXRTeXN0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLnN5c3RlbU1hbmFnZXIuZ2V0U3lzdGVtcygpO1xuICB9XG5cbiAgZXhlY3V0ZShkZWx0YSwgdGltZSkge1xuICAgIGlmICghZGVsdGEpIHtcbiAgICAgIHRpbWUgPSBub3coKSAvIDEwMDA7XG4gICAgICBkZWx0YSA9IHRpbWUgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgdGhpcy5sYXN0VGltZSA9IHRpbWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5zeXN0ZW1NYW5hZ2VyLmV4ZWN1dGUoZGVsdGEsIHRpbWUpO1xuICAgICAgdGhpcy5lbnRpdHlNYW5hZ2VyLnByb2Nlc3NEZWZlcnJlZFJlbW92YWwoKTtcbiAgICB9XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgcGxheSgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICB9XG5cbiAgY3JlYXRlRW50aXR5KG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlNYW5hZ2VyLmNyZWF0ZUVudGl0eShuYW1lKTtcbiAgfVxuXG4gIHN0YXRzKCkge1xuICAgIHZhciBzdGF0cyA9IHtcbiAgICAgIGVudGl0aWVzOiB0aGlzLmVudGl0eU1hbmFnZXIuc3RhdHMoKSxcbiAgICAgIHN5c3RlbTogdGhpcy5zeXN0ZW1NYW5hZ2VyLnN0YXRzKCksXG4gICAgfTtcblxuICAgIHJldHVybiBzdGF0cztcbiAgfVxufVxuIiwiY29uc3QgcHJveHlNYXAgPSBuZXcgV2Vha01hcCgpO1xuXG5jb25zdCBwcm94eUhhbmRsZXIgPSB7XG4gIHNldCh0YXJnZXQsIHByb3ApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgVHJpZWQgdG8gd3JpdGUgdG8gXCIke3RhcmdldC5jb25zdHJ1Y3Rvci5nZXROYW1lKCl9IyR7U3RyaW5nKFxuICAgICAgICBwcm9wXG4gICAgICApfVwiIG9uIGltbXV0YWJsZSBjb21wb25lbnQuIFVzZSAuZ2V0TXV0YWJsZUNvbXBvbmVudCgpIHRvIG1vZGlmeSBhIGNvbXBvbmVudC5gXG4gICAgKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHdyYXBJbW11dGFibGVDb21wb25lbnQoVCwgY29tcG9uZW50KSB7XG4gIGlmIChjb21wb25lbnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBsZXQgd3JhcHBlZENvbXBvbmVudCA9IHByb3h5TWFwLmdldChjb21wb25lbnQpO1xuXG4gIGlmICghd3JhcHBlZENvbXBvbmVudCkge1xuICAgIHdyYXBwZWRDb21wb25lbnQgPSBuZXcgUHJveHkoY29tcG9uZW50LCBwcm94eUhhbmRsZXIpO1xuICAgIHByb3h5TWFwLnNldChjb21wb25lbnQsIHdyYXBwZWRDb21wb25lbnQpO1xuICB9XG5cbiAgcmV0dXJuIHdyYXBwZWRDb21wb25lbnQ7XG59XG4iLCJleHBvcnQgeyBXb3JsZCB9IGZyb20gXCIuL1dvcmxkLmpzXCI7XG5leHBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCIuL1N5c3RlbS5qc1wiO1xuZXhwb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vQ29tcG9uZW50LmpzXCI7XG5leHBvcnQgeyBTeXN0ZW1TdGF0ZUNvbXBvbmVudCB9IGZyb20gXCIuL1N5c3RlbVN0YXRlQ29tcG9uZW50LmpzXCI7XG5leHBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiLi9UYWdDb21wb25lbnQuanNcIjtcbmV4cG9ydCB7IE9iamVjdFBvb2wgfSBmcm9tIFwiLi9PYmplY3RQb29sLmpzXCI7XG5leHBvcnQge1xuICBUeXBlcyxcbiAgY3JlYXRlVHlwZSxcbiAgY29weVZhbHVlLFxuICBjbG9uZVZhbHVlLFxuICBjb3B5QXJyYXksXG4gIGNsb25lQXJyYXksXG4gIGNvcHlKU09OLFxuICBjbG9uZUpTT04sXG4gIGNvcHlDb3B5YWJsZSxcbiAgY2xvbmVDbG9uYWJsZSxcbn0gZnJvbSBcIi4vVHlwZXMuanNcIjtcbmV4cG9ydCB7IFZlcnNpb24gfSBmcm9tIFwiLi9WZXJzaW9uLmpzXCI7XG5leHBvcnQgeyBlbmFibGVSZW1vdGVEZXZ0b29scyB9IGZyb20gXCIuL1JlbW90ZURldlRvb2xzL2luZGV4LmpzXCI7XG5leHBvcnQgeyBFbnRpdHkgYXMgX0VudGl0eSB9IGZyb20gXCIuL0VudGl0eS5qc1wiO1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vVXRpbHMvVmVjdG9yMlwiO1xuXG5leHBvcnQgY2xhc3MgTGluZURhdGEgZXh0ZW5kcyBDb21wb25lbnQ8TGluZURhdGE+IHtcbiAgcG9pbnRzOiBBcnJheTxWZWN0b3IyPjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyBEaXNhYmxlIHRoZSBkZWZhdWx0IHNjaGVtYSBiZWhhdmlvci5cbiAgICBzdXBlcihmYWxzZSk7XG5cbiAgICAvLyBDdXN0b20gZGF0YSBzZXR1cC5cbiAgICB0aGlzLnBvaW50cyA9IG5ldyBBcnJheTxWZWN0b3IyPigpO1xuICB9XG5cbiAgY29weShzb3VyY2U6IHRoaXMpOiB0aGlzIHtcbiAgICB0aGlzLnBvaW50cy5sZW5ndGggPSBzb3VyY2UucG9pbnRzLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc291cmNlLnBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc291cmNlUG9pbnQgPSBzb3VyY2UucG9pbnRzW2ldO1xuICAgICAgdGhpcy5wb2ludHNbaV0gPSBzb3VyY2VQb2ludC5jbG9uZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gTm8gbmVlZCB0byBvdmVycmlkZSBkZWZhdWx0IGNsb25lKCkgYmVoYXZpb3IuXG4gIC8vIElmIHBhcmFtZXRlcnMgYXJlIG5lZWRlZCBmb3IgdGhlIGNvbnN0cnVjdG9yLCB3cml0ZSBhIGN1c3RvbSBjbG9uZSgpIG1ldGhvZC5cbiAgLy8gY2xvbmUoKTogdGhpcyB7XG4gIC8vICAgcmV0dXJuIG5ldyAodGhpcy5jb25zdHJ1Y3RvcigpKS5jb3B5KHRoaXMpO1xuICAvLyB9XG5cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5wb2ludHMuZm9yRWFjaCgocG9pbnQpID0+IHtcbiAgICAgIHBvaW50LnggPSAwO1xuICAgICAgcG9pbnQueSA9IDA7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBWZWN0b3IyLCBWZWN0b3IyVHlwZSB9IGZyb20gXCIuLi9VdGlscy9WZWN0b3IyXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0yRERhdGEgZXh0ZW5kcyBDb21wb25lbnQ8VHJhbnNmb3JtMkREYXRhPiB7XG4gIHBvc2l0aW9uOiBWZWN0b3IyO1xuXG4gIHN0YXRpYyBzY2hlbWEgPSB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHR5cGU6IFZlY3RvcjJUeXBlLFxuICAgICAgZGVmYXVsdDogbmV3IFZlY3RvcjIoMCwgMCksXG4gICAgfSxcbiAgfTtcbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50U2NoZW1hLCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBWYWx1ZURhdGEgZXh0ZW5kcyBDb21wb25lbnQ8VmFsdWVEYXRhPiB7XG4gIGludFZhbDogbnVtYmVyO1xuICBzdHJWYWw6IHN0cmluZztcblxuICBzdGF0aWMgc2NoZW1hOiBDb21wb25lbnRTY2hlbWEgPSB7XG4gICAgaW50VmFsOiB7XG4gICAgICB0eXBlOiBUeXBlcy5OdW1iZXIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgc3RyVmFsOiB7XG4gICAgICB0eXBlOiBUeXBlcy5TdHJpbmcsXG4gICAgICBkZWZhdWx0OiBcIlwiLFxuICAgIH0sXG4gIH07XG59XG4iLCJpbXBvcnQgeyBXb3JsZCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBMaW5lRGF0YSB9IGZyb20gXCIuL0RhdGFDb21wb25lbnRzL0xpbmVEYXRhXCI7XG5pbXBvcnQgeyBUcmFuc2Zvcm0yRERhdGEgfSBmcm9tIFwiLi9EYXRhQ29tcG9uZW50cy9UcmFuc2Zvcm0yRERhdGFcIjtcbmltcG9ydCB7IFZhbHVlRGF0YSB9IGZyb20gXCIuL0RhdGFDb21wb25lbnRzL1ZhbHVlRGF0YVwiO1xuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL1V0aWxzL1ZlY3RvcjJcIjtcblxuLy8gMS4gQ3JlYXRlIGEgd29ybGRcbmNvbnN0IG1haW5Xb3JsZDogV29ybGQgPSBuZXcgV29ybGQoe1xuICBlbnRpdHlQb29sU2l6ZTogMTAwMDAsXG59KTtcblxuLy8gMi4xIEJhc2ljIENvbXBvbmVudHNcbi8vIDIuMS4xIENyZWF0ZSBhIGNvbXBvbmVudFxuLy8gMi4xLjIgQ2hhbmdlIHRoZSB2YWx1ZSBvZiB0aGUgY29tcG9uZW50XG5jb25zdCBCYXNpY0NvbXBvbmVudERlbW8gPSAoKSA9PiB7XG4gIGxldCBkZWJ1Z1RleHRBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWJ1ZzFcIikgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgbGV0IGRlYnVnQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgXCJkZWJ1Z0J1dHRvbjFcIlxuICApIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuXG4gIC8vIFJldHVybiBpZiB0aGUgZGVidWcgZWxlbWVudHMgYXJlIG5vdCBmb3VuZC5cbiAgaWYgKCFkZWJ1Z1RleHRBcmVhIHx8ICFkZWJ1Z0J1dHRvbikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIG5ldyBjb21wb25lbnQuXG4gIGNvbnN0IHZhbHVlRGF0YTogVmFsdWVEYXRhID0gbmV3IFZhbHVlRGF0YSgpO1xuICBkZWJ1Z1RleHRBcmVhLmlubmVySFRNTCArPVxuICAgIFwiSW5pdGlhbCBWYWx1ZURhdGE6IFwiICsgSlNPTi5zdHJpbmdpZnkodmFsdWVEYXRhKSArIFwiXFxuXCI7XG5cbiAgY29uc3QgQ2hhbmdlVmFsdWVEYXRhID0gKCkgPT4ge1xuICAgIC8vIENoYW5nZSB0aGUgdmFsdWUgb2YgdGhlIGNvbXBvbmVudC5cbiAgICB2YWx1ZURhdGEuaW50VmFsICs9IDEwO1xuICAgIHZhbHVlRGF0YS5zdHJWYWwgPSBcIkhlbGxvIFdvcmxkIVwiO1xuICAgIGRlYnVnVGV4dEFyZWEuaW5uZXJIVE1MICs9XG4gICAgICBcIkN1cnJlbnQgVmFsdWVEYXRhOiBcIiArIEpTT04uc3RyaW5naWZ5KHZhbHVlRGF0YSkgKyBcIlxcblwiO1xuICB9O1xuXG4gIGRlYnVnQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBDaGFuZ2VWYWx1ZURhdGEpO1xufTtcblxuLy8gMi4yIEN1c3RvbSBUeXBlc1xuLy8gMi4yLjEgQ3JlYXRlIGEgY29tcG9uZW50IHdpdGggYSBjdXN0b20gdHlwZVxuLy8gMi4yLjIgQ2hhbmdlIHRoZSB2YWx1ZSBvZiB0aGUgY29tcG9uZW50XG5jb25zdCBDdXN0b21UeXBlRGVtbyA9ICgpID0+IHtcbiAgbGV0IGRlYnVnVGV4dEFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYnVnMlwiKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICBsZXQgZGVidWdCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICBcImRlYnVnQnV0dG9uMlwiXG4gICkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cbiAgLy8gUmV0dXJuIGlmIHRoZSBkZWJ1ZyBlbGVtZW50cyBhcmUgbm90IGZvdW5kLlxuICBpZiAoIWRlYnVnVGV4dEFyZWEgfHwgIWRlYnVnQnV0dG9uKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQ3JlYXRlIGEgbmV3IHRyYW5zZm9ybSBjb21wb25lbnQuXG4gIGNvbnN0IHRyYW5zZm9ybTJEOiBUcmFuc2Zvcm0yRERhdGEgPSBuZXcgVHJhbnNmb3JtMkREYXRhKCk7XG4gIGRlYnVnVGV4dEFyZWEuaW5uZXJIVE1MICs9XG4gICAgXCJJbml0aWFsIFRyYW5zZm9ybTJEOiBcIiArIEpTT04uc3RyaW5naWZ5KHRyYW5zZm9ybTJEKSArIFwiXFxuXCI7XG5cbiAgY29uc3QgQ2hhbmdlVHJhbnNmb3JtMkQgPSAoKSA9PiB7XG4gICAgLy8gQ2hhbmdlIHRoZSB2YWx1ZSBvZiB0aGUgY29tcG9uZW50LlxuICAgIHRyYW5zZm9ybTJELnBvc2l0aW9uLnggKz0gMTA7XG4gICAgdHJhbnNmb3JtMkQucG9zaXRpb24ueSArPSAxMDtcbiAgICBkZWJ1Z1RleHRBcmVhLmlubmVySFRNTCArPVxuICAgICAgXCJDdXJyZW50IFRyYW5zZm9ybTJEOiBcIiArIEpTT04uc3RyaW5naWZ5KHRyYW5zZm9ybTJEKSArIFwiXFxuXCI7XG4gIH07XG5cbiAgZGVidWdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIENoYW5nZVRyYW5zZm9ybTJEKTtcbn07XG5cbmNvbnN0IEN1c3RvbUNvbXBvbmVudERlbW8gPSAoKSA9PiB7XG4gIGxldCBkZWJ1Z1RleHRBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWJ1ZzNcIikgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgbGV0IHJhbmRvbU9yaWdpbmFsQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgXCJkZWJ1Z0J1dHRvbjNcIlxuICApIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICBsZXQgY29weUNvbXBvbmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgIFwiZGVidWdCdXR0b240XCJcbiAgKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcblxuICAvLyBSZXR1cm4gaWYgdGhlIGRlYnVnIGVsZW1lbnRzIGFyZSBub3QgZm91bmQuXG4gIGlmICghZGVidWdUZXh0QXJlYSB8fCAhcmFuZG9tT3JpZ2luYWxCdXR0b24gfHwgIWNvcHlDb21wb25lbnQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBDcmVhdGUgMiBuZXcgTGluZURhdGEgY29tcG9uZW50LlxuICBjb25zdCBsaW5lRGF0YTogTGluZURhdGEgPSBuZXcgTGluZURhdGEoKTtcbiAgY29uc3QgbGluZURhdGEyOiBMaW5lRGF0YSA9IG5ldyBMaW5lRGF0YSgpO1xuICBkZWJ1Z1RleHRBcmVhLmlubmVySFRNTCA9XG4gICAgXCJJbml0aWFsIExpbmVEYXRhOiBcIiArXG4gICAgSlNPTi5zdHJpbmdpZnkobGluZURhdGEpICtcbiAgICBcIlxcblwiICtcbiAgICBcIkluaXRpYWwgTGluZURhdGEyOiBcIiArXG4gICAgSlNPTi5zdHJpbmdpZnkobGluZURhdGEyKSArXG4gICAgXCJcXG5cIjtcblxuICBjb25zdCBSYW5kb21PcmlnaW5hbCA9ICgpID0+IHtcbiAgICAvLyBDbGVhciB0aGUgcG9pbnRzIGFycmF5LlxuICAgIGxpbmVEYXRhLnBvaW50cy5sZW5ndGggPSAwO1xuXG4gICAgLy8gQWRkIHJhbmRvbSBwb2ludHMgdG8gdGhlIG9yaWdpbmFsIGxpbmUuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgIGxpbmVEYXRhLnBvaW50cy5wdXNoKG5ldyBWZWN0b3IyKE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCkpKTtcbiAgICB9XG5cbiAgICBkZWJ1Z1RleHRBcmVhLmlubmVySFRNTCA9XG4gICAgICBcIkN1cnJlbnQgTGluZURhdGE6IFwiICtcbiAgICAgIEpTT04uc3RyaW5naWZ5KGxpbmVEYXRhKSArXG4gICAgICBcIlxcblwiICtcbiAgICAgIFwiQ3VycmVudCBMaW5lRGF0YTI6IFwiICtcbiAgICAgIEpTT04uc3RyaW5naWZ5KGxpbmVEYXRhMikgK1xuICAgICAgXCJcXG5cIjtcbiAgfTtcblxuICBjb25zdCBDb3B5Q29tcG9uZW50ID0gKCkgPT4ge1xuICAgIC8vIENvcHkgdGhlIG9yaWdpbmFsIGxpbmUgdG8gdGhlIHNlY29uZCBsaW5lLlxuICAgIGxpbmVEYXRhMi5jb3B5KGxpbmVEYXRhKTtcblxuICAgIGRlYnVnVGV4dEFyZWEuaW5uZXJIVE1MID1cbiAgICAgIFwiQ3VycmVudCBMaW5lRGF0YTogXCIgK1xuICAgICAgSlNPTi5zdHJpbmdpZnkobGluZURhdGEpICtcbiAgICAgIFwiXFxuXCIgK1xuICAgICAgXCJDdXJyZW50IExpbmVEYXRhMjogXCIgK1xuICAgICAgSlNPTi5zdHJpbmdpZnkobGluZURhdGEyKSArXG4gICAgICBcIlxcblwiO1xuICB9O1xuXG4gIHJhbmRvbU9yaWdpbmFsQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBSYW5kb21PcmlnaW5hbCk7XG4gIGNvcHlDb21wb25lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIENvcHlDb21wb25lbnQpO1xufTtcblxuY29uc3QgbWFpbiA9ICgpID0+IHtcbiAgLy8gMi4gQ29tcG9uZW50c1xuICBCYXNpY0NvbXBvbmVudERlbW8oKTtcbiAgQ3VzdG9tVHlwZURlbW8oKTtcbiAgQ3VzdG9tQ29tcG9uZW50RGVtbygpO1xufTtcblxud2luZG93Lm9ubG9hZCA9IG1haW47XG4iLCJpbXBvcnQgeyBjbG9uZUNsb25hYmxlLCBjb3B5Q29weWFibGUsIGNyZWF0ZVR5cGUgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgVmVjdG9yMiB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICB9XG5cbiAgc2V0KHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICB9XG5cbiAgY29weSh2OiBWZWN0b3IyKSB7XG4gICAgdGhpcy54ID0gdi54O1xuICAgIHRoaXMueSA9IHYueTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFZlY3RvcjJUeXBlID0gY3JlYXRlVHlwZSh7XG4gIG5hbWU6IFwiVmVjdG9yMlwiLFxuICBkZWZhdWx0OiBuZXcgVmVjdG9yMigwLCAwKSxcbiAgY29weTogY29weUNvcHlhYmxlPFZlY3RvcjI+LFxuICBjbG9uZTogY2xvbmVDbG9uYWJsZTxWZWN0b3IyPixcbn0pO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvTWFpbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==