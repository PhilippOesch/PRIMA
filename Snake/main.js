"use strict";
var SnakeGame;
(function (SnakeGame) {
    var ƒ = FudgeCore;
    window.addEventListener("load", hndload);
    let viewport; //viewport variable
    let snakeScene = new ƒ.Node("SnakeScene");
    let snake = new ƒ.Node("Snake");
    snake.addComponent(new ƒ.ComponentTransform());
    let mesh;
    let mtrSolidWhite;
    let snakeList = new Array(); //array with snake parts
    function hndload(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.RenderManager.initialize();
        ƒ.Debug.log(canvas);
        mesh = new ƒ.MeshQuad();
        mtrSolidWhite = new ƒ.Material("SolidGreen", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("green")));
        //let node: ƒ.Node= new ƒ.Node("Quad"); //Node for our Object
        for (let i = 0; i < 4; i++) {
            let node = new ƒ.Node("Quad"); //Node for our Object
            let cmpMesh = new ƒ.ComponentMesh(mesh); //attache Mesh to Node
            cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.8));
            node.addComponent(cmpMesh); //Add Component into node component Map
            let cmpMat = new ƒ.ComponentMaterial(mtrSolidWhite); //attache Mesh to Node
            node.addComponent(cmpMat); //Add Component into node component Map
            node.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-1 * i, 0, 0))));
            // node.mtxLocal.scale(ƒ.Vector3.ONE(0.8));
            snake.appendChild(node);
            snakeList.push(node);
        }
        snakeScene.addChild(snake);
        //The Camera
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translateZ(30);
        cmpCamera.pivot.rotateY(180);
        //The Viewport
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", snakeScene, cmpCamera, canvas);
        ƒ.Debug.log(viewport);
        viewport.draw();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 10);
    }
    function update() {
        let snakeEnd = snakeList.pop(); //get last Snakepart and delete it from the Array
        let currentHeadPos = snakeList[0].mtxLocal.translation; //get the position of the head of the snake
        let newhead = createSnakePart(); // create a new snake part
        newhead.cmpTransform.local.translate(new ƒ.Vector3(currentHeadPos.x + 1, currentHeadPos.y, 0)); //put the snakepart in front of snake
        snakeList.unshift(newhead); //add at the beginning of array
        snake.addChild(newhead); //add part to Scenegraph
        snake.removeChild(snakeEnd); //delet End from Scenegraph
        snake.cmpTransform.local.translate(new ƒ.Vector3(1, 0, 0));
        viewport.draw();
    }
    function createSnakePart() {
        let node = new ƒ.Node("Quad");
        let cmpMesh = new ƒ.ComponentMesh(mesh); //attache Mesh to Node
        cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.8));
        node.addComponent(cmpMesh); //Add Component into node component Map
        let cmpMat = new ƒ.ComponentMaterial(mtrSolidWhite); //attache Mesh to Node
        node.addComponent(cmpMat); //Add Component into node component Map
        node.addComponent(new ƒ.ComponentTransform());
        return node;
    }
})(SnakeGame || (SnakeGame = {}));
//# sourceMappingURL=main.js.map