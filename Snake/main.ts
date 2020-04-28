namespace SnakeGame {
    import ƒ= FudgeCore;

    window.addEventListener("load", hndload)

    let viewport: ƒ.Viewport;    //viewport variable

    let snakeScene: ƒ.Node= new ƒ.Node("SnakeScene")

    let snake: ƒ.Node= new ƒ.Node("Snake")
    snake.addComponent(new ƒ.ComponentTransform());

    function hndload(_event: Event):void {
        const canvas: HTMLCanvasElement= document.querySelector("canvas");

        ƒ.RenderManager.initialize();
        ƒ.Debug.log(canvas);

        let mesh: ƒ.MeshQuad= new ƒ.MeshQuad(); //Create a Quad Mesh
        let mtrSolidWhite: ƒ.Material= new ƒ.Material("SolidGreen", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("green")));

        //let node: ƒ.Node= new ƒ.Node("Quad"); //Node for our Object
        for(let i= 0; i< 4; i++){
            let node: ƒ.Node= new ƒ.Node("Quad"); //Node for our Object

            let cmpMesh: ƒ.ComponentMesh= new ƒ.ComponentMesh(mesh); //attache Mesh to Node
            cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.8));
            node.addComponent(cmpMesh); //Add Component into node component Map

            let cmpMat: ƒ.ComponentMaterial= new ƒ.ComponentMaterial(mtrSolidWhite); //attache Mesh to Node
            node.addComponent(cmpMat); //Add Component into node component Map

            node.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-1*i,0,0))));
            // node.mtxLocal.scale(ƒ.Vector3.ONE(0.8));
            snake.appendChild(node);
        }
        snakeScene.addChild(snake);

        //The Camera
        let cmpCamera: ƒ.ComponentCamera= new ƒ.ComponentCamera();
        cmpCamera.pivot.translateZ(30);
        cmpCamera.pivot.rotateY(180);

        //The Viewport
        viewport= new ƒ.Viewport();
        viewport.initialize("Viewport", snakeScene, cmpCamera, canvas);
        ƒ.Debug.log(viewport);

        viewport.draw();

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 10);
    }

    function update(){
        snake.cmpTransform.local.translate(new ƒ.Vector3(1,0,0));
        viewport.draw();
    }

}