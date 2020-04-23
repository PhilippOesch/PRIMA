"use strict";
var CityScene;
(function (CityScene) {
    var ƒ = FudgeCore;
    window.addEventListener("load", hndload);
    let viewport;
    let sceneNode;
    function hndload(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.Debug.log(canvas);
        sceneNode = new ƒ.Node("WaldScene");
        let clrGround = new ƒ.Color(0.4, 0.8, 0.5, 1);
        let clrHouse = new ƒ.Color(0.5, 0.5, 0.5, 1);
        let clrHouseRoof = new ƒ.Color(1, 0, 0, 1);
        //Ground
        let groundMesh = new ƒ.MeshCube();
        let cmpGroundMesh = new ƒ.ComponentMesh(groundMesh);
        cmpGroundMesh.pivot.scale(new ƒ.Vector3(6, 0.5, 6));
        cmpGroundMesh.pivot.rotateX(90);
        sceneNode.addComponent(cmpGroundMesh);
        let groundMat = new ƒ.Material("clrGround", ƒ.ShaderUniColor, new ƒ.CoatColored(clrGround));
        let cmpGroundMaterial = new ƒ.ComponentMaterial(groundMat);
        sceneNode.addComponent(cmpGroundMaterial);
        //House
        let houseNode = new ƒ.Node("house");
        let houseBaseNode = createCompleteMeshNode("housebase", new ƒ.Material("clrHouse", ƒ.ShaderUniColor, new ƒ.CoatColored(clrHouse)), new ƒ.MeshCube());
        let houseBaseMesh = houseBaseNode.getComponent(ƒ.ComponentMesh);
        houseBaseMesh.pivot.translateY(0.5);
        let houseRoofNode = createCompleteMeshNode("houseRoof", new ƒ.Material("clrHouse", ƒ.ShaderUniColor, new ƒ.CoatColored(clrHouseRoof)), new ƒ.MeshPyramid());
        let houseRoofMesh = houseRoofNode.getComponent(ƒ.ComponentMesh);
        houseRoofMesh.pivot.translate(new ƒ.Vector3(0, 1, 0));
        houseRoofMesh.pivot.scale(new ƒ.Vector3(1.2, 1, 1.2));
        houseNode.appendChild(houseBaseNode);
        houseNode.appendChild(houseRoofNode);
        sceneNode.appendChild(houseNode);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(0, 5, 8));
        cmpCamera.pivot.rotate(new ƒ.Vector3(30, 180, 0));
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", sceneNode, cmpCamera, canvas);
        ƒ.Debug.log(viewport);
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
})(CityScene || (CityScene = {}));
//# sourceMappingURL=main.js.map