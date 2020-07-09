"use strict";
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Bullet extends ƒ.Node {
        constructor(_pos, _target, _speed = 0.1) {
            super("Bullet");
            this.collisionActive = true;
            this.target = _target;
            this.speed = _speed;
            this.createNodes(_pos);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
        }
        static loadImages() {
            Bullet.bulletImg = document.querySelector("#tankbullet");
        }
        update() {
            let enemyPos = this.target.cmpTransform.local.copy;
            let pos = this.cmpTransform.local.copy;
            let movement = pos.getTranslationTo(enemyPos);
            movement.normalize(this.speed);
            if (this.target == undefined) {
                RTS_V2.bullets.removeChild(this);
            }
            this.cmpTransform.local.translate(movement);
            let pointAt = enemyPos.translation.copy;
            pointAt.subtract(this.mtxWorld.translation);
            this.textureNode.mtxLocal.lookAt(pointAt, ƒ.Vector3.Z());
            this.textureNode.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
            this.collidingWithEnemy();
        }
        createNodes(_pos) {
            let mtr = this.getTextureMaterial("BulletMtr", Bullet.bulletImg);
            let mesh = new ƒ.MeshSprite();
            let cmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos));
            this.textureNode = new ƒAid.Node("Bullet Texture Node", ƒ.Matrix4x4.IDENTITY(), mtr, mesh);
            let cmpMesh = this.textureNode.getComponent(ƒ.ComponentMesh);
            cmpMesh.pivot.scale(new ƒ.Vector3(0.4, 0.3, 0));
            cmpMesh.pivot.rotateZ(90);
            this.addComponent(cmpTransform);
            this.appendChild(this.textureNode);
        }
        collidingWithEnemy() {
            if (this.collisionActive) {
                let thisPos = this.mtxWorld.translation;
                let targetPos = this.target.mtxWorld.translation.copy;
                let distanceVector = ƒ.Vector3.DIFFERENCE(thisPos, targetPos);
                if (distanceVector.magnitudeSquared < this.target.collisionRange) {
                    this.collisionActive = false;
                    RTS_V2.bullets.removeChild(this);
                }
            }
        }
        getTextureMaterial(_name, _img) {
            let txt = new ƒ.TextureImage();
            let coatTxt = new ƒ.CoatTextured();
            txt.image = _img;
            coatTxt.texture = txt;
            return new ƒ.Material(_name, ƒ.ShaderTexture, coatTxt);
        }
    }
    RTS_V2.Bullet = Bullet;
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let selectedUnits = new Array();
    let startSelectionInfo;
    let mousePos;
    //let mousePos= ƒ.Vector2;
    ƒ.RenderManager.initialize(true, false);
    window.addEventListener("load", hndLoad);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        let backgroundImg = document.querySelector("#terrain");
        RTS_V2.Bullet.loadImages();
        RTS_V2.TankUnit.loadImages();
        let graph = new ƒ.Node("Game");
        let terrain = createTerrainNode(backgroundImg);
        graph.appendChild(terrain);
        RTS_V2.bullets = new ƒ.Node("Bullets");
        RTS_V2.units = new ƒ.Node("Units");
        RTS_V2.enemyUnits = new ƒ.Node("EnemyUnits");
        graph.appendChild(RTS_V2.bullets);
        graph.appendChild(RTS_V2.units);
        graph.appendChild(RTS_V2.enemyUnits);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(ƒ.Vector3.Z(30));
        let cameraLookAt = new ƒ.Vector3(0, 0, 0);
        cmpCamera.pivot.lookAt(cameraLookAt);
        cmpCamera.backgroundColor = ƒ.Color.CSS("white");
        RTS_V2.viewport = new ƒ.Viewport();
        RTS_V2.viewport.initialize("Viewport", graph, cmpCamera, canvas);
        createUnits();
        RTS_V2.viewport.addEventListener("\u0192pointerdown" /* DOWN */, pointerDown);
        RTS_V2.viewport.addEventListener("\u0192pointerup" /* UP */, pointerUp);
        RTS_V2.viewport.addEventListener("\u0192pointermove" /* MOVE */, pointerMove);
        RTS_V2.viewport.activatePointerEvent("\u0192pointerdown" /* DOWN */, true);
        RTS_V2.viewport.activatePointerEvent("\u0192pointerup" /* UP */, true);
        RTS_V2.viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
        ƒ.Debug.log(RTS_V2.viewport);
        ƒ.Debug.log(graph);
        RTS_V2.viewport.draw();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }
    function update() {
        RTS_V2.viewport.draw();
        if (startSelectionInfo != null) {
            drawSelectionRectangle(startSelectionInfo.startSelectionClientPos, mousePos);
        }
    }
    function createTerrainNode(_img) {
        let txt = new ƒ.TextureImage();
        let coat = new ƒ.CoatTextured();
        txt.image = _img;
        coat.texture = txt;
        let mesh = new ƒ.MeshSprite();
        let mtr = new ƒ.Material("mtrTerrain", ƒ.ShaderTexture, coat);
        let terrain = new ƒAid.Node("Terrain", ƒ.Matrix4x4.IDENTITY(), mtr, mesh);
        let terrainsCmpMesh = terrain.getComponent(ƒ.ComponentMesh);
        terrainsCmpMesh.pivot.scale(new ƒ.Vector3(20, 20, 0));
        let cmpMesh = terrain.getComponent(ƒ.ComponentMaterial);
        cmpMesh.pivot.scale(new ƒ.Vector2(5, 5));
        return terrain;
    }
    function drawSelectionRectangle(_startClient, _endClient) {
        let ctx = RTS_V2.viewport.getContext();
        let vector = _endClient.copy;
        vector.subtract(_startClient);
        ctx.save();
        ctx.beginPath();
        ctx.rect(_startClient.x, _startClient.y, vector.x, vector.y);
        ctx.strokeStyle = "Black";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    function createUnits() {
        let unit0 = new RTS_V2.TankUnit("Unit", new ƒ.Vector3(0, 2, 0.1), false);
        let unit1 = new RTS_V2.TankUnit("Unit", new ƒ.Vector3(2, 4, 0.1), false);
        let unit2 = new RTS_V2.TankUnit("Unit", new ƒ.Vector3(0, 0, 0.1));
        let unit3 = new RTS_V2.TankUnit("Unit", new ƒ.Vector3(2, 0, 0.1));
        let unit4 = new RTS_V2.TankUnit("Unit", new ƒ.Vector3(2, 2, 0.1));
        RTS_V2.enemyUnits.appendChild(unit0);
        RTS_V2.enemyUnits.appendChild(unit1);
        RTS_V2.units.appendChild(unit2);
        RTS_V2.units.appendChild(unit3);
        RTS_V2.units.appendChild(unit4);
    }
    function pointerDown(_event) {
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let ray = RTS_V2.viewport.getRayFromClient(posMouse);
        let position = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));
        if (_event.which == 1) { //Left Mouse Click
            mousePos = posMouse;
            startSelectionInfo = { startSelectionPos: position, startSelectionClientPos: posMouse };
        }
        else if (_event.which == 3 && selectedUnits.length != 0) {
            let targetPosArray = createTargetPosArray(position, 1.5, 5);
            let index = 0;
            let enemySelected = null;
            let enemies = RTS_V2.enemyUnits.getChildren().map((value) => {
                return value;
            });
            for (let enemy of enemies) {
                if (enemy.isInPickingRange(ray)) {
                    enemySelected = enemy;
                }
            }
            if (enemySelected != null) {
                for (let unit of selectedUnits) {
                    unit.setTarget = enemySelected;
                }
            }
            else {
                for (let unit of selectedUnits) {
                    unit.setTarget = null;
                    unit.setMove = targetPosArray[index];
                    index = (index + 1) % targetPosArray.length;
                }
            }
        }
        else {
            startSelectionInfo = null;
        }
    }
    function pointerUp(_event) {
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let ray = RTS_V2.viewport.getRayFromClient(posMouse);
        if (_event.which == 1) {
            selectedUnits = new Array();
            let endPos = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));
            let allunits = RTS_V2.units.getChildren().map((value) => {
                return value;
            });
            let distanceVector = ƒ.Vector3.DIFFERENCE(startSelectionInfo.startSelectionPos, endPos);
            if (distanceVector.magnitudeSquared < 1) {
                for (let unit of allunits) {
                    if (unit.isInPickingRange(ray)) {
                        unit.setPicked(true);
                        selectedUnits.push(unit);
                    }
                    else {
                        unit.setPicked(false);
                    }
                }
            }
            else {
                for (let unit of allunits) {
                    let unitPos = unit.mtxWorld.translation.copy;
                    let adjustedStartPos = startSelectionInfo.startSelectionPos.copy;
                    adjustedStartPos.subtract(ƒ.Vector3.Z(0.5));
                    let adjustedEndPos = endPos.copy;
                    adjustedEndPos.add((ƒ.Vector3.Z(0.5)));
                    if (unitPos.isInsideCube(adjustedStartPos, adjustedEndPos)) {
                        unit.setPicked(true);
                        selectedUnits.push(unit);
                    }
                    else {
                        unit.setPicked(false);
                    }
                }
            }
            console.log(selectedUnits);
        }
        startSelectionInfo = null;
    }
    function pointerMove(_event) {
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        mousePos = posMouse;
    }
    function createTargetPosArray(_pos, _distance, _positionCount) {
        let targetPosArray = new Array();
        for (let i = 0; i < _positionCount; i++) {
            let angle = i * (360 / _positionCount);
            let dir = new ƒ.Vector3(1, 0, 0);
            dir.transform(ƒ.Matrix4x4.ROTATION_Z(angle));
            dir.normalize(_distance);
            let position = _pos.copy;
            position.add(dir);
            targetPosArray.push(position);
        }
        return targetPosArray;
    }
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    class Unit extends ƒ.Node {
        constructor() {
            super(...arguments);
            this.speed = 3 / 1000;
            this.shoot = (_node, _target) => {
                let startingPos = _node.mtxWorld.copy;
                let bullet = new RTS_V2.Bullet(startingPos.translation.copy, _target);
                RTS_V2.bullets.appendChild(bullet);
            };
        }
        set setMove(_pos) {
            this.moveTo = _pos;
        }
        set setTarget(_target) {
            this.target = _target;
        }
        attack() {
            let targetPos = this.target.mtxWorld.translation.copy;
            this.moveTo = targetPos;
            let thisPos = this.mtxWorld.translation.copy;
            let distanceVector = ƒ.Vector3.DIFFERENCE(targetPos, thisPos);
            if (distanceVector.magnitudeSquared < this.shootingRange ** 2) {
                this.moveTo = null;
                this.follow();
                if (this.shootingTimer == null || !this.shootingTimer.active) {
                    this.shootingTimer = new ƒ.Timer(ƒ.Time.game, this.shootingRate, 0, () => this.shoot(this, this.target));
                }
            }
            else {
                this.clearTimer();
            }
            if (this.target == undefined) {
                this.target = null;
                this.clearTimer();
            }
        }
        isInPickingRange(_ray) {
            let distanceVector = _ray.getDistance(this.mtxWorld.translation.copy);
            if (distanceVector.magnitudeSquared < this.collisionRange ** 2) {
                return true;
            }
            else {
                return false;
            }
        }
        setPicked(_bool) {
            console.log("isPicked");
        }
        move() {
            let distanceToTravel = this.speed * ƒ.Loop.timeFrameGame;
            let move;
            if (this.moveTo != null) {
                while (true) {
                    move = ƒ.Vector3.DIFFERENCE(this.moveTo, this.mtxLocal.translation);
                    if (move.magnitudeSquared > distanceToTravel * distanceToTravel)
                        break;
                    this.moveTo = null;
                }
                let pointAt = this.moveTo.copy;
                pointAt.subtract(this.mtxWorld.translation);
                this.cmpTransform.local.translate(ƒ.Vector3.NORMALIZATION(move, distanceToTravel));
            }
        }
        getTextureMaterial(_img) {
            let txt = new ƒ.TextureImage();
            let coatTxt = new ƒ.CoatTextured();
            txt.image = _img;
            coatTxt.texture = txt;
            return new ƒ.Material(name, ƒ.ShaderTexture, coatTxt);
        }
        clearTimer() {
            if (this.shootingTimer != undefined) {
                this.shootingTimer.clear();
            }
        }
        follow() {
            if (this.target != null && this.target != undefined) {
                let targetpos = this.target.mtxWorld.translation.copy;
                //targetpos.subtract(this.mtxWorld.translation.copy);
                console.log(targetpos);
            }
        }
    }
    RTS_V2.Unit = Unit;
})(RTS_V2 || (RTS_V2 = {}));
/// <reference path="Unit.ts"/>
var RTS_V2;
/// <reference path="Unit.ts"/>
(function (RTS_V2) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class TankUnit extends RTS_V2.Unit {
        constructor(_name, _pos, _isPlayer = true) {
            super(_name);
            this.collisionRange = 1;
            this.shootingRange = 5;
            this.shootingRate = 1000;
            this.speed = 3 / 1000;
            this.isPlayer = _isPlayer;
            this.createNodes(_pos);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
        }
        static loadImages() {
            TankUnit.bodyImg = document.querySelector("#tank");
            TankUnit.cannonImg = document.querySelector("#cannon");
            TankUnit.enemyBodyImg = document.querySelector("#enemytank");
            TankUnit.enemyBarrelImg = document.querySelector("#enemybarrel");
            TankUnit.barrelImg = document.querySelector("#barrel");
            TankUnit.selectedImg = document.querySelector("#selected");
        }
        setPicked(_bool) {
            if (_bool) {
                this.appendChild(this.selected);
            }
            else {
                this.removeChild(this.selected);
            }
        }
        update() {
            this.move();
            if (this.target != null) {
                this.attack();
            }
            else {
                this.clearTimer();
            }
            if (this.moveTo != null && this.moveTo != undefined) {
                let pointAt = this.moveTo.copy;
                pointAt.subtract(this.mtxWorld.translation);
                this.bodyNode.mtxLocal.lookAt(pointAt, ƒ.Vector3.Z());
                this.bodyNode.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
            }
        }
        follow() {
            if (this.target != null && this.target != undefined) {
                let targetpos = this.target.mtxWorld.translation.copy;
                //targetpos.subtract(this.mtxWorld.translation.copy);
                this.cannonNode.cmpTransform.lookAt(targetpos, ƒ.Vector3.Z());
                this.cannonNode.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
            }
        }
        createNodes(_pos) {
            let cannonMtr = this.getTextureMaterial(TankUnit.cannonImg);
            let selectedMtr = this.getTextureMaterial(TankUnit.selectedImg);
            let bodyMtr;
            let barrelMtr;
            if (this.isPlayer) {
                bodyMtr = this.getTextureMaterial(TankUnit.bodyImg);
                barrelMtr = this.getTextureMaterial(TankUnit.barrelImg);
            }
            else {
                bodyMtr = this.getTextureMaterial(TankUnit.enemyBodyImg);
                barrelMtr = this.getTextureMaterial(TankUnit.enemyBarrelImg);
            }
            this.selected = new ƒAid.Node("Unit Selected", ƒ.Matrix4x4.IDENTITY(), selectedMtr, TankUnit.mesh);
            let selectedCmpNode = this.selected.getComponent(ƒ.ComponentMesh);
            selectedCmpNode.pivot.scale(ƒ.Vector3.ONE(1.3));
            let unitCmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos));
            this.addComponent(unitCmpTransform);
            this.bodyNode = new ƒAid.Node("Unit Body", ƒ.Matrix4x4.IDENTITY(), bodyMtr, TankUnit.mesh);
            let bodyCmpMesh = this.bodyNode.getComponent(ƒ.ComponentMesh);
            bodyCmpMesh.pivot.scale(ƒ.Vector3.ONE());
            bodyCmpMesh.pivot.rotateZ(90);
            this.cannonNode = new ƒAid.Node("Unit Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.12)), cannonMtr, TankUnit.mesh);
            let cannonCmpMesh = this.cannonNode.getComponent(ƒ.ComponentMesh);
            cannonCmpMesh.pivot.scale(ƒ.Vector3.ONE(0.7));
            let barrelNode = new ƒAid.Node("Unit Barrel", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-0.5, 0, 0.11)), barrelMtr, TankUnit.mesh);
            let barrelCmpMesh = barrelNode.getComponent(ƒ.ComponentMesh);
            barrelCmpMesh.pivot.scale(new ƒ.Vector3(0.7, 0.3, 0));
            barrelCmpMesh.pivot.rotateZ(90);
            this.appendChild(this.bodyNode);
            this.appendChild(this.cannonNode);
            this.cannonNode.appendChild(barrelNode);
        }
    }
    TankUnit.mesh = new ƒ.MeshSprite();
    RTS_V2.TankUnit = TankUnit;
})(RTS_V2 || (RTS_V2 = {}));
//# sourceMappingURL=RealTimeStrategie.js.map