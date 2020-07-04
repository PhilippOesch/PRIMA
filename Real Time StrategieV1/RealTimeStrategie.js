"use strict";
var Real_Time_Strategie_V2;
(function (Real_Time_Strategie_V2) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Unit extends ƒ.Node {
        constructor(_name, _pos) {
            super(_name);
            this.pickingRange = 1;
            this.speed = 3 / 1000;
            this.createNodes(_pos);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
        }
        static loadMaterials() {
            let bodyImg = document.querySelector(".tankbody");
            let barrelImg = document.querySelector(".tankbarrel");
            let cannonlImg = document.querySelector(".tankcannon");
            Unit.bodymaterial = Unit.loadMaterialWithTexture("bodyMtr", bodyImg);
            Unit.cannonMaterial = Unit.loadMaterialWithTexture("cannonMtr", cannonlImg);
            Unit.cannonBarrelMaterial = Unit.loadMaterialWithTexture("cannonBarrelMtr", barrelImg);
        }
        static loadMaterialWithTexture(_name, _img) {
            let txt = new ƒ.TextureImage();
            console.log(_img);
            txt.image = _img;
            console.log(txt.type);
            let coatTxt = new ƒ.CoatTextured();
            coatTxt.texture = txt;
            let mtr = new ƒ.Material(name, ƒ.ShaderTexture, coatTxt);
            return mtr;
        }
        set move(_pos) {
            this.moveTo = _pos;
        }
        setPicked(_bool) {
            //let cmpMaterial: ƒ.ComponentMaterial = this.bodyNode.getComponent(ƒ.ComponentMaterial);
            if (_bool) {
                //cmpMaterial.clrPrimary = Unit.pickedColor;
            }
            else {
                // let newCmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(this.bodymaterial)
                // this.bodyNode.removeComponent(cmpMaterial);
                // this.bodyNode.addComponent(newCmpMaterial);
            }
        }
        update() {
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
                this.bodyNode.mtxLocal.lookAt(pointAt, ƒ.Vector3.Z());
                this.bodyNode.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
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
            this.bodyNode = new ƒAid.Node("Unit Base", ƒ.Matrix4x4.IDENTITY(), Unit.bodymaterial, Unit.mesh);
            let baseCmpMesh = this.bodyNode.getComponent(ƒ.ComponentMesh);
            baseCmpMesh.pivot.scale(new ƒ.Vector3(1, 1, 0));
            this.appendChild(this.bodyNode);
            let cannon = new ƒAid.Node("Unit Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.2)), Unit.cannonMaterial, Unit.mesh);
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
    Unit.pickedColor = new ƒ.Color(1, 0, 0);
    Real_Time_Strategie_V2.Unit = Unit;
})(Real_Time_Strategie_V2 || (Real_Time_Strategie_V2 = {}));
var Real_Time_Strategie_V2;
(function (Real_Time_Strategie_V2) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.RenderManager.initialize(false, false);
    window.addEventListener("load", hndLoad);
    let selectedUnits = new Array();
    let startSelectionInfo;
    function hndLoad(_event) {
        console.log(selectedUnits);
        const canvas = document.querySelector("canvas");
        Real_Time_Strategie_V2.Unit.loadMaterials();
        let graph = new ƒ.Node("Game");
        graph.appendChild(createTerrainNode());
        Real_Time_Strategie_V2.units = new ƒ.Node("Units");
        graph.appendChild(Real_Time_Strategie_V2.units);
        setupGameObjects();
        //ƒAid.addStandardLightComponents(graph, new ƒ.Color(0.6, 0.6, 0.6));
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(ƒ.Vector3.Z(30));
        let cameraLookAt = new ƒ.Vector3(0, 0, 0);
        cmpCamera.pivot.lookAt(cameraLookAt);
        //cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = ƒ.Color.CSS("white");
        Real_Time_Strategie_V2.viewport = new ƒ.Viewport();
        Real_Time_Strategie_V2.viewport.initialize("Viewport", graph, cmpCamera, canvas);
        Real_Time_Strategie_V2.viewport.addEventListener("\u0192pointerdown" /* DOWN */, pointerDown);
        Real_Time_Strategie_V2.viewport.addEventListener("\u0192pointerup" /* UP */, pointerUp);
        Real_Time_Strategie_V2.viewport.addEventListener("\u0192pointermove" /* MOVE */, pointerMove);
        Real_Time_Strategie_V2.viewport.activatePointerEvent("\u0192pointerdown" /* DOWN */, true);
        Real_Time_Strategie_V2.viewport.activatePointerEvent("\u0192pointerup" /* UP */, true);
        Real_Time_Strategie_V2.viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
        ƒ.Debug.log(Real_Time_Strategie_V2.viewport);
        ƒ.Debug.log(graph);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }
    function createTerrainNode() {
        let img = document.querySelector(".background");
        let txt = new ƒ.TextureImage();
        let coat = new ƒ.CoatTextured();
        txt.image = img;
        coat.texture = txt;
        coat.tilingX = 1;
        coat.tilingY = 1;
        coat.repetition = true;
        let mesh = new ƒ.MeshSprite();
        let mtr = new ƒ.Material("mtrTerrain", ƒ.ShaderTexture, coat);
        // let mesh: ƒ.MeshSprite = new ƒ.MeshSprite();
        // let mtr: ƒ.Material = new ƒ.Material("terrainMtr", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0, 0.5, 0)));
        let terrain = new ƒAid.Node("Terrain", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(-1)), mtr, mesh);
        let terrainsCmpMesh = terrain.getComponent(ƒ.ComponentMesh);
        terrainsCmpMesh.pivot.scale(new ƒ.Vector3(20, 20, 0));
        return terrain;
    }
    function setupGameObjects() {
        let newUnit0 = new Real_Time_Strategie_V2.Unit("Tank", new ƒ.Vector3(0, 0, 0.1));
        let newUnit1 = new Real_Time_Strategie_V2.Unit("Tank", new ƒ.Vector3(2, 2, 0.1));
        let newUnit2 = new Real_Time_Strategie_V2.Unit("Tank", new ƒ.Vector3(2, 0, 0.1));
        let newUnit3 = new Real_Time_Strategie_V2.Unit("Tank", new ƒ.Vector3(0, 2, 0.1));
        let newUnit4 = new Real_Time_Strategie_V2.Unit("Tank", new ƒ.Vector3(2, 4, 0.1));
        Real_Time_Strategie_V2.units.appendChild(newUnit0);
        Real_Time_Strategie_V2.units.appendChild(newUnit1);
        Real_Time_Strategie_V2.units.appendChild(newUnit2);
        Real_Time_Strategie_V2.units.appendChild(newUnit3);
        Real_Time_Strategie_V2.units.appendChild(newUnit4);
    }
    function update(_event) {
        Real_Time_Strategie_V2.viewport.draw();
    }
    function pointerDown(_event) {
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let ray = Real_Time_Strategie_V2.viewport.getRayFromClient(posMouse);
        let position = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));
        if (_event.which == 1) { //Left Mouse Click
            startSelectionInfo = { startSelectionPos: position, startSelectionClientPos: posMouse };
        }
        else if (_event.which == 3) {
            if (selectedUnits.length != 0) {
                let targetPosArray = createTargetPosArray(position, 1.5, 5);
                let index = 0;
                for (let unit of selectedUnits) {
                    unit.move = targetPosArray[index];
                    index = (index + 1) % targetPosArray.length;
                }
            }
        }
        else {
            startSelectionInfo = null;
        }
        // let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        // let ray: ƒ.Ray = viewport.getRayFromClient(posMouse);
        // if (_event.which == 1) {
        //     let allunits: Array<Unit> = units.getChildren().map((value) => {
        //         return <Unit>value;
        //     });
        //     selectedUnit = null;
        //     for (let unit of allunits) {
        //         if (unit.isInPickingRange(ray)) {
        //             selectedUnit = unit;
        //             selectedUnit.setPicked(true);
        //         } else {
        //             unit.setPicked(false);
        //         }
        //     }
        //     console.log(selectedUnit);
        // } else {
        //     if (selectedUnit != null) {
        //         let newPos: ƒ.Vector3 = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));
        //         console.log(newPos);
        //         selectedUnit.move = newPos;
        //     }
        // }
    }
    function pointerUp(_event) {
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let ray = Real_Time_Strategie_V2.viewport.getRayFromClient(posMouse);
        if (_event.which == 1) {
            selectedUnits = new Array();
            let endPos = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));
            let allunits = Real_Time_Strategie_V2.units.getChildren().map((value) => {
                return value;
            });
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
            console.log(selectedUnits);
        }
        startSelectionInfo = null;
    }
    function pointerMove(_event) {
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        if (startSelectionInfo != null) {
            drawSelectionRectangle(startSelectionInfo.startSelectionClientPos, posMouse);
        }
    }
    function drawSelectionRectangle(_startClient, _endClient) {
        let ctx = Real_Time_Strategie_V2.viewport.getContext();
        let vector = _endClient.copy;
        vector.subtract(_startClient);
        ctx.save();
        ctx.beginPath();
        ctx.rect(_startClient.x, _startClient.y, vector.x, vector.y);
        ctx.strokeStyle = "Black";
        ctx.lineWidth = 3;
        ctx.stroke();
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
})(Real_Time_Strategie_V2 || (Real_Time_Strategie_V2 = {}));
//# sourceMappingURL=RealTimeStrategie.js.map