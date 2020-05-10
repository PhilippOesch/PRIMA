"use strict";
var L05_Snake3DStart;
(function (L05_Snake3DStart) {
    var ƒ = FudgeCore;
    window.addEventListener("load", hndLoad);
    let scene;
    let snake;
    let playfield;
    let twoDPos;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.Debug.log(canvas);
        twoDPos = new ƒ.Vector2(-0.5, -0.5);
        scene = new ƒ.Node("scene");
        playfield = createSpielfeld();
        scene.appendChild(playfield);
        snake = new L05_Snake3DStart.Snake();
        playfield.cmpTransform.local.rotateY(20);
        playfield.cmpTransform.local.translateY(-2);
        playfield.appendChild(snake);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translateZ(30);
        cmpCamera.pivot.rotateY(180);
        L05_Snake3DStart.viewport = new ƒ.Viewport();
        L05_Snake3DStart.viewport.initialize("Viewport", scene, cmpCamera, canvas);
        ƒ.Debug.log(L05_Snake3DStart.viewport);
        // let axisVertical = new ƒ.Axis("Vertical", 1, ƒ.CONTROL_TYPE.PROPORTIONAL, true);
        // axisVertical.addControl(new ƒ.Control())
        document.addEventListener("keydown", control);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 5);
    }
    function update(_event) {
        L05_Snake3DStart.viewport.draw();
        if (twoDPos.x == 5.5) {
            snake.rotate(ƒ.Vector3.Y(90));
            playfield.cmpTransform.local.rotate(ƒ.Vector3.Y(-90));
            twoDPos.x = -5.5;
        }
        else if (twoDPos.x == -5.5) {
            snake.rotate(ƒ.Vector3.Y(-90));
            playfield.cmpTransform.local.rotate(ƒ.Vector3.Y(90));
            twoDPos.x = 5.5;
        }
        else if (twoDPos.y == -5.5) {
            snake.rotate(ƒ.Vector3.X(90));
            playfield.cmpTransform.local.rotate(ƒ.Vector3.X(-90));
            twoDPos.y = 5.5;
        }
        else if (twoDPos.y == 5.5) {
            snake.rotate(ƒ.Vector3.X(-90));
            playfield.cmpTransform.local.rotate(ƒ.Vector3.X(90));
            twoDPos.y = -5.5;
        }
        snake.move();
        twoDPos.add(snake.direction2D);
        console.log(twoDPos.x);
        //console.log("Loop");
    }
    function control(_event) {
        let direction;
        direction = ƒ.Keyboard.mapToValue(ƒ.Vector3.Y(), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.W]);
        direction.add(ƒ.Keyboard.mapToValue(ƒ.Vector3.Y(-1), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.S]));
        if (direction.y == 0) {
            direction = ƒ.Keyboard.mapToValue(ƒ.Vector3.X(), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.D]);
            direction.add(ƒ.Keyboard.mapToValue(ƒ.Vector3.X(-1), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.A]));
        }
        if (!direction.equals(ƒ.Vector3.ZERO())) {
            snake.direction = direction;
        }
        let rotation = ƒ.Vector3.ZERO();
        rotation = ƒ.Keyboard.mapToValue(ƒ.Vector3.Y(90), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        rotation.add(ƒ.Keyboard.mapToValue(ƒ.Vector3.Y(-90), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.ARROW_LEFT]));
        rotation.add(ƒ.Keyboard.mapToValue(ƒ.Vector3.X(90), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.ARROW_DOWN]));
        rotation.add(ƒ.Keyboard.mapToValue(ƒ.Vector3.X(-90), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.ARROW_UP]));
        snake.rotate(rotation);
        playfield.cmpTransform.local.rotate(rotation);
    }
    function createSpielfeld() {
        let mesh = new ƒ.MeshCube();
        let mtrSolidGrey = new ƒ.Material("SolidGrey", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));
        let feld = new ƒ.Node("Spielfeld");
        let cmpMesh = new ƒ.ComponentMesh(mesh);
        cmpMesh.pivot.scale(new ƒ.Vector3(10, 10, 10));
        let cmpMaterial = new ƒ.ComponentMaterial(mtrSolidGrey);
        let cmpTransform = new ƒ.ComponentTransform();
        feld.addComponent(cmpMesh);
        feld.addComponent(cmpMaterial);
        feld.addComponent(cmpTransform);
        return feld;
    }
})(L05_Snake3DStart || (L05_Snake3DStart = {}));
//# sourceMappingURL=Main.js.map