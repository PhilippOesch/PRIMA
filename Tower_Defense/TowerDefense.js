"use strict";
var TowerDefense;
(function (TowerDefense) {
    // import ƒ = FudgeCore;
    // import ƒAid = FudgeAid;
    class ComponentPicker extends ƒ.Component {
        constructor(_radius = 0.5) {
            super();
            this.radius = 0.5;
            this.radius = _radius;
        }
        drawPickRadius(_viewport) {
            let pickData = this.getPickData();
            let crc2 = _viewport.getContext();
            crc2.save();
            crc2.beginPath();
            crc2.arc(pickData.canvas.x, pickData.canvas.y, pickData.radius.magnitude, 0, 2 * Math.PI);
            crc2.strokeStyle = "#000000";
            crc2.fillStyle = "#ffffff80";
            crc2.stroke();
            crc2.fill();
        }
        pick(_client) {
            let pickData = this.getPickData();
            let distance = ƒ.Vector2.DIFFERENCE(_client, pickData.canvas);
            if (distance.magnitudeSquared < pickData.radius.magnitudeSquared)
                return pickData;
            return null;
        }
        getPickData() {
            let node = this.getContainer();
            let projection = TowerDefense.viewport.camera.project(node.mtxWorld.translation);
            let posClient = TowerDefense.viewport.pointClipToClient(projection.toVector2());
            let projectionRadius = ƒ.Vector3.X(this.radius * node.mtxWorld.scaling.magnitude); // / 1.414);
            projectionRadius.transform(TowerDefense.viewport.camera.pivot, false);
            projectionRadius = TowerDefense.viewport.camera.project(ƒ.Vector3.SUM(node.mtxWorld.translation, projectionRadius));
            let posRadius = TowerDefense.viewport.pointClipToClient(projectionRadius.toVector2());
            return { clip: projection, canvas: posClient, radius: ƒ.Vector2.DIFFERENCE(posRadius, posClient) };
        }
    }
    TowerDefense.ComponentPicker = ComponentPicker;
})(TowerDefense || (TowerDefense = {}));
var TowerDefense;
(function (TowerDefense) {
    var ƒ = FudgeCore;
    class Enemy extends ƒ.Node {
        constructor(_pos = ƒ.Vector3.ZERO(), _direction = ƒ.Vector3.X(), _speed = 0, _path) {
            super("Enemy");
            this.nextWaypoint = 0;
            this.health = 1;
            this.armor = 0.5; //Faktor for Damage Reduktion, closer to 0 means less Damage
            this.isDead = false;
            //this.direction = _direction;
            this.speed = _speed;
            this.startingPosition = _pos;
            this.path = _path;
            this.init();
            console.log(this.path);
        }
        update() {
            // let movement: ƒ.Vector3 = this.direction.copy;
            // movement.normalize(this.speed);
            // this.cmpTransform.local.translate(movement);
            let distanceToTravel = this.speed;
            let move;
            while (true) {
                if (this.nextWaypoint == this.path.length) {
                    break;
                }
                move = ƒ.Vector3.DIFFERENCE(this.path[this.nextWaypoint], this.mtxLocal.translation);
                if (move.magnitudeSquared > distanceToTravel * distanceToTravel)
                    break;
                this.nextWaypoint = ++this.nextWaypoint;
                if (this.nextWaypoint == 0)
                    this.mtxLocal.translation = this.path[0];
            }
            if (!(this.nextWaypoint == this.path.length)) {
                this.cmpTransform.local.translate(ƒ.Vector3.NORMALIZATION(move, distanceToTravel));
            }
            else {
                TowerDefense.enemies.removeChild(this);
            }
        }
        calculateDamage(_projectile) {
            this.health -= (_projectile.strength * this.armor);
            if (this.health <= 0 && !this.isDead) {
                TowerDefense.enemies.removeChild(this);
                // let newPath: Path = new Path(grid[0][0], grid[3][0], grid[3][14]);
                // let enemy: Enemy = new Enemy(newPath[0], ƒ.Vector3.X(), 0.1, newPath);
                // enemies.appendChild(enemy);
                this.isDead = true;
            }
        }
        init() {
            this.createNodes();
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
        }
        createNodes() {
            let meshBody = new ƒ.MeshCube();
            let meshHead = new ƒ.MeshSphere();
            let mtr = new ƒ.Material("enemyMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.5, 0, 0)));
            let body = new ƒ.Node("ememy Body");
            body.addComponent(new ƒ.ComponentMesh(meshBody));
            body.addComponent(new ƒ.ComponentMaterial(mtr));
            let bodyTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(new ƒ.Vector3(1, 1, 1)));
            body.addComponent(bodyTransformation);
            this.appendChild(body);
            let head = new ƒ.Node("ememy Head");
            head.addComponent(new ƒ.ComponentMesh(meshHead));
            head.addComponent(new ƒ.ComponentMaterial(mtr));
            let headTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(new ƒ.Vector3(1, 1, 1)));
            headTransformation.local.translate(ƒ.Vector3.Y(1));
            head.addComponent(headTransformation);
            this.appendChild(head);
            let enemyTransformation = new ƒ.ComponentTransform();
            enemyTransformation.local.translate(this.startingPosition);
            this.addComponent(enemyTransformation);
        }
    }
    TowerDefense.Enemy = Enemy;
})(TowerDefense || (TowerDefense = {}));
var TowerDefense;
(function (TowerDefense) {
    var ƒ = FudgeCore;
    class Projectile extends ƒ.Node {
        constructor(_pos, _enemy, _speed = 1) {
            super("Projectile");
            this.strength = 0.4;
            this.collisionActive = true;
            this.startingposition = _pos;
            this.enemy = _enemy;
            this.speed = _speed;
            this.init();
        }
        update() {
            let enemyPos = this.enemy.cmpTransform.local.copy;
            let startingPos = this.cmpTransform.local.copy;
            let movement = startingPos.getTranslationTo(enemyPos);
            movement.normalize(this.speed);
            if (this.enemy == undefined) {
                TowerDefense.viewport.getGraph().removeChild(this);
            }
            this.cmpTransform.local.translate(movement);
            this.collidingWithEnemy();
        }
        collidingWithEnemy() {
            if (this.collisionActive) {
                let thisPos = this.mtxWorld.translation;
                if (thisPos.isInsideSphere(this.enemy.mtxLocal.translation, 1)) {
                    this.collisionActive = false;
                    this.enemy.calculateDamage(this);
                    TowerDefense.viewport.getGraph().removeChild(this);
                }
            }
        }
        init() {
            this.createObject();
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
        }
        createObject() {
            let mesh = new ƒ.MeshSphere();
            let mtrPlayfield = new ƒ.Material("projectileMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let meshCmp = new ƒ.ComponentMesh(mesh);
            meshCmp.pivot.scale(ƒ.Vector3.ONE(0.5));
            this.addComponent(meshCmp);
            this.addComponent(new ƒ.ComponentMaterial(mtrPlayfield));
            let transformationComponent = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.startingposition));
            this.addComponent(transformationComponent);
            TowerDefense.viewport.getGraph().appendChild(this);
        }
    }
    TowerDefense.Projectile = Projectile;
})(TowerDefense || (TowerDefense = {}));
/// <reference path="Projectile.ts"/>
var TowerDefense;
/// <reference path="Projectile.ts"/>
(function (TowerDefense) {
    var ƒ = FudgeCore;
    class Tower extends ƒ.Node {
        constructor(_pos) {
            super("Tower");
            this.rate = 1000; //in ms
            this.isShooting = false;
            this.range = 12;
            this.fireProjectile = () => {
                let startingPos = this.getChildrenByName("Tower Cannon")[0].mtxWorld.copy;
                let newProjectile = new TowerDefense.Projectile(startingPos.translation.copy, this.targetedEnemy);
                TowerDefense.viewport.getGraph().appendChild(newProjectile);
            };
            this.position = _pos;
            this.init();
        }
        update() {
            this.follow();
        }
        rotate(_rotation) {
            this.cmpTransform.local.rotate(_rotation);
        }
        follow() {
            this.targetedEnemy = this.getClosestEnemy();
            //let enemy: Enemy = <Enemy>enemies.getChildrenByName("Enemy")[0];
            if (this.targetedEnemy != undefined) {
                let distanceSquared = ƒ.Vector3.DIFFERENCE(this.mtxWorld.translation, this.targetedEnemy.mtxWorld.translation).magnitudeSquared;
                // console.log("Squared Distanze is:" + distanceSquared);
                if (distanceSquared < (this.range * this.range)) {
                    let enemyPos = this.targetedEnemy.mtxWorld.translation.copy;
                    let cannon = this.getChildrenByName("Tower Cannon")[0];
                    enemyPos.subtract(cannon.mtxWorld.translation); //Adjust Direction to point at the right pos
                    if (cannon != null) {
                        cannon.mtxLocal.lookAt(enemyPos, ƒ.Vector3.Y());
                    }
                    if (!this.isShooting) {
                        this.shootingInterval = setInterval(this.fireProjectile, this.rate);
                        this.isShooting = true;
                    }
                }
                else {
                    if (this.isShooting) {
                        clearInterval(this.shootingInterval);
                        this.isShooting = false;
                    }
                }
            }
            else if (this.isShooting) {
                this.isShooting = false;
                clearInterval(this.shootingInterval);
            }
        }
        init() {
            this.createNodes();
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
            // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.fireProjectile);
            // ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 1);
        }
        createNodes() {
            let meshCube = new ƒ.MeshCube();
            //let meshPyramid: ƒ.MeshPyramid= new ƒ.MeshPyramid();
            let meshSphere = new ƒ.MeshSphere();
            let mtr = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.5, 0.5, 0.5)));
            let mtrCannon = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let base = new ƒ.Node("Tower Base");
            let baseMeshCmp = new ƒ.ComponentMesh(meshCube);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(4, 0.5, 4));
            base.addComponent(baseMeshCmp);
            base.addComponent(new ƒ.ComponentMaterial(mtr));
            let baseTransformation = new ƒ.ComponentTransform();
            base.addComponent(baseTransformation);
            this.appendChild(base);
            let body = new ƒ.Node("Tower Body");
            let bodyMeshCmp = new ƒ.ComponentMesh(meshCube);
            bodyMeshCmp.pivot.scale(new ƒ.Vector3(2, 4, 2));
            body.addComponent(bodyMeshCmp);
            body.addComponent(new ƒ.ComponentMaterial(mtr));
            let bodyTransformation = new ƒ.ComponentTransform();
            bodyTransformation.local.translate(ƒ.Vector3.Y(0.5));
            body.addComponent(bodyTransformation);
            this.appendChild(body);
            let cannon = new ƒ.Node("Tower Cannon");
            let cannonMeshCmp = new ƒ.ComponentMesh(meshSphere);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            cannon.addComponent(cannonMeshCmp);
            cannon.addComponent(new ƒ.ComponentMaterial(mtr));
            let cannonTransformation = new ƒ.ComponentTransform();
            cannonTransformation.local.translateY(3.3, false);
            cannon.addComponent(cannonTransformation);
            this.appendChild(cannon);
            let cannonBarrel = new ƒ.Node("Canon Barrel");
            let cannonBarrelMeshCmp = new ƒ.ComponentMesh(meshCube);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 2));
            cannonBarrel.addComponent(cannonBarrelMeshCmp);
            cannonBarrel.addComponent(new ƒ.ComponentMaterial(mtrCannon));
            let cannonBarrelTransformation = new ƒ.ComponentTransform();
            cannonBarrelTransformation.local.translateZ(1);
            cannonBarrel.addComponent(cannonBarrelTransformation);
            cannon.appendChild(cannonBarrel);
            let towerTransformation = new ƒ.ComponentTransform();
            towerTransformation.local.translate(this.position);
            this.addComponent(towerTransformation);
        }
        getClosestEnemy() {
            let enemiesArray = TowerDefense.enemies.getChildren().map((value) => {
                return value;
            });
            if (enemiesArray.length != 0) {
                enemiesArray.sort((a, b) => {
                    let aTranslation = this.mtxWorld.getTranslationTo(a.mtxWorld);
                    let aDistance = aTranslation.magnitudeSquared;
                    let bTranslation = this.mtxWorld.getTranslationTo(b.mtxWorld);
                    let bDistance = bTranslation.magnitudeSquared;
                    if (aDistance < bDistance) {
                        return -1;
                    }
                    if (aDistance > bDistance) {
                        return 1;
                    }
                    return 0;
                });
                return enemiesArray[0];
            }
            else {
                return null;
            }
        }
        calculateRelativeMatrix(_matrix, _relativeTo) {
            let result;
            result = ƒ.Matrix4x4.INVERSION(_relativeTo);
            result = ƒ.Matrix4x4.MULTIPLICATION(result, _matrix);
            return result;
        }
    }
    TowerDefense.Tower = Tower;
})(TowerDefense || (TowerDefense = {}));
/// <reference path="Tower.ts"/>
var TowerDefense;
/// <reference path="Tower.ts"/>
(function (TowerDefense) {
    class ITower extends TowerDefense.Tower {
        constructor() {
            super(...arguments);
            this.fireProjectile = () => {
                let startingPos = this.getChildrenByName("Tower Cannon")[0].mtxWorld.copy;
                let startingPos2 = this.getChildrenByName("Tower2 Cannon")[0].mtxWorld.copy;
                let newProjectile = new TowerDefense.Projectile(startingPos.translation.copy, this.targetedEnemy);
                let newProjectile2 = new TowerDefense.Projectile(startingPos2.translation.copy, this.targetedEnemy);
                TowerDefense.viewport.getGraph().appendChild(newProjectile);
                TowerDefense.viewport.getGraph().appendChild(newProjectile2);
            };
        }
        follow() {
            this.targetedEnemy = this.getClosestEnemy();
            //let enemy: Enemy = <Enemy>enemies.getChildrenByName("Enemy")[0];
            if (this.targetedEnemy != undefined) {
                let distanceSquared = ƒ.Vector3.DIFFERENCE(this.mtxWorld.translation, this.targetedEnemy.mtxWorld.translation).magnitudeSquared;
                // console.log("Squared Distanze is:" + distanceSquared);
                if (distanceSquared < (this.range * this.range)) {
                    let enemyPos = this.targetedEnemy.mtxLocal.translation.copy;
                    let cannon = this.getChildrenByName("Tower Cannon")[0];
                    let cannon2 = this.getChildrenByName("Tower2 Cannon")[0];
                    enemyPos.subtract(this.mtxWorld.translation.copy); //Adjust Direction to point at the right pos //Adjust Direction to point at the right pos
                    if (cannon != null) {
                        cannon.mtxLocal.lookAt(enemyPos, ƒ.Vector3.Y());
                        cannon2.mtxLocal.lookAt(enemyPos, ƒ.Vector3.Y());
                    }
                    if (!this.isShooting) {
                        this.shootingInterval = setInterval(this.fireProjectile, this.rate);
                        this.isShooting = true;
                    }
                }
                else {
                    if (this.isShooting) {
                        clearInterval(this.shootingInterval);
                        this.isShooting = false;
                    }
                }
            }
            else if (this.isShooting) {
                this.isShooting = false;
                clearInterval(this.shootingInterval);
            }
        }
        init() {
            this.createNodes();
            this.range = 16;
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
        }
        createNodes() {
            let meshCube = new ƒ.MeshCube();
            //let meshPyramid: ƒ.MeshPyramid= new ƒ.MeshPyramid();
            let meshSphere = new ƒ.MeshSphere();
            let mtr = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.3, 0.3, 0.3)));
            let mtrCannon = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let base = new ƒ.Node("Tower Base");
            let baseMeshCmp = new ƒ.ComponentMesh(meshCube);
            baseMeshCmp.pivot.translate(ƒ.Vector3.X(2));
            baseMeshCmp.pivot.scale(new ƒ.Vector3(16, 0.5, 4));
            base.addComponent(baseMeshCmp);
            base.addComponent(new ƒ.ComponentMaterial(mtr));
            let baseTransformation = new ƒ.ComponentTransform();
            base.addComponent(baseTransformation);
            this.appendChild(base);
            let body = new ƒ.Node("Tower Body");
            let bodyMeshCmp = new ƒ.ComponentMesh(meshCube);
            bodyMeshCmp.pivot.scale(new ƒ.Vector3(2, 4, 2));
            body.addComponent(bodyMeshCmp);
            body.addComponent(new ƒ.ComponentMaterial(mtr));
            let bodyTransformation = new ƒ.ComponentTransform();
            bodyTransformation.local.translate(ƒ.Vector3.Y(0.5));
            bodyTransformation.local.translate(ƒ.Vector3.X(-2));
            body.addComponent(bodyTransformation);
            this.appendChild(body);
            let cannon = new ƒ.Node("Tower Cannon");
            let cannonMeshCmp = new ƒ.ComponentMesh(meshSphere);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            cannon.addComponent(cannonMeshCmp);
            cannon.addComponent(new ƒ.ComponentMaterial(mtr));
            let cannonTransformation = new ƒ.ComponentTransform();
            cannonTransformation.local.translateY(3.3, false);
            cannonTransformation.local.translate(ƒ.Vector3.X(-2));
            cannon.addComponent(cannonTransformation);
            this.appendChild(cannon);
            let cannonBarrel = new ƒ.Node("Canon Barrel");
            let cannonBarrelMeshCmp = new ƒ.ComponentMesh(meshCube);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 2));
            cannonBarrel.addComponent(cannonBarrelMeshCmp);
            cannonBarrel.addComponent(new ƒ.ComponentMaterial(mtrCannon));
            let cannonBarrelTransformation = new ƒ.ComponentTransform();
            cannonBarrelTransformation.local.translateZ(1);
            cannonBarrel.addComponent(cannonBarrelTransformation);
            cannon.appendChild(cannonBarrel);
            let body2 = new ƒ.Node("Tower Body");
            let body2MeshCmp = new ƒ.ComponentMesh(meshCube);
            body2MeshCmp.pivot.scale(new ƒ.Vector3(2, 4, 2));
            body2.addComponent(body2MeshCmp);
            body2.addComponent(new ƒ.ComponentMaterial(mtr));
            let body2Transformation = new ƒ.ComponentTransform();
            body2Transformation.local.translate(ƒ.Vector3.Y(0.5));
            body2Transformation.local.translate(ƒ.Vector3.X(6));
            body2.addComponent(body2Transformation);
            this.appendChild(body2);
            let cannon2 = new ƒ.Node("Tower2 Cannon");
            let cannon2MeshCmp = new ƒ.ComponentMesh(meshSphere);
            cannon2MeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            cannon2.addComponent(cannon2MeshCmp);
            cannon2.addComponent(new ƒ.ComponentMaterial(mtr));
            let cannon2Transformation = new ƒ.ComponentTransform();
            cannon2Transformation.local.translateY(3.3, false);
            cannon2Transformation.local.translateX(6);
            cannon2.addComponent(cannon2Transformation);
            this.appendChild(cannon2);
            let cannon2Barrel = new ƒ.Node("Canon Barrel");
            let cannon2BarrelMeshCmp = new ƒ.ComponentMesh(meshCube);
            cannon2BarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 2));
            cannon2Barrel.addComponent(cannon2BarrelMeshCmp);
            cannon2Barrel.addComponent(new ƒ.ComponentMaterial(mtrCannon));
            let cannon2BarrelTransformation = new ƒ.ComponentTransform();
            cannon2BarrelTransformation.local.translateZ(1);
            cannon2Barrel.addComponent(cannon2BarrelTransformation);
            cannon2.appendChild(cannon2Barrel);
            let towerTransformation = new ƒ.ComponentTransform();
            towerTransformation.local.translate(this.position);
            this.addComponent(towerTransformation);
        }
    }
    TowerDefense.ITower = ITower;
})(TowerDefense || (TowerDefense = {}));
var TowerDefense;
(function (TowerDefense) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.RenderManager.initialize(true, false);
    window.addEventListener("load", hndLoad);
    TowerDefense.gridBlockSize = 4;
    let gridX = 15;
    let gridZ = 10;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.Debug.log(canvas);
        let graph = new ƒ.Node("Game");
        TowerDefense.enemies = new ƒ.Node("enemies");
        graph.appendChild(TowerDefense.enemies);
        initGrid();
        createField(graph);
        spawnEnemy();
        let tower1 = new TowerDefense.ITower(TowerDefense.grid[5][1]);
        tower1.rotate(ƒ.Vector3.Y(90));
        //let tower2: ITower = new Tower(grid[3][0]);
        graph.appendChild(tower1);
        //graph.appendChild(tower2);
        ƒAid.addStandardLightComponents(graph, new ƒ.Color(0.6, 0.6, 0.6));
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(0, TowerDefense.gridBlockSize * gridX * 1.3, 1));
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        cmpCamera.backgroundColor = ƒ.Color.CSS("PaleTurquoise");
        TowerDefense.viewport = new ƒ.Viewport();
        TowerDefense.viewport.initialize("Viewport", graph, cmpCamera, canvas);
        ƒ.Debug.log(TowerDefense.viewport);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    }
    function update(_event) {
        spawnEnemy();
        TowerDefense.viewport.draw();
    }
    function createField(_graph) {
        let mesh = new ƒ.MeshCube();
        let mtrPlayfield = new ƒ.Material("playfield", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0, 0.4, 0)));
        let field = new ƒ.Node("playfield");
        field.addComponent(new ƒ.ComponentMesh(mesh));
        field.addComponent(new ƒ.ComponentMaterial(mtrPlayfield));
        field.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(new ƒ.Vector3(TowerDefense.gridBlockSize * gridX, 1, TowerDefense.gridBlockSize * gridZ))));
        _graph.addChild(field);
    }
    function initGrid() {
        TowerDefense.grid = [];
        let startLeft = (TowerDefense.gridBlockSize / 2) - (gridX * TowerDefense.gridBlockSize / 2);
        let startTop = (gridZ * TowerDefense.gridBlockSize / 2) - (TowerDefense.gridBlockSize / 2);
        for (let z = 0; z < gridZ; z++) {
            TowerDefense.grid[z] = [];
            for (let x = 0; x < gridX; x++) {
                TowerDefense.grid[z][x] = new ƒ.Vector3((startLeft + (TowerDefense.gridBlockSize * x)), 1, (startTop - (TowerDefense.gridBlockSize * z)));
            }
        }
    }
    function spawnEnemy() {
        if (TowerDefense.enemies.getChildren().length == 0) {
            let newPath = new TowerDefense.Path(TowerDefense.grid[0][0], TowerDefense.grid[3][0], TowerDefense.grid[3][14]);
            let enemy = new TowerDefense.Enemy(newPath[0], ƒ.Vector3.X(), 0.2, newPath);
            TowerDefense.enemies.appendChild(enemy);
        }
    }
})(TowerDefense || (TowerDefense = {}));
var TowerDefense;
(function (TowerDefense) {
    class Path extends Array {
        // public waypoints: ƒ.Vector3[] = [];
        render(_viewport) {
            let crc2 = _viewport.getContext();
            let first = true;
            for (let waypoint of this) {
                let projection = TowerDefense.viewport.camera.project(waypoint);
                let posClient = TowerDefense.viewport.pointClipToClient(projection.toVector2());
                if (first)
                    crc2.moveTo(posClient.x, posClient.y);
                else
                    crc2.lineTo(posClient.x, posClient.y);
                first = false;
            }
            crc2.stroke();
        }
    }
    TowerDefense.Path = Path;
})(TowerDefense || (TowerDefense = {}));
//# sourceMappingURL=TowerDefense.js.map