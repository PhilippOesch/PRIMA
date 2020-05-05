"use strict";
var L03_SnakeMove;
(function (L03_SnakeMove) {
    var ƒ = FudgeCore;
    window.addEventListener("load", hndLoad);
    let snake;
    let directions;
    let wantedDir;
    let currentDirectionIndex; //Index for direction inside from direction Array
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.Debug.log(canvas);
        currentDirectionIndex = 1;
        directions = [ƒ.Vector3.Y(1), ƒ.Vector3.X(1), ƒ.Vector3.Y(-1), ƒ.Vector3.X(-1)];
        snake = new L03_SnakeMove.Snake();
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translateZ(30);
        cmpCamera.pivot.rotateY(180);
        L03_SnakeMove.viewport = new ƒ.Viewport();
        L03_SnakeMove.viewport.initialize("Viewport", snake, cmpCamera, canvas);
        ƒ.Debug.log(L03_SnakeMove.viewport);
        document.addEventListener("keydown", hndKeydown);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 10);
    }
    function update(_event) {
        if (wantedDir == 'right') {
            if ((currentDirectionIndex + 1) >= 4) {
                currentDirectionIndex = 0;
            }
            else {
                currentDirectionIndex++;
            }
            snake.direction = directions[currentDirectionIndex];
            wantedDir = '';
        }
        else if (wantedDir == 'left') {
            if ((currentDirectionIndex - 1) <= -1) {
                currentDirectionIndex = 3;
            }
            else {
                currentDirectionIndex--;
            }
            snake.direction = directions[currentDirectionIndex];
            wantedDir = '';
        }
        L03_SnakeMove.viewport.draw();
        snake.move();
        console.log("Loop");
        console.log(currentDirectionIndex);
    }
    function hndKeydown(_event) {
        switch (_event.code) {
            case ƒ.KEYBOARD_CODE.D:
                wantedDir = 'right';
                break;
            case ƒ.KEYBOARD_CODE.A:
                wantedDir = 'left';
                break;
            case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
                wantedDir = 'right';
                break;
            case ƒ.KEYBOARD_CODE.ARROW_LEFT:
                wantedDir = 'left';
                break;
        }
    }
})(L03_SnakeMove || (L03_SnakeMove = {}));
//# sourceMappingURL=Main.js.map