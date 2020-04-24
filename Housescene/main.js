"use strict";
var HouseScene;
(function (HouseScene) {
    var ƒ = FudgeCore;
    window.addEventListener("load", hndload);
    let viewport;
    let sceneNode;
    let canvas;
    function hndload(_event) {
        canvas = document.querySelector("canvas");
        createScene();
        viewport.draw();
    }
    function createCompleteMeshNode(_name, _material, _mesh) {
        let node = new ƒ.Node(_name);
        let cmpMesh = new ƒ.ComponentMesh(_mesh);
        let cmpMaterial = new ƒ.ComponentMaterial(_material);
        let cmpTransform = new ƒ.ComponentTransform();
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        node.addComponent(cmpTransform);
        return node;
    }
    function createScene() {
        let clrGround = new ƒ.Color(0.4, 0.8, 0.5, 1);
        let clrHouse = new ƒ.Color(0.5, 0.5, 0.5, 1);
        let clrHouseRoof = new ƒ.Color(1, 0, 0, 1);
        let clrStreet = new ƒ.Color(0.25, 0.25, 0.25, 1);
        //Ground
        sceneNode = createCompleteMeshNode("Ground", new ƒ.Material("clrGround", ƒ.ShaderUniColor, new ƒ.CoatColored(clrGround)), new ƒ.MeshCube());
        let groundMeshComp = sceneNode.getComponent(ƒ.ComponentMesh);
        groundMeshComp.pivot.scale(new ƒ.Vector3(6, 0.5, 6));
        groundMeshComp.pivot.rotateX(90);
        //Street
        let streetNode = createCompleteMeshNode("street", new ƒ.Material("clrStreet", ƒ.ShaderUniColor, new ƒ.CoatColored(clrStreet)), new ƒ.MeshCube());
        let streetMeshComp = streetNode.getComponent(ƒ.ComponentMesh);
        streetMeshComp.pivot.translate(new ƒ.Vector3(0, 0.3, 1.5));
        streetMeshComp.pivot.scale(new ƒ.Vector3(6, 0.1, 1.5));
        streetMeshComp.pivot.rotateX(-90);
        sceneNode.appendChild(streetNode);
        //House
        let houseNode = new ƒ.Node("house");
        //House Base
        let houseBaseNode = createCompleteMeshNode("housebase", new ƒ.Material("clrHouse", ƒ.ShaderUniColor, new ƒ.CoatColored(clrHouse)), new ƒ.MeshCube());
        let houseBaseMeshComp = houseBaseNode.getComponent(ƒ.ComponentMesh);
        houseBaseMeshComp.pivot.translateY(0.5);
        houseNode.appendChild(houseBaseNode);
        //House Roof
        let houseRoofNode = createCompleteMeshNode("houseRoof", new ƒ.Material("clrHouse", ƒ.ShaderUniColor, new ƒ.CoatColored(clrHouseRoof)), new ƒ.MeshPyramid());
        let houseRoofMeshComp = houseRoofNode.getComponent(ƒ.ComponentMesh);
        houseRoofMeshComp.pivot.translate(new ƒ.Vector3(0, 1, 0));
        houseRoofMeshComp.pivot.scale(new ƒ.Vector3(1.2, 1, 1.2));
        houseNode.appendChild(houseRoofNode);
        sceneNode.appendChild(houseNode);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(0, 5, 8));
        cmpCamera.pivot.rotate(new ƒ.Vector3(30, 180, 0));
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", sceneNode, cmpCamera, canvas);
        ƒ.Debug.log(viewport);
    }
})(HouseScene || (HouseScene = {}));
//# sourceMappingURL=main.js.map