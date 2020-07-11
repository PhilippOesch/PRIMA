"use strict";
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    let AUDIO;
    (function (AUDIO) {
        AUDIO["SHOOT"] = "assets/sounds/shooting-sound.ogg";
        AUDIO["IMPACT"] = "assets/sounds/impact-sound.ogg";
    })(AUDIO = RTS_V2.AUDIO || (RTS_V2.AUDIO = {}));
    class Audio extends ƒ.Node {
        static start() {
            Audio.appendAudio();
            RTS_V2.viewport.getGraph().appendChild(Audio.node);
            ƒ.AudioManager.default.listenTo(Audio.node);
        }
        static play(_audio) {
            Audio.getAudio(_audio).play(true);
        }
        static getAudio(_audio) {
            return Audio.components.get(_audio);
        }
        static async appendAudio() {
            Audio.components.set(AUDIO.SHOOT, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.SHOOT), false, false));
            Audio.components.set(AUDIO.IMPACT, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.IMPACT), false, false));
            Audio.components.get(AUDIO.SHOOT).volume = 0.5;
            Audio.components.get(AUDIO.IMPACT).volume = 0.5;
            Audio.components.forEach(value => Audio.node.addComponent(value));
        }
    }
    Audio.components = new Map();
    Audio.node = new Audio("Audio");
    RTS_V2.Audio = Audio;
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Bullet extends ƒ.Node {
        constructor(_pos, _target, _speed = 0.1) {
            super("Bullet");
            this.damage = 0.5;
            this.collisionActive = true;
            this.target = _target;
            this.speed = _speed;
            this.createNodes(_pos);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
            RTS_V2.Audio.play(RTS_V2.AUDIO.SHOOT);
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
                    this.target.calculateDamage(this);
                    this.collisionActive = false;
                    RTS_V2.bullets.removeChild(this);
                    RTS_V2.Audio.play(RTS_V2.AUDIO.IMPACT);
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
    class Flock {
        constructor(_unit) {
            this.neighborRadius = 5;
            this.avoidanceRadius = 1.5;
            this.moveweight = 0.4;
            this.avoidanceWeight = 0.6;
            this.unit = _unit;
            this.squareNeighborRadius = this.neighborRadius ** 2;
            this.squareAvoidanceRadius = this.avoidanceRadius ** 2;
        }
        calculateMove(_move) {
            let move = ƒ.Vector3.ZERO();
            let neighbors = this.getNearbyObjects(this.unit);
            let avoidanceMove = this.avoidance(this.unit, neighbors);
            avoidanceMove.scale(this.avoidanceWeight);
            avoidanceMove = this.partialNormalization(avoidanceMove, this.avoidanceWeight);
            let weightedMove = _move.copy;
            weightedMove.scale(this.moveweight);
            weightedMove = this.partialNormalization(weightedMove, this.moveweight);
            move.add(avoidanceMove);
            move.add(weightedMove);
            return move;
        }
        avoidance(_node, _neighbors) {
            if (_neighbors.length == 0) {
                return ƒ.Vector3.ZERO();
            }
            let avoidanceMove = ƒ.Vector3.ZERO();
            let nAvoide = 0;
            for (let element of _neighbors) {
                let distanceVector = ƒ.Vector3.DIFFERENCE(element.mtxWorld.translation, _node.mtxWorld.translation);
                if (distanceVector.magnitudeSquared < this.squareAvoidanceRadius) {
                    let avoidVector = ƒ.Vector3.DIFFERENCE(_node.mtxWorld.translation, element.mtxWorld.translation);
                    avoidanceMove.add(avoidVector);
                    nAvoide++;
                }
            }
            if (nAvoide > 0)
                avoidanceMove.scale(1 / nAvoide);
            return avoidanceMove;
        }
        partialNormalization(_vector, _weigth) {
            if (_vector.magnitudeSquared > _weigth ** 2) {
                _vector.normalize();
                _vector.scale(_weigth);
            }
            return _vector;
        }
        getNearbyObjects(_node) {
            let nearbyObjects = new Array();
            let objects = RTS_V2.getUnits();
            for (let value of objects) {
                let distanceVector = ƒ.Vector3.DIFFERENCE(value.mtxWorld.translation, _node.mtxWorld.translation);
                let distanceSquared = distanceVector.magnitudeSquared;
                if (value != _node && distanceSquared < this.squareNeighborRadius) {
                    nearbyObjects.push(value);
                }
            }
            return nearbyObjects;
        }
    }
    RTS_V2.Flock = Flock;
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    //import ƒUi = FudgeUserInterface;
    class Healthbar /* implements ƒ.MutableForUserInterface*/ {
        constructor(_unit) {
            //uiController: ƒUi.Controller;
            this.health = 0;
            this.unit = _unit;
            this.health = this.unit.getHealth;
            this.element = document.createElement("progress");
            //this.element = document.createElement("custom-healtbar");
            this.element.value = this.health;
            this.element.setAttribute("value", this.health + "");
            this.element.setAttribute("key", "health");
            this.element.setAttribute("min", "0");
            //this.element.max = 100;
            this.element.setAttribute("max", "1");
            document.body.appendChild(this.element);
            if (this.unit.isPlayer) {
                this.element.classList.add("player");
            }
            else {
                this.element.classList.add("enemy");
            }
            //this.uiController = new ƒUi.Controller(this, this.element);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
        }
        // public getMutator(): ƒ.Mutator {
        //     let mutator: ƒ.Mutator = {};
        //     this.updateMutator(mutator);
        //     return mutator;
        // }
        // public updateMutator(_mutator: ƒ.Mutator): void {
        //     _mutator.health = this.health;
        //     //console.log(this.health);
        // }
        update() {
            let camera = RTS_V2.viewport.camera;
            let projection = camera.project(this.unit.mtxWorld.translation.copy);
            let screenPos = RTS_V2.viewport.pointClipToClient(projection.toVector2());
            this.element.style.left = screenPos.x + "px";
            this.element.style.top = screenPos.y + "px";
            this.element.setAttribute("value", this.unit.getHealth + "");
        }
        delete() {
            ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            document.body.removeChild(this.element);
        }
    }
    RTS_V2.Healthbar = Healthbar;
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let selectedUnits = new Array();
    let startSelectionInfo;
    let terrainX = 30;
    let terrainY = 20;
    let terrainTiling = 5;
    let mousePos;
    //let mousePos= ƒ.Vector2;
    ƒ.RenderManager.initialize(true, false);
    window.addEventListener("load", hndLoad);
    function hndLoad(_event) {
        // ƒUi.CustomElementTemplate.register("custom-healthbar");
        // ƒUi.CustomElement.register("custom-healthbar", FudgeUserInterface.CustomElementTemplate);
        const canvas = document.querySelector("canvas");
        let backgroundImg = document.querySelector("#terrain");
        //prevents the context menu to open
        canvas.addEventListener("contextmenu", event => event.preventDefault());
        RTS_V2.Bullet.loadImages();
        RTS_V2.TankUnit.loadImages();
        let graph = new ƒ.Node("Game");
        let terrain = createTerrainNode(backgroundImg);
        graph.appendChild(terrain);
        RTS_V2.bullets = new ƒ.Node("Bullets");
        RTS_V2.units = new ƒ.Node("Units");
        graph.appendChild(RTS_V2.bullets);
        graph.appendChild(RTS_V2.units);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(ƒ.Vector3.Z(35));
        let cameraLookAt = new ƒ.Vector3(0, 0, 0);
        cmpCamera.pivot.lookAt(cameraLookAt);
        cmpCamera.backgroundColor = ƒ.Color.CSS("white");
        RTS_V2.viewport = new ƒ.Viewport();
        RTS_V2.viewport.initialize("Viewport", graph, cmpCamera, canvas);
        //setup AudioNode
        RTS_V2.Audio.start();
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
        terrainsCmpMesh.pivot.scale(new ƒ.Vector3(terrainX, terrainY, 0));
        let cmpMtr = terrain.getComponent(ƒ.ComponentMaterial);
        cmpMtr.pivot.scale(new ƒ.Vector2(terrainX / terrainTiling, terrainY / terrainTiling));
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
        RTS_V2.units.appendChild(unit0);
        RTS_V2.units.appendChild(unit1);
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
            let targetPosArray = RTS_V2.Utils.createTargetPosArray(position, 1.5, selectedUnits.length);
            let enemySelected = null;
            let enemies = getUnits(false);
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
                let index = 0;
                for (let unit of selectedUnits) {
                    unit.setTarget = null;
                    unit.setMove = targetPosArray[index];
                    index++;
                    console.log(targetPosArray);
                }
            }
        }
        else {
            startSelectionInfo = null;
        }
    }
    function pointerUp(_event) {
        _event.preventDefault();
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let ray = RTS_V2.viewport.getRayFromClient(posMouse);
        if (_event.which == 1) {
            selectedUnits = new Array();
            let endPos = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));
            let allunits = getUnits();
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
    function getUnits(_ofPlayer = true) {
        let array = RTS_V2.units.getChildren().map(value => value);
        if (_ofPlayer) {
            return array.filter((value) => {
                if (value.isPlayer)
                    return true;
                return false;
            });
        }
        else {
            return array.filter((value) => {
                if (!value.isPlayer)
                    return true;
                return false;
            });
        }
    }
    RTS_V2.getUnits = getUnits;
    // function getAllUnits(): Array<Unit> {
    //     let playerUnits: Array<Unit> = getUnits();
    //     let enemyUnits: Array<Unit> = getUnits(false);
    //     return new Array<Unit>().concat(playerUnits, enemyUnits);
    // }
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    class Unit extends ƒ.Node {
        constructor() {
            super(...arguments);
            this.speed = 3 / 1000;
            this.health = 1;
            this.armor = 2;
            this.isDead = false;
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
        get getHealth() {
            return this.health;
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
            if (this.target == undefined || this.target.isDead) {
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
        calculateDamage(_bullet) {
            this.health -= (_bullet.damage / this.armor);
            //(<Healthbar>this.healthBar).health = Math.floor(this.health * 100);
            if (this.health <= 0 && !this.isDead) {
                RTS_V2.units.removeChild(this);
                this.isDead = true;
                this.healthBar.delete();
                this.healthBar = null;
            }
        }
        setPicked(_bool) {
            console.log("isPicked");
        }
        move(_move) {
            let distanceToTravel = this.speed * ƒ.Loop.timeFrameGame;
            let moveVector;
            moveVector = ƒ.Vector3.DIFFERENCE(_move, this.mtxLocal.translation);
            while (true) {
                moveVector = ƒ.Vector3.DIFFERENCE(this.moveTo, this.mtxLocal.translation);
                if (moveVector.magnitudeSquared > distanceToTravel ** 2)
                    break;
                this.moveTo = null;
            }
            moveVector = this.flock.calculateMove(moveVector);
            let pointAt = moveVector.copy;
            pointAt.subtract(this.mtxWorld.translation);
            this.cmpTransform.local.translate(ƒ.Vector3.NORMALIZATION(moveVector, distanceToTravel));
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
            this.isPlayer = _isPlayer;
            this.collisionRange = 1;
            this.shootingRange = 5;
            this.shootingRate = 1000;
            this.speed = 3 / 1000;
            this.flock = new RTS_V2.Flock(this);
            this.createNodes(_pos);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
            this.healthBar = new RTS_V2.Healthbar(this);
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
            if (this.target != null) {
                this.attack();
            }
            else {
                this.clearTimer();
            }
            if (this.moveTo != null && this.moveTo != undefined) {
                this.move(this.moveTo);
                let pointAt = this.moveTo.copy;
                RTS_V2.Utils.adjustLookAtToGameworld(pointAt, this.bodyNode);
            }
        }
        follow() {
            if (this.target != null && this.target != undefined) {
                let targetpos = this.target.mtxWorld.translation.copy;
                RTS_V2.Utils.adjustLookAtToGameworld(targetpos, this.cannonNode);
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
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    let Utils;
    (function (Utils) {
        function adjustLookAtToGameworld(_lookAtPos, _node) {
            let adjustetLookAtToWorld = _lookAtPos.copy;
            adjustetLookAtToWorld.subtract(_node.mtxWorld.translation.copy);
            _node.mtxLocal.lookAt(adjustetLookAtToWorld, ƒ.Vector3.Z());
            _node.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
        }
        Utils.adjustLookAtToGameworld = adjustLookAtToGameworld;
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
        Utils.createTargetPosArray = createTargetPosArray;
    })(Utils = RTS_V2.Utils || (RTS_V2.Utils = {}));
})(RTS_V2 || (RTS_V2 = {}));
//# sourceMappingURL=RealTimeStrategie.js.map