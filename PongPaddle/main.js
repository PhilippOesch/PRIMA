"use strict";
var PongPaddle;
(function (PongPaddle) {
    var ƒ = FudgeCore; //import FudgeCore as ƒ
    window.addEventListener("load", hndload); //add hndload to load Event, happening when page is loading
    let viewport; //refenence
    let ball = new ƒ.Node("Ball"); //reference to Ball node
    let paddleLeft = new ƒ.Node("PaddleLeft"); //reference to Left Paddle Node
    let paddleRight = new ƒ.Node("PaddleRight"); //reference to Right Paddle Node
    //Loading Handler
    function hndload() {
        const canvas = document.querySelector("canvas"); //reference to Canvas Element
        ƒ.RenderManager.initialize(); //Initialize RenderingContext of WebGL
        ƒ.Debug.log(canvas); //use of Fudge Debugger
        //pong scene
        let pong = createPong(); //the root Node of this scene
        //Camera
        let cmpCamera = new ƒ.ComponentCamera(); //the Camera initialization
        cmpCamera.pivot.translateZ(42); //moves Camera up bei 42 units
        cmpCamera.pivot.rotateY(180); //rotate the Camera on the Y-Axis by 180 degrees to show towards the Center
        paddleRight.cmpTransform.local.translateX(20); //move Right Paddle 20 units on the x-axis so it is on the right side of the screen
        paddleLeft.cmpTransform.local.translateX(-20); //move Left Paddle -20 units on the x-axis so it is on the left side of the screen
        //make both paddles wider by 4 units
        paddleLeft.getComponent(ƒ.ComponentMesh).pivot.scaleY(4);
        paddleRight.getComponent(ƒ.ComponentMesh).pivot.scaleY(4);
        viewport = new ƒ.Viewport(); //create Viewport
        viewport.initialize("Viewport", pong, cmpCamera, canvas); //initialize Viewport
        ƒ.Debug.log(viewport); //Debug Viewport
        document.addEventListener("keydown", hndKeydown);
        viewport.draw(); //draw the Viewport
    }
    //creates Objects inside Scene
    function createPong() {
        let pong = new ƒ.Node("Pong"); //init Pong Node
        let mtrSolidWhite = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE"))); //white solid material
        let meshQuad = new ƒ.MeshQuad(); //Quad Mesh
        //give all Objects a Mesh (all quads)
        ball.addComponent(new ƒ.ComponentMesh(meshQuad));
        paddleLeft.addComponent(new ƒ.ComponentMesh(meshQuad));
        paddleRight.addComponent(new ƒ.ComponentMesh(meshQuad));
        //give all Objects a Material (all white)
        ball.addComponent(new ƒ.ComponentMaterial(mtrSolidWhite));
        paddleLeft.addComponent(new ƒ.ComponentMaterial(mtrSolidWhite));
        paddleRight.addComponent(new ƒ.ComponentMaterial(mtrSolidWhite));
        //give all Objects a Transform Component
        ball.addComponent(new ƒ.ComponentTransform());
        paddleLeft.addComponent(new ƒ.ComponentTransform());
        paddleRight.addComponent(new ƒ.ComponentTransform());
        //add Objects to root Node
        pong.appendChild(ball);
        pong.appendChild(paddleLeft);
        pong.appendChild(paddleRight);
        return pong;
    }
    //Handler for Keyboard Event
    function hndKeydown(_event) {
        //switch for diffrent Keyboard keys
        switch (_event.code) {
            case ƒ.KEYBOARD_CODE.ARROW_UP:
                paddleRight.cmpTransform.local.translate(new ƒ.Vector3(0, 0.3, 0)); //Arrow-Up moves up the right paddle
                break;
            case ƒ.KEYBOARD_CODE.ARROW_DOWN:
                paddleRight.cmpTransform.local.translate(ƒ.Vector3.Y(-0.3)); //Arrow-Down moves down the right paddle
                break;
            case ƒ.KEYBOARD_CODE.W:
                paddleLeft.cmpTransform.local.translate(new ƒ.Vector3(0, 0.3, 0)); //W moves up the right paddle
                break;
            case ƒ.KEYBOARD_CODE.S:
                paddleLeft.cmpTransform.local.translate(ƒ.Vector3.Y(-0.3)); //S moves down the right paddle
                break;
        }
        //ƒ.RenderManager.update();
        viewport.draw(); //update the viewport
    }
})(PongPaddle || (PongPaddle = {}));
//# sourceMappingURL=main.js.map