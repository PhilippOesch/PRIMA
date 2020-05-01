"use strict";
var SnakeGame;
(function (SnakeGame) {
    var ƒ = FudgeCore;
    window.addEventListener("load", hndload);
    let viewport; //viewport variable
    let snakeScene = new ƒ.Node("SnakeScene");
    let snake;
    let wantedDir;
    function hndload(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.RenderManager.initialize();
        ƒ.Debug.log(canvas);
        createWalls();
        snake = new SnakeGame.Snake();
        snakeScene.addChild(snake);
        spawnFood();
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
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 5);
    }
    function update() {
        if (wantedDir == 'up' && !snake.direction.equals(ƒ.Vector3.Y(-1))) {
            snake.direction = ƒ.Vector3.Y();
        }
        else if (wantedDir == 'down' && !snake.direction.equals(ƒ.Vector3.Y())) {
            snake.direction = ƒ.Vector3.Y(-1);
        }
        else if (wantedDir == 'left' && !snake.direction.equals(ƒ.Vector3.X())) {
            snake.direction = ƒ.Vector3.X(-1);
        }
        else if (wantedDir == 'right' && !snake.direction.equals(ƒ.Vector3.X(-1))) {
            snake.direction = ƒ.Vector3.X();
        }
        //check collision with the snake self
        if (snake.snakeSegmentList.length >= 4) {
            for (let i = 4; i < snake.snakeSegmentList.length; i++) {
                let segment = snake.snakeSegmentList[i];
                if (snake.isColliding(segment)) {
                    console.log("Collision");
                    gameover();
                }
            }
        }
        snake.move();
        viewport.draw();
    }
    function hndKeydown(_event) {
        switch (_event.code) {
            case ƒ.KEYBOARD_CODE.W:
                wantedDir = 'up';
                break;
            case ƒ.KEYBOARD_CODE.S:
                wantedDir = 'down';
                break;
            case ƒ.KEYBOARD_CODE.A:
                wantedDir = 'left';
                break;
            case ƒ.KEYBOARD_CODE.D:
                wantedDir = 'right';
                break;
        }
    }
    function gameover() {
        window.location.reload();
    }
    function createWalls() {
        let mesh = new ƒ.MeshQuad();
        let mtrSolidGrey = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("grey")));
        //Top Wall
        let topwall = new ƒ.Node("TopWall");
        let cmpTopWallMesh = new ƒ.ComponentMesh(mesh);
        cmpTopWallMesh.pivot.scale(new ƒ.Vector3(30, 2, 0));
        topwall.addComponent(cmpTopWallMesh);
        topwall.addComponent(new ƒ.ComponentMaterial(mtrSolidGrey));
        topwall.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, 10.5, 0))));
        //Bottom Wall
        let bottomwall = new ƒ.Node("BottomWall");
        let cmpBottomWallMesh = new ƒ.ComponentMesh(mesh);
        cmpBottomWallMesh.pivot.scale(new ƒ.Vector3(30, 2, 0));
        bottomwall.addComponent(cmpBottomWallMesh);
        bottomwall.addComponent(new ƒ.ComponentMaterial(mtrSolidGrey));
        bottomwall.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, -10.5, 0))));
        //Left Wall
        let leftwall = new ƒ.Node("LeftWall");
        let cmpLeftWallMesh = new ƒ.ComponentMesh(mesh);
        cmpLeftWallMesh.pivot.scale(new ƒ.Vector3(1, 22, 0));
        leftwall.addComponent(cmpLeftWallMesh);
        leftwall.addComponent(new ƒ.ComponentMaterial(mtrSolidGrey));
        leftwall.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-14, 0, 0))));
        //Right Wall
        let rightwall = new ƒ.Node("RightWall");
        let cmpRightWallMesh = new ƒ.ComponentMesh(mesh);
        cmpRightWallMesh.pivot.scale(new ƒ.Vector3(1, 22, 0));
        rightwall.addComponent(cmpRightWallMesh);
        rightwall.addComponent(new ƒ.ComponentMaterial(mtrSolidGrey));
        rightwall.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(14, 0, 0))));
        snakeScene.appendChild(rightwall);
        snakeScene.appendChild(leftwall);
        snakeScene.appendChild(topwall);
        snakeScene.appendChild(bottomwall);
    }
    function spawnFood() {
        let mesh = new ƒ.MeshQuad();
        let mtrSolidRed = new ƒ.Material("SolidRed", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("red")));
        let food = new ƒ.Node("Food");
        let cmpFoodMesh = new ƒ.ComponentMesh(mesh);
        food.addComponent(cmpFoodMesh);
        food.addComponent(new ƒ.ComponentMaterial(mtrSolidRed));
        let randomVector = getRandomVector();
        let checkPos = false;
        while (!checkPos) {
            checkPos = true;
            for (let position of snake.snakeSegmentList) {
                if (position.cmpTransform.local.translation.equals(randomVector)) {
                    checkPos = false;
                }
            }
            if (!checkPos) {
                randomVector = getRandomVector();
            }
        }
        console.log(randomVector);
        food.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(randomVector)));
        snakeScene.appendChild(food);
    }
    function getRandomVector() {
        let randomX = Math.floor(Math.random() * 14) + 0;
        randomX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        let randomY = Math.floor(Math.random() * 10) + 0;
        randomY *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        return new ƒ.Vector3(randomX, randomY, 0);
    }
})(SnakeGame || (SnakeGame = {}));
//# sourceMappingURL=main.js.map