(()=>{var __webpack_modules__={808:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>enableRemoteDevtools});var _utils_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(30),_Utils_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(947);function hookConsoleAndErrors(e){["error","warning","log"].forEach((t=>{if("function"==typeof console[t]){var n=console[t].bind(console);console[t]=(...s)=>(e.send({method:"console",type:t,args:JSON.stringify(s)}),n.apply(null,s))}})),window.addEventListener("error",(t=>{e.send({method:"error",error:JSON.stringify({message:t.error.message,stack:t.error.stack})})}))}function includeRemoteIdHTML(e){let t=document.createElement("div");return t.style.cssText="\n    align-items: center;\n    background-color: #333;\n    color: #aaa;\n    display:flex;\n    font-family: Arial;\n    font-size: 1.1em;\n    height: 40px;\n    justify-content: center;\n    left: 0;\n    opacity: 0.9;\n    position: absolute;\n    right: 0;\n    text-align: center;\n    top: 0;\n  ",t.innerHTML=`Open ECSY devtools to connect to this page using the code:&nbsp;<b style="color: #fff">${e}</b>&nbsp;<button onClick="generateNewCode()">Generate new code</button>`,document.body.appendChild(t),t}function enableRemoteDevtools(remoteId){if(!_Utils_js__WEBPACK_IMPORTED_MODULE_0__.Ym)return void console.warn("Remote devtools not available outside the browser");window.generateNewCode=()=>{window.localStorage.clear(),remoteId=(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.O)(6),window.localStorage.setItem("ecsyRemoteId",remoteId),window.location.reload(!1)},remoteId=remoteId||window.localStorage.getItem("ecsyRemoteId"),remoteId||(remoteId=(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.O)(6),window.localStorage.setItem("ecsyRemoteId",remoteId));let infoDiv=includeRemoteIdHTML(remoteId);window.__ECSY_REMOTE_DEVTOOLS_INJECTED=!0,window.__ECSY_REMOTE_DEVTOOLS={};let Version="",worldsBeforeLoading=[],onWorldCreated=e=>{var t=e.detail.world;Version=e.detail.version,worldsBeforeLoading.push(t)};window.addEventListener("ecsy-world-created",onWorldCreated);let onLoaded=()=>{var peer=new Peer(remoteId,{host:"peerjs.ecsy.io",secure:!0,port:443,config:{iceServers:[{url:"stun:stun.l.google.com:19302"},{url:"stun:stun1.l.google.com:19302"},{url:"stun:stun2.l.google.com:19302"},{url:"stun:stun3.l.google.com:19302"},{url:"stun:stun4.l.google.com:19302"}]},debug:3});peer.on("open",(()=>{peer.on("connection",(connection=>{window.__ECSY_REMOTE_DEVTOOLS.connection=connection,connection.on("open",(function(){infoDiv.innerHTML="Connected",connection.on("data",(function(data){if("init"===data.type){var script=document.createElement("script");script.setAttribute("type","text/javascript"),script.onload=()=>{script.parentNode.removeChild(script),window.removeEventListener("ecsy-world-created",onWorldCreated),worldsBeforeLoading.forEach((e=>{var t=new CustomEvent("ecsy-world-created",{detail:{world:e,version:Version}});window.dispatchEvent(t)}))},script.innerHTML=data.script,(document.head||document.documentElement).appendChild(script),script.onload(),hookConsoleAndErrors(connection)}else if("executeScript"===data.type){let value=eval(data.script);data.returnEval&&connection.send({method:"evalReturn",value})}}))}))}))}))};(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.L)("https://cdn.jsdelivr.net/npm/peerjs@0.3.20/dist/peer.min.js",onLoaded)}if(_Utils_js__WEBPACK_IMPORTED_MODULE_0__.Ym){const e=new URLSearchParams(window.location.search);e.has("enable-remote-devtools")&&enableRemoteDevtools()}},30:(e,t,n)=>{"use strict";function s(e){for(var t="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",s=n.length,o=0;o<e;o++)t+=n.charAt(Math.floor(Math.random()*s));return t}function o(e,t){var n=document.createElement("script");n.src=e,n.onload=t,(document.head||document.documentElement).appendChild(n)}n.d(t,{L:()=>o,O:()=>s})},947:(e,t,n)=>{"use strict";function s(e){for(var t=[],n=0;n<e.length;n++){var s=e[n];if(!r(s))throw new Error("Tried to create a query with an unregistered component");if("object"==typeof s){var o="not"===s.operator?"!":s.operator;t.push(o+s.Component._typeId)}else t.push(s._typeId)}return t.sort().join("-")}n.d(t,{EG:()=>s,Ym:()=>o,fh:()=>r,zO:()=>i});const o="undefined"!=typeof window,i=o&&void 0!==window.performance?performance.now.bind(performance):Date.now.bind(Date);function r(e){return"object"==typeof e&&void 0!==e.Component._typeId||e.isComponent&&void 0!==e._typeId}},218:(e,t,n)=>{"use strict";n.r(t),n.d(t,{Component:()=>h,Not:()=>T,ObjectPool:()=>i,System:()=>x,SystemStateComponent:()=>l,TagComponent:()=>D,Types:()=>I,Version:()=>_,World:()=>E,_Entity:()=>f,cloneArray:()=>S,cloneClonable:()=>q,cloneJSON:()=>P,cloneValue:()=>M,copyArray:()=>b,copyCopyable:()=>N,copyJSON:()=>O,copyValue:()=>w,createType:()=>R,enableRemoteDevtools:()=>L.A});var s=n(947);class o{constructor(e){this._systems=[],this._executeSystems=[],this.world=e,this.lastExecutedSystem=null}registerSystem(e,t){if(!e.isSystem)throw new Error(`System '${e.name}' does not extend 'System' class`);if(void 0!==this.getSystem(e))return console.warn(`System '${e.getName()}' already registered.`),this;var n=new e(this.world,t);return n.init&&n.init(t),n.order=this._systems.length,this._systems.push(n),n.execute&&(this._executeSystems.push(n),this.sortSystems()),this}unregisterSystem(e){let t=this.getSystem(e);return void 0===t?(console.warn(`Can unregister system '${e.getName()}'. It doesn't exist.`),this):(this._systems.splice(this._systems.indexOf(t),1),t.execute&&this._executeSystems.splice(this._executeSystems.indexOf(t),1),this)}sortSystems(){this._executeSystems.sort(((e,t)=>e.priority-t.priority||e.order-t.order))}getSystem(e){return this._systems.find((t=>t instanceof e))}getSystems(){return this._systems}removeSystem(e){var t=this._systems.indexOf(e);~t&&this._systems.splice(t,1)}executeSystem(e,t,n){if(e.initialized&&e.canExecute()){let o=(0,s.zO)();e.execute(t,n),e.executeTime=(0,s.zO)()-o,this.lastExecutedSystem=e,e.clearEvents()}}stop(){this._executeSystems.forEach((e=>e.stop()))}execute(e,t,n){this._executeSystems.forEach((s=>(n||s.enabled)&&this.executeSystem(s,e,t)))}stats(){for(var e={numSystems:this._systems.length,systems:{}},t=0;t<this._systems.length;t++){var n=this._systems[t],s=e.systems[n.getName()]={queries:{},executeTime:n.executeTime};for(var o in n.ctx)s.queries[o]=n.ctx[o].stats()}return e}}class i{constructor(e,t){this.freeList=[],this.count=0,this.T=e,this.isObjectPool=!0,void 0!==t&&this.expand(t)}acquire(){return this.freeList.length<=0&&this.expand(Math.round(.2*this.count)+1),this.freeList.pop()}release(e){e.reset(),this.freeList.push(e)}expand(e){for(var t=0;t<e;t++){var n=new this.T;n._pool=this,this.freeList.push(n)}this.count+=e}totalSize(){return this.count}totalFree(){return this.freeList.length}totalUsed(){return this.count-this.freeList.length}}class r{constructor(){this._listeners={},this.stats={fired:0,handled:0}}addEventListener(e,t){let n=this._listeners;void 0===n[e]&&(n[e]=[]),-1===n[e].indexOf(t)&&n[e].push(t)}hasEventListener(e,t){return void 0!==this._listeners[e]&&-1!==this._listeners[e].indexOf(t)}removeEventListener(e,t){var n=this._listeners[e];if(void 0!==n){var s=n.indexOf(t);-1!==s&&n.splice(s,1)}}dispatchEvent(e,t,n){this.stats.fired++;var s=this._listeners[e];if(void 0!==s)for(var o=s.slice(0),i=0;i<o.length;i++)o[i].call(this,t,n)}resetCounters(){this.stats.fired=this.stats.handled=0}}class a{constructor(e,t){if(this.Components=[],this.NotComponents=[],e.forEach((e=>{"object"==typeof e?this.NotComponents.push(e.Component):this.Components.push(e)})),0===this.Components.length)throw new Error("Can't create a query without components");this.entities=[],this.eventDispatcher=new r,this.reactive=!1,this.key=(0,s.EG)(e);for(var n=0;n<t._entities.length;n++){var o=t._entities[n];this.match(o)&&(o.queries.push(this),this.entities.push(o))}}addEntity(e){e.queries.push(this),this.entities.push(e),this.eventDispatcher.dispatchEvent(a.prototype.ENTITY_ADDED,e)}removeEntity(e){let t=this.entities.indexOf(e);~t&&(this.entities.splice(t,1),t=e.queries.indexOf(this),e.queries.splice(t,1),this.eventDispatcher.dispatchEvent(a.prototype.ENTITY_REMOVED,e))}match(e){return e.hasAllComponents(this.Components)&&!e.hasAnyComponents(this.NotComponents)}toJSON(){return{key:this.key,reactive:this.reactive,components:{included:this.Components.map((e=>e.name)),not:this.NotComponents.map((e=>e.name))},numEntities:this.entities.length}}stats(){return{numComponents:this.Components.length,numEntities:this.entities.length}}}a.prototype.ENTITY_ADDED="Query#ENTITY_ADDED",a.prototype.ENTITY_REMOVED="Query#ENTITY_REMOVED",a.prototype.COMPONENT_CHANGED="Query#COMPONENT_CHANGED";class c{constructor(e){this._world=e,this._queries={}}onEntityRemoved(e){for(var t in this._queries){var n=this._queries[t];-1!==e.queries.indexOf(n)&&n.removeEntity(e)}}onEntityComponentAdded(e,t){for(var n in this._queries){var s=this._queries[n];~s.NotComponents.indexOf(t)&&~s.entities.indexOf(e)?s.removeEntity(e):~s.Components.indexOf(t)&&s.match(e)&&!~s.entities.indexOf(e)&&s.addEntity(e)}}onEntityComponentRemoved(e,t){for(var n in this._queries){var s=this._queries[n];~s.NotComponents.indexOf(t)&&!~s.entities.indexOf(e)&&s.match(e)?s.addEntity(e):~s.Components.indexOf(t)&&~s.entities.indexOf(e)&&!s.match(e)&&s.removeEntity(e)}}getQuery(e){var t=(0,s.EG)(e),n=this._queries[t];return n||(this._queries[t]=n=new a(e,this._world)),n}stats(){var e={};for(var t in this._queries)e[t]=this._queries[t].stats();return e}}class h{constructor(e){if(!1!==e){const t=this.constructor.schema;for(const n in t)if(e&&e.hasOwnProperty(n))this[n]=e[n];else{const e=t[n];if(e.hasOwnProperty("default"))this[n]=e.type.clone(e.default);else{const t=e.type;this[n]=t.clone(t.default)}}}this._pool=null}copy(e){const t=this.constructor.schema;for(const n in t){const s=t[n];e.hasOwnProperty(n)&&(this[n]=s.type.copy(e[n],this[n]))}return this}clone(){return(new this.constructor).copy(this)}reset(){const e=this.constructor.schema;for(const t in e){const n=e[t];if(n.hasOwnProperty("default"))this[t]=n.type.copy(n.default,this[t]);else{const e=n.type;this[t]=e.copy(e.default,this[t])}}}dispose(){this._pool&&this._pool.release(this)}getName(){return this.constructor.getName()}checkUndefinedAttributes(e){const t=this.constructor.schema;Object.keys(e).forEach((e=>{t.hasOwnProperty(e)||console.warn(`Trying to set attribute '${e}' not defined in the '${this.constructor.name}' schema. Please fix the schema, the attribute value won't be set`)}))}}h.schema={},h.isComponent=!0,h.getName=function(){return this.displayName||this.name};class l extends h{}l.isSystemStateComponent=!0;class m extends i{constructor(e,t,n){super(t,void 0),this.entityManager=e,void 0!==n&&this.expand(n)}expand(e){for(var t=0;t<e;t++){var n=new this.T(this.entityManager);n._pool=this,this.freeList.push(n)}this.count+=e}}class p{constructor(e){this.world=e,this.componentsManager=e.componentsManager,this._entities=[],this._nextEntityId=0,this._entitiesByNames={},this._queryManager=new c(this),this.eventDispatcher=new r,this._entityPool=new m(this,this.world.options.entityClass,this.world.options.entityPoolSize),this.entitiesWithComponentsToRemove=[],this.entitiesToRemove=[],this.deferredRemovalEnabled=!0}getEntityByName(e){return this._entitiesByNames[e]}createEntity(e){var t=this._entityPool.acquire();return t.alive=!0,t.name=e||"",e&&(this._entitiesByNames[e]?console.warn(`Entity name '${e}' already exist`):this._entitiesByNames[e]=t),this._entities.push(t),this.eventDispatcher.dispatchEvent(d,t),t}entityAddComponent(e,t,n){if(void 0===t._typeId&&!this.world.componentsManager._ComponentsMap[t._typeId])throw new Error(`Attempted to add unregistered component "${t.getName()}"`);if(!~e._ComponentTypes.indexOf(t)){e._ComponentTypes.push(t),t.__proto__===l&&e.numStateComponents++;var s=this.world.componentsManager.getComponentsPool(t),o=s?s.acquire():new t(n);s&&n&&o.copy(n),e._components[t._typeId]=o,this._queryManager.onEntityComponentAdded(e,t),this.world.componentsManager.componentAddedToEntity(t),this.eventDispatcher.dispatchEvent(y,e,t)}}entityRemoveComponent(e,t,n){var s=e._ComponentTypes.indexOf(t);~s&&(this.eventDispatcher.dispatchEvent(v,e,t),n?this._entityRemoveComponentSync(e,t,s):(0===e._ComponentTypesToRemove.length&&this.entitiesWithComponentsToRemove.push(e),e._ComponentTypes.splice(s,1),e._ComponentTypesToRemove.push(t),e._componentsToRemove[t._typeId]=e._components[t._typeId],delete e._components[t._typeId]),this._queryManager.onEntityComponentRemoved(e,t),t.__proto__===l&&(e.numStateComponents--,0!==e.numStateComponents||e.alive||e.remove()))}_entityRemoveComponentSync(e,t,n){e._ComponentTypes.splice(n,1);var s=e._components[t._typeId];delete e._components[t._typeId],s.dispose(),this.world.componentsManager.componentRemovedFromEntity(t)}entityRemoveAllComponents(e,t){let n=e._ComponentTypes;for(let s=n.length-1;s>=0;s--)n[s].__proto__!==l&&this.entityRemoveComponent(e,n[s],t)}removeEntity(e,t){var n=this._entities.indexOf(e);if(!~n)throw new Error("Tried to remove entity not in list");e.alive=!1,this.entityRemoveAllComponents(e,t),0===e.numStateComponents&&(this.eventDispatcher.dispatchEvent(u,e),this._queryManager.onEntityRemoved(e),!0===t?this._releaseEntity(e,n):this.entitiesToRemove.push(e))}_releaseEntity(e,t){this._entities.splice(t,1),this._entitiesByNames[e.name]&&delete this._entitiesByNames[e.name],e._pool.release(e)}removeAllEntities(){for(var e=this._entities.length-1;e>=0;e--)this.removeEntity(this._entities[e])}processDeferredRemoval(){if(this.deferredRemovalEnabled){for(let e=0;e<this.entitiesToRemove.length;e++){let t=this.entitiesToRemove[e],n=this._entities.indexOf(t);this._releaseEntity(t,n)}this.entitiesToRemove.length=0;for(let t=0;t<this.entitiesWithComponentsToRemove.length;t++){let n=this.entitiesWithComponentsToRemove[t];for(;n._ComponentTypesToRemove.length>0;){let t=n._ComponentTypesToRemove.pop();var e=n._componentsToRemove[t._typeId];delete n._componentsToRemove[t._typeId],e.dispose(),this.world.componentsManager.componentRemovedFromEntity(t)}}this.entitiesWithComponentsToRemove.length=0}}queryComponents(e){return this._queryManager.getQuery(e)}count(){return this._entities.length}stats(){var e={numEntities:this._entities.length,numQueries:Object.keys(this._queryManager._queries).length,queries:this._queryManager.stats(),numComponentPool:Object.keys(this.componentsManager._componentPool).length,componentPool:{},eventDispatcher:this.eventDispatcher.stats};for(var t in this.componentsManager._componentPool){var n=this.componentsManager._componentPool[t];e.componentPool[n.T.getName()]={used:n.totalUsed(),size:n.count}}return e}}const d="EntityManager#ENTITY_CREATE",u="EntityManager#ENTITY_REMOVED",y="EntityManager#COMPONENT_ADDED",v="EntityManager#COMPONENT_REMOVE";class g{constructor(){this.Components=[],this._ComponentsMap={},this._componentPool={},this.numComponents={},this.nextComponentId=0}hasComponent(e){return-1!==this.Components.indexOf(e)}registerComponent(e,t){if(-1!==this.Components.indexOf(e))return void console.warn(`Component type: '${e.getName()}' already registered.`);const n=e.schema;if(!n)throw new Error(`Component "${e.getName()}" has no schema property.`);for(const t in n)if(!n[t].type)throw new Error(`Invalid schema for component "${e.getName()}". Missing type for "${t}" property.`);e._typeId=this.nextComponentId++,this.Components.push(e),this._ComponentsMap[e._typeId]=e,this.numComponents[e._typeId]=0,void 0===t?t=new i(e):!1===t&&(t=void 0),this._componentPool[e._typeId]=t}componentAddedToEntity(e){this.numComponents[e._typeId]++}componentRemovedFromEntity(e){this.numComponents[e._typeId]--}getComponentsPool(e){return this._componentPool[e._typeId]}}const _="0.3.1";new WeakMap;class f{constructor(e){this._entityManager=e||null,this.id=e._nextEntityId++,this._ComponentTypes=[],this._components={},this._componentsToRemove={},this.queries=[],this._ComponentTypesToRemove=[],this.alive=!1,this.numStateComponents=0}getComponent(e,t){var n=this._components[e._typeId];return n||!0!==t||(n=this._componentsToRemove[e._typeId]),n}getRemovedComponent(e){return this._componentsToRemove[e._typeId]}getComponents(){return this._components}getComponentsToRemove(){return this._componentsToRemove}getComponentTypes(){return this._ComponentTypes}getMutableComponent(e){var t=this._components[e._typeId];if(t){for(var n=0;n<this.queries.length;n++){var s=this.queries[n];s.reactive&&-1!==s.Components.indexOf(e)&&s.eventDispatcher.dispatchEvent(a.prototype.COMPONENT_CHANGED,this,t)}return t}}addComponent(e,t){return this._entityManager.entityAddComponent(this,e,t),this}removeComponent(e,t){return this._entityManager.entityRemoveComponent(this,e,t),this}hasComponent(e,t){return!!~this._ComponentTypes.indexOf(e)||!0===t&&this.hasRemovedComponent(e)}hasRemovedComponent(e){return!!~this._ComponentTypesToRemove.indexOf(e)}hasAllComponents(e){for(var t=0;t<e.length;t++)if(!this.hasComponent(e[t]))return!1;return!0}hasAnyComponents(e){for(var t=0;t<e.length;t++)if(this.hasComponent(e[t]))return!0;return!1}removeAllComponents(e){return this._entityManager.entityRemoveAllComponents(this,e)}copy(e){for(var t in e._components){var n=e._components[t];this.addComponent(n.constructor),this.getComponent(n.constructor).copy(n)}return this}clone(){return new f(this._entityManager).copy(this)}reset(){for(var e in this.id=this._entityManager._nextEntityId++,this._ComponentTypes.length=0,this.queries.length=0,this._components)delete this._components[e]}remove(e){return this._entityManager.removeEntity(this,e)}}const C={entityPoolSize:0,entityClass:f};class E{constructor(e={}){if(this.options=Object.assign({},C,e),this.componentsManager=new g(this),this.entityManager=new p(this),this.systemManager=new o(this),this.enabled=!0,this.eventQueues={},s.Ym&&"undefined"!=typeof CustomEvent){var t=new CustomEvent("ecsy-world-created",{detail:{world:this,version:_}});window.dispatchEvent(t)}this.lastTime=(0,s.zO)()/1e3}registerComponent(e,t){return this.componentsManager.registerComponent(e,t),this}registerSystem(e,t){return this.systemManager.registerSystem(e,t),this}hasRegisteredComponent(e){return this.componentsManager.hasComponent(e)}unregisterSystem(e){return this.systemManager.unregisterSystem(e),this}getSystem(e){return this.systemManager.getSystem(e)}getSystems(){return this.systemManager.getSystems()}execute(e,t){e||(e=(t=(0,s.zO)()/1e3)-this.lastTime,this.lastTime=t),this.enabled&&(this.systemManager.execute(e,t),this.entityManager.processDeferredRemoval())}stop(){this.enabled=!1}play(){this.enabled=!0}createEntity(e){return this.entityManager.createEntity(e)}stats(){return{entities:this.entityManager.stats(),system:this.systemManager.stats()}}}class x{canExecute(){if(0===this._mandatoryQueries.length)return!0;for(let e=0;e<this._mandatoryQueries.length;e++)if(0===this._mandatoryQueries[e].entities.length)return!1;return!0}getName(){return this.constructor.getName()}constructor(e,t){if(this.world=e,this.enabled=!0,this._queries={},this.queries={},this.priority=0,this.executeTime=0,t&&t.priority&&(this.priority=t.priority),this._mandatoryQueries=[],this.initialized=!0,this.constructor.queries)for(var n in this.constructor.queries){var o=this.constructor.queries[n],i=o.components;if(!i||0===i.length)throw new Error("'components' attribute can't be empty in a query");let e=i.filter((e=>!(0,s.fh)(e)));if(e.length>0)throw new Error(`Tried to create a query '${this.constructor.name}.${n}' with unregistered components: [${e.map((e=>e.getName())).join(", ")}]`);var r=this.world.entityManager.queryComponents(i);this._queries[n]=r,!0===o.mandatory&&this._mandatoryQueries.push(r),this.queries[n]={results:r.entities};var c=["added","removed","changed"];const t={added:a.prototype.ENTITY_ADDED,removed:a.prototype.ENTITY_REMOVED,changed:a.prototype.COMPONENT_CHANGED};o.listen&&c.forEach((e=>{if(this.execute||console.warn(`System '${this.getName()}' has defined listen events (${c.join(", ")}) for query '${n}' but it does not implement the 'execute' method.`),o.listen[e]){let s=o.listen[e];if("changed"===e){if(r.reactive=!0,!0===s){let t=this.queries[n][e]=[];r.eventDispatcher.addEventListener(a.prototype.COMPONENT_CHANGED,(e=>{-1===t.indexOf(e)&&t.push(e)}))}else if(Array.isArray(s)){let t=this.queries[n][e]=[];r.eventDispatcher.addEventListener(a.prototype.COMPONENT_CHANGED,((e,n)=>{-1!==s.indexOf(n.constructor)&&-1===t.indexOf(e)&&t.push(e)}))}}else{let s=this.queries[n][e]=[];r.eventDispatcher.addEventListener(t[e],(e=>{-1===s.indexOf(e)&&s.push(e)}))}}}))}}stop(){this.executeTime=0,this.enabled=!1}play(){this.enabled=!0}clearEvents(){for(let t in this.queries){var e=this.queries[t];if(e.added&&(e.added.length=0),e.removed&&(e.removed.length=0),e.changed)if(Array.isArray(e.changed))e.changed.length=0;else for(let t in e.changed)e.changed[t].length=0}}toJSON(){var e={name:this.getName(),enabled:this.enabled,executeTime:this.executeTime,priority:this.priority,queries:{}};if(this.constructor.queries){var t=this.constructor.queries;for(let n in t){let s=this.queries[n],o=t[n],i=e.queries[n]={key:this._queries[n].key};i.mandatory=!0===o.mandatory,i.reactive=o.listen&&(!0===o.listen.added||!0===o.listen.removed||!0===o.listen.changed||Array.isArray(o.listen.changed)),i.reactive&&(i.listen={},["added","removed","changed"].forEach((e=>{s[e]&&(i.listen[e]={entities:s[e].length})})))}}return e}}function T(e){return{operator:"not",Component:e}}x.isSystem=!0,x.getName=function(){return this.displayName||this.name};class D extends h{constructor(){super(!1)}}D.isTagComponent=!0;const w=e=>e,M=e=>e,b=(e,t)=>{if(!e)return e;if(!t)return e.slice();t.length=0;for(let n=0;n<e.length;n++)t.push(e[n]);return t},S=e=>e&&e.slice(),O=e=>JSON.parse(JSON.stringify(e)),P=e=>JSON.parse(JSON.stringify(e)),N=(e,t)=>e?t?t.copy(e):e.clone():e,q=e=>e&&e.clone();function R(e){var t=["name","default","copy","clone"].filter((t=>!e.hasOwnProperty(t)));if(t.length>0)throw new Error(`createType expects a type definition with the following properties: ${t.join(", ")}`);return e.isType=!0,e}const I={Number:R({name:"Number",default:0,copy:w,clone:M}),Boolean:R({name:"Boolean",default:!1,copy:w,clone:M}),String:R({name:"String",default:"",copy:w,clone:M}),Array:R({name:"Array",default:[],copy:b,clone:S}),Ref:R({name:"Ref",default:void 0,copy:w,clone:M}),JSON:R({name:"JSON",default:null,copy:O,clone:P})};var L=n(808)},821:(e,t,n)=>{var s,o;s=[n,t,n(218)],o=function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.LineData=void 0;class s extends n.Component{constructor(){super(!1),this.points=new Array}copy(e){this.points.length=e.points.length;for(let t=0;t<e.points.length;t++){const n=e.points[t];this.points[t]=n.clone()}return this}reset(){this.points.forEach((e=>{e.x=0,e.y=0}))}}t.LineData=s}.apply(t,s),void 0===o||(e.exports=o)},419:(e,t,n)=>{var s,o;s=[n,t,n(218)],o=function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ValueData=void 0;class s extends n.Component{}t.ValueData=s,s.schema={intVal:{type:n.Types.Number,default:0},strVal:{type:n.Types.String,default:""}}}.apply(t,s),void 0===o||(e.exports=o)},811:(e,t,n)=>{var s,o;s=[n,t,n(218)],o=function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.MassData=void 0;class s extends n.Component{}t.MassData=s,s.schema={mass:{type:n.Types.Number,default:1}}}.apply(t,s),void 0===o||(e.exports=o)},286:(e,t,n)=>{var s,o;s=[n,t,n(218),n(335)],o=function(e,t,n,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Transform2DData=void 0;class o extends n.Component{}t.Transform2DData=o,o.schema={position:{type:s.Vector2Type,default:new s.Vector2(0,0)}}}.apply(t,s),void 0===o||(e.exports=o)},274:(e,t,n)=>{var s,o;s=[n,t,n(218),n(335)],o=function(e,t,n,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.VelocityData=void 0;class o extends n.Component{}t.VelocityData=o,o.schema={velocity:{type:s.Vector2Type,default:new s.Vector2(0,0)}}}.apply(t,s),void 0===o||(e.exports=o)},731:(e,t,n)=>{var s,o;s=[n,t,n(218),n(821),n(419),n(286),n(335)],o=function(e,t,n,s,o,i,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.demo1=void 0,new n.World({entityPoolSize:1e4}),t.demo1=()=>{(()=>{let e=document.getElementById("debug1"),t=document.getElementById("debugButton1");if(!e||!t)return;const n=new o.ValueData;e.innerHTML+="Initial ValueData: "+JSON.stringify(n)+"\n",t.addEventListener("click",(()=>{n.intVal+=10,n.strVal="Hello World!",e.innerHTML+="Current ValueData: "+JSON.stringify(n)+"\n"}))})(),(()=>{let e=document.getElementById("debug2"),t=document.getElementById("debugButton2");if(!e||!t)return;const n=new i.Transform2DData;e.innerHTML+="Initial Transform2D: "+JSON.stringify(n)+"\n",t.addEventListener("click",(()=>{n.position.x+=10,n.position.y+=10,e.innerHTML+="Current Transform2D: "+JSON.stringify(n)+"\n"}))})(),(()=>{let e=document.getElementById("debug3"),t=document.getElementById("debugButton3"),n=document.getElementById("debugButton4");if(!e||!t||!n)return;const o=new s.LineData,i=new s.LineData;e.innerHTML="Initial LineData: "+JSON.stringify(o)+"\nInitial LineData2: "+JSON.stringify(i)+"\n",t.addEventListener("click",(()=>{o.points.length=0;for(let e=0;e<3;e++)o.points.push(new r.Vector2(Math.random(),Math.random()));e.innerHTML="Current LineData: "+JSON.stringify(o)+"\nCurrent LineData2: "+JSON.stringify(i)+"\n"})),n.addEventListener("click",(()=>{i.copy(o),e.innerHTML="Current LineData: "+JSON.stringify(o)+"\nCurrent LineData2: "+JSON.stringify(i)+"\n"}))})()}}.apply(t,s),void 0===o||(e.exports=o)},578:(e,t,n)=>{var s,o;s=[n,t,n(218),n(811),n(286),n(274),n(93),n(812),n(287),n(831),n(370),n(764),n(318),n(1),n(146),n(110),n(96),n(402),n(732),n(157)],o=function(e,t,n,s,o,i,r,a,c,h,l,m,p,d,u,y,v,g,_,f){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.demo2=void 0;const C=new n.World({entityPoolSize:1e4}),E=()=>{C.execute(),requestAnimationFrame(E)};t.demo2=()=>{let e=document.getElementById("mainCanvas");if(!e)return;e.width=e.clientWidth,e.height=e.clientHeight;const t=document.getElementById("generateMoonButton"),n=document.getElementById("generatePlanetButton"),x=document.getElementById("clearEntitiesButton"),T=document.getElementById("moonCount");C.registerComponent(y.DebugTag).registerComponent(g.DraggableTag).registerComponent(v.DraggableHighlightTag).registerComponent(f.PlanetTag).registerComponent(_.MoonTag),C.registerComponent(o.Transform2DData).registerComponent(i.VelocityData).registerComponent(s.MassData),C.registerSystem(h.DraggableSystem,{canvas:e}).registerSystem(u.VelocityMoveSystem).registerSystem(l.GravitySystem).registerSystem(p.PlanetGenerationSystem,{canvas:e,generateMoonButton:t,generatePlanetButton:n,clearEntitiesButton:x,moonCountText:T}),C.registerSystem(r.ClearCanvasSystem,{canvas:e}).registerSystem(m.MoonRenderSystem,{canvas:e}).registerSystem(d.PlanetRenderSystem,{canvas:e}).registerSystem(a.DebugRenderSystem,{canvas:e}).registerSystem(c.DraggableHighlightRenderSystem,{canvas:e}),requestAnimationFrame(E)}}.apply(t,s),void 0===o||(e.exports=o)},226:(e,t,n)=>{var s,o;s=[n,t,n(731),n(578)],void 0===(o=function(e,t,n,s){"use strict";window.onload=()=>{(0,n.demo1)(),(0,s.demo2)()}}.apply(t,s))||(e.exports=o)},93:(e,t,n)=>{var s,o;s=[n,t,n(218)],o=function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ClearCanvasSystem=void 0;class s extends n.System{init(e){this.canvas=e.canvas,this.canvasContext=this.canvas.getContext("2d")}execute(e,t){this.canvasContext.clearRect(0,0,this.canvas.width,this.canvas.height)}}t.ClearCanvasSystem=s}.apply(t,s),void 0===o||(e.exports=o)},812:(e,t,n)=>{var s,o;s=[n,t,n(218),n(286),n(110)],o=function(e,t,n,s,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DebugRenderSystem=void 0;class i extends n.System{init(e){this.canvas=e.canvas,this.canvasContext=this.canvas.getContext("2d")}execute(e,t){this.queries.transformEntities.results.forEach((e=>{let t=e.getComponent(s.Transform2DData),n=t.position.x,o=t.position.y;this.canvasContext.save(),this.canvasContext.translate(n,o),this.canvasContext.fillStyle="green",this.canvasContext.beginPath(),this.canvasContext.arc(0,0,5,0,2*Math.PI),this.canvasContext.fill(),this.canvasContext.beginPath(),this.canvasContext.moveTo(0,0),this.canvasContext.strokeStyle="red",this.canvasContext.lineWidth=2,this.canvasContext.lineTo(40,0),this.canvasContext.stroke(),this.canvasContext.beginPath(),this.canvasContext.fillStyle="red",this.canvasContext.moveTo(50,0),this.canvasContext.lineTo(40,5),this.canvasContext.lineTo(40,-5),this.canvasContext.closePath(),this.canvasContext.fill(),this.canvasContext.beginPath(),this.canvasContext.moveTo(0,0),this.canvasContext.strokeStyle="blue",this.canvasContext.lineWidth=2,this.canvasContext.lineTo(0,40),this.canvasContext.stroke(),this.canvasContext.beginPath(),this.canvasContext.fillStyle="blue",this.canvasContext.moveTo(0,50),this.canvasContext.lineTo(5,40),this.canvasContext.lineTo(-5,40),this.canvasContext.closePath(),this.canvasContext.fill(),this.canvasContext.restore()}))}}t.DebugRenderSystem=i,i.queries={transformEntities:{components:[s.Transform2DData,o.DebugTag]}}}.apply(t,s),void 0===o||(e.exports=o)},287:(e,t,n)=>{var s,o;s=[n,t,n(218),n(286),n(96)],o=function(e,t,n,s,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DraggableHighlightRenderSystem=void 0;class i extends n.System{init(e){this.mainCanvas=e.canvas,this.canvasContext=this.mainCanvas.getContext("2d")}execute(e,t){this.queries.highlightEntities.results.forEach((e=>{const t=e.getComponent(s.Transform2DData);this.canvasContext.beginPath(),this.canvasContext.strokeStyle="blue",this.canvasContext.arc(t.position.x,t.position.y,30,0,2*Math.PI),this.canvasContext.stroke()}))}}t.DraggableHighlightRenderSystem=i,i.queries={highlightEntities:{components:[s.Transform2DData,o.DraggableHighlightTag]}}}.apply(t,s),void 0===o||(e.exports=o)},831:(e,t,n)=>{var s,o;s=[n,t,n(218),n(286),n(110),n(96),n(402),n(335)],o=function(e,t,n,s,o,i,r,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DraggableSystem=void 0;class c extends n.System{constructor(){super(...arguments),this.mousePos=new a.Vector2(0,0),this.isMouseDown=!1,this.closestEntity=null,this.currEntity=null}init(e){this.mainCanvas=e.canvas,this.mainCanvas.addEventListener("mousemove",(e=>{let t=this.getMousePos(this.mainCanvas,e),n=a.Vector2.sub(t,this.mousePos);if(this.mousePos=t,this.isMouseDown&&null!=this.currEntity){const e=this.currEntity.getMutableComponent(s.Transform2DData);e.position=a.Vector2.add(e.position,n)}})),this.mainCanvas.addEventListener("mousedown",(e=>{this.isMouseDown=!0,this.updateSelectedEntity(),this.mousePos=this.getMousePos(this.mainCanvas,e)})),this.mainCanvas.addEventListener("mouseup",(e=>{this.isMouseDown=!1}))}execute(e,t){if(this.isMouseDown)return;let n=null,o=0;this.queries.draggableEntities.results.forEach((e=>{const t=e.getComponent(s.Transform2DData),i=a.Vector2.sub(this.mousePos,t.position).magnitude();i>30||(null==n||i<o)&&(n=e,o=i)})),this.queries.highlightEntities.results.forEach((e=>{e!=n&&e.removeComponent(i.DraggableHighlightTag)})),n&&!n.hasComponent(i.DraggableHighlightTag)&&n.addComponent(i.DraggableHighlightTag),this.closestEntity=n}getMousePos(e,t){const n=e.getBoundingClientRect();return new a.Vector2(t.clientX-n.left,t.clientY-n.top)}updateSelectedEntity(){null==this.currEntity&&null!=this.closestEntity?(this.currEntity=this.closestEntity,this.currEntity.addComponent(o.DebugTag)):null!=this.currEntity&&null==this.closestEntity?(this.currEntity.removeComponent(o.DebugTag),this.currEntity=null):null!=this.currEntity&&null!=this.closestEntity&&this.currEntity!=this.closestEntity&&(this.currEntity.removeComponent(o.DebugTag),this.currEntity=this.closestEntity,this.currEntity.addComponent(o.DebugTag))}}t.DraggableSystem=c,c.queries={draggableEntities:{components:[r.DraggableTag,s.Transform2DData]},highlightEntities:{components:[i.DraggableHighlightTag]}}}.apply(t,s),void 0===o||(e.exports=o)},370:(e,t,n)=>{var s,o;s=[n,t,n(218),n(811),n(286),n(274),n(732),n(157),n(335)],o=function(e,t,n,s,o,i,r,a,c){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.GravitySystem=void 0,Math.pow(10,-11);class h extends n.System{execute(e,t){const n=this.queries.planets.results,r=this.queries.moons.results;n.forEach((e=>{const t=e.getComponent(o.Transform2DData),n=e.getComponent(s.MassData);r.forEach((e=>{const r=e.getComponent(o.Transform2DData),a=e.getMutableComponent(i.VelocityData),h=e.getComponent(s.MassData),l=c.Vector2.sub(t.position,r.position).magnitude(),m=n.mass*h.mass/(l*l),p=c.Vector2.sub(t.position,r.position).normalize();let d=c.Vector2.scale(p,m/h.mass);d.magnitude()>100&&(d=d.normalize(),d=c.Vector2.scale(d,100)),a.velocity=c.Vector2.add(a.velocity,d)}))}))}}t.GravitySystem=h,h.queries={planets:{components:[a.PlanetTag,o.Transform2DData,s.MassData]},moons:{components:[r.MoonTag,o.Transform2DData,i.VelocityData,s.MassData]}}}.apply(t,s),void 0===o||(e.exports=o)},764:(e,t,n)=>{var s,o;s=[n,t,n(218),n(286),n(732)],o=function(e,t,n,s,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.MoonRenderSystem=void 0;class i extends n.System{init(e){this.mainCanvas=e.canvas,this.canvasContext=this.mainCanvas.getContext("2d")}execute(e,t){this.queries.moons.results.forEach((e=>{const t=e.getComponent(s.Transform2DData);this.canvasContext.beginPath(),this.canvasContext.fillStyle="black",this.canvasContext.arc(t.position.x,t.position.y,10,0,2*Math.PI),this.canvasContext.fill()}))}}t.MoonRenderSystem=i,i.queries={moons:{components:[o.MoonTag,s.Transform2DData]}}}.apply(t,s),void 0===o||(e.exports=o)},318:(e,t,n)=>{var s,o;s=[n,t,n(218),n(811),n(286),n(274),n(402),n(732),n(157),n(335)],o=function(e,t,n,s,o,i,r,a,c,h){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PlanetGenerationSystem=void 0;class l extends n.System{constructor(){super(...arguments),this.moonCount=0}init(e){this.mainCanvas=e.canvas;const t=e.generateMoonButton,n=e.generatePlanetButton,s=e.clearEntitiesButton,o=e.moonCountText;t.addEventListener("click",(()=>{this.generateMoons(50),this.moonCount+=50,o.innerText=this.moonCount.toString()})),n.addEventListener("click",(()=>{this.generatePlanets(1)})),s.addEventListener("click",(()=>{const e=this.queries.moons.results;for(let t=e.length-1;t>=0;t--)e[t].remove();const t=this.queries.planets.results;for(let e=t.length-1;e>=0;e--)t[e].remove();this.moonCount=0,o.innerText=this.moonCount.toString()}))}execute(e,t){}generateMoons(e){for(let t=0;t<e;t++)this.world.createEntity().addComponent(o.Transform2DData,{position:new h.Vector2(Math.random()*this.mainCanvas.width,Math.random()*this.mainCanvas.height)}).addComponent(i.VelocityData,{velocity:new h.Vector2(100*Math.random()-50,100*Math.random()-50)}).addComponent(s.MassData,{mass:5*Math.random()+5}).addComponent(a.MoonTag)}generatePlanets(e){for(let t=0;t<e;t++)this.world.createEntity().addComponent(o.Transform2DData,{position:new h.Vector2(this.mainCanvas.width/2,this.mainCanvas.height/2)}).addComponent(s.MassData,{mass:5e3*Math.random()+5e3}).addComponent(c.PlanetTag).addComponent(r.DraggableTag)}}t.PlanetGenerationSystem=l,l.queries={moons:{components:[a.MoonTag]},planets:{components:[c.PlanetTag]}}}.apply(t,s),void 0===o||(e.exports=o)},1:(e,t,n)=>{var s,o;s=[n,t,n(218),n(286),n(157)],o=function(e,t,n,s,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PlanetRenderSystem=void 0;class i extends n.System{init(e){this.mainCanvas=e.canvas,this.canvasContext=this.mainCanvas.getContext("2d")}execute(e,t){this.queries.planets.results.forEach((e=>{const t=e.getComponent(s.Transform2DData);this.canvasContext.beginPath(),this.canvasContext.fillStyle="orange",this.canvasContext.arc(t.position.x,t.position.y,20,0,2*Math.PI),this.canvasContext.fill()}))}}t.PlanetRenderSystem=i,i.queries={planets:{components:[o.PlanetTag,s.Transform2DData]}}}.apply(t,s),void 0===o||(e.exports=o)},146:(e,t,n)=>{var s,o;s=[n,t,n(218),n(286),n(274)],o=function(e,t,n,s,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.VelocityMoveSystem=void 0;class i extends n.System{execute(e,t){this.queries.entities.results.forEach((t=>{const n=t.getComponent(s.Transform2DData),i=t.getComponent(o.VelocityData);n.position.x+=i.velocity.x*e,n.position.y+=i.velocity.y*e}))}}t.VelocityMoveSystem=i,i.queries={entities:{components:[o.VelocityData,s.Transform2DData]}}}.apply(t,s),void 0===o||(e.exports=o)},110:(e,t,n)=>{var s,o;s=[n,t,n(218)],o=function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DebugTag=void 0;class s extends n.TagComponent{}t.DebugTag=s}.apply(t,s),void 0===o||(e.exports=o)},96:(e,t,n)=>{var s,o;s=[n,t,n(218)],o=function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DraggableHighlightTag=void 0;class s extends n.TagComponent{}t.DraggableHighlightTag=s}.apply(t,s),void 0===o||(e.exports=o)},402:(e,t,n)=>{var s,o;s=[n,t,n(218)],o=function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DraggableTag=void 0;class s extends n.TagComponent{}t.DraggableTag=s}.apply(t,s),void 0===o||(e.exports=o)},732:(e,t,n)=>{var s,o;s=[n,t,n(218)],o=function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.MoonTag=void 0;class s extends n.TagComponent{}t.MoonTag=s}.apply(t,s),void 0===o||(e.exports=o)},157:(e,t,n)=>{var s,o;s=[n,t,n(218)],o=function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PlanetTag=void 0;class s extends n.TagComponent{}t.PlanetTag=s}.apply(t,s),void 0===o||(e.exports=o)},335:(e,t,n)=>{var s,o;s=[n,t,n(218)],o=function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Vector2Type=t.Vector2=void 0;class s{constructor(e=0,t=0){this.x=e,this.y=t}set(e,t){return this.x=e,this.y=t,this}copy(e){return this.x=e.x,this.y=e.y,this}clone(){return new s(this.x,this.y)}magnitude(){return Math.sqrt(this.x*this.x+this.y*this.y)}normalize(){const e=this.magnitude();let t=new s;return t.x=this.x/e,t.y=this.y/e,t}static add(e,t){let n=new s;return n.x=e.x+t.x,n.y=e.y+t.y,n}static sub(e,t){let n=new s;return n.x=e.x-t.x,n.y=e.y-t.y,n}static scale(e,t){let n=new s;return n.x=e.x*t,n.y=e.y*t,n}}t.Vector2=s,t.Vector2Type=(0,n.createType)({name:"Vector2",default:new s(0,0),copy:n.copyCopyable,clone:n.cloneClonable})}.apply(t,s),void 0===o||(e.exports=o)}},__webpack_module_cache__={};function __webpack_require__(e){var t=__webpack_module_cache__[e];if(void 0!==t)return t.exports;var n=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](n,n.exports,__webpack_require__),n.exports}__webpack_require__.d=(e,t)=>{for(var n in t)__webpack_require__.o(t,n)&&!__webpack_require__.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var __webpack_exports__=__webpack_require__(226)})();
//# sourceMappingURL=out.js.map