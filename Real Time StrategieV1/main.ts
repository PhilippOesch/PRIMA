namespace Real_Time_Strategie_V2 {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    ƒ.RenderManager.initialize(true, false);

    window.addEventListener("load", hndLoad);

    export let viewport: ƒ.Viewport;
    export let units: ƒ.Node;

    let selectedUnits: Unit[] = new Array<Unit>();

    let startSelectionInfo: { startSelectionPos: ƒ.Vector3, startSelectionClientPos: ƒ.Vector2 }

    function hndLoad(_event: Event): void {
        console.log(selectedUnits);
        const canvas: HTMLCanvasElement = document.querySelector("canvas");

        Unit.loadMaterials();
        let graph: ƒ.Node = new ƒ.Node("Game");
        graph.appendChild(createTerrainNode());
        units = new ƒ.Node("Units");
        graph.appendChild(units);
        setupGameObjects();
        //ƒAid.addStandardLightComponents(graph, new ƒ.Color(0.6, 0.6, 0.6));

        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(ƒ.Vector3.Z(30));
        let cameraLookAt: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
        cmpCamera.pivot.lookAt(cameraLookAt);
        //cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = ƒ.Color.CSS("white");

        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);

        viewport.addEventListener(ƒ.EVENT_POINTER.DOWN, pointerDown);
        viewport.addEventListener(ƒ.EVENT_POINTER.UP, pointerUp);
        viewport.addEventListener(ƒ.EVENT_POINTER.MOVE, pointerMove);
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.UP, true);
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);
        ƒ.Debug.log(viewport);
        ƒ.Debug.log(graph);

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }

    function createTerrainNode(): ƒ.Node {
        let img: HTMLImageElement = document.querySelector(".background");
        let txt: ƒ.TextureImage = new ƒ.TextureImage();
        let coat: ƒ.CoatTextured = new ƒ.CoatTextured();
        txt.image = img;
        coat.texture = txt;
        coat.tilingX = 1;
        coat.tilingY = 1;
        coat.repetition = true;

        let mesh: ƒ.MeshSprite = new ƒ.MeshSprite();
        let mtr: ƒ.Material = new ƒ.Material("mtrTerrain", ƒ.ShaderTexture, coat);
        // let mesh: ƒ.MeshSprite = new ƒ.MeshSprite();
        // let mtr: ƒ.Material = new ƒ.Material("terrainMtr", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0, 0.5, 0)));


        let terrain: ƒAid.Node = new ƒAid.Node("Terrain", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(-1)), mtr, mesh);
        let terrainsCmpMesh: ƒ.ComponentMesh = terrain.getComponent(ƒ.ComponentMesh);
        terrainsCmpMesh.pivot.scale(new ƒ.Vector3(20, 20, 0));

        return terrain;
    }

    function setupGameObjects(): void {
        let newUnit0: Unit = new Unit("Tank", new ƒ.Vector3(0, 0, 0.1));
        let newUnit1: Unit = new Unit("Tank", new ƒ.Vector3(2, 2, 0.1));
        let newUnit2: Unit = new Unit("Tank", new ƒ.Vector3(2, 0, 0.1));
        let newUnit3: Unit = new Unit("Tank", new ƒ.Vector3(0, 2, 0.1));
        let newUnit4: Unit = new Unit("Tank", new ƒ.Vector3(2, 4, 0.1));
        units.appendChild(newUnit0);
        units.appendChild(newUnit1);
        units.appendChild(newUnit2);
        units.appendChild(newUnit3);
        units.appendChild(newUnit4);
    }

    function update(_event: ƒ.Eventƒ): void {
        viewport.draw();
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
                    unit.move = targetPosArray[index];
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