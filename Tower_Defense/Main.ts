namespace TowerDefense {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    ƒ.RenderManager.initialize(true, false);

    window.addEventListener("load", hndLoad);

    export let viewport: ƒ.Viewport;
    export let graph: ƒ.Node;
    export let enemy: Enemy;

    let tower: Tower;

    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        ƒ.Debug.log(canvas);

        graph = new ƒ.Node("Game");
        createField();

        enemy = new Enemy(new ƒ.Vector3(-14.5, 1, 5), ƒ.Vector3.X(), 0.1);
        tower = new Tower(new ƒ.Vector3(0, 1, 0));
        graph.appendChild(enemy);
        graph.appendChild(tower);

        ƒAid.addStandardLightComponents(graph, new ƒ.Color(0.6, 0.6, 0.6));

        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(0, 30, 1));
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        cmpCamera.backgroundColor = ƒ.Color.CSS("white");

        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        ƒ.Debug.log(viewport);

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 30);
    }

    function update(_event: ƒ.Eventƒ): void {
        viewport.draw();
    }

    function createField(): void {
        let mesh: ƒ.MeshCube = new ƒ.MeshCube();
        let mtrPlayfield: ƒ.Material = new ƒ.Material("playfield", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0, 0.4, 0)));

        let field: ƒ.Node = new ƒ.Node("playfield");
        field.addComponent(new ƒ.ComponentMesh(mesh));
        field.addComponent(new ƒ.ComponentMaterial(mtrPlayfield));
        field.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(new ƒ.Vector3(40, 1, 20))));

        graph.addChild(field);
    }
}