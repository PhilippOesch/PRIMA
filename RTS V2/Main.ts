namespace RTS_V2 {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export let viewport: ƒ.Viewport;
    export let units: ƒ.Node;
    export let enemyUnits: ƒ.Node;
    export let bullets: ƒ.Node;

    let selectedUnits: Unit[] = new Array<Unit>();
    let startSelectionInfo: { startSelectionPos: ƒ.Vector3, startSelectionClientPos: ƒ.Vector2 };

    ƒ.RenderManager.initialize(true, false);

    window.addEventListener("load", hndLoad);

    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        let backgroundImg: HTMLImageElement = document.querySelector("#terrain");
        Bullet.loadImages();
        Unit.loadImages();

        let graph: ƒ.Node = new ƒ.Node("Game");
        let terrain: ƒAid.Node = createTerrainNode(backgroundImg);
        graph.appendChild(terrain);
        bullets = new ƒ.Node("Bullets");
        units = new ƒ.Node("Units");
        enemyUnits = new ƒ.Node("EnemyUnits");
        graph.appendChild(bullets);
        graph.appendChild(units);
        graph.appendChild(enemyUnits);

        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(ƒ.Vector3.Z(30));
        let cameraLookAt: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
        cmpCamera.pivot.lookAt(cameraLookAt);
        cmpCamera.backgroundColor = ƒ.Color.CSS("white");

        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        createUnits();

        viewport.addEventListener(ƒ.EVENT_POINTER.DOWN, pointerDown);
        viewport.addEventListener(ƒ.EVENT_POINTER.UP, pointerUp);
        viewport.addEventListener(ƒ.EVENT_POINTER.MOVE, pointerMove);
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.UP, true);
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);

        ƒ.Debug.log(viewport);
        ƒ.Debug.log(graph);

        viewport.draw();

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }

    function update(): void {
        viewport.draw();
    }

    function createTerrainNode(_img: HTMLImageElement): ƒAid.Node {
        let txt: ƒ.TextureImage = new ƒ.TextureImage();
        let coat: ƒ.CoatTextured = new ƒ.CoatTextured();
        txt.image = _img;
        coat.texture = txt;

        let mesh: ƒ.MeshSprite = new ƒ.MeshSprite();
        let mtr: ƒ.Material = new ƒ.Material("mtrTerrain", ƒ.ShaderTexture, coat);

        let terrain: ƒAid.Node = new ƒAid.Node("Terrain", ƒ.Matrix4x4.IDENTITY(), mtr, mesh);
        let terrainsCmpMesh: ƒ.ComponentMesh = terrain.getComponent(ƒ.ComponentMesh);
        terrainsCmpMesh.pivot.scale(new ƒ.Vector3(20, 20, 0));

        return terrain;
    }

    function drawSelectionRectangle(_startClient: ƒ.Vector2, _endClient: ƒ.Vector2): void {
        let ctx: CanvasRenderingContext2D = viewport.getContext();
        let vector: ƒ.Vector2 = _endClient.copy;
        vector.subtract(_startClient);
        ctx.save();
        ctx.beginPath();
        ctx.rect(_startClient.x, _startClient.y, vector.x, vector.y);
        ctx.strokeStyle = "Black";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    function createUnits(): void {
        let unit0: Unit = new Unit("Unit", new ƒ.Vector3(0, 2, 0.1), false);
        let unit1: Unit = new Unit("Unit", new ƒ.Vector3(2, 4, 0.1), false);
        let unit2: Unit = new Unit("Unit", new ƒ.Vector3(0, 0, 0.1));
        let unit3: Unit = new Unit("Unit", new ƒ.Vector3(2, 0, 0.1));
        let unit4: Unit = new Unit("Unit", new ƒ.Vector3(2, 2, 0.1));
        enemyUnits.appendChild(unit0);
        enemyUnits.appendChild(unit1);
        units.appendChild(unit2);
        units.appendChild(unit3);
        units.appendChild(unit4);
    }

    function pointerDown(_event: ƒ.EventPointer): void {
        let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let ray: ƒ.Ray = viewport.getRayFromClient(posMouse);
        let position: ƒ.Vector3 = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));

        if (_event.which == 1) { //Left Mouse Click
            startSelectionInfo = { startSelectionPos: position, startSelectionClientPos: posMouse };
        } else if (_event.which == 3) {
            if (selectedUnits.length != 0) {
                let targetPosArray: ƒ.Vector3[] = createTargetPosArray(position, 1.5, 5);

                let index: number = 0;
                for (let unit of selectedUnits) {
                    unit.movePos = targetPosArray[index];
                    index = (index + 1) % targetPosArray.length;
                }
            }
        } else {
            startSelectionInfo = null;
        }

    }

    function pointerUp(_event: ƒ.EventPointer): void {
        let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let ray: ƒ.Ray = viewport.getRayFromClient(posMouse);

        if (_event.which == 1) {
            selectedUnits = new Array<Unit>();
            let endPos: ƒ.Vector3 = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));

            let allunits: Array<Unit> = units.getChildren().map((value) => {
                return <Unit>value;
            });

            let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(startSelectionInfo.startSelectionPos, endPos);
            if (distanceVector.magnitudeSquared < 1) {
                for (let unit of allunits) {
                    if(unit.isInPickingRange(ray)){
                        unit.setPicked(true);
                        selectedUnits.push(unit);
                    } else {
                        unit.setPicked(false);
                    }
                }
            } else {
                for (let unit of allunits) {
                    let unitPos: ƒ.Vector3 = unit.mtxWorld.translation.copy;
                    let adjustedStartPos: ƒ.Vector3 = startSelectionInfo.startSelectionPos.copy;
                    adjustedStartPos.subtract(ƒ.Vector3.Z(0.5));
                    let adjustedEndPos: ƒ.Vector3 = endPos.copy;
                    adjustedEndPos.add((ƒ.Vector3.Z(0.5)));

                    if (unitPos.isInsideCube(adjustedStartPos, adjustedEndPos)) {
                        unit.setPicked(true);
                        selectedUnits.push(unit);
                    } else {
                        unit.setPicked(false);
                    }
                }
            }

            console.log(selectedUnits);
        }

        startSelectionInfo = null;
    }

    function pointerMove(_event: ƒ.EventPointer): void {
        let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);

        if (startSelectionInfo != null) {
            drawSelectionRectangle(startSelectionInfo.startSelectionClientPos, posMouse);
        }
    }

    function createTargetPosArray(_pos: ƒ.Vector3, _distance: number, _positionCount: number): ƒ.Vector3[] {
        let targetPosArray: Array<ƒ.Vector3> = new Array<ƒ.Vector3>();
        for (let i = 0; i < _positionCount; i++) {
            let angle: number = i * (360 / _positionCount);
            let dir: ƒ.Vector3 = new ƒ.Vector3(1, 0, 0);
            dir.transform(ƒ.Matrix4x4.ROTATION_Z(angle));
            dir.normalize(_distance);
            let position: ƒ.Vector3 = _pos.copy;
            position.add(dir);
            targetPosArray.push(position);
        }

        return targetPosArray;
    }
}