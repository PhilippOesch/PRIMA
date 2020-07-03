namespace Real_Time_Strategie {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    ƒ.RenderManager.initialize(true, false);

    window.addEventListener("load", hndLoad);

    export let viewport: ƒ.Viewport;
    export let units: ƒ.Node;

    let selectedUnit: Unit;

    function hndLoad(_event: Event): void {
        console.log(selectedUnit);
        const canvas: HTMLCanvasElement = document.querySelector("canvas");

        let graph: ƒAid.Node = createTerrainNode();
        units = new ƒ.Node("Units");
        graph.appendChild(units);
        setupGameObjects();
        ƒAid.addStandardLightComponents(graph, new ƒ.Color(0.6, 0.6, 0.6));

        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(ƒ.Vector3.Z(30));
        let cameraLookAt: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
        cmpCamera.pivot.lookAt(cameraLookAt);
        //cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = ƒ.Color.CSS("white");

        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);

        viewport.addEventListener(ƒ.EVENT_POINTER.DOWN, pointerDown);
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);
        ƒ.Debug.log(viewport);
        ƒ.Debug.log(graph);

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    }

    function createTerrainNode(): ƒAid.Node {
        let mesh: ƒ.MeshSprite = new ƒ.MeshSprite();
        let mtrTerrain: ƒ.Material = new ƒ.Material("mrtTerrain", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0.2, 0.6, 0.3)));

        let terrain: ƒAid.Node = new ƒAid.Node("Game", ƒ.Matrix4x4.IDENTITY(), mtrTerrain, mesh);
        let terrainsCmpMesh: ƒ.ComponentMesh = terrain.getComponent(ƒ.ComponentMesh);
        terrainsCmpMesh.pivot.scale(new ƒ.Vector3(20, 20, 0));

        return terrain;
    }

    function setupGameObjects(): void {
        let newUnit: Unit = new Unit("Tank", new ƒ.Vector3(0, 0, 0.1));
        units.appendChild(newUnit);
    }

    function update(_event: ƒ.Eventƒ): void {
        viewport.draw();
    }

    function pointerDown(_event: ƒ.EventPointer): void {
        let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let ray: ƒ.Ray = viewport.getRayFromClient(posMouse);

        if (_event.which == 1) {
            let allunits: Array<Unit> = units.getChildren().map((value) => {
                return <Unit>value;
            });

            selectedUnit = null;

            for (let unit of allunits) {
                if (unit.isInPickingRange(ray)) {
                    selectedUnit = unit;
                    selectedUnit.setPicked(true);
                } else {
                    unit.setPicked(false);
                }
            }

            console.log(selectedUnit);
        } else {
            if (selectedUnit != null) {
                let newPos: ƒ.Vector3 = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));
                console.log(newPos);
                selectedUnit.move = newPos;
            }
        }
    }

}