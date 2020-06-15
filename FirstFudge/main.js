"use strict";
var FirstFudge;
(function (FirstFudge) {
    var ƒ = FudgeCore;
    window.addEventListener("load", hndload);
    let viewport; //viewport variable
    function hndload(_event) {
        const canvas = document.querySelector("canvas");
        //ƒ.RenderManager.initialize();
        ƒ.Debug.log(canvas);
        //THe Node
        let node = new ƒ.Node("Quad"); //Node for our Object
        //The Mesh
        let mesh = new ƒ.MeshCube(); //Create a Quad Mesh
        let cmpMesh = new ƒ.ComponentMesh(mesh); //attache Mesh to Node
        node.addComponent(cmpMesh); //Add Component into node component Map
        //The Material
        let mtrSolidWhite = new ƒ.Material("SolidGreen", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("green")));
        let cmpMaterial = new ƒ.ComponentMaterial(mtrSolidWhite);
        node.addComponent(cmpMaterial);
        //The Camera
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translateZ(2);
        cmpCamera.pivot.translateY(-3);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.pivot.rotateX(-60);
        //The Viewport
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", node, cmpCamera, canvas);
        ƒ.Debug.log(viewport);
        viewport.draw();
    }
})(FirstFudge || (FirstFudge = {}));
//# sourceMappingURL=main.js.map