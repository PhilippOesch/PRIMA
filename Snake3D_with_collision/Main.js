"use strict";
var L06_Snake3D_HeadControl;
(function (L06_Snake3D_HeadControl) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("load", hndLoad);
    let snake;
    let graph;
    let food;
    let cosys = new ƒAid.NodeCoordinateSystem("ControlSystem");
    ƒ.RenderManager.initialize(true);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.Debug.log(canvas);
        graph = new ƒ.Node("Game");
        snake = new L06_Snake3D_HeadControl.Snake();
        graph.addChild(snake);
        for (var i = 0; i < 10; i++) {
            createNewFood();
        }
        cosys.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(10))));
        // graph.addChild(cosys);
        createCube();
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(5, 10, 40));
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        // cmpCamera.pivot.rotateY(180);
        L06_Snake3D_HeadControl.viewport = new ƒ.Viewport();
        L06_Snake3D_HeadControl.viewport.initialize("Viewport", graph, cmpCamera, canvas);
        ƒ.Debug.log(L06_Snake3D_HeadControl.viewport);
        let cmpLightAmbient = new ƒ.ComponentLight(new ƒ.LightAmbient(new ƒ.Color(0.2, 0.2, 0.2)));
        let cmpLightDirectional = new ƒ.ComponentLight(new ƒ.LightDirectional(new ƒ.Color(1, 1, 1)));
        let cmp2LightDirectional = new ƒ.ComponentLight(new ƒ.LightDirectional(new ƒ.Color(1, 1, 1)));
        cmpLightDirectional.pivot.lookAt(new ƒ.Vector3(10, -15, -5));
        cmp2LightDirectional.pivot.lookAt(new ƒ.Vector3(-10, 15, 5));
        graph.addComponent(cmpLightAmbient);
        graph.addComponent(cmpLightDirectional);
        graph.addComponent(cmp2LightDirectional);
        document.addEventListener("keydown", control);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 5);
    }
    function update(_event) {
        collisionDetection();
        snake.move();
        moveCamera();
        L06_Snake3D_HeadControl.viewport.draw();
    }
    function moveCamera() {
        let posCamera = snake.head.mtxLocal.translation;
        posCamera.normalize(50);
        L06_Snake3D_HeadControl.viewport.camera.pivot.translation = posCamera;
        let transformation = ƒ.Vector3.TRANSFORMATION(ƒ.Vector3.X(), snake.getChildren()[0].mtxLocal, false);
        L06_Snake3D_HeadControl.viewport.camera.pivot.lookAt(ƒ.Vector3.ZERO());
        console.log(transformation);
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
            case ƒ.KEYBOARD_CODE.D:
                rotation = ƒ.Vector3.Y(-90);
                break;
            case ƒ.KEYBOARD_CODE.ARROW_LEFT:
                rotation = ƒ.Vector3.Y(90);
                break;
            case ƒ.KEYBOARD_CODE.A:
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
    function collisionDetection() {
        for (let i = 3; i < snake.getChildren().length; i++) {
            let segment = snake.getChildren()[i];
            if (snake.isColliding(segment)) {
                console.log("Collision");
                gameover();
            }
        }
        graph.getChildrenByName("Food").forEach((value) => {
            if (snake.isColliding(value)) {
                graph.removeChild(value);
                createNewFood();
                snake.addNewSnakePart();
            }
        });
        // if ( food!=null && snake.isColliding(food)) {
        //   graph.removeChild(food);
        //   createNewFood();
        //   snake.addNewSnakePart();
        // }
    }
    function gameover() {
        //window.location.reload();
        ƒ.Loop.stop();
    }
    function createNewFood() {
        let newFood;
        let checkCollision;
        do {
            checkCollision = true;
            newFood = new L06_Snake3D_HeadControl.Food();
            for (let snakeSegments of snake.getChildren()) {
                if (newFood != null && newFood.isColliding(snakeSegments)) {
                    checkCollision = false;
                    return;
                }
            }
            graph.getChildrenByName("Food").forEach((value) => {
                if (newFood != null && newFood.isColliding(value)) {
                    checkCollision = false;
                    return;
                }
            });
        } while (!checkCollision);
        food = newFood;
        graph.appendChild(food);
    }
    function createCube() {
        let cube = new ƒAid.Node("Cube", ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(25)), new ƒ.Material("Cube", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.4, 0.4, 0.6, 0.5))), new ƒ.MeshCube());
        graph.addChild(cube);
    }
})(L06_Snake3D_HeadControl || (L06_Snake3D_HeadControl = {}));
//# sourceMappingURL=Main.js.map