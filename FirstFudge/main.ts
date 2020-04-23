namespace FirstFudge {
    import ƒ= FudgeCore;

    window.addEventListener("load", hndload)

    let viewport: ƒ.Viewport;    //viewport variable

    function hndload(_event: Event):void {
        const canvas: HTMLCanvasElement= document.querySelector("canvas");
        //ƒ.RenderManager.initialize();
        ƒ.Debug.log(canvas);

        //THe Node
        let node: ƒ.Node= new ƒ.Node("Quad"); //Node for our Object

        //The Mesh
        let mesh: ƒ.MeshCube= new ƒ.MeshCube(); //Create a Quad Mesh
        let cmpMesh: ƒ.ComponentMesh= new ƒ.ComponentMesh(mesh); //attache Mesh to Node
        node.addComponent(cmpMesh); //Add Component into node component Map
        
        //The Material
        let mtrSolidWhite: ƒ.Material= new ƒ.Material("SolidGreen", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("green")));
        let cmpMaterial: ƒ.ComponentMaterial= new ƒ.ComponentMaterial(mtrSolidWhite);
        node.addComponent(cmpMaterial);

        //The Camera
        let cmpCamera: ƒ.ComponentCamera= new ƒ.ComponentCamera();
        cmpCamera.pivot.translateZ(2);
        cmpCamera.pivot.translateY(-3);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.pivot.rotateX(-60);

        //The Viewport
        viewport= new ƒ.Viewport();
        viewport.initialize("Viewport", node, cmpCamera, canvas);
        ƒ.Debug.log(viewport);

        viewport.draw();
    }
}