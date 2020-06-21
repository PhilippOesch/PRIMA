namespace TowerDefense {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    ƒ.RenderManager.initialize(true, false);

    window.addEventListener("load", hndLoad);

    export let viewport: ƒ.Viewport;
    export let grid: ƒ.Vector3[][];
    export let enemies: ƒ.Node;
    export let gridBlockSize: number = 4;
    let gridX: number = 15;
    let gridZ: number = 10;
    let blocktowerMtr= new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.3, 0.3, 0.3)))
    let itowerMtr= new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.4, 0.4, 0.4)))


    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        ƒ.Debug.log(canvas);

        let graph: ƒ.Node = new ƒ.Node("Game");
        enemies = new ƒ.Node("enemies");
        graph.appendChild(enemies);

        initGrid();
        createField(graph);

        spawnEnemy();
        let tower1: Tower = new Tower(grid[5][1]);
        let tower2: TowerBlock = new TowerBlock(grid[6][2], blocktowerMtr);
        let tower3: ITower = new ITower(grid[5][5], itowerMtr);
        let tower4: ITowerVariant= new ITowerVariant(grid[1][5], itowerMtr);
        graph.appendChild(tower1);
        graph.appendChild(tower2);
        graph.appendChild(tower3);
        graph.appendChild(tower4);

        ƒAid.addStandardLightComponents(graph, new ƒ.Color(0.6, 0.6, 0.6));

        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(0, gridBlockSize * gridX * 1.3, 1));
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        cmpCamera.backgroundColor = ƒ.Color.CSS("PaleTurquoise");

        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        ƒ.Debug.log(viewport);

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    }

    function update(_event: ƒ.Eventƒ): void {
        spawnEnemy();
        viewport.draw();
    }

    function createField(_graph: ƒ.Node): void {
        // let img: HTMLImageElement= document.querySelector("img");
        // let txtImage: ƒ.TextureImage= new ƒ.TextureImage();
        // txtImage.image= img;
        // let coatTextured: ƒ.CoatTextured = new ƒ.CoatTextured();
        // coatTextured.texture = txtImage;
        // coatTextured.repetition= true;
        // coatTextured.tilingX= 0.1;
        // let material: ƒ.Material = new ƒ.Material("Textured", ƒ.ShaderTexture, coatTextured);

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
}