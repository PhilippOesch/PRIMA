"use strict";
var HouseScene;
(function (HouseScene) {
    var ƒ = FudgeCore;
    window.addEventListener("load", hndload);
    let viewport;
    let sceneNode;
    let canvas;
    let scenecamera;
    function hndload(_event) {
        canvas = document.querySelector("canvas");
        createScene();
        document.addEventListener("keydown", hndKeydown);
        viewport.draw();
    }
    function createScene() {
        let clrGround = new ƒ.Color(0.4, 0.8, 0.5, 1);
        let clrHouse = new ƒ.Color(0.5, 0.5, 0.5, 1);
        let clrHouseRoof = new ƒ.Color(1, 0, 0, 1);
        let clrStreet = new ƒ.Color(0.25, 0.25, 0.25, 1);
        //Ground
        sceneNode = createCompleteMeshNode("Ground", new ƒ.Material("clrGround", ƒ.ShaderUniColor, new ƒ.CoatColored(clrGround)), new ƒ.MeshCube(), new ƒ.Vector3(6, 0.5, 6));
        //sceneNode.addComponent(new ƒ.ComponentTransform());
        //Street
        let streetNode = createCompleteMeshNode("street", new ƒ.Material("clrStreet", ƒ.ShaderUniColor, new ƒ.CoatColored(clrStreet)), new ƒ.MeshCube(), new ƒ.Vector3(6, 0.1, 1.5));
        let streetTransform = streetNode.getComponent(ƒ.ComponentTransform);
        streetTransform.local.translate(new ƒ.Vector3(0, 0.3, 1.5));
        sceneNode.appendChild(streetNode);
        //House
        let houseNode = new ƒ.Node("house");
        let cmphouseTransform = new ƒ.ComponentTransform();
        cmphouseTransform.local.translateY(0.25);
        houseNode.addComponent(cmphouseTransform);
        //House Base
        let houseBaseNode = createCompleteMeshNode("housebase", new ƒ.Material("clrHouse", ƒ.ShaderUniColor, new ƒ.CoatColored(clrHouse)), new ƒ.MeshCube());
        let houseBaseTransform = houseBaseNode.getComponent(ƒ.ComponentTransform);
        houseBaseTransform.local.translateY(0.5);
        houseNode.appendChild(houseBaseNode);
        //House Roof
        let houseRoofNode = createCompleteMeshNode("houseRoof", new ƒ.Material("clrHouse", ƒ.ShaderUniColor, new ƒ.CoatColored(clrHouseRoof)), new ƒ.MeshPyramid());
        let cmpHouseRoofTransform = houseRoofNode.getComponent(ƒ.ComponentTransform);
        cmpHouseRoofTransform.local.translateY(1);
        cmpHouseRoofTransform.local.scale(new ƒ.Vector3(1.2, 1, 1.2));
        houseNode.appendChild(houseRoofNode);
        sceneNode.appendChild(houseNode);
        // let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        // cmpCamera.pivot.translate(new ƒ.Vector3(0, 0, 8));
        // cmpCamera.pivot.lookAt(new ƒ.Vector3(0, 0, 0));
        // cmpCamera.projectCentral(1, 45, ƒ.FIELD_OF_VIEW.DIAGONAL);
        //cmpCamera.pivot.rotate(new ƒ.Vector3(30, 180, 0));
        scenecamera = createCamera(new ƒ.Vector3(0, 5, 8));
        viewport = new ƒ.Viewport();
        // -viewport.initialize("Viewport", sceneNode, cmpCamera, canvas);
        viewport.initialize("Viewport", sceneNode, scenecamera.getComponent(ƒ.ComponentCamera), canvas);
        ƒ.Debug.log(viewport);
    }
    function createCompleteMeshNode(_name, _material, _mesh, _scale = new ƒ.Vector3(1, 1, 1)) {
        let node = new ƒ.Node(_name);
        let cmpMesh = new ƒ.ComponentMesh(_mesh);
        cmpMesh.pivot.scale(_scale);
        let cmpMaterial = new ƒ.ComponentMaterial(_material);
        let cmpTransform = new ƒ.ComponentTransform();
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        node.addComponent(cmpTransform);
        return node;
    }
    // function createCamera(_translate: ƒ.Vector3 = new ƒ.Vector3(0, 5, 8), _lookAt: ƒ.Vector3 = new ƒ.Vector3()): ƒ.Node {
    //     let camera: ƒ.Node = new ƒ.Node("camera");
    //     let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
    //     cmpTransform.local.translate(_translate);
    //     cmpTransform.local.lookAt(_lookAt)
    //     camera.addComponent(cmpTransform);
    //     let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    //     cmpCamera.projectCentral(1, 45, ƒ.FIELD_OF_VIEW.DIAGONAL);
    //     camera.addComponent(cmpCamera);
    //     return camera;
    // }
    function createCamera(_translate = new ƒ.Vector3(0, 0, 0), _lookAt = new ƒ.Vector3(0, 0, 0)) {
        let camera = new ƒ.Node("camera");
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(_translate);
        cmpCamera.pivot.lookAt(_lookAt);
        cmpCamera.projectCentral(1, 45, ƒ.FIELD_OF_VIEW.DIAGONAL);
        camera.addComponent(cmpCamera);
        return camera;
    }
    function hndKeydown(_event) {
        //switch for diffrent Keyboard keys
        switch (_event.code) {
            case ƒ.KEYBOARD_CODE.A:
                sceneNode.cmpTransform.local.rotate(new ƒ.Vector3(0, 2, 0)); //Arrow-Up moves up the right paddle by 0.3 units
                break;
            case ƒ.KEYBOARD_CODE.D:
                sceneNode.cmpTransform.local.rotate(new ƒ.Vector3(0, -2, 0)); //Arrow-Down moves down the right paddle by 0.3 units
                break;
        }
        //ƒ.RenderManager.update(); //not working
        viewport.draw(); //update the viewport
    }
})(HouseScene || (HouseScene = {}));
//# sourceMappingURL=main.js.map