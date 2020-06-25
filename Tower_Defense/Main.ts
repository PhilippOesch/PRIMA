namespace TowerDefense {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    ƒ.RenderManager.initialize(true, false);

    window.addEventListener("load", hndLoad);

    export let viewport: ƒ.Viewport;
    export let grid: ƒ.Vector3[][];
    export let enemies: ƒ.Node;
    export let gridBlockSize: number = 4;
    export let towers: ƒ.Node = new ƒ.Node("towers");

    let gridX: number = 15;
    let gridZ: number = 10;
    let cameraDistance = gridBlockSize * gridX * 1.5;

    let objectIsPicked: boolean = false;
    let selectedTower: Tower;

    let TowerBlockColor: ƒ.Color = new ƒ.Color(0.3, 0.3, 0.3);
    let ITowerColor: ƒ.Color = new ƒ.Color(0.4, 0.4, 0.4);

    let towerSelectionPositions: ƒ.Vector3[]= new Array<ƒ.Vector3>();

    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        ƒ.Debug.log(canvas);
        console.log(objectIsPicked);
        console.log(selectedTower);

        let graph: ƒ.Node = new ƒ.Node("Game");
        enemies = new ƒ.Node("enemies");
        graph.appendChild(enemies);
        graph.appendChild(towers);

        initGrid();
        createField(graph);

        spawnEnemy();
        createTowers();

        ƒAid.addStandardLightComponents(graph, new ƒ.Color(0.6, 0.6, 0.6));

        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(8, cameraDistance, 0.000001));
        let cameraLookAt: ƒ.Vector3= new ƒ.Vector3(8, 0, 0)
        cmpCamera.pivot.lookAt(cameraLookAt);
        cmpCamera.backgroundColor = ƒ.Color.CSS("white");

        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        ƒ.Debug.log(viewport);

        viewport.addEventListener(ƒ.EVENT_POINTER.MOVE, pointerMove);
        viewport.addEventListener(ƒ.EVENT_POINTER.DOWN, pointerDown);
        viewport.addEventListener(ƒ.EVENT_POINTER.UP, pointerUp);
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.UP, true);

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    }

    function update(_event: ƒ.Eventƒ): void {
        spawnEnemy();
        viewport.draw();
    }

    function createField(_graph: ƒ.Node): void {

        let mesh: ƒ.MeshCube = new ƒ.MeshCube();
        let mtrPlayfield: ƒ.Material = new ƒ.Material("playfield", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0, 0.5, 0)));

        let field: ƒ.Node = new ƒ.Node("playfield");
        field.addComponent(new ƒ.ComponentMesh(mesh));
        field.addComponent(new ƒ.ComponentMaterial(mtrPlayfield));
        field.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(new ƒ.Vector3(gridBlockSize * gridX, 1, gridBlockSize * gridZ))));

        _graph.addChild(field);
    }

    function initGrid(): void {
        grid = [];
        let startLeft: number = (gridBlockSize / 2) - (gridX * gridBlockSize / 2);
        let startTop: number = (gridZ * gridBlockSize / 2) - (gridBlockSize / 2);

        for (let z = 0; z < gridZ; z++) {
            grid[z] = [];
            for (let x = 0; x < gridX; x++) {
                grid[z][x] = new ƒ.Vector3((startLeft + (gridBlockSize * x)), 1, (startTop - (gridBlockSize * z)));
            }
        }
    }

    function spawnEnemy(): void {
        if (enemies.getChildren().length == 0) {
            let newPath: Path = new Path(grid[0][0], grid[3][0], grid[3][14]);
            let enemy: Enemy = new Enemy(newPath[0], ƒ.Vector3.X(), 0.2, newPath);
            enemies.appendChild(enemy);
        }
    }

    function pointerMove(_event: ƒ.EventPointer): void {
        let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        if (objectIsPicked) {

            let rayEnd: ƒ.Vector3 = convertClientToView(posMouse);
            console.log(rayEnd);
            let cmpTransform: ƒ.ComponentTransform = selectedTower.getComponent(ƒ.ComponentTransform);
            cmpTransform.local.translation = rayEnd;

            let cmpMaterial: ƒ.ComponentMaterial = selectedTower.getComponent(ƒ.ComponentMaterial);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("red");
        }
    }

    function pointerDown(_event: ƒ.EventPointer): void {
        let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let towerset: ƒ.Node[] = viewport.getGraph().getChild(1).getChildren();
        let picked: { z: number; picker: ComponentPicker, name: string }[] = [];
        for (let tower of towerset) {
            let cmpPicker: ComponentPicker = tower.getComponent(ComponentPicker);
            let pickData: PickData = cmpPicker.pick(posMouse);
            let castedTower = <Tower>tower;
            if (pickData && !castedTower.towerActive) {
                objectIsPicked = true;
                selectedTower = castedTower;
                castedTower.setMaterialColor(ƒ.Color.CSS("red"));
                console.log("picked")
                picked.push({ z: pickData.clip.z, picker: cmpPicker, name: tower.name });
            }
        }
        picked.sort((_a, _b) => _a.z > _b.z ? 1 : -1);
        console.clear();
        console.table(picked);
        viewport.draw();
    }

    function pointerUp(_event: ƒ.EventPointer): void {
        let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        let rayEnd: ƒ.Vector3 = convertClientToView(posMouse);
 
        if(objectIsPicked){
            selectedTower.resetMaterialColor();
            selectedTower.snapToGrid(rayEnd);
            selectedTower.resetMaterialColor();
        }

        objectIsPicked = false;
    }

    function createTowers(): void {
        for(let i= 0; i<4; i++){
            towerSelectionPositions.push(new ƒ.Vector3(((gridX*gridBlockSize)/2+ gridBlockSize*3), 1, (gridZ* gridBlockSize/2)-(i*10)));
        }

        // let tower1: Tower = new Tower(grid[5][1]);
        // let tower2: TowerBlock = new TowerBlock(grid[6][2], TowerBlockColor);
        // let tower3: ITower = new ITower(grid[5][5], ITowerColor);
        // let tower4: ITowerVariant = new ITowerVariant(grid[1][5], ITowerColor);

        let tower1: Tower = new Tower(towerSelectionPositions[0]);
        let btowerPos: ƒ.Vector3= towerSelectionPositions[1].copy;
        btowerPos.subtract(new ƒ.Vector3(gridBlockSize/2, 0, gridBlockSize/2))
        let tower2: TowerBlock = new TowerBlock(btowerPos, TowerBlockColor);
        let tower3: ITower = new ITower(towerSelectionPositions[2], ITowerColor);
        let tower4: ITowerVariant = new ITowerVariant(towerSelectionPositions[3], ITowerColor);
        towers.appendChild(tower1);
        towers.appendChild(tower2);
        towers.appendChild(tower3);
        towers.appendChild(tower4);
    }

    function convertClientToView(_mousepos: ƒ.Vector2): ƒ.Vector3 {
        let posProjection: ƒ.Vector2 = viewport.pointClientToProjection(_mousepos);
        let ray: ƒ.Ray = new ƒ.Ray(new ƒ.Vector3(-posProjection.x, posProjection.y, 1));
        let camera: ƒ.ComponentCamera = viewport.camera;

        ray.direction.scale(cameraDistance - 1);
        ray.origin.transform(camera.pivot);
        ray.origin.transform(viewport.getGraph().mtxWorld);
        ray.direction.transform(camera.pivot, false);
        ray.direction.transform(viewport.getGraph().mtxWorld, false);

        let rayEnd: ƒ.Vector3 = ƒ.Vector3.SUM(ray.origin, ray.direction);
        return rayEnd;
    }
}