"use strict";
var SnakeGame;
(function (SnakeGame) {
    var ƒ = FudgeCore;
    window.addEventListener("load", hndload);
    let viewport; //viewport variable
    let snakeScene = new ƒ.Node("SnakeScene");
    let snake = new ƒ.Node("Snake");
    snake.addComponent(new ƒ.ComponentTransform());
    let Direction;
    (function (Direction) {
        Direction[Direction["Up"] = 1] = "Up";
        Direction[Direction["Down"] = 2] = "Down";
        Direction[Direction["Left"] = 3] = "Left";
        Direction[Direction["Right"] = 4] = "Right";
    })(Direction || (Direction = {})); //Enumiration for the different directions. Assign Keyword to a value
    let currentDirection; //current Snake Direction;
    let mesh;
    let mtrSolidWhite;
    let snakeList = new Array(); //array with snake parts
    function hndload(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.RenderManager.initialize();
        ƒ.Debug.log(canvas);
        mesh = new ƒ.MeshQuad();
        mtrSolidWhite = new ƒ.Material("SolidGreen", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("green")));
        currentDirection = Direction.Right;
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
        document.addEventListener("keydown", hndKeydown);
        viewport.draw();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 10);
    }
    function update() {
        let snakeEnd = snakeList.pop(); //get last Snakepart and delete it from the Array
        let currentHeadPos = snakeList[0].mtxLocal.translation; //get the position of the head of the snake
        let newhead = createSnakePart(); // create a new snake part
        switch (currentDirection) {
            case 1 /* Direction.Up */:
                newhead.cmpTransform.local.translate(new ƒ.Vector3(currentHeadPos.x, currentHeadPos.y + 1, 0));
                break;
            case 2 /* Direction.Down */:
                newhead.cmpTransform.local.translate(new ƒ.Vector3(currentHeadPos.x, currentHeadPos.y - 1, 0));
                break;
            case 3 /* Direction.Left */:
                newhead.cmpTransform.local.translate(new ƒ.Vector3(currentHeadPos.x - 1, currentHeadPos.y, 0));
                break;
            case 4 /* Direction.Right */:
                newhead.cmpTransform.local.translate(new ƒ.Vector3(currentHeadPos.x + 1, currentHeadPos.y, 0));
                break;
        }
        snakeList.unshift(newhead); //add part at the beginning of array
        snake.addChild(newhead); //add new part to snakenode
        snake.removeChild(snakeEnd); //delete End part from snakenode
        //snake.cmpTransform.local.translate(new ƒ.Vector3(1,0,0));
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
    function hndKeydown(_event) {
        //the snake cant do a 180 Degree turn so we need to check wheather the snake is moving the opposite direction
        if (_event.code == ƒ.KEYBOARD_CODE.W && currentDirection != 2 /* value for Direction.Down */) {
            currentDirection = 1;
        }
        if (_event.code == ƒ.KEYBOARD_CODE.S && currentDirection != 1 /* value for Direction.Up */) {
            currentDirection = 2;
        }
        if (_event.code == ƒ.KEYBOARD_CODE.A && currentDirection != 4 /* value for Direction.Right */) {
            currentDirection = 3;
        }
        if (_event.code == ƒ.KEYBOARD_CODE.D && currentDirection != 3 /* value for Direction.Left */) {
            currentDirection = 4;
        }
    }
})(SnakeGame || (SnakeGame = {}));
//# sourceMappingURL=main.js.map