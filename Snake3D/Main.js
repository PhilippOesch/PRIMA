"use strict";
var L05_Snake3DStart;
(function (L05_Snake3DStart) {
    var ƒ = FudgeCore;
    window.addEventListener("load", hndLoad);
    let scene;
    let snake;
    let playfield;
    let cmpCamera;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.Debug.log(canvas);
        scene = new ƒ.Node("scene");
        playfield = createSpielfeld();
        scene.appendChild(playfield);
        snake = new L05_Snake3DStart.Snake();
        playfield.cmpTransform.local.rotateY(20);
        playfield.cmpTransform.local.translateY(-2);
        playfield.appendChild(snake);
        cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(5, 10, 40));
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
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
        moveCamera();
        collisionDetection();
        snake.move();
    }
    function control(_event) {
        // let direction: ƒ.Vector3;
        // direction = ƒ.Keyboard.mapToValue(ƒ.Vector3.Y(), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.W]);
        // direction.add(ƒ.Keyboard.mapToValue(ƒ.Vector3.Y(-1), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.S]));
        // if (direction.y == 0) {
        //   direction = ƒ.Keyboard.mapToValue(ƒ.Vector3.X(), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.D]);
        //   direction.add(ƒ.Keyboard.mapToValue(ƒ.Vector3.X(-1), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.A]));
        // }
        // if (!direction.equals(ƒ.Vector3.ZERO()))
        //   snake.direction = direction;
        let rotation = ƒ.Vector3.ZERO();
        switch (_event.code) {
            case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
                rotation = ƒ.Vector3.Y(-90);
                break;
            case ƒ.KEYBOARD_CODE.ARROW_LEFT:
                rotation = ƒ.Vector3.Y(90);
                break;
            case ƒ.KEYBOARD_CODE.SPACE:
                rotation = ƒ.Vector3.Z(-90);
                break;
            default:
                return;
        }
        snake.rotate(rotation);
        // cosys.mtxLocal.rotate(rotation);
    }
    function createSpielfeld() {
        let mesh = new ƒ.MeshCube();
        let mtrSolidGrey = new ƒ.Material("SolidGrey", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("GREY")));
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
    function gameover() {
        window.location.reload();
    }
    function moveCamera() {
        let posCamera = ƒ.Vector3.NORMALIZATION(snake.getChildren()[0].mtxLocal.translation, 30);
        L05_Snake3DStart.viewport.camera.pivot.translation = posCamera;
        L05_Snake3DStart.viewport.camera.pivot.lookAt(ƒ.Vector3.ZERO());
    }
    function collisionDetection() {
        for (let i = 3; i < snake.getChildren().length; i++) {
            let segment = snake.getChildren()[i];
            if (snake.isColliding(segment)) {
                console.log("Collision");
                gameover();
            }
        }
    }
})(L05_Snake3DStart || (L05_Snake3DStart = {}));
//# sourceMappingURL=Main.js.map