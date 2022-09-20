var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("Core/Context/TimeContext", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.timeContext = void 0;
    exports.timeContext = {
        startTime: 0,
        lastUpdateTime: 0,
        deltaTime: 0,
        timeSinceStartup: 0,
        timeScale: 1
    };
});
define("Utils/SetUtils", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.SetsChild = exports.SetsEqual = void 0;
    // Check if two sets are equal.
    function SetsEqual(a, b) {
        if (a.size !== b.size) {
            return false;
        }
        return Array.from(a).every(function (element) {
            return b.has(element);
        });
    }
    exports.SetsEqual = SetsEqual;
    // Check if one set is the child set of another.
    function SetsChild(child, target) {
        var res = true;
        child.forEach(function (element) {
            if (!target.has(element)) {
                res = false;
            }
        });
        return res;
    }
    exports.SetsChild = SetsChild;
});
define("Core/ESCSystem/ECSInterface/IComponent", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
});
define("Core/ESCSystem/ECSInterface/IEntity", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
});
define("Core/ESCSystem/ECSInterface/IArchetype", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
});
define("Core/ESCSystem/ArchetypeManager", ["require", "exports", "Utils/SetUtils"], function (require, exports, SetUtils_1) {
    "use strict";
    exports.__esModule = true;
    exports.DestroyArchetype = exports.GetArchetypes = exports.GetAccurateArchetype = exports.CreateArchetype = exports.HasArchetype = void 0;
    var archetypes = new Map();
    // Check if such archetype exist in the ECS system.
    function HasArchetype(components) {
        var res = false;
        // Check if the archetype exist.
        archetypes.forEach(function (archetype) {
            if ((0, SetUtils_1.SetsEqual)(archetype.componentTypes, components)) {
                res = true;
            }
        });
        return res;
    }
    exports.HasArchetype = HasArchetype;
    // Create a new archetype.
    function CreateArchetype(components) {
        // Check if the archetype exist.
        archetypes.forEach(function (archetype) {
            if ((0, SetUtils_1.SetsEqual)(archetype.componentTypes, components)) {
                throw new Error("Archetype exist.");
            }
        });
        // Create component map.
        var componentMap = new Map();
        components.forEach(function (component) {
            componentMap.set(component, new Array());
        });
        archetypes.set(components, {
            componentTypes: components,
            entities: new Array(),
            archetypeSize: 0,
            components: componentMap
        });
    }
    exports.CreateArchetype = CreateArchetype;
    // Get the exact archetype.
    function GetAccurateArchetype(components) {
        var res = null;
        archetypes.forEach(function (archetype) {
            if ((0, SetUtils_1.SetsEqual)(archetype.componentTypes, components)) {
                res = archetype;
            }
        });
        return res;
    }
    exports.GetAccurateArchetype = GetAccurateArchetype;
    // Get the archetype containing components.
    function GetArchetypes(components) {
        var res = new Array();
        // Check if the archetype exist.
        archetypes.forEach(function (archetype) {
            // If components is the child set of archetype.componentTypes
            if ((0, SetUtils_1.SetsChild)(components, archetype.componentTypes)) {
                res.push(archetype);
            }
        });
        return res;
    }
    exports.GetArchetypes = GetArchetypes;
    // Remove the archetype from all the exist archetypes.
    function DestroyArchetype(components) {
        return archetypes["delete"](components);
    }
    exports.DestroyArchetype = DestroyArchetype;
});
define("Core/ESCSystem/EntityManager", ["require", "exports", "Core/ESCSystem/ArchetypeManager"], function (require, exports, ArchetypeManager_1) {
    "use strict";
    exports.__esModule = true;
    exports.RemoveComponent = exports.AddComponent = exports.DestroyEntity = exports.CreateEntity = void 0;
    var entities = new Array();
    function CreateEntity(components) {
        // Get the archetype
        var entityArchetype = new Set();
        components.forEach(function (component) {
            entityArchetype.add(component.componentType);
        });
        // Create the archetype if not exist.
        if (!(0, ArchetypeManager_1.HasArchetype)(entityArchetype)) {
            // Fix create archetype error here.
            try {
                (0, ArchetypeManager_1.CreateArchetype)(entityArchetype);
            }
            catch (error) {
                console.log("Create archetype error.");
            }
        }
        // Get the archetype
        var archetype = (0, ArchetypeManager_1.GetAccurateArchetype)(entityArchetype);
        // Append the component to the archetype.
        components.forEach(function (component) {
            archetype.components.get(component.componentType).push(component);
        });
        // Increase the archetype size.
        archetype.archetypeSize += 1;
        // Create entity.
        var entity = {
            archetype: archetype,
            components: components
        };
        // Add the entity to the archetype.
        archetype.entities.push(entity);
        // Add the entity to the entity list.
        entities.push(entity);
    }
    exports.CreateEntity = CreateEntity;
    function DestroyEntity(entity) {
        // Get the archetype of the entity.
        var archetype = entity.archetype;
        // Remove all the components in the archetype.
        entity.components.forEach(function (component) {
            var componentList = archetype.components.get(component.componentType);
            var index = componentList.indexOf(component);
            componentList.splice(index, 1);
        });
        // Decrease the archetype size.
        archetype.archetypeSize -= 1;
        // Check if archetypeSize is 0.
        if (archetype.archetypeSize == 0) {
            // Destroy archetype.
            (0, ArchetypeManager_1.DestroyArchetype)(new Set(entity.components.map(function (component) { return component.componentType; })));
        }
        // Remove the entity from the archetype.
        var index = archetype.entities.indexOf(entity);
        archetype.entities.splice(index, 1);
        // Remove the entity from the entity list.
        index = entities.indexOf(entity);
        entities.splice(index, 1);
    }
    exports.DestroyEntity = DestroyEntity;
    function AddComponent(entity, component) {
        // Return if the component already exist.
        if (entity.components.filter(function (component1) { return component1.componentType === component.componentType; }).length !== 0) {
            return;
        }
        // Add a component to the entity and change the archetype.
        var newComponents = entity.components;
        // Destroy the old entity.
        DestroyEntity(entity);
        // Append the new component to the list.
        newComponents.push(component);
        // Create a new entity with the new components.
        CreateEntity(newComponents);
    }
    exports.AddComponent = AddComponent;
    function RemoveComponent(entity, componentType) {
        // Get the new component list.
        var newComponents = entity.components;
        // Destroy the old entity.
        DestroyEntity(entity);
        newComponents = newComponents.filter(function (component) { return component.componentType !== componentType; });
        // Create a new entity with the new components.
        CreateEntity(newComponents);
    }
    exports.RemoveComponent = RemoveComponent;
});
define("Utils/Math/Vector2", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.Vector2 = void 0;
    var Vector2 = /** @class */ (function () {
        function Vector2(x, y) {
            this.x = x;
            this.y = y;
        }
        Vector2.prototype.Reverse = function () {
            return new Vector2(-this.x, -this.y);
        };
        Vector2.prototype.Length = function () {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        };
        Vector2.prototype.Normalize = function () {
            return Vector2.Mul(this, 1 / this.Length());
        };
        Vector2.prototype.Copy = function () {
            return new Vector2(this.x, this.y);
        };
        // Add two vector 2.
        Vector2.Add = function (v1, v2) {
            return new Vector2(v1.x + v2.x, v1.y + v2.y);
        };
        // Subtract two vector 2.
        Vector2.Sub = function (v1, v2) {
            return this.Add(v1, v2.Reverse());
        };
        // Multiply a vector 2 by a scaler.
        Vector2.Mul = function (v1, scaler) {
            return new Vector2(v1.x * scaler, v1.y * scaler);
        };
        // Lerp between two vector 2.
        Vector2.Lerp = function (v1, v2, lerp) {
            // Min value of lerp = 0, max = 1.
            lerp = Math.min(1, lerp);
            lerp = Math.max(0, lerp);
            var res = this.Add(v1, this.Mul(this.Sub(v2, v1), lerp));
            return res;
        };
        return Vector2;
    }());
    exports.Vector2 = Vector2;
});
define("DataComponents/BulletData/IBulletData", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.BulletDataName = void 0;
    exports.BulletDataName = "BulletData";
});
define("DataComponents/BulletData/BulletData", ["require", "exports", "DataComponents/BulletData/IBulletData"], function (require, exports, IBulletData_1) {
    "use strict";
    exports.__esModule = true;
    exports.BulletData = void 0;
    var BulletData = /** @class */ (function () {
        function BulletData(speed, damage, direction) {
            this.componentType = IBulletData_1.BulletDataName;
            this.bulletSpeed = speed;
            this.bulletDamage = damage;
            this.bulletDirection = direction.Normalize();
        }
        return BulletData;
    }());
    exports.BulletData = BulletData;
});
define("DataComponents/BulletFireData/IBulletFireData", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.BulletFireDataName = void 0;
    exports.BulletFireDataName = "BulletFireData";
});
define("DataComponents/ColliderData/IColliderData", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.ColliderDataName = void 0;
    exports.ColliderDataName = "ColliderData";
});
define("DataComponents/ColliderData/ColliderData", ["require", "exports", "DataComponents/ColliderData/IColliderData"], function (require, exports, IColliderData_1) {
    "use strict";
    exports.__esModule = true;
    exports.ColliderData = void 0;
    var ColliderData = /** @class */ (function () {
        function ColliderData(radius) {
            this.componentType = IColliderData_1.ColliderDataName;
            this.radius = radius;
        }
        return ColliderData;
    }());
    exports.ColliderData = ColliderData;
});
define("DataComponents/LifeCycleData/ILifeCycleData", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.LifeCycleDataName = void 0;
    exports.LifeCycleDataName = "LifeCycleData";
});
define("DataComponents/LifeCycleData/LifeCycleData", ["require", "exports", "DataComponents/LifeCycleData/ILifeCycleData"], function (require, exports, ILifeCycleData_1) {
    "use strict";
    exports.__esModule = true;
    exports.LifeCycleData = void 0;
    var LifeCycleData = /** @class */ (function () {
        function LifeCycleData(lifeTime) {
            this.componentType = ILifeCycleData_1.LifeCycleDataName;
            this.lifeTime = lifeTime;
        }
        return LifeCycleData;
    }());
    exports.LifeCycleData = LifeCycleData;
});
define("DataComponents/RendererData/IRendererData", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.RendererDataName = void 0;
    exports.RendererDataName = "RendererData";
});
define("DataComponents/RendererData/CircleRendererData", ["require", "exports", "DataComponents/RendererData/IRendererData"], function (require, exports, IRendererData_1) {
    "use strict";
    exports.__esModule = true;
    exports.CircleRendererData = void 0;
    var CircleRendererData = /** @class */ (function () {
        function CircleRendererData(radius) {
            this.componentType = IRendererData_1.RendererDataName;
            this.radius = radius;
        }
        CircleRendererData.prototype.OnRender = function (context) {
            context.beginPath();
            context.arc(0, 0, this.radius, 0, 2 * Math.PI);
            context.stroke();
        };
        return CircleRendererData;
    }());
    exports.CircleRendererData = CircleRendererData;
});
define("DataComponents/RendererData/RectRendererData", ["require", "exports", "DataComponents/RendererData/IRendererData"], function (require, exports, IRendererData_2) {
    "use strict";
    exports.__esModule = true;
    exports.RectRendererData = void 0;
    var RectRendererData = /** @class */ (function () {
        function RectRendererData(width, height) {
            this.componentType = IRendererData_2.RendererDataName;
            this.width = width;
            this.height = height;
        }
        RectRendererData.prototype.OnRender = function (context) {
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(this.width, 0);
            context.lineTo(this.width, this.height);
            context.lineTo(0, this.height);
            context.closePath();
            context.stroke();
        };
        return RectRendererData;
    }());
    exports.RectRendererData = RectRendererData;
});
define("DataComponents/TransformData/ITransformData", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.TransformDataName = void 0;
    exports.TransformDataName = "TransformData";
});
define("DataComponents/TransformData/TransformData", ["require", "exports", "DataComponents/TransformData/ITransformData"], function (require, exports, ITransformData_1) {
    "use strict";
    exports.__esModule = true;
    exports.TransformData = void 0;
    var TransformData = /** @class */ (function () {
        function TransformData(position) {
            this.componentType = ITransformData_1.TransformDataName;
            this.position = position;
        }
        return TransformData;
    }());
    exports.TransformData = TransformData;
});
define("DataComponents/RendererData/BulletRendererData", ["require", "exports", "DataComponents/RendererData/IRendererData"], function (require, exports, IRendererData_3) {
    "use strict";
    exports.__esModule = true;
    exports.BulletRendererData = void 0;
    var BulletRendererData = /** @class */ (function () {
        function BulletRendererData(bulletLength, bulletRadius, bulletColor) {
            if (bulletColor === void 0) { bulletColor = "yellow"; }
            this.componentType = IRendererData_3.RendererDataName;
            this.bulletLength = 20;
            this.bulletRadius = 4;
            this.bulletLength = bulletLength;
            this.bulletRadius = bulletRadius;
            this.bulletColor = bulletColor;
        }
        BulletRendererData.prototype.OnRender = function (context) {
            // Begin drawing
            context.beginPath();
            // Upper semi-circle
            context.arc(0, 0, this.bulletRadius, Math.PI, 0);
            // Body
            context.moveTo(this.bulletRadius, 0);
            context.lineTo(this.bulletRadius, this.bulletLength);
            // Lower semi-circle
            context.arc(0, this.bulletLength, this.bulletRadius, 0, Math.PI);
            // Close the path
            context.lineTo(-this.bulletRadius, 0);
            context.closePath();
            // Fill the path with yellow
            context.fillStyle = this.bulletColor;
            context.fill();
        };
        return BulletRendererData;
    }());
    exports.BulletRendererData = BulletRendererData;
});
define("TagComponents/BulletTag", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.BulletTagName = exports.BulletTag = void 0;
    var BulletTag = /** @class */ (function () {
        function BulletTag() {
            this.componentType = exports.BulletTagName;
        }
        return BulletTag;
    }());
    exports.BulletTag = BulletTag;
    exports.BulletTagName = "BulletTag";
});
define("Prefabs/PlayerBulletPrefab", ["require", "exports", "DataComponents/BulletData/BulletData", "DataComponents/ColliderData/ColliderData", "DataComponents/LifeCycleData/LifeCycleData", "DataComponents/RendererData/BulletRendererData", "DataComponents/TransformData/TransformData", "TagComponents/BulletTag", "Utils/Math/Vector2"], function (require, exports, BulletData_1, ColliderData_1, LifeCycleData_1, BulletRendererData_1, TransformData_1, BulletTag_1, Vector2_1) {
    "use strict";
    exports.__esModule = true;
    exports.PlayerBulletPrefab = void 0;
    function PlayerBulletPrefab(position) {
        return [
            new TransformData_1.TransformData(position),
            new BulletRendererData_1.BulletRendererData(10, 3, "yellow"),
            new BulletData_1.BulletData(200, 5, new Vector2_1.Vector2(0, -1)),
            new LifeCycleData_1.LifeCycleData(5),
            new ColliderData_1.ColliderData(10),
            new BulletTag_1.BulletTag(),
        ];
    }
    exports.PlayerBulletPrefab = PlayerBulletPrefab;
});
define("Systems/Player/BulletFireSystem", ["require", "exports", "Core/Context/TimeContext", "Core/ESCSystem/ArchetypeManager", "Core/ESCSystem/EntityManager", "DataComponents/BulletFireData/IBulletFireData", "DataComponents/TransformData/ITransformData", "Prefabs/PlayerBulletPrefab"], function (require, exports, TimeContext_1, ArchetypeManager_2, EntityManager_1, IBulletFireData_1, ITransformData_2, PlayerBulletPrefab_1) {
    "use strict";
    exports.__esModule = true;
    exports.BulletFireSystem = void 0;
    var BulletFireSystem = /** @class */ (function () {
        function BulletFireSystem() {
        }
        BulletFireSystem.prototype.OnAwake = function () {
            // Do Nothing.
        };
        BulletFireSystem.prototype.OnUpdate = function () {
            var archetypes = (0, ArchetypeManager_2.GetArchetypes)(new Set([ITransformData_2.TransformDataName, IBulletFireData_1.BulletFireDataName]));
            archetypes.forEach(function (archetype) {
                // Loop through all index.
                for (var index = 0; index < archetype.archetypeSize; index++) {
                    var transform = archetype.components.get(ITransformData_2.TransformDataName)[index];
                    var bulletFireData = archetype.components.get(IBulletFireData_1.BulletFireDataName)[index];
                    bulletFireData.fireTimer += TimeContext_1.timeContext.deltaTime;
                    if (bulletFireData.fireTimer >= bulletFireData.fireInterval) {
                        // Emit a bullet.
                        (0, EntityManager_1.CreateEntity)((0, PlayerBulletPrefab_1.PlayerBulletPrefab)(transform.position.Copy()));
                        bulletFireData.fireTimer = 0;
                    }
                }
            });
        };
        return BulletFireSystem;
    }());
    exports.BulletFireSystem = BulletFireSystem;
});
define("Systems/Bullet/BulletMoveSystem", ["require", "exports", "Core/Context/TimeContext", "Core/ESCSystem/ArchetypeManager", "DataComponents/BulletData/IBulletData", "DataComponents/TransformData/ITransformData", "Utils/Math/Vector2"], function (require, exports, TimeContext_2, ArchetypeManager_3, IBulletData_2, ITransformData_3, Vector2_2) {
    "use strict";
    exports.__esModule = true;
    exports.BulletMoveSystem = void 0;
    var BulletMoveSystem = /** @class */ (function () {
        function BulletMoveSystem() {
        }
        BulletMoveSystem.prototype.OnAwake = function () {
            // Do Nothing.
        };
        BulletMoveSystem.prototype.OnUpdate = function () {
            var archetypes = (0, ArchetypeManager_3.GetArchetypes)(new Set([ITransformData_3.TransformDataName, IBulletData_2.BulletDataName]));
            archetypes.forEach(function (archetype) {
                // Loop through all index.
                for (var index = 0; index < archetype.archetypeSize; index++) {
                    var transform = archetype.components.get(ITransformData_3.TransformDataName)[index];
                    var bulletData = archetype.components.get(IBulletData_2.BulletDataName)[index];
                    transform.position = Vector2_2.Vector2.Add(transform.position, Vector2_2.Vector2.Mul(bulletData.bulletDirection, bulletData.bulletSpeed * TimeContext_2.timeContext.deltaTime));
                }
            });
        };
        return BulletMoveSystem;
    }());
    exports.BulletMoveSystem = BulletMoveSystem;
});
define("TagComponents/DestroyTag", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.DestroyTagName = exports.DestroyTag = void 0;
    var DestroyTag = /** @class */ (function () {
        function DestroyTag() {
            this.componentType = exports.DestroyTagName;
        }
        return DestroyTag;
    }());
    exports.DestroyTag = DestroyTag;
    exports.DestroyTagName = "DestroyTag";
});
define("Systems/Utils/DestroySystem", ["require", "exports", "Core/ESCSystem/ArchetypeManager", "Core/ESCSystem/EntityManager", "TagComponents/DestroyTag"], function (require, exports, ArchetypeManager_4, EntityManager_2, DestroyTag_1) {
    "use strict";
    exports.__esModule = true;
    exports.DestroySystem = void 0;
    var DestroySystem = /** @class */ (function () {
        function DestroySystem() {
        }
        DestroySystem.prototype.OnAwake = function () {
            // Do nothing.
        };
        DestroySystem.prototype.OnUpdate = function () {
            // Get all archetypes with transform and renderer.
            var archetypes = (0, ArchetypeManager_4.GetArchetypes)(new Set([DestroyTag_1.DestroyTagName]));
            // Destroy all the entities with DestroyTag.
            archetypes.forEach(function (archetype) {
                archetype.entities.forEach(function (entity) {
                    (0, EntityManager_2.DestroyEntity)(entity);
                });
            });
        };
        return DestroySystem;
    }());
    exports.DestroySystem = DestroySystem;
});
define("DataComponents/RendererData/BackgroundRendererData", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.BackGroundRendererDataName = exports.BackGroundRendererData = void 0;
    var BackGroundRendererData = /** @class */ (function () {
        function BackGroundRendererData(backgroundWidth, backgroundHeight, backgroundColor, renderOrder) {
            this.componentType = exports.BackGroundRendererDataName;
            this.backgroundWidth = backgroundWidth;
            this.backgroundHeight = backgroundHeight;
            this.backgroundColor = backgroundColor;
            this.renderOrder = renderOrder;
        }
        BackGroundRendererData.prototype.OnRender = function (context) {
            context.fillStyle = this.backgroundColor;
            context.fillRect(0, 0, this.backgroundWidth, this.backgroundHeight);
        };
        return BackGroundRendererData;
    }());
    exports.BackGroundRendererData = BackGroundRendererData;
    exports.BackGroundRendererDataName = "BackGroundRendererData";
});
define("DataComponents/RendererData/PlanetRendererData", ["require", "exports", "DataComponents/RendererData/BackgroundRendererData"], function (require, exports, BackgroundRendererData_1) {
    "use strict";
    exports.__esModule = true;
    exports.PlanetRenderer = void 0;
    var PlanetRenderer = /** @class */ (function () {
        function PlanetRenderer(planetSize, planetColor, craterNum, renderOrder) {
            this.componentType = BackgroundRendererData_1.BackGroundRendererDataName;
            this.craters = [];
            this.planetSize = planetSize;
            this.planetColor = planetColor;
            this.craterNum = craterNum;
            this.renderOrder = renderOrder;
            for (var index = 0; index < this.craterNum; index++) {
                // Calculate the random position.
                var rad = Math.random() * Math.PI * 2;
                // Get the random distance.
                var distance = Math.random() * this.planetSize;
                // Calculate the position.
                var x = Math.cos(rad) * distance;
                var y = Math.sin(rad) * distance;
                // Get the max crater size.
                var maxCraterSize = Math.min(this.planetSize - distance, this.planetSize / 3);
                // Get the random crater size.
                var craterSize = Math.random() * maxCraterSize;
                // Add the crater to the array.
                this.craters.push({
                    x: x,
                    y: y,
                    radius: craterSize
                });
            }
        }
        PlanetRenderer.prototype.OnRender = function (context) {
            // Draw a planet.
            context.fillStyle = this.planetColor;
            context.beginPath();
            context.arc(0, 0, this.planetSize, 0, 2 * Math.PI);
            context.fill();
            // Add crater to random position.
            this.craters.forEach(function (crater) {
                context.fillStyle = "#363636";
                context.beginPath();
                context.arc(crater.x, crater.y, crater.radius, 0, 2 * Math.PI);
                context.fill();
            });
        };
        return PlanetRenderer;
    }());
    exports.PlanetRenderer = PlanetRenderer;
});
define("DataComponents/BulletFireData/BulletFireData", ["require", "exports", "DataComponents/BulletFireData/IBulletFireData"], function (require, exports, IBulletFireData_2) {
    "use strict";
    exports.__esModule = true;
    exports.BulletFireData = void 0;
    var BulletFireData = /** @class */ (function () {
        function BulletFireData(fireInterval) {
            this.componentType = IBulletFireData_2.BulletFireDataName;
            this.fireInterval = fireInterval;
            this.fireTimer = 0;
        }
        return BulletFireData;
    }());
    exports.BulletFireData = BulletFireData;
});
define("DataComponents/RendererData/PlayerRendererData", ["require", "exports", "DataComponents/RendererData/IRendererData"], function (require, exports, IRendererData_4) {
    "use strict";
    exports.__esModule = true;
    exports.PlayerRendererData = void 0;
    var PlayerRendererData = /** @class */ (function () {
        function PlayerRendererData() {
            this.componentType = IRendererData_4.RendererDataName;
        }
        PlayerRendererData.prototype.OnRender = function (context) {
            context.scale(0.5, 0.5);
            context.beginPath();
            context.moveTo(-10, 0);
            context.lineTo(0, -70);
            context.lineTo(10, 0);
            context.lineTo(70, 7);
            context.lineTo(70, 17);
            context.lineTo(13, 20);
            context.lineTo(10, 30);
            context.lineTo(10, 50);
            context.lineTo(30, 55);
            context.lineTo(30, 64);
            context.lineTo(0, 70);
            context.lineTo(-30, 64);
            context.lineTo(-30, 55);
            context.lineTo(-10, 50);
            context.lineTo(-10, 30);
            context.lineTo(-13, 20);
            context.lineTo(-70, 17);
            context.lineTo(-70, 7);
            context.lineTo(-10, 0);
            context.closePath();
            context.strokeStyle = "black";
            context.stroke();
            context.fillStyle = "blue";
            context.fill();
        };
        return PlayerRendererData;
    }());
    exports.PlayerRendererData = PlayerRendererData;
});
define("DataComponents/SliderControlData/ISliderControlData", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.SliderControlDataName = void 0;
    exports.SliderControlDataName = "SliderControlData";
});
define("DataComponents/SliderControlData/SliderControlData", ["require", "exports", "DataComponents/SliderControlData/ISliderControlData"], function (require, exports, ISliderControlData_1) {
    "use strict";
    exports.__esModule = true;
    exports.SliderControlData = void 0;
    var SliderControlData = /** @class */ (function () {
        function SliderControlData(sliderMinVal, sliderMaxVal, minTransform, maxTransform) {
            this.componentType = ISliderControlData_1.SliderControlDataName;
            this.sliderMinVal = sliderMinVal;
            this.sliderMaxVal = sliderMaxVal;
            this.minTransform = minTransform;
            this.maxTransform = maxTransform;
        }
        return SliderControlData;
    }());
    exports.SliderControlData = SliderControlData;
});
define("Prefabs/PlayerPrefab", ["require", "exports", "DataComponents/BulletFireData/BulletFireData", "DataComponents/RendererData/PlayerRendererData", "DataComponents/SliderControlData/SliderControlData", "DataComponents/TransformData/TransformData", "Utils/Math/Vector2"], function (require, exports, BulletFireData_1, PlayerRendererData_1, SliderControlData_1, TransformData_2, Vector2_3) {
    "use strict";
    exports.__esModule = true;
    exports.PlayerPrefab = void 0;
    function PlayerPrefab() {
        // Get the slider from document.
        var slider = document.getElementById("positionSlider");
        return [
            new TransformData_2.TransformData(new Vector2_3.Vector2(250, 450)),
            new PlayerRendererData_1.PlayerRendererData(),
            new SliderControlData_1.SliderControlData(Number(slider.min), Number(slider.max), new Vector2_3.Vector2(0, 450), new Vector2_3.Vector2(500, 450)),
            new BulletFireData_1.BulletFireData(0.1),
        ];
    }
    exports.PlayerPrefab = PlayerPrefab;
});
define("Systems/Init/SceneInit", ["require", "exports", "Core/ESCSystem/EntityManager", "DataComponents/RendererData/BackgroundRendererData", "DataComponents/TransformData/TransformData", "Prefabs/PlayerPrefab", "Utils/Math/Vector2"], function (require, exports, EntityManager_3, BackgroundRendererData_2, TransformData_3, PlayerPrefab_1, Vector2_4) {
    "use strict";
    exports.__esModule = true;
    exports.SceneInit = void 0;
    var SceneInit = /** @class */ (function () {
        function SceneInit() {
        }
        SceneInit.prototype.OnAwake = function () {
            // Add background.
            (0, EntityManager_3.CreateEntity)([
                new BackgroundRendererData_2.BackGroundRendererData(500, 500, "black", 0),
                new TransformData_3.TransformData(new Vector2_4.Vector2(0, 0)),
            ]);
            // Create a player.
            (0, EntityManager_3.CreateEntity)((0, PlayerPrefab_1.PlayerPrefab)());
        };
        SceneInit.prototype.OnUpdate = function () {
            // Do nothing.
        };
        return SceneInit;
    }());
    exports.SceneInit = SceneInit;
});
define("Systems/Utils/LifeTimeSystem", ["require", "exports", "Core/Context/TimeContext", "Core/ESCSystem/ArchetypeManager", "Core/ESCSystem/EntityManager", "DataComponents/LifeCycleData/ILifeCycleData", "TagComponents/DestroyTag"], function (require, exports, TimeContext_3, ArchetypeManager_5, EntityManager_4, ILifeCycleData_2, DestroyTag_2) {
    "use strict";
    exports.__esModule = true;
    exports.LifeTimeSystem = void 0;
    var LifeTimeSystem = /** @class */ (function () {
        function LifeTimeSystem() {
        }
        LifeTimeSystem.prototype.OnAwake = function () {
            // Do Nothing.
        };
        LifeTimeSystem.prototype.OnUpdate = function () {
            // Get all archetypes with lifetime component.
            var archetypes = (0, ArchetypeManager_5.GetArchetypes)(new Set([ILifeCycleData_2.LifeCycleDataName]));
            archetypes.forEach(function (archetype) {
                for (var index = 0; index < archetype.archetypeSize; index++) {
                    // The life cycle component.
                    var lifeCycle = archetype.components.get(ILifeCycleData_2.LifeCycleDataName)[index];
                    // Decrease the life cycle time.
                    lifeCycle.lifeTime -= TimeContext_3.timeContext.deltaTime;
                    // Add the tag for the entity if the life time is <= 0
                    if (lifeCycle.lifeTime <= 0) {
                        var entity = archetype.entities[index];
                        (0, EntityManager_4.AddComponent)(entity, new DestroyTag_2.DestroyTag());
                    }
                }
            });
        };
        return LifeTimeSystem;
    }());
    exports.LifeTimeSystem = LifeTimeSystem;
});
define("Systems/Render/RenderSystem", ["require", "exports", "Core/ESCSystem/ArchetypeManager", "DataComponents/RendererData/IRendererData", "DataComponents/TransformData/ITransformData"], function (require, exports, ArchetypeManager_6, IRendererData_5, ITransformData_4) {
    "use strict";
    exports.__esModule = true;
    exports.RenderSystem = void 0;
    var RenderSystem = /** @class */ (function () {
        function RenderSystem() {
        }
        RenderSystem.prototype.OnAwake = function () {
            // Get the main canvas.
            this.mainCanvas = document.getElementById("mainCanvas");
            this.canvas2DContext = this.mainCanvas.getContext("2d");
        };
        RenderSystem.prototype.OnUpdate = function () {
            var _this = this;
            // If context not possessed, continue to next frame.
            if (!this.canvas2DContext) {
                return;
            }
            // Get all archetypes with transform and renderer.
            var archetypes = (0, ArchetypeManager_6.GetArchetypes)(new Set([ITransformData_4.TransformDataName, IRendererData_5.RendererDataName]));
            archetypes.forEach(function (archetype) {
                // Loop through all index.
                for (var index = 0; index < archetype.archetypeSize; index++) {
                    var transform = archetype.components.get(ITransformData_4.TransformDataName)[index];
                    var renderer = archetype.components.get(IRendererData_5.RendererDataName)[index];
                    // Context transform.
                    _this.canvas2DContext.save();
                    _this.canvas2DContext.translate(transform.position.x, transform.position.y);
                    // Draw call.
                    renderer.OnRender(_this.canvas2DContext);
                    // Restore context.
                    _this.canvas2DContext.restore();
                }
            });
        };
        return RenderSystem;
    }());
    exports.RenderSystem = RenderSystem;
});
define("Systems/Player/SyncSliderSystem", ["require", "exports", "Core/ESCSystem/ArchetypeManager", "DataComponents/SliderControlData/ISliderControlData", "DataComponents/TransformData/ITransformData", "Utils/Math/Vector2"], function (require, exports, ArchetypeManager_7, ISliderControlData_2, ITransformData_5, Vector2_5) {
    "use strict";
    exports.__esModule = true;
    exports.SyncSliderSystem = void 0;
    var SyncSliderSystem = /** @class */ (function () {
        function SyncSliderSystem() {
        }
        SyncSliderSystem.prototype.OnAwake = function () {
            var _this = this;
            // Get the slider component.
            var slider = document.getElementById("positionSlider");
            // Set the slider value to 0.
            slider.value = "50";
            // Register slider event listener.
            slider.addEventListener("input", function (e) { return _this.OnSliderValChanged(e); });
            this.sliderVal = 0;
        };
        SyncSliderSystem.prototype.OnUpdate = function () {
            var _this = this;
            // Log only when slider value updated.
            if (this.sliderValUpdated) {
                // console.log(`Slider value: ${this.sliderVal}`);
                // Get all archetypes with transform and slider control data.
                var archetypes = (0, ArchetypeManager_7.GetArchetypes)(new Set([ITransformData_5.TransformDataName, ISliderControlData_2.SliderControlDataName]));
                archetypes.forEach(function (archetype) {
                    // Loop through all index.
                    for (var index = 0; index < archetype.archetypeSize; index++) {
                        var transform = archetype.components.get(ITransformData_5.TransformDataName)[index];
                        var sliderCtl = archetype.components.get(ISliderControlData_2.SliderControlDataName)[index];
                        // Calculate the lerp value based on the slider value.
                        var lerpVal = (_this.sliderVal - sliderCtl.sliderMinVal) /
                            (sliderCtl.sliderMaxVal - sliderCtl.sliderMinVal);
                        // Calculate the new transform.
                        var newTrans = Vector2_5.Vector2.Lerp(sliderCtl.minTransform, sliderCtl.maxTransform, lerpVal);
                        console.log(newTrans);
                        // Update the transform.
                        transform.position = newTrans;
                    }
                });
            }
            // Reset slider updated flag.
            this.sliderValUpdated = false;
        };
        // Callback function called when the slider value changed.
        SyncSliderSystem.prototype.OnSliderValChanged = function (event) {
            var target = event.target;
            this.sliderVal = Number(target.value);
            this.sliderValUpdated = true;
        };
        return SyncSliderSystem;
    }());
    exports.SyncSliderSystem = SyncSliderSystem;
});
define("DataComponents/HealthData/IHealthData", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.HealthDataName = void 0;
    exports.HealthDataName = "HealthData";
});
define("GameManager/DamageManager", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.DamageManager = void 0;
    var DamageManager = /** @class */ (function () {
        function DamageManager() {
            this.damage = 0;
            this.damageText = document.getElementById("damageText");
            this.ShowDamage();
        }
        DamageManager.prototype.AddDamage = function (score) {
            this.damage += score;
            this.ShowDamage();
        };
        DamageManager.prototype.ShowDamage = function () {
            this.damageText.innerHTML = "Damage: " + this.damage.toString();
        };
        return DamageManager;
    }());
    exports.DamageManager = DamageManager;
});
define("TagComponents/EnemyTag", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.EnemyTagName = exports.EnemyTag = void 0;
    var EnemyTag = /** @class */ (function () {
        function EnemyTag() {
            this.componentType = exports.EnemyTagName;
        }
        return EnemyTag;
    }());
    exports.EnemyTag = EnemyTag;
    exports.EnemyTagName = "EnemyTag";
});
define("Systems/Physics/BulletEnemyCollideSystem", ["require", "exports", "Core/ESCSystem/ArchetypeManager", "Core/ESCSystem/EntityManager", "DataComponents/BulletData/IBulletData", "DataComponents/ColliderData/IColliderData", "DataComponents/HealthData/IHealthData", "DataComponents/TransformData/ITransformData", "TagComponents/BulletTag", "TagComponents/DestroyTag", "TagComponents/EnemyTag", "Utils/Math/Vector2"], function (require, exports, ArchetypeManager_8, EntityManager_5, IBulletData_3, IColliderData_2, IHealthData_1, ITransformData_6, BulletTag_2, DestroyTag_3, EnemyTag_1, Vector2_6) {
    "use strict";
    exports.__esModule = true;
    exports.BulletEnemyCollideSystem = void 0;
    var BulletEnemyCollideSystem = /** @class */ (function () {
        function BulletEnemyCollideSystem(scoreManager) {
            this.damageManager = scoreManager;
        }
        BulletEnemyCollideSystem.prototype.OnAwake = function () {
            // Do nothing.
        };
        BulletEnemyCollideSystem.prototype.OnUpdate = function () {
            var _this = this;
            var bulletArchetypes = (0, ArchetypeManager_8.GetArchetypes)(new Set([
                BulletTag_2.BulletTagName,
                ITransformData_6.TransformDataName,
                IColliderData_2.ColliderDataName,
                IBulletData_3.BulletDataName,
            ]));
            // Traverse all bullets.
            bulletArchetypes.forEach(function (bulletArchetype) {
                var _loop_1 = function (bulletIndex) {
                    var bulletTransform = bulletArchetype.components.get(ITransformData_6.TransformDataName)[bulletIndex];
                    var bulletCollider = bulletArchetype.components.get(IColliderData_2.ColliderDataName)[bulletIndex];
                    var bulletData = bulletArchetype.components.get(IBulletData_3.BulletDataName)[bulletIndex];
                    var enemyArchetypes = (0, ArchetypeManager_8.GetArchetypes)(new Set([
                        EnemyTag_1.EnemyTagName,
                        ITransformData_6.TransformDataName,
                        IColliderData_2.ColliderDataName,
                        IHealthData_1.HealthDataName,
                    ]));
                    // Traverse all enemies.
                    enemyArchetypes.forEach(function (enemyArchetype) {
                        for (var enemyIndex = 0; enemyIndex < enemyArchetype.archetypeSize; enemyIndex++) {
                            var enemyTransform = enemyArchetype.components.get(ITransformData_6.TransformDataName)[enemyIndex];
                            var enemyCollider = enemyArchetype.components.get(IColliderData_2.ColliderDataName)[enemyIndex];
                            var enemyHealth = enemyArchetype.components.get(IHealthData_1.HealthDataName)[enemyIndex];
                            // Get the distance between bullet and enemy.
                            var dist = Vector2_6.Vector2.Add(bulletTransform.position, enemyTransform.position.Reverse()).Length();
                            // Debug if distance < sum of two collider radius.
                            if (dist < bulletCollider.radius + enemyCollider.radius) {
                                console.log("Collision.");
                                // Add destroy tag to the bullet.
                                (0, EntityManager_5.AddComponent)(bulletArchetype.entities[bulletIndex], new DestroyTag_3.DestroyTag());
                                // Take damage to the enemy health.
                                enemyHealth.currHealth -= bulletData.bulletDamage;
                                console.log(enemyHealth.currHealth);
                                _this.damageManager.AddDamage(bulletData.bulletDamage);
                            }
                        }
                    });
                };
                for (var bulletIndex = 0; bulletIndex < bulletArchetype.archetypeSize; bulletIndex++) {
                    _loop_1(bulletIndex);
                }
            });
        };
        return BulletEnemyCollideSystem;
    }());
    exports.BulletEnemyCollideSystem = BulletEnemyCollideSystem;
});
define("GameManager/EnemyDestroyManager", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.EnemyDestroyManager = void 0;
    var EnemyDestroyManager = /** @class */ (function () {
        function EnemyDestroyManager() {
            this.destroy = 0;
            this.destroyText = document.getElementById("destroyText");
            this.ShowDestroy();
        }
        EnemyDestroyManager.prototype.AddDestroy = function () {
            this.destroy += 1;
            this.ShowDestroy();
        };
        EnemyDestroyManager.prototype.ShowDestroy = function () {
            this.destroyText.innerHTML = "Destroy: " + this.destroy.toString();
        };
        return EnemyDestroyManager;
    }());
    exports.EnemyDestroyManager = EnemyDestroyManager;
});
define("Systems/Health/HealthDestroySystem", ["require", "exports", "Core/ESCSystem/ArchetypeManager", "Core/ESCSystem/EntityManager", "DataComponents/HealthData/IHealthData", "TagComponents/DestroyTag"], function (require, exports, ArchetypeManager_9, EntityManager_6, IHealthData_2, DestroyTag_4) {
    "use strict";
    exports.__esModule = true;
    exports.HealthDestroySystem = void 0;
    var HealthDestroySystem = /** @class */ (function () {
        function HealthDestroySystem(destroyManager) {
            this.destroyManager = destroyManager;
        }
        HealthDestroySystem.prototype.OnAwake = function () {
            // Do nothing.
        };
        HealthDestroySystem.prototype.OnUpdate = function () {
            var _this = this;
            // Get all archetypes with transform and renderer.
            var archetypes = (0, ArchetypeManager_9.GetArchetypes)(new Set([IHealthData_2.HealthDataName]));
            // Destroy all the entities with DestroyTag.
            archetypes.forEach(function (archetype) {
                for (var index = 0; index < archetype.archetypeSize; index++) {
                    // Get health data.
                    var health = archetype.components.get(IHealthData_2.HealthDataName)[index];
                    // If health <= 0, add destroy tag.
                    if (health.currHealth <= 0) {
                        (0, EntityManager_6.AddComponent)(archetype.entities[index], new DestroyTag_4.DestroyTag());
                        _this.destroyManager.AddDestroy();
                    }
                }
            });
        };
        return HealthDestroySystem;
    }());
    exports.HealthDestroySystem = HealthDestroySystem;
});
define("DataComponents/VerticalMoveData/IVerticalMoveData", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.VerticalMoveDataName = void 0;
    exports.VerticalMoveDataName = "VerticalMoveData";
});
define("DataComponents/VerticalMoveData/VerticalMoveData", ["require", "exports", "DataComponents/VerticalMoveData/IVerticalMoveData"], function (require, exports, IVerticalMoveData_1) {
    "use strict";
    exports.__esModule = true;
    exports.VerticalMoveData = void 0;
    var VerticalMoveData = /** @class */ (function () {
        function VerticalMoveData(moveSpeed) {
            this.componentType = IVerticalMoveData_1.VerticalMoveDataName;
            this.moveSpeed = moveSpeed;
        }
        return VerticalMoveData;
    }());
    exports.VerticalMoveData = VerticalMoveData;
});
define("DataComponents/HealthData/HealthData", ["require", "exports", "DataComponents/HealthData/IHealthData"], function (require, exports, IHealthData_3) {
    "use strict";
    exports.__esModule = true;
    exports.HealthData = void 0;
    var HealthData = /** @class */ (function () {
        function HealthData(maxHealth) {
            this.componentType = IHealthData_3.HealthDataName;
            this.maxHealth = maxHealth;
            this.currHealth = maxHealth;
        }
        return HealthData;
    }());
    exports.HealthData = HealthData;
});
define("DataComponents/RendererData/EnemyRendererData", ["require", "exports", "DataComponents/RendererData/IRendererData"], function (require, exports, IRendererData_6) {
    "use strict";
    exports.__esModule = true;
    exports.EnemyRendererData = void 0;
    var EnemyRendererData = /** @class */ (function () {
        function EnemyRendererData(size, winSize) {
            this.componentType = IRendererData_6.RendererDataName;
            this.enemySize = size;
            this.winSize = winSize;
        }
        EnemyRendererData.prototype.OnRender = function (context) {
            // Draw white body.
            context.fillStyle = "white";
            context.beginPath();
            context.arc(0, 0, this.enemySize, 0, 2 * Math.PI);
            context.fill();
            // Draw left wing.
            context.fillStyle = "red";
            context.beginPath();
            context.moveTo(-this.enemySize, 0);
            context.lineTo(-this.enemySize, -this.enemySize);
            context.arc(-this.enemySize - this.winSize / 2, -this.enemySize, this.winSize / 2, Math.PI, 0);
            context.lineTo(-this.enemySize - this.winSize, -this.enemySize);
            context.lineTo(-this.enemySize - this.winSize, this.enemySize);
            context.arc(-this.enemySize - this.winSize / 2, this.enemySize, this.winSize / 2, 0, Math.PI);
            context.lineTo(-this.enemySize, this.enemySize);
            context.lineTo(-this.enemySize, 0);
            context.fill();
            // Draw right wing.
            context.fillStyle = "red";
            context.beginPath();
            context.moveTo(this.enemySize, 0);
            context.lineTo(this.enemySize, -this.enemySize);
            context.arc(this.enemySize + this.winSize / 2, -this.enemySize, this.winSize / 2, Math.PI, 0);
            context.lineTo(this.enemySize + this.winSize, -this.enemySize);
            context.lineTo(this.enemySize + this.winSize, this.enemySize);
            context.arc(this.enemySize + this.winSize / 2, this.enemySize, this.winSize / 2, 0, Math.PI);
            context.lineTo(this.enemySize, this.enemySize);
            context.lineTo(this.enemySize, 0);
            context.fill();
            // Draw eyes.
            context.fillStyle = "gray";
            context.beginPath();
            context.arc(0, 0, this.enemySize, Math.PI / 4, (3 * Math.PI) / 4);
            context.fill();
        };
        return EnemyRendererData;
    }());
    exports.EnemyRendererData = EnemyRendererData;
});
define("Prefabs/EnemyPrefab", ["require", "exports", "DataComponents/ColliderData/ColliderData", "DataComponents/VerticalMoveData/VerticalMoveData", "DataComponents/HealthData/HealthData", "DataComponents/RendererData/EnemyRendererData", "DataComponents/TransformData/TransformData", "TagComponents/EnemyTag"], function (require, exports, ColliderData_2, VerticalMoveData_1, HealthData_1, EnemyRendererData_1, TransformData_4, EnemyTag_2) {
    "use strict";
    exports.__esModule = true;
    exports.EnemyPrefab = void 0;
    function EnemyPrefab(position, moveSpeed) {
        return [
            new TransformData_4.TransformData(position),
            new EnemyRendererData_1.EnemyRendererData(20, 5),
            new ColliderData_2.ColliderData((20 * 2) / Math.sqrt(3)),
            new HealthData_1.HealthData(100),
            new VerticalMoveData_1.VerticalMoveData(moveSpeed),
            new EnemyTag_2.EnemyTag(),
        ];
    }
    exports.EnemyPrefab = EnemyPrefab;
});
define("Systems/Utils/PrefabGenerateSystem", ["require", "exports", "Core/Context/TimeContext", "Core/ESCSystem/EntityManager"], function (require, exports, TimeContext_4, EntityManager_7) {
    "use strict";
    exports.__esModule = true;
    exports.PrefabGenerateSystem = void 0;
    var PrefabGenerateSystem = /** @class */ (function () {
        function PrefabGenerateSystem(prefab, generateInterval) {
            if (generateInterval === void 0) { generateInterval = null; }
            this.generateInterval = 2;
            this.timer = 0;
            this.prefab = prefab;
            if (generateInterval) {
                this.generateInterval = generateInterval;
            }
        }
        PrefabGenerateSystem.prototype.OnAwake = function () { };
        PrefabGenerateSystem.prototype.OnUpdate = function () {
            this.timer += TimeContext_4.timeContext.deltaTime;
            if (this.timer >= this.generateInterval) {
                // Generate prefab.
                (0, EntityManager_7.CreateEntity)(this.prefab());
                this.timer = 0;
            }
        };
        return PrefabGenerateSystem;
    }());
    exports.PrefabGenerateSystem = PrefabGenerateSystem;
});
define("Systems/Utils/VerticalMoveSystem", ["require", "exports", "Core/Context/TimeContext", "Core/ESCSystem/ArchetypeManager", "DataComponents/VerticalMoveData/IVerticalMoveData", "DataComponents/TransformData/ITransformData", "Utils/Math/Vector2"], function (require, exports, TimeContext_5, ArchetypeManager_10, IVerticalMoveData_2, ITransformData_7, Vector2_7) {
    "use strict";
    exports.__esModule = true;
    exports.VerticalMoveSystem = void 0;
    var VerticalMoveSystem = /** @class */ (function () {
        function VerticalMoveSystem() {
        }
        VerticalMoveSystem.prototype.OnAwake = function () {
            // Do nothing.
        };
        VerticalMoveSystem.prototype.OnUpdate = function () {
            // Get all archetypes with transform and renderer.
            var archetypes = (0, ArchetypeManager_10.GetArchetypes)(new Set([ITransformData_7.TransformDataName, IVerticalMoveData_2.VerticalMoveDataName]));
            // Move all enemies.
            archetypes.forEach(function (archetype) {
                for (var index = 0; index < archetype.archetypeSize; index++) {
                    var transform = archetype.components.get(ITransformData_7.TransformDataName)[index];
                    var moveData = archetype.components.get(IVerticalMoveData_2.VerticalMoveDataName)[index];
                    transform.position = Vector2_7.Vector2.Add(transform.position, Vector2_7.Vector2.Mul(new Vector2_7.Vector2(0, 1), moveData.moveSpeed * TimeContext_5.timeContext.deltaTime));
                }
            });
        };
        return VerticalMoveSystem;
    }());
    exports.VerticalMoveSystem = VerticalMoveSystem;
});
define("Systems/Enemy/EnemyGameOverSystem", ["require", "exports", "Core/Context/TimeContext", "Core/ESCSystem/ArchetypeManager", "Core/ESCSystem/EntityManager", "DataComponents/TransformData/ITransformData", "TagComponents/DestroyTag", "TagComponents/EnemyTag"], function (require, exports, TimeContext_6, ArchetypeManager_11, EntityManager_8, ITransformData_8, DestroyTag_5, EnemyTag_3) {
    "use strict";
    exports.__esModule = true;
    exports.EnemyGameOverSystem = void 0;
    var EnemyGameOverSystem = /** @class */ (function () {
        function EnemyGameOverSystem() {
            this.gameOver = false;
            this.showGameOverText = false;
        }
        EnemyGameOverSystem.prototype.OnAwake = function () {
            this.canvasHeight = document.getElementById("mainCanvas").height;
            this.gameOverText = document.getElementById("gameOverText");
            this.gameOverImg = document.getElementById("gameOverImg");
        };
        EnemyGameOverSystem.prototype.OnUpdate = function () {
            var _this = this;
            // Get all archetypes with transform and renderer.
            var archetypes = (0, ArchetypeManager_11.GetArchetypes)(new Set([ITransformData_8.TransformDataName, EnemyTag_3.EnemyTagName]));
            // Check if enemy position cross threshold.
            archetypes.forEach(function (archetype) {
                for (var index = 0; index < archetype.archetypeSize; index++) {
                    var transform = archetype.components.get(ITransformData_8.TransformDataName)[index];
                    if (transform.position.y >= _this.canvasHeight) {
                        console.log("Game Over.");
                        // Destroy the enemy.
                        (0, EntityManager_8.AddComponent)(archetype.entities[index], new DestroyTag_5.DestroyTag());
                        // If this is the first time game over, slow the time scale.
                        _this.gameOverText.innerHTML = "SUS Wars";
                        _this.gameOverImg.src = "https://i.redd.it/dh009khln5r81.png";
                        if (!_this.gameOver) {
                            _this.gameOver = true;
                            // Slow down time scale and show game over.
                            (function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(TimeContext_6.timeContext.timeScale > 0)) return [3 /*break*/, 2];
                                            TimeContext_6.timeContext.timeScale -= 0.025;
                                            return [4 /*yield*/, new Promise(function (f) { return setTimeout(f, 200); })];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 0];
                                        case 2:
                                            TimeContext_6.timeContext.timeScale = 0;
                                            return [2 /*return*/];
                                    }
                                });
                            }); })();
                        }
                    }
                }
            });
        };
        return EnemyGameOverSystem;
    }());
    exports.EnemyGameOverSystem = EnemyGameOverSystem;
});
define("Systems/Render/BackGroundRenderSystem", ["require", "exports", "Core/ESCSystem/ArchetypeManager", "DataComponents/RendererData/BackgroundRendererData", "DataComponents/TransformData/ITransformData"], function (require, exports, ArchetypeManager_12, BackgroundRendererData_3, ITransformData_9) {
    "use strict";
    exports.__esModule = true;
    exports.BackgroundRenderSystem = void 0;
    var BackgroundRenderSystem = /** @class */ (function () {
        function BackgroundRenderSystem() {
        }
        BackgroundRenderSystem.prototype.OnAwake = function () {
            // Get the main canvas.
            this.mainCanvas = document.getElementById("mainCanvas");
            this.canvas2DContext = this.mainCanvas.getContext("2d");
        };
        BackgroundRenderSystem.prototype.OnUpdate = function () {
            var _this = this;
            // If context not possessed, continue to next frame.
            if (!this.canvas2DContext) {
                return;
            }
            // Clear canvas.
            this.canvas2DContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
            // Get all archetypes with transform and renderer.
            var archetypes = (0, ArchetypeManager_12.GetArchetypes)(new Set([ITransformData_9.TransformDataName, BackgroundRendererData_3.BackGroundRendererDataName]));
            // Render buffer.
            var renderBuffer = [];
            archetypes.forEach(function (archetype) {
                // Loop through all index.
                for (var index = 0; index < archetype.archetypeSize; index++) {
                    var transform = archetype.components.get(ITransformData_9.TransformDataName)[index];
                    var renderer = archetype.components.get(BackgroundRendererData_3.BackGroundRendererDataName)[index];
                    // Push to render buffer.
                    renderBuffer.push({
                        transform: transform,
                        renderer: renderer
                    });
                }
            });
            // Sort render buffer by renderOrder.
            renderBuffer.sort(function (a, b) {
                return a.renderer.renderOrder - b.renderer.renderOrder;
            });
            // Render all objects.
            renderBuffer.forEach(function (renderGroup) {
                // Context transform.
                _this.canvas2DContext.save();
                _this.canvas2DContext.translate(renderGroup.transform.position.x, renderGroup.transform.position.y);
                // Draw call.
                renderGroup.renderer.OnRender(_this.canvas2DContext);
                // Restore context.
                _this.canvas2DContext.restore();
            });
        };
        return BackgroundRenderSystem;
    }());
    exports.BackgroundRenderSystem = BackgroundRenderSystem;
});
define("Prefabs/PlanetBackgroundPrefab", ["require", "exports", "DataComponents/LifeCycleData/LifeCycleData", "DataComponents/RendererData/PlanetRendererData", "DataComponents/TransformData/TransformData", "DataComponents/VerticalMoveData/VerticalMoveData", "Utils/Math/Vector2"], function (require, exports, LifeCycleData_2, PlanetRendererData_1, TransformData_5, VerticalMoveData_2, Vector2_8) {
    "use strict";
    exports.__esModule = true;
    exports.PlanetPrefab = void 0;
    function PlanetPrefab() {
        // Random x coordinate.
        var x = Math.random() * 500;
        // Random size.
        var size = Math.random() * 50 + 30;
        // Random color.
        var color = "hsl(" + Math.random() * 360 + ", 50%, 25%)";
        // Random crater number.
        var craterNum = Math.floor(Math.random() * 10 + 5);
        // Calculate the speed based on the size.
        var speed = size;
        return [
            new TransformData_5.TransformData(new Vector2_8.Vector2(x, -size)),
            new VerticalMoveData_2.VerticalMoveData(speed),
            new PlanetRendererData_1.PlanetRenderer(size, color, craterNum, size),
            new LifeCycleData_2.LifeCycleData(30),
        ];
    }
    exports.PlanetPrefab = PlanetPrefab;
});
define("ECSSystems", ["require", "exports", "Systems/Player/BulletFireSystem", "Systems/Bullet/BulletMoveSystem", "Systems/Utils/DestroySystem", "Systems/Init/SceneInit", "Systems/Utils/LifeTimeSystem", "Systems/Render/RenderSystem", "Systems/Player/SyncSliderSystem", "Systems/Physics/BulletEnemyCollideSystem", "GameManager/DamageManager", "Systems/Health/HealthDestroySystem", "GameManager/EnemyDestroyManager", "Systems/Utils/PrefabGenerateSystem", "Systems/Utils/VerticalMoveSystem", "Systems/Enemy/EnemyGameOverSystem", "Systems/Render/BackGroundRenderSystem", "Prefabs/EnemyPrefab", "Utils/Math/Vector2", "Prefabs/PlanetBackgroundPrefab"], function (require, exports, BulletFireSystem_1, BulletMoveSystem_1, DestroySystem_1, SceneInit_1, LifeTimeSystem_1, RenderSystem_1, SyncSliderSystem_1, BulletEnemyCollideSystem_1, DamageManager_1, HealthDestroySystem_1, EnemyDestroyManager_1, PrefabGenerateSystem_1, VerticalMoveSystem_1, EnemyGameOverSystem_1, BackGroundRenderSystem_1, EnemyPrefab_1, Vector2_9, PlanetBackgroundPrefab_1) {
    "use strict";
    exports.__esModule = true;
    exports.activeSystems = void 0;
    var scoreManager = new DamageManager_1.DamageManager();
    var destroyManager = new EnemyDestroyManager_1.EnemyDestroyManager();
    exports.activeSystems = [
        // =====Init=====
        new SceneInit_1.SceneInit(),
        // =====Render=====
        new PrefabGenerateSystem_1.PrefabGenerateSystem(function () { return (0, PlanetBackgroundPrefab_1.PlanetPrefab)(); }, 1),
        new BackGroundRenderSystem_1.BackgroundRenderSystem(),
        new RenderSystem_1.RenderSystem(),
        // =====Physics=====
        new BulletEnemyCollideSystem_1.BulletEnemyCollideSystem(scoreManager),
        // =====Game Play=====
        new PrefabGenerateSystem_1.PrefabGenerateSystem(function () {
            var xMax = 500 - 30;
            var xMin = 30;
            var speedMax = 100;
            var speedMin = 50;
            // Random x coord.
            var xCoord = Math.random() * (xMax - xMin) + xMin;
            // Random move speed.
            var speed = Math.random() * (speedMax - speedMin) + speedMin;
            return (0, EnemyPrefab_1.EnemyPrefab)(new Vector2_9.Vector2(xCoord, -30), speed);
        }, 1.2),
        new SyncSliderSystem_1.SyncSliderSystem(),
        new BulletMoveSystem_1.BulletMoveSystem(),
        new VerticalMoveSystem_1.VerticalMoveSystem(),
        new BulletFireSystem_1.BulletFireSystem(),
        new HealthDestroySystem_1.HealthDestroySystem(destroyManager),
        new EnemyGameOverSystem_1.EnemyGameOverSystem(),
        // =====Others=====
        // new TimeDebugSystem(),
        new LifeTimeSystem_1.LifeTimeSystem(),
        // =====Destroy=====
        new DestroySystem_1.DestroySystem(),
    ];
});
define("Core/ESCSystem/SystemManager", ["require", "exports", "ECSSystems"], function (require, exports, ECSSystems_1) {
    "use strict";
    exports.__esModule = true;
    exports.UpdateSystems = exports.InitSystems = void 0;
    // Call this method to initialize all systems.
    function InitSystems() {
        // Init all the systems.
        ECSSystems_1.activeSystems.forEach(function (system) {
            system.OnAwake();
        });
    }
    exports.InitSystems = InitSystems;
    // Call this method to update all systems.
    function UpdateSystems() {
        // Update all systems.
        ECSSystems_1.activeSystems.forEach(function (system) {
            system.OnUpdate();
        });
    }
    exports.UpdateSystems = UpdateSystems;
});
define("Core/CoreAwake", ["require", "exports", "Core/Context/TimeContext", "Core/ESCSystem/SystemManager"], function (require, exports, TimeContext_7, SystemManager_1) {
    "use strict";
    exports.__esModule = true;
    exports.CoreAwake = void 0;
    function CoreAwake() {
        // console.log("Core Awake.");
        // Setup time context.
        TimeContext_7.timeContext.startTime = Date.now() / 1000;
        TimeContext_7.timeContext.lastUpdateTime = TimeContext_7.timeContext.startTime;
        // Init all systems.
        (0, SystemManager_1.InitSystems)();
    }
    exports.CoreAwake = CoreAwake;
});
define("Core/CoreUpdate", ["require", "exports", "Core/Context/TimeContext", "Core/ESCSystem/SystemManager"], function (require, exports, TimeContext_8, SystemManager_2) {
    "use strict";
    exports.__esModule = true;
    exports.CoreUpdate = void 0;
    function CoreUpdate() {
        // console.log("Core Update.");
        // Update time context.
        var currTime = Date.now() / 1000;
        TimeContext_8.timeContext.timeSinceStartup = currTime - TimeContext_8.timeContext.startTime;
        TimeContext_8.timeContext.deltaTime =
            (currTime - TimeContext_8.timeContext.lastUpdateTime) * TimeContext_8.timeContext.timeScale;
        TimeContext_8.timeContext.lastUpdateTime = currTime;
        // Update all systems.
        (0, SystemManager_2.UpdateSystems)();
    }
    exports.CoreUpdate = CoreUpdate;
});
define("main", ["require", "exports", "Core/CoreAwake", "Core/CoreUpdate"], function (require, exports, CoreAwake_1, CoreUpdate_1) {
    "use strict";
    exports.__esModule = true;
    // Called when window is setup for the first time.
    function RootAwake() {
        // Call core awake.
        (0, CoreAwake_1.CoreAwake)();
        // Start frame update.
        window.requestAnimationFrame(RootUpdate);
    }
    // Called every frame.
    function RootUpdate() {
        // Call core update.
        (0, CoreUpdate_1.CoreUpdate)();
        // Call next frame update;
        window.requestAnimationFrame(RootUpdate);
    }
    RootAwake();
});
define("Systems/Utils/TimeDebugSystem", ["require", "exports", "Core/Context/TimeContext"], function (require, exports, TimeContext_9) {
    "use strict";
    exports.__esModule = true;
    exports.TimeDebugSystem = void 0;
    var TimeDebugSystem = /** @class */ (function () {
        function TimeDebugSystem() {
        }
        TimeDebugSystem.prototype.OnAwake = function () {
            console.log("Time Debug System Awake.");
        };
        TimeDebugSystem.prototype.OnUpdate = function () {
            console.log("Time since startup: ".concat(TimeContext_9.timeContext.timeSinceStartup, "\n") +
                "Delta time: ".concat(TimeContext_9.timeContext.deltaTime));
        };
        return TimeDebugSystem;
    }());
    exports.TimeDebugSystem = TimeDebugSystem;
});
//# sourceMappingURL=out.js.map