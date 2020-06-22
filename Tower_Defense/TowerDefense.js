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
    var ƒAid = FudgeAid;
    class Enemy extends ƒ.Node {
        constructor(_pos = ƒ.Vector3.ZERO(), _direction = ƒ.Vector3.X(), _speed = 0, _path) {
            super("Enemy");
            this.nextWaypoint = 0;
            this.health = 1;
            this.armor = 0.2; //Faktor for Damage Reduktion, closer to 0 means less Damage
            this.isDead = false;
            this.speed = _speed;
            this.startingPosition = _pos;
            this.path = _path;
            this.init();
            console.log(this.path);
        }
        update() {
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
            let body = new ƒAid.Node("ememy Body", ƒ.Matrix4x4.IDENTITY(), mtr, meshBody);
            this.appendChild(body);
            let head = new ƒAid.Node("ememy Head", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(1)), mtr, meshHead);
            this.appendChild(head);
            let enemyTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.startingPosition));
            this.addComponent(enemyTransformation);
        }
    }
    TowerDefense.Enemy = Enemy;
})(TowerDefense || (TowerDefense = {}));
var TowerDefense;
(function (TowerDefense) {
    var ƒ = FudgeCore;
    class Projectile extends ƒ.Node {
        constructor(_pos, _enemy, _strength = 0.4, _size = 0.5, _speed = 1) {
            super("Projectile");
            this.strength = 0.4;
            this.collisionActive = true;
            this.startingposition = _pos;
            this.enemy = _enemy;
            this.speed = _speed;
            this.size = _size;
            this.strength = _strength;
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
            meshCmp.pivot.scale(ƒ.Vector3.ONE(this.size));
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
    var ƒAid = FudgeAid;
    class Tower extends ƒ.Node {
        constructor(_pos, _color = new ƒ.Color(0.5, 0.5, 0.5)) {
            super("Tower");
            this.rate = 1000; //in ms
            this.isShooting = false;
            this.range = 14;
            this.fireProjectile = (_node, _enemy) => {
                let startingPos = _node.mtxWorld.copy;
                let newProjectile = new TowerDefense.Projectile(startingPos.translation.copy, _enemy);
                TowerDefense.viewport.getGraph().appendChild(newProjectile);
            };
            this.position = _pos;
            this.color = _color;
            this.mtr = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(this.color));
            this.init();
        }
        update() {
            this.follow();
        }
        setMaterialColor(_color) {
            let cmpMaterial = this.getChildrenByName("Tower Base")[0].getComponent(ƒ.ComponentMaterial);
            cmpMaterial.clrPrimary = _color;
        }
        resetMaterialColor() {
            let cmpMaterial = this.getChildrenByName("Tower Base")[0].getComponent(ƒ.ComponentMaterial);
            cmpMaterial.clrPrimary = this.color;
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
                        this.shootingInterval = setInterval(() => this.fireProjectile(cannon, this.targetedEnemy), this.rate);
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
            this.mtr = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(this.color));
            this.createNodes();
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
            this.addComponent(new TowerDefense.ComponentPicker(1));
        }
        createNodes() {
            let meshCube = new ƒ.MeshCube();
            let meshSphere = new ƒ.MeshSphere();
            let mtrCannon = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let base = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.IDENTITY(), this.mtr, meshCube);
            let baseMeshCmp = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(4, 0.5, 4));
            this.appendChild(base);
            let body = new ƒAid.Node("Tower Body", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(0.5)), this.mtr, meshCube);
            let bodyMeshCmp = body.getComponent(ƒ.ComponentMesh);
            bodyMeshCmp.pivot.scale(new ƒ.Vector3(2, 4, 2));
            this.appendChild(body);
            let cannon = new ƒAid.Node("Tower Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(3.3)), this.mtr, meshSphere);
            let cannonMeshCmp = cannon.getComponent(ƒ.ComponentMesh);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            this.appendChild(cannon);
            let cannonBarrel = new ƒAid.Node("Canon Barrel", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(1)), mtrCannon, meshCube);
            let cannonBarrelMeshCmp = cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 2));
            cannon.appendChild(cannonBarrel);
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
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
    }
    TowerDefense.Tower = Tower;
})(TowerDefense || (TowerDefense = {}));
/// <reference path="Tower.ts"/>
var TowerDefense;
/// <reference path="Tower.ts"/>
(function (TowerDefense) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class ITower extends TowerDefense.Tower {
        constructor() {
            super(...arguments);
            this.isShooting2 = false;
        }
        init() {
            this.range = 12;
            this.cannon1RelPos = ƒ.Vector3.X(-4);
            this.cannon2RelPos = ƒ.Vector3.X(4);
            this.xScale = 12;
            this.zScale = 4;
            this.createNodes();
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
            // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.fireProjectile);
            // ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 1);
            this.addComponent(new TowerDefense.ComponentPicker(1));
        }
        follow() {
            let targetedEnemy1 = this.getClosestEnemyOfNode(this.getChildrenByName("Tower Cannon")[0]);
            let targetedEnemy2 = this.getClosestEnemyOfNode(this.getChildrenByName("Tower2 Cannon")[0]);
            let cannon1 = this.getChildrenByName("Tower Cannon")[0];
            let cannon2 = this.getChildrenByName("Tower2 Cannon")[0];
            //let enemy: Enemy = <Enemy>enemies.getChildrenByName("Enemy")[0];
            //this.targetAnEnemy(targetedEnemy2, cannon2, this.isShooting2, this.shootingInterval2);
            if (targetedEnemy1 != undefined) {
                let distanceSquared = ƒ.Vector3.DIFFERENCE(cannon1.mtxWorld.translation, targetedEnemy1.mtxWorld.translation).magnitudeSquared;
                // console.log("Squared Distanze is:" + distanceSquared);
                if (distanceSquared < (this.range * this.range)) {
                    let enemyPos = targetedEnemy1.mtxWorld.translation.copy;
                    enemyPos.add(this.cannon1RelPos);
                    enemyPos.subtract(cannon1.mtxWorld.translation); //Adjust Direction to point at the right pos
                    if (cannon1 != null) {
                        cannon1.mtxLocal.lookAt(enemyPos, ƒ.Vector3.Y());
                    }
                    if (!this.isShooting) {
                        this.shootingInterval = setInterval(() => this.fireProjectile(cannon1, targetedEnemy1), this.rate);
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
            if (targetedEnemy2 != undefined) {
                let distanceSquare2 = ƒ.Vector3.DIFFERENCE(cannon2.mtxWorld.translation, targetedEnemy2.mtxWorld.translation).magnitudeSquared;
                // console.log("Squared Distanze is:" + distanceSquared);
                if (distanceSquare2 < (this.range * this.range)) {
                    let enemyPos = targetedEnemy2.mtxWorld.translation.copy;
                    enemyPos.add(this.cannon2RelPos);
                    enemyPos.subtract(cannon2.mtxWorld.translation); //Adjust Direction to point at the right pos
                    if (cannon2 != null) {
                        cannon2.mtxLocal.lookAt(enemyPos, ƒ.Vector3.Y());
                    }
                    if (!this.isShooting2) {
                        this.shootingInterval2 = setInterval(() => this.fireProjectile(cannon2, targetedEnemy2), this.rate);
                        this.isShooting2 = true;
                    }
                }
                else {
                    if (this.isShooting2) {
                        clearInterval(this.shootingInterval2);
                        this.isShooting2 = false;
                    }
                }
            }
            else if (this.isShooting2) {
                this.isShooting2 = false;
                clearInterval(this.shootingInterval2);
            }
        }
        createNodes() {
            let meshCube = new ƒ.MeshCube();
            //let meshPyramid: ƒ.MeshPyramid= new ƒ.MeshPyramid();
            let meshSphere = new ƒ.MeshSphere();
            let mtrCannon = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let base = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.IDENTITY(), this.mtr, meshCube);
            let baseMeshCmp = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(this.xScale, 0.5, this.zScale));
            this.appendChild(base);
            let body = new ƒAid.Node("Tower Body", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(0.5)), this.mtr, meshCube);
            let bodyMeshCmp = body.getComponent(ƒ.ComponentMesh);
            bodyMeshCmp.pivot.scale(new ƒ.Vector3(2, 4, 2));
            let bodyTransformation = body.getComponent(ƒ.ComponentTransform);
            bodyTransformation.local.translate(this.cannon1RelPos);
            this.appendChild(body);
            let body2 = new ƒAid.Node("Tower Body", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(0.5)), this.mtr, meshCube);
            let body2MeshCmp = body2.getComponent(ƒ.ComponentMesh);
            body2MeshCmp.pivot.scale(new ƒ.Vector3(2, 4, 2));
            let body2Transformation = body2.getComponent(ƒ.ComponentTransform);
            body2Transformation.local.translate(this.cannon2RelPos);
            this.appendChild(body2);
            let cannon = new ƒAid.Node("Tower Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(3.3)), this.mtr, meshSphere);
            let cannonMeshCmp = cannon.getComponent(ƒ.ComponentMesh);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            let cannonTransformation = cannon.getComponent(ƒ.ComponentTransform);
            cannonTransformation.local.translate(this.cannon1RelPos);
            this.appendChild(cannon);
            let cannon2 = new ƒAid.Node("Tower2 Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(3.3)), this.mtr, meshSphere);
            let cannon2MeshCmp = cannon2.getComponent(ƒ.ComponentMesh);
            cannon2MeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            let cannon2Transformation = cannon2.getComponent(ƒ.ComponentTransform);
            cannon2Transformation.local.translate(this.cannon2RelPos);
            this.appendChild(cannon2);
            let cannonBarrel = new ƒAid.Node("Canon Barrel", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(1)), mtrCannon, meshCube);
            let cannonBarrelMeshCmp = cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 2));
            cannon.appendChild(cannonBarrel);
            let cannon2Barrel = new ƒAid.Node("Canon2 Barrel", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(1)), mtrCannon, meshCube);
            let cannon2BarrelMeshCmp = cannon2Barrel.getComponent(ƒ.ComponentMesh);
            cannon2BarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 2));
            cannon2.appendChild(cannon2Barrel);
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            this.addComponent(towerTransformation);
        }
        getClosestEnemyOfNode(_node) {
            let enemiesArray = TowerDefense.enemies.getChildren().map((value) => {
                return value;
            });
            if (enemiesArray.length != 0) {
                enemiesArray.sort((a, b) => {
                    let aTranslation = _node.mtxWorld.getTranslationTo(a.mtxWorld);
                    let aDistance = aTranslation.magnitudeSquared;
                    let bTranslation = _node.mtxWorld.getTranslationTo(b.mtxWorld);
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
    }
    TowerDefense.ITower = ITower;
})(TowerDefense || (TowerDefense = {}));
/// <reference path="Tower.ts"/>
var TowerDefense;
/// <reference path="Tower.ts"/>
(function (TowerDefense) {
    class ITowerVariant extends TowerDefense.ITower {
        init() {
            this.range = 12;
            this.cannon1RelPos = ƒ.Vector3.Z(-4);
            this.cannon2RelPos = ƒ.Vector3.Z(4);
            this.xScale = 4;
            this.zScale = 12;
            this.createNodes();
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
            // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.fireProjectile);
            // ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 1);
            this.addComponent(new TowerDefense.ComponentPicker(1));
        }
    }
    TowerDefense.ITowerVariant = ITowerVariant;
})(TowerDefense || (TowerDefense = {}));
var TowerDefense;
(function (TowerDefense) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.RenderManager.initialize(true, false);
    window.addEventListener("load", hndLoad);
    TowerDefense.gridBlockSize = 4;
    TowerDefense.towers = new ƒ.Node("towers");
    let gridX = 15;
    let gridZ = 10;
    let cameraDistanze = TowerDefense.gridBlockSize * gridX * 1.3;
    let objectIsPicked = false;
    let selectedTower;
    let TowerBlockColor = new ƒ.Color(0.3, 0.3, 0.3);
    let ITowerColor = new ƒ.Color(0.4, 0.4, 0.4);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.Debug.log(canvas);
        console.log(objectIsPicked);
        console.log(selectedTower);
        let graph = new ƒ.Node("Game");
        TowerDefense.enemies = new ƒ.Node("enemies");
        graph.appendChild(TowerDefense.enemies);
        graph.appendChild(TowerDefense.towers);
        initGrid();
        createField(graph);
        spawnEnemy();
        createTower();
        ƒAid.addStandardLightComponents(graph, new ƒ.Color(0.6, 0.6, 0.6));
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(0, cameraDistanze, 0.000001));
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        cmpCamera.backgroundColor = ƒ.Color.CSS("PaleTurquoise");
        TowerDefense.viewport = new ƒ.Viewport();
        TowerDefense.viewport.initialize("Viewport", graph, cmpCamera, canvas);
        ƒ.Debug.log(TowerDefense.viewport);
        TowerDefense.viewport.addEventListener("\u0192pointermove" /* MOVE */, pointerMove);
        TowerDefense.viewport.addEventListener("\u0192pointerdown" /* DOWN */, pointerDown);
        TowerDefense.viewport.addEventListener("\u0192pointerup" /* UP */, pointerUp);
        TowerDefense.viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
        TowerDefense.viewport.activatePointerEvent("\u0192pointerdown" /* DOWN */, true);
        TowerDefense.viewport.activatePointerEvent("\u0192pointerup" /* UP */, true);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    }
    function update(_event) {
        spawnEnemy();
        TowerDefense.viewport.draw();
    }
    function createField(_graph) {
        // let img: HTMLImageElement= document.querySelector("img");
        // let txtImage: ƒ.TextureImage= new ƒ.TextureImage();
        // txtImage.image= img;
        // let coatTextured: ƒ.CoatTextured = new ƒ.CoatTextured();
        // coatTextured.texture = txtImage;
        // coatTextured.repetition= true;
        // coatTextured.tilingX= 0.1;
        // let material: ƒ.Material = new ƒ.Material("Textured", ƒ.ShaderTexture, coatTextured);
        let mesh = new ƒ.MeshCube();
        let mtrPlayfield = new ƒ.Material("playfield", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0, 0.5, 0)));
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
    function pointerMove(_event) {
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        if (objectIsPicked) {
            let rayEnd = convertClientToView(posMouse);
            //let projection: ƒ.Vector3 = camera.project(rayEnd);
            console.log(rayEnd);
            let cmpTransform = selectedTower.getComponent(ƒ.ComponentTransform);
            cmpTransform.local.translation = rayEnd;
            let cmpMaterial = selectedTower.getComponent(ƒ.ComponentMaterial);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("red");
        }
    }
    function pointerDown(_event) {
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let towerset = TowerDefense.viewport.getGraph().getChild(1).getChildren();
        let picked = [];
        for (let tower of towerset) {
            let cmpPicker = tower.getComponent(TowerDefense.ComponentPicker);
            let pickData = cmpPicker.pick(posMouse);
            let castedTower = tower;
            castedTower.resetMaterialColor();
            if (pickData) {
                objectIsPicked = true;
                selectedTower = castedTower;
                castedTower.setMaterialColor(ƒ.Color.CSS("red"));
                console.log("picked");
                picked.push({ z: pickData.clip.z, picker: cmpPicker, name: tower.name });
            }
        }
        picked.sort((_a, _b) => _a.z > _b.z ? 1 : -1);
        //pickedObjekt= picked;
        //console.clear();
        console.table(picked);
        TowerDefense.viewport.draw();
    }
    function pointerUp(_event) {
        for (let tower of TowerDefense.towers.getChildren()) {
            let castedTower = tower;
            castedTower.resetMaterialColor();
        }
        objectIsPicked = false;
    }
    function createTower() {
        let tower1 = new TowerDefense.Tower(TowerDefense.grid[5][1]);
        let tower2 = new TowerDefense.TowerBlock(TowerDefense.grid[6][2], TowerBlockColor);
        let tower3 = new TowerDefense.ITower(TowerDefense.grid[5][5], ITowerColor);
        let tower4 = new TowerDefense.ITowerVariant(TowerDefense.grid[1][5], ITowerColor);
        TowerDefense.towers.appendChild(tower1);
        TowerDefense.towers.appendChild(tower2);
        TowerDefense.towers.appendChild(tower3);
        TowerDefense.towers.appendChild(tower4);
    }
    function convertClientToView(_mousepos) {
        let posProjection = TowerDefense.viewport.pointClientToProjection(_mousepos);
        let ray = new ƒ.Ray(new ƒ.Vector3(-posProjection.x, posProjection.y, 1));
        let camera = TowerDefense.viewport.camera;
        ray.direction.scale(cameraDistanze - 1);
        ray.origin.transform(camera.pivot);
        ray.origin.transform(TowerDefense.viewport.getGraph().mtxWorld);
        ray.direction.transform(camera.pivot, false);
        ray.direction.transform(TowerDefense.viewport.getGraph().mtxWorld, false);
        let rayEnd = ƒ.Vector3.SUM(ray.origin, ray.direction);
        return rayEnd;
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
var TowerDefense;
(function (TowerDefense) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class TowerBlock extends TowerDefense.Tower {
        constructor() {
            super(...arguments);
            this.fireProjectile = () => {
                let startingPos = this.getChildrenByName("Tower Cannon")[0].mtxWorld.copy;
                let newProjectile = new TowerDefense.Projectile(startingPos.translation.copy, this.targetedEnemy, 0.8, 1);
                TowerDefense.viewport.getGraph().appendChild(newProjectile);
            };
        }
        init() {
            this.createNodes();
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
            this.addComponent(new TowerDefense.ComponentPicker(2));
        }
        createNodes() {
            let meshCube = new ƒ.MeshCube();
            let meshSphere = new ƒ.MeshSphere();
            let mtrCannon = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let base = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.IDENTITY(), this.mtr, meshCube);
            let baseMeshCmp = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(8, 0.5, 8));
            this.appendChild(base);
            let body = new ƒAid.Node("Tower Body", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(0.5)), this.mtr, meshCube);
            let bodyMeshCmp = body.getComponent(ƒ.ComponentMesh);
            bodyMeshCmp.pivot.scale(new ƒ.Vector3(4, 4, 4));
            this.appendChild(body);
            let cannon = new ƒAid.Node("Tower Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(4.3)), this.mtr, meshSphere);
            let cannonMeshCmp = cannon.getComponent(ƒ.ComponentMesh);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(4));
            this.appendChild(cannon);
            let cannonBarrel = new ƒAid.Node("Canon Barrel", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(1)), mtrCannon, meshCube);
            let cannonBarrelMeshCmp = cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(1, 1, 4));
            cannon.appendChild(cannonBarrel);
            let towerTransformation = new ƒ.ComponentTransform();
            let pos = this.position.copy;
            pos.add(new ƒ.Vector3(2, 0, 2));
            towerTransformation.local.translate(pos);
            this.addComponent(towerTransformation);
        }
    }
    TowerDefense.TowerBlock = TowerBlock;
})(TowerDefense || (TowerDefense = {}));
//# sourceMappingURL=TowerDefense.js.map