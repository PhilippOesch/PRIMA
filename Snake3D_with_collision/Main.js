"use strict";
var Snake3D;
(function (Snake3D) {
    var ƒ = FudgeCore;
    //import ƒAid = FudgeAid;
    class Snake extends ƒ.Node {
        constructor(_name, _material = new ƒ.Material("SnakeMaterial", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")))) {
            super(_name);
            this.dirCurrent = ƒ.Vector3.X();
            console.log("Creating Snake");
            this.mesh = new ƒ.MeshCube();
            this.material = _material;
            this.grow(4);
            this.head = this.getChild(0);
            this.collisionSphere = new Snake3D.CollisionSphere(this.head);
        }
        move() {
            this.dirCurrent = this.dirNew || this.dirCurrent;
            let child = this.head;
            let cmpPrev = child.getComponent(ƒ.ComponentTransform);
            let mtxHead;
            while (true) {
                mtxHead = cmpPrev.local.copy;
                mtxHead.translate(this.dirCurrent);
                if (Math.abs(mtxHead.translation.x) < Snake3D.size + 1 && Math.abs(mtxHead.translation.y) < Snake3D.size + 1 && Math.abs(mtxHead.translation.z) < Snake3D.size + 1)
                    break;
                this.rotate(ƒ.Vector3.Z(-90));
            }
            let cmpNew = new ƒ.ComponentTransform(mtxHead);
            for (let segment of this.getChildren()) {
                cmpPrev = segment.getComponent(ƒ.ComponentTransform);
                segment.removeComponent(cmpPrev);
                segment.addComponent(cmpNew);
                cmpNew = cmpPrev;
            }
        }
        set direction(_new) {
            if (this.dirCurrent.equals(ƒ.Vector3.SCALE(_new, -1)))
                return;
            console.log(this.dirCurrent, _new);
            this.dirNew = _new;
        }
        rotate(_rotation) {
            this.head.mtxLocal.rotate(_rotation);
        }
        createSegment() {
            let segment = new ƒ.Node("Segment");
            let cmpMesh = new ƒ.ComponentMesh(this.mesh);
            segment.addComponent(cmpMesh);
            cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.8));
            let cmpMaterial = new ƒ.ComponentMaterial(this.material);
            segment.addComponent(cmpMaterial);
            let mtxSegment = new ƒ.Matrix4x4();
            if (this.nChildren)
                mtxSegment = this.getChild(this.nChildren - 1).mtxLocal.copy;
            segment.addComponent(new ƒ.ComponentTransform(mtxSegment));
            return segment;
        }
        grow(_nSegments) {
            if (_nSegments < 0)
                return;
            for (let i = 0; i < _nSegments; i++) {
                let segment = this.createSegment();
                this.appendChild(segment);
            }
        }
    }
    Snake3D.Snake = Snake;
})(Snake3D || (Snake3D = {}));
/// <reference path="Snake.ts"/>
var Snake3D;
/// <reference path="Snake.ts"/>
(function (Snake3D) {
    var ƒ = FudgeCore;
    class AISnake extends Snake3D.Snake {
        constructor() {
            var material = new ƒ.Material("AISnakeMaterial", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("Orange")));
            super("AISnake", material);
            this.awarenessArea = new Snake3D.AwarenesArea(14, this.head);
        }
        move() {
            //get food Objects inside detection Area
            let inAwarenesArea = this.getFoodInArea();
            let closest = null;
            let child = this.head;
            //get nearest Food Object
            if (inAwarenesArea != undefined) {
                inAwarenesArea.forEach((value) => {
                    if (closest == null) {
                        closest = value;
                    }
                    else if (this.getDistance(value.mtxLocal.translation, child.mtxLocal.translation) < this.getDistance(closest.mtxLocal.translation, child.mtxLocal.translation)) {
                        closest = value;
                    }
                });
            }
            let goRightPos = child.mtxLocal.copy;
            goRightPos.rotate(ƒ.Vector3.Y(-90));
            goRightPos.translate(this.dirCurrent);
            if (!(Math.abs(goRightPos.translation.x) < Snake3D.size + 1 && Math.abs(goRightPos.translation.y) < Snake3D.size + 1 && Math.abs(goRightPos.translation.z) < Snake3D.size + 1))
                goRightPos.rotate(ƒ.Vector3.Z(-90));
            let goLeftPos = child.mtxLocal.copy;
            goLeftPos.rotate(ƒ.Vector3.Y(90));
            goLeftPos.translate(this.dirCurrent);
            if (!(Math.abs(goLeftPos.translation.x) < Snake3D.size + 1 && Math.abs(goLeftPos.translation.y) < Snake3D.size + 1 && Math.abs(goLeftPos.translation.z) < Snake3D.size + 1))
                goLeftPos.rotate(ƒ.Vector3.Z(-90));
            let goStreightPos = child.mtxLocal.copy;
            goStreightPos.translate(this.dirCurrent);
            if (!(Math.abs(goStreightPos.translation.x) < Snake3D.size + 1 && Math.abs(goStreightPos.translation.y) < Snake3D.size + 1 && Math.abs(goStreightPos.translation.z) < Snake3D.size + 1))
                goStreightPos.rotate(ƒ.Vector3.Z(-90));
            //Check Collision in new Pos
            let goRightCollision = this.isCollidingwithItself(goRightPos.translation);
            let goLeftCollision = this.isCollidingwithItself(goLeftPos.translation);
            let goStreightCollision = this.isCollidingwithItself(goStreightPos.translation);
            let direction = "";
            if (closest != null) {
                // let goRightDist: number = this.getDistance(closest.mtxLocal.translation, goRightPos.translation);
                // let goLeftDist: number = this.getDistance(closest.mtxLocal.translation, goLeftPos.translation);
                // let goStreightDist: number = this.getDistance(closest.mtxLocal.translation, goStreightPos.translation);
                let sorted = Array(goRightPos.translation, goLeftPos.translation, goStreightPos.translation);
                sorted.sort((a, b) => {
                    let aDistance = this.getDistance(closest.mtxLocal.translation, a);
                    let bDistance = this.getDistance(closest.mtxLocal.translation, b);
                    if (aDistance < bDistance) {
                        return -1;
                    }
                    if (aDistance > bDistance) {
                        return 1;
                    }
                    return 1;
                });
                console.dir(sorted);
                for (let value of sorted) {
                    if ((value.equals(goStreightPos.translation) && !goStreightCollision)) {
                        direction = "streight";
                    }
                    else if ((value.equals(goRightPos.translation) && !goRightCollision)) {
                        direction = "right";
                    }
                    else if ((value.equals(goLeftPos.translation) && !goLeftCollision)) {
                        direction = "left";
                    }
                    if (direction !== "") {
                        break;
                    }
                }
                //just selecting way to closest food
                // if(sorted[0].equals(goStreightPos.translation)){
                //     direction= "streight";
                // } else if(sorted[0].equals(goLeftPos.translation)){
                //     direction= "left";
                // } else if(sorted[0].equals(goRightPos.translation)){
                //     direction= "right";
                // }
            }
            else {
                if (!goStreightCollision) {
                    direction = "streight";
                }
                else if (!goLeftCollision) {
                    direction = "left";
                }
                else if (!goRightCollision) {
                    direction = "right";
                }
            }
            if (direction == "right") {
                this.rotate(ƒ.Vector3.Y(-90));
            }
            if (direction == "left") {
                this.rotate(ƒ.Vector3.Y(90));
            }
            let cmpPrev = child.getComponent(ƒ.ComponentTransform);
            let mtxHead;
            while (true) {
                mtxHead = cmpPrev.local.copy;
                mtxHead.translate(this.dirCurrent);
                if (Math.abs(mtxHead.translation.x) < Snake3D.size + 1 && Math.abs(mtxHead.translation.y) < Snake3D.size + 1 && Math.abs(mtxHead.translation.z) < Snake3D.size + 1)
                    break;
                this.rotate(ƒ.Vector3.Z(-90));
            }
            let cmpNew = new ƒ.ComponentTransform(mtxHead);
            for (let segment of this.getChildren()) {
                cmpPrev = segment.getComponent(ƒ.ComponentTransform);
                segment.removeComponent(cmpPrev);
                segment.addComponent(cmpNew);
                cmpNew = cmpPrev;
            }
        }
        getFoodInArea() {
            let objectsInArea = new Array();
            Snake3D.graph.getChildrenByName("Food").forEach(value => {
                if (this.awarenessArea.isColliding(value)) {
                    objectsInArea.push(value);
                }
            });
            // console.log(objectsInArea);
            return objectsInArea;
        }
        getDistance(_input1, _input2) {
            let xval = Math.abs(_input1.x - _input2.x);
            let yval = Math.abs(_input1.y - _input2.y);
            let zval = Math.abs(_input1.z - _input2.z);
            return Math.sqrt((xval * xval) + (yval * yval) + (zval * zval));
        }
        isCollidingwithItself(_input) {
            let checkcollision = false;
            this.getChildren().forEach((value, index) => {
                if (index > 2 && value.mtxLocal.translation.isInsideSphere(_input, 0.4)) {
                    checkcollision = true;
                    return;
                }
            });
            return checkcollision;
        }
    }
    Snake3D.AISnake = AISnake;
})(Snake3D || (Snake3D = {}));
var Snake3D;
(function (Snake3D) {
    var ƒ = FudgeCore;
    class CollisionSphere {
        constructor(_parentnode) {
            this.parentnode = _parentnode;
        }
        isColliding(_inputObject) {
            let snakeHeadPos = this.parentnode.cmpTransform.local.translation;
            let snakeHeadScale = this.parentnode.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            let inputPos = _inputObject.mtxLocal.translation;
            let inputScale = _inputObject.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            let xval = Math.abs(snakeHeadPos.x - inputPos.x);
            let yval = Math.abs(snakeHeadPos.y - inputPos.y);
            let zval = Math.abs(snakeHeadPos.z - inputPos.z);
            let distance = Math.sqrt((xval * xval) + (yval * yval) + (zval * zval));
            if (distance < (snakeHeadScale.x / 2 + inputScale.x / 2)) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    Snake3D.CollisionSphere = CollisionSphere;
})(Snake3D || (Snake3D = {}));
/// <reference path="CollisionSphere.ts"/>
var Snake3D;
/// <reference path="CollisionSphere.ts"/>
(function (Snake3D) {
    var ƒ = FudgeCore;
    class AwarenesArea extends Snake3D.CollisionSphere {
        constructor(_size, _parentNode) {
            super(_parentNode);
            this.size = _size;
        }
        isColliding(_inputObject) {
            let snakeHeadPos = this.parentnode.cmpTransform.local.translation;
            let snakeHeadScale = this.size;
            let inputPos = _inputObject.mtxLocal.translation;
            let inputScale = _inputObject.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            let xval = Math.abs(snakeHeadPos.x - inputPos.x);
            let yval = Math.abs(snakeHeadPos.y - inputPos.y);
            let zval = Math.abs(snakeHeadPos.z - inputPos.z);
            let distance = Math.sqrt((xval * xval) + (yval * yval) + (zval * zval));
            if (distance < (snakeHeadScale / 2 + inputScale.x / 2)) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    Snake3D.AwarenesArea = AwarenesArea;
})(Snake3D || (Snake3D = {}));
var Snake3D;
(function (Snake3D) {
    var ƒ = FudgeCore;
    class Food extends ƒ.Node {
        constructor() {
            super("Food");
            this.init(Snake3D.size);
            this.collisionSphere = new Snake3D.CollisionSphere(this);
        }
        init(size) {
            let position = new ƒ.Vector3(ƒ.Random.default.getRangeFloored(-size, size), ƒ.Random.default.getRangeFloored(-size, size), ƒ.Random.default.getSign() * size);
            position.shuffle();
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("Food", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("RED")))));
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube()));
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(position)));
        }
    }
    Snake3D.Food = Food;
})(Snake3D || (Snake3D = {}));
var Snake3D;
(function (Snake3D) {
    var ƒ = FudgeCore;
    //import ƒAid = FudgeAid;
    window.addEventListener("load", hndLoad);
    Snake3D.size = 10;
    let food;
    let snake;
    let aISnake;
    //let cosys: ƒAid.NodeCoordinateSystem = new ƒAid.NodeCoordinateSystem("ControlSystem");
    ƒ.RenderManager.initialize(true);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.Debug.log(canvas);
        Snake3D.graph = new ƒ.Node("Game");
        snake = new Snake3D.Snake("PlayerSnake");
        snake.rotate(ƒ.Vector3.Y(180));
        Snake3D.graph.addChild(snake);
        aISnake = new Snake3D.AISnake();
        Snake3D.graph.addChild(aISnake);
        console.log(snake);
        let foodAmount = 30;
        for (var i = 0; i < foodAmount; i++) {
            createNewFood();
        }
        //cosys.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(10))));
        // graph.addChild(cosys);
        createCube();
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(5, 10, 40));
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        // cmpCamera.pivot.rotateY(180);
        Snake3D.viewport = new ƒ.Viewport();
        Snake3D.viewport.initialize("Viewport", Snake3D.graph, cmpCamera, canvas);
        ƒ.Debug.log(Snake3D.viewport);
        let cmpLightAmbient = new ƒ.ComponentLight(new ƒ.LightAmbient(new ƒ.Color(0.2, 0.2, 0.2)));
        let cmpLightDirectional = new ƒ.ComponentLight(new ƒ.LightDirectional(new ƒ.Color(1, 1, 1)));
        let cmp2LightDirectional = new ƒ.ComponentLight(new ƒ.LightDirectional(new ƒ.Color(1, 1, 1)));
        cmpLightDirectional.pivot.lookAt(new ƒ.Vector3(10, -15, -5));
        cmp2LightDirectional.pivot.lookAt(new ƒ.Vector3(-10, 15, 5));
        Snake3D.graph.addComponent(cmpLightAmbient);
        Snake3D.graph.addComponent(cmpLightDirectional);
        Snake3D.graph.addComponent(cmp2LightDirectional);
        document.addEventListener("keydown", control);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 7);
    }
    function update(_event) {
        collisionDetection();
        snake.move();
        aISnake.move();
        moveCamera();
        Snake3D.viewport.draw();
    }
    function moveCamera() {
        let posCamera = aISnake.head.cmpTransform.local.translation.copy;
        posCamera.normalize(70);
        Snake3D.viewport.camera.pivot.translation = posCamera;
        // let transformation: ƒ.Vector3= ƒ.Vector3.TRANSFORMATION(ƒ.Vector3.X(), aISnake.head.mtxLocal, false);
        Snake3D.viewport.camera.pivot.lookAt(ƒ.Vector3.ZERO());
        //console.log(transformation);
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
        console.log(rotation);
        // cosys.mtxLocal.rotate(rotation);
    }
    function collisionDetection() {
        for (let i = 3; i < snake.getChildren().length; i++) {
            let segment = snake.getChildren()[i];
            if (snake.collisionSphere.isColliding(segment)) {
                console.log("Collision");
                gameover();
            }
        }
        for (let i = 3; i < aISnake.getChildren().length; i++) {
            let segment = aISnake.getChildren()[i];
            if (aISnake.collisionSphere.isColliding(segment)) {
                console.log("Collision");
                gameover();
            }
        }
        Snake3D.graph.getChildrenByName("Food").forEach((value) => {
            if (snake.collisionSphere.isColliding(value)) {
                Snake3D.graph.removeChild(value);
                createNewFood();
                snake.grow(1);
            }
            if (aISnake.collisionSphere.isColliding(value)) {
                Snake3D.graph.removeChild(value);
                createNewFood();
                aISnake.grow(1);
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
            newFood = new Snake3D.Food();
            for (let snakeSegment of aISnake.getChildren()) {
                if (newFood != null && newFood.collisionSphere.isColliding(snakeSegment)) {
                    checkCollision = false;
                    return;
                }
            }
            Snake3D.graph.getChildrenByName("Food").forEach((value) => {
                if (newFood != null && newFood.collisionSphere.isColliding(value)) {
                    checkCollision = false;
                    return;
                }
            });
        } while (!checkCollision);
        food = newFood;
        Snake3D.graph.appendChild(food);
    }
    function createCube() {
        let mesh = new ƒ.MeshCube();
        let mtrPlayfield = new ƒ.Material("playfield", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.4, 0.4, 0.6, 0.5)));
        let cube = new ƒ.Node("playfield");
        cube.addComponent(new ƒ.ComponentMesh(mesh));
        cube.addComponent(new ƒ.ComponentMaterial(mtrPlayfield));
        cube.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE((Snake3D.size * 2) - 1))));
        Snake3D.graph.addChild(cube);
    }
})(Snake3D || (Snake3D = {}));
//# sourceMappingURL=main.js.map