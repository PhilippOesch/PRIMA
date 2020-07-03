"use strict";
var Real_Time_Strategie;
(function (Real_Time_Strategie) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Unit extends ƒ.Node {
        //private speed: number;
        constructor(_name, _pos) {
            super(_name);
            this.pickingRange = 1;
            this.speed = 2 / 1000;
            this.createNodes(_pos);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
        }
        set move(_pos) {
            this.moveTo = _pos;
        }
        setPicked(_bool) {
            let cmpMaterial = this.base.getComponent(ƒ.ComponentMaterial);
            if (_bool) {
                cmpMaterial.clrPrimary = Unit.pickedColor;
            }
            else {
                let newCmpMaterial = new ƒ.ComponentMaterial(Unit.material);
                this.base.removeComponent(cmpMaterial);
                this.base.addComponent(newCmpMaterial);
            }
        }
        update() {
            let distanceToTravel = this.speed * ƒ.Loop.timeFrameGame;
            let move;
            if (this.moveTo != null) {
                while (true) {
                    move = ƒ.Vector3.DIFFERENCE(this.moveTo, this.mtxLocal.translation);
                    console.log(move);
                    if (move.magnitudeSquared > distanceToTravel * distanceToTravel)
                        break;
                    this.moveTo = null;
                }
                //testing
                // let pointAt: ƒ.Vector3 = this.moveTo.copy;
                // pointAt.subtract(this.mtxWorld.translation);
                // let testMatrix: ƒ.Matrix4x4 = this.base.mtxLocal.copy;
                // testMatrix.lookAt(pointAt, ƒ.Vector3.Z());
                // testMatrix.rotate(new ƒ.Vector3(0, 90, 90));
                // let newCmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(testMatrix);
                // let oldCmpTransform: ƒ.ComponentTransform = this.base.getComponent(ƒ.ComponentTransform);
                // this.base.removeComponent(oldCmpTransform);
                // this.base.addComponent(newCmpTransform);
                let pointAt = this.moveTo.copy;
                pointAt.subtract(this.mtxWorld.translation);
                this.base.mtxLocal.lookAt(pointAt, ƒ.Vector3.Z());
                this.base.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
                this.cmpTransform.local.translate(ƒ.Vector3.NORMALIZATION(move, distanceToTravel));
            }
        }
        isInPickingRange(_ray) {
            let distanceVector = _ray.getDistance(this.mtxWorld.translation.copy);
            if (distanceVector.magnitudeSquared < this.pickingRange ** 2) {
                return true;
            }
            else {
                return false;
            }
        }
        createNodes(_pos) {
            this.base = new ƒAid.Node("Unit Base", ƒ.Matrix4x4.IDENTITY(), Unit.material, Unit.mesh);
            let baseCmpMesh = this.base.getComponent(ƒ.ComponentMesh);
            baseCmpMesh.pivot.scale(new ƒ.Vector3(1.5, 1, 0));
            this.appendChild(this.base);
            let cannon = new ƒAid.Node("Unit Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.10001)), Unit.cannonMaterial, Unit.mesh);
            let cannonCmpMesh = cannon.getComponent(ƒ.ComponentMesh);
            cannonCmpMesh.pivot.scale(new ƒ.Vector3(0.7, 0.7, 0));
            let cannonBarrel = new ƒAid.Node("Unit Cannonbarrel", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.X(0.5)), Unit.cannonBarrelMaterial, Unit.mesh);
            let cannonBarrelCmpMesh = cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelCmpMesh.pivot.scale(new ƒ.Vector3(1, 0.2, 0));
            cannon.appendChild(cannonBarrel);
            this.appendChild(cannon);
            let unitCmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos));
            this.addComponent(unitCmpTransform);
        }
    }
    Unit.mesh = new ƒ.MeshSprite();
    Unit.material = new ƒ.Material("UnitMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0.7, 0.7, 0.7)));
    Unit.cannonMaterial = new ƒ.Material("UnitMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0.3, 0.3, 0.3)));
    Unit.cannonBarrelMaterial = new ƒ.Material("UnitMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0.4, 0.4, 0.4)));
    Unit.pickedColor = new ƒ.Color(1, 0, 0);
    Real_Time_Strategie.Unit = Unit;
})(Real_Time_Strategie || (Real_Time_Strategie = {}));
var Real_Time_Strategie;
(function (Real_Time_Strategie) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.RenderManager.initialize(true, false);
    window.addEventListener("load", hndLoad);
    let selectedUnit;
    function hndLoad(_event) {
        console.log(selectedUnit);
        const canvas = document.querySelector("canvas");
        let graph = createTerrainNode();
        Real_Time_Strategie.units = new ƒ.Node("Units");
        graph.appendChild(Real_Time_Strategie.units);
        setupGameObjects();
        ƒAid.addStandardLightComponents(graph, new ƒ.Color(0.6, 0.6, 0.6));
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(ƒ.Vector3.Z(30));
        let cameraLookAt = new ƒ.Vector3(0, 0, 0);
        cmpCamera.pivot.lookAt(cameraLookAt);
        //cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = ƒ.Color.CSS("white");
        Real_Time_Strategie.viewport = new ƒ.Viewport();
        Real_Time_Strategie.viewport.initialize("Viewport", graph, cmpCamera, canvas);
        Real_Time_Strategie.viewport.addEventListener("\u0192pointerdown" /* DOWN */, pointerDown);
        Real_Time_Strategie.viewport.activatePointerEvent("\u0192pointerdown" /* DOWN */, true);
        ƒ.Debug.log(Real_Time_Strategie.viewport);
        ƒ.Debug.log(graph);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    }
    function createTerrainNode() {
        let mesh = new ƒ.MeshSprite();
        let mtrTerrain = new ƒ.Material("mrtTerrain", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0.2, 0.6, 0.3)));
        let terrain = new ƒAid.Node("Game", ƒ.Matrix4x4.IDENTITY(), mtrTerrain, mesh);
        let terrainsCmpMesh = terrain.getComponent(ƒ.ComponentMesh);
        terrainsCmpMesh.pivot.scale(new ƒ.Vector3(20, 20, 0));
        return terrain;
    }
    function setupGameObjects() {
        let newUnit = new Real_Time_Strategie.Unit("Tank", new ƒ.Vector3(0, 0, 0.1));
        Real_Time_Strategie.units.appendChild(newUnit);
    }
    function update(_event) {
        Real_Time_Strategie.viewport.draw();
    }
    function pointerDown(_event) {
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let ray = Real_Time_Strategie.viewport.getRayFromClient(posMouse);
        if (_event.which == 1) {
            let allunits = Real_Time_Strategie.units.getChildren().map((value) => {
                return value;
            });
            selectedUnit = null;
            for (let unit of allunits) {
                if (unit.isInPickingRange(ray)) {
                    selectedUnit = unit;
                    selectedUnit.setPicked(true);
                }
                else {
                    unit.setPicked(false);
                }
            }
            console.log(selectedUnit);
        }
        else {
            if (selectedUnit != null) {
                let newPos = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));
                console.log(newPos);
                selectedUnit.move = newPos;
            }
        }
    }
})(Real_Time_Strategie || (Real_Time_Strategie = {}));
//# sourceMappingURL=RealTimeStrategie.js.map