namespace HouseScene {
    import ƒ = FudgeCore;

    window.addEventListener("load", hndload)

    let viewport: ƒ.Viewport;
    let sceneNode: ƒ.Node;
    let canvas: HTMLCanvasElement;

    function hndload(_event: Event): void {
        canvas= document.querySelector("canvas");
        createScene();
        viewport.draw();
    }

    function createCompleteMeshNode(_name: string, _material: ƒ.Material, _mesh: ƒ.Mesh): ƒ.Node {
        let node: ƒ.Node = new ƒ.Node(_name);

        let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(_mesh);
        let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(_material);
        let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();

        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        node.addComponent(cmpTransform);
        return node;
    }

    function createScene(){
        let clrGround: ƒ.Color = new ƒ.Color(0.4, 0.8, 0.5, 1);
        let clrHouse: ƒ.Color = new ƒ.Color(0.5, 0.5, 0.5, 1);
        let clrHouseRoof: ƒ.Color = new ƒ.Color(1, 0, 0, 1);
        let clrStreet: ƒ.Color = new ƒ.Color(0.25, 0.25, 0.25, 1);

        //Ground
        sceneNode= createCompleteMeshNode("Ground", new ƒ.Material("clrGround", ƒ.ShaderUniColor, new ƒ.CoatColored(clrGround)), new ƒ.MeshCube());
        let groundMeshComp: ƒ.ComponentMesh= sceneNode.getComponent(ƒ.ComponentMesh);
        groundMeshComp.pivot.scale( new ƒ.Vector3(6, 0.5, 6));
        groundMeshComp.pivot.rotateX(90);

        //Street
        let streetNode: ƒ.Node = createCompleteMeshNode("street", new ƒ.Material("clrStreet", ƒ.ShaderUniColor, new ƒ.CoatColored(clrStreet)), new ƒ.MeshCube());
        let streetMeshComp: ƒ.ComponentMesh = streetNode.getComponent(ƒ.ComponentMesh);
        streetMeshComp.pivot.translate(new ƒ.Vector3(0, 0.3, 1.5));
        streetMeshComp.pivot.scale(new ƒ.Vector3(6, 0.1, 1.5));
        streetMeshComp.pivot.rotateX(-90);
        sceneNode.appendChild(streetNode);

        //House
        let houseNode: ƒ.Node = new ƒ.Node("house");

        //House Base
        let houseBaseNode: ƒ.Node = createCompleteMeshNode("housebase", new ƒ.Material("clrHouse", ƒ.ShaderUniColor, new ƒ.CoatColored(clrHouse)), new ƒ.MeshCube());
        let houseBaseMeshComp: ƒ.ComponentMesh = houseBaseNode.getComponent(ƒ.ComponentMesh);
        houseBaseMeshComp.pivot.translateY(0.5);
        houseNode.appendChild(houseBaseNode);

        //House Roof
        let houseRoofNode: ƒ.Node = createCompleteMeshNode("houseRoof", new ƒ.Material("clrHouse", ƒ.ShaderUniColor, new ƒ.CoatColored(clrHouseRoof)), new ƒ.MeshPyramid());
        let houseRoofMeshComp: ƒ.ComponentMesh = houseRoofNode.getComponent(ƒ.ComponentMesh);
        houseRoofMeshComp.pivot.translate(new ƒ.Vector3(0,1,0));
        houseRoofMeshComp.pivot.scale(new ƒ.Vector3(1.2, 1, 1.2));
        houseNode.appendChild(houseRoofNode);

        sceneNode.appendChild(houseNode);


        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(0, 5, 8));
        cmpCamera.pivot.rotate(new ƒ.Vector3(30, 180, 0))

        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", sceneNode, cmpCamera, canvas);
        ƒ.Debug.log(viewport);
    }
}