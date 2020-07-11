
namespace RTS_V2 {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    //import ƒUi = FudgeUserInterface;

    export let viewport: ƒ.Viewport;
    export let units: ƒ.Node;
    export let bullets: ƒ.Node;

    let selectedUnits: Unit[] = new Array<Unit>();
    let startSelectionInfo: { startSelectionPos: ƒ.Vector3, startSelectionClientPos: ƒ.Vector2 };

    let terrainX: number = 30;
    let terrainY: number = 20;
    let terrainTiling: number = 5;

    let mousePos: ƒ.Vector2;
    //let mousePos= ƒ.Vector2;

    ƒ.RenderManager.initialize(true, false);

    window.addEventListener("load", hndLoad);

    function hndLoad(_event: Event): void {
        // ƒUi.CustomElementTemplate.register("custom-healthbar");
        // ƒUi.CustomElement.register("custom-healthbar", FudgeUserInterface.CustomElementTemplate);

        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        let backgroundImg: HTMLImageElement = document.querySelector("#terrain");

        //prevents the context menu to open
        canvas.addEventListener("contextmenu", event => event.preventDefault());

        Bullet.loadImages();
        TankUnit.loadImages();

        let graph: ƒ.Node = new ƒ.Node("Game");
        let terrain: ƒAid.Node = createTerrainNode(backgroundImg);
        graph.appendChild(terrain);
        bullets = new ƒ.Node("Bullets");
        units = new ƒ.Node("Units");
        graph.appendChild(bullets);
        graph.appendChild(units);


        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(ƒ.Vector3.Z(35));
        let cameraLookAt: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
        cmpCamera.pivot.lookAt(cameraLookAt);
        cmpCamera.backgroundColor = ƒ.Color.CSS("white");

        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);

        //setup AudioNode
        Audio.start();
        
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
        if (startSelectionInfo != null) {
            drawSelectionRectangle(startSelectionInfo.startSelectionClientPos, mousePos);
        }
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
        terrainsCmpMesh.pivot.scale(new ƒ.Vector3(terrainX, terrainY, 0));
        let cmpMtr: ƒ.ComponentMaterial = terrain.getComponent(ƒ.ComponentMaterial);
        cmpMtr.pivot.scale(new ƒ.Vector2(terrainX / terrainTiling, terrainY / terrainTiling));

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
        let unit0: Unit = new TankUnit("Unit", new ƒ.Vector3(0, 2, 0.1), false);
        let unit1: Unit = new TankUnit("Unit", new ƒ.Vector3(2, 4, 0.1), false);
        let unit2: Unit = new TankUnit("Unit", new ƒ.Vector3(0, 0, 0.1));
        let unit3: Unit = new TankUnit("Unit", new ƒ.Vector3(2, 0, 0.1));
        let unit4: Unit = new TankUnit("Unit", new ƒ.Vector3(2, 2, 0.1));
        units.appendChild(unit0);
        units.appendChild(unit1);
        units.appendChild(unit2);
        units.appendChild(unit3);
        units.appendChild(unit4);
    }

    function pointerDown(_event: ƒ.EventPointer): void {
        let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let ray: ƒ.Ray = viewport.getRayFromClient(posMouse);
        let position: ƒ.Vector3 = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));

        if (_event.which == 1) { //Left Mouse Click
            mousePos = posMouse;
            startSelectionInfo = { startSelectionPos: position, startSelectionClientPos: posMouse };
        } else if (_event.which == 3 && selectedUnits.length != 0) {

            let targetPosArray: ƒ.Vector3[] = Utils.createTargetPosArray(position, 1.5, selectedUnits.length);

            let enemySelected: Unit = null;

            let enemies: Array<Unit> = getUnits(false);

            for (let enemy of enemies) {
                if (enemy.isInPickingRange(ray)) {
                    enemySelected = enemy;
                }
            }
            if (enemySelected != null) {
                for (let unit of selectedUnits) {
                    unit.setTarget = enemySelected;
                }
            } else {
                let index: number = 0;

                for (let unit of selectedUnits) {
                    unit.setTarget = null;
                    unit.setMove = targetPosArray[index];
                    index++;
                    console.log(targetPosArray);
                }
            }
        } else {
            startSelectionInfo = null;
        }

    }

    function pointerUp(_event: ƒ.EventPointer): void {
        _event.preventDefault();
        let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let ray: ƒ.Ray = viewport.getRayFromClient(posMouse);

        if (_event.which == 1) {
            selectedUnits = new Array<Unit>();
            let endPos: ƒ.Vector3 = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));

            let allunits: Array<Unit> = getUnits();

            let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(startSelectionInfo.startSelectionPos, endPos);
            if (distanceVector.magnitudeSquared < 1) {
                for (let unit of allunits) {
                    if (unit.isInPickingRange(ray)) {
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
        mousePos = posMouse;
    }

    export function getUnits(_ofPlayer: boolean = true): Array<Unit> {
        let array: Unit[] = units.getChildren().map(value => <Unit>value);
        if (_ofPlayer) {
            return array.filter((value) => {
                if (value.isPlayer)
                    return true;
                return false;
            });
        } else {
            return array.filter((value) => {
                if (!value.isPlayer)
                    return true;
                return false;
            });
        }
    }

    // function getAllUnits(): Array<Unit> {
    //     let playerUnits: Array<Unit> = getUnits();
    //     let enemyUnits: Array<Unit> = getUnits(false);

    //     return new Array<Unit>().concat(playerUnits, enemyUnits);
    // }
}