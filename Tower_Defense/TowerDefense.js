"use strict";
var TowerDefense;
(function (TowerDefense) {
    var ƒ = FudgeCore;
    class Enemy extends ƒ.Node {
        //private armor: number;
        constructor(_pos = ƒ.Vector3.ZERO(), _direction = ƒ.Vector3.X(), _speed = 0) {
            super("Enemy");
            this.direction = _direction;
            this.speed = _speed;
            this.startingPosition = _pos;
            this.init();
        }
        init() {
            this.createNodes();
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
        update() {
            let movement = this.direction.copy;
            movement.normalize(this.speed);
            this.cmpTransform.local.translate(movement);
        }
    }
    TowerDefense.Enemy = Enemy;
})(TowerDefense || (TowerDefense = {}));
var TowerDefense;
(function (TowerDefense) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.RenderManager.initialize(true, false);
    window.addEventListener("load", hndLoad);
    TowerDefense.projectiles = new Set();
    let tower;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.Debug.log(canvas);
        TowerDefense.graph = new ƒ.Node("Game");
        createField();
        TowerDefense.enemy = new TowerDefense.Enemy(new ƒ.Vector3(-9.5, 1, 5), ƒ.Vector3.X(), 0.1);
        tower = new TowerDefense.Tower(new ƒ.Vector3(0, 1, 0));
        TowerDefense.graph.appendChild(TowerDefense.enemy);
        TowerDefense.graph.appendChild(tower);
        ƒAid.addStandardLightComponents(TowerDefense.graph, new ƒ.Color(0.5, 0.5, 0.5));
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(5, 20, 30));
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        TowerDefense.viewport = new ƒ.Viewport();
        TowerDefense.viewport.initialize("Viewport", TowerDefense.graph, cmpCamera, canvas);
        ƒ.Debug.log(TowerDefense.viewport);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    }
    function update(_event) {
        TowerDefense.enemy.update();
        tower.update();
        TowerDefense.projectiles.forEach(function (item) {
            item.update();
        });
        TowerDefense.viewport.draw();
    }
    function createField() {
        let mesh = new ƒ.MeshCube();
        let mtrPlayfield = new ƒ.Material("playfield", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0, 0.3, 0)));
        let field = new ƒ.Node("playfield");
        field.addComponent(new ƒ.ComponentMesh(mesh));
        field.addComponent(new ƒ.ComponentMaterial(mtrPlayfield));
        field.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(new ƒ.Vector3(20, 1, 20))));
        TowerDefense.graph.addChild(field);
    }
})(TowerDefense || (TowerDefense = {}));
var TowerDefense;
(function (TowerDefense) {
    var ƒ = FudgeCore;
    class Projectile extends ƒ.Node {
        constructor(_pos, _dir, _speed = 2) {
            super("Projectile");
            this.startingposition = _pos;
            this.direction = _dir;
            this.speed = _speed;
            this.init();
            console.log("Projectile created");
        }
        init() {
            this.createObject();
            TowerDefense.projectiles.add(this);
        }
        createObject() {
            let mesh = new ƒ.MeshSphere();
            let mtrPlayfield = new ƒ.Material("projectileMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let meshCmp = new ƒ.ComponentMesh(mesh);
            meshCmp.pivot.scale(ƒ.Vector3.ONE(0.3));
            this.addComponent(meshCmp);
            this.addComponent(new ƒ.ComponentMaterial(mtrPlayfield));
            let transformationComponent = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.startingposition));
            this.addComponent(transformationComponent);
            TowerDefense.graph.appendChild(this);
        }
        update() {
            let movement = this.direction.copy;
            movement.normalize(this.speed);
            this.cmpTransform.local.translate(movement);
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
            this.fireProjectile = () => {
                let enemyPos = TowerDefense.enemy.cmpTransform.local.copy;
                let startingPos = this.getChildrenByName("Tower Cannon")[0].cmpTransform.local.copy;
                startingPos.translateY(1, false);
                console.log(startingPos.translation);
                let direction = startingPos.getTranslationTo(enemyPos);
                direction.normalize();
                let newProjectile = new TowerDefense.Projectile(startingPos.translation.copy, direction);
                TowerDefense.graph.appendChild(newProjectile);
            };
            this.position = _pos;
            this.init();
        }
        init() {
            this.createNodes();
            this.shootingInterval = setInterval(this.fireProjectile, this.rate);
            console.log(this.shootingInterval);
        }
        createNodes() {
            let meshCube = new ƒ.MeshCube();
            //let meshPyramid: ƒ.MeshPyramid= new ƒ.MeshPyramid();
            let meshSphere = new ƒ.MeshSphere();
            let mtr = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.4, 0.4, 0.4)));
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
            cannonBarrel.addComponent(new ƒ.ComponentMaterial(mtr));
            let cannonBarrelTransformation = new ƒ.ComponentTransform();
            cannonBarrelTransformation.local.translateZ(1);
            cannonBarrel.addComponent(cannonBarrelTransformation);
            cannon.appendChild(cannonBarrel);
            let towerTransformation = new ƒ.ComponentTransform();
            towerTransformation.local.translate(this.position);
            this.addComponent(towerTransformation);
        }
        update() {
            let enemyPos = TowerDefense.enemy.cmpTransform.local.translation.copy;
            let cannon = this.getChildrenByName("Tower Cannon")[0];
            if (cannon != null) {
                cannon.cmpTransform.local.lookAt(enemyPos);
            }
        }
    }
    TowerDefense.Tower = Tower;
})(TowerDefense || (TowerDefense = {}));
//# sourceMappingURL=TowerDefense.js.map