namespace CityScene {
    import ƒ = FudgeCore;

    window.addEventListener("load", hndload)

    let viewport: ƒ.Viewport;
    let sceneNode: ƒ.Node;

    function hndload(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");

        ƒ.Debug.log(canvas);

        sceneNode = new ƒ.Node("WaldScene")

        let clrGround: ƒ.Color = new ƒ.Color(0.4, 0.8, 0.5, 1);
        let clrHouse: ƒ.Color = new ƒ.Color(0.5, 0.5, 0.5, 1);
        let clrHouseRoof: ƒ.Color = new ƒ.Color(1, 0, 0, 1);

        //Ground
        let groundMesh: ƒ.MeshCube = new ƒ.MeshCube();
        let cmpGroundMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(groundMesh);
        cmpGroundMesh.pivot.scale(new ƒ.Vector3(6, 0.5, 6));
        cmpGroundMesh.pivot.rotateX(90);
        sceneNode.addComponent(cmpGroundMesh);
        let groundMat: ƒ.Material = new ƒ.Material("clrGround", ƒ.ShaderUniColor, new ƒ.CoatColored(clrGround));
        let cmpGroundMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(groundMat);
        sceneNode.addComponent(cmpGroundMaterial);

        //House
        let houseNode: ƒ.Node = new ƒ.Node("house");

        let houseBaseNode: ƒ.Node = createCompleteMeshNode("housebase", new ƒ.Material("clrHouse", ƒ.ShaderUniColor, new ƒ.CoatColored(clrHouse)), new ƒ.MeshCube());
        let houseBaseMesh: ƒ.ComponentMesh = houseBaseNode.getComponent(ƒ.ComponentMesh);
        houseBaseMesh.pivot.translateY(0.5);

        let houseRoofNode: ƒ.Node = createCompleteMeshNode("houseRoof", new ƒ.Material("clrHouse", ƒ.ShaderUniColor, new ƒ.CoatColored(clrHouseRoof)), new ƒ.MeshPyramid());
        let houseRoofMesh: ƒ.ComponentMesh = houseRoofNode.getComponent(ƒ.ComponentMesh);
        houseRoofMesh.pivot.translate(new ƒ.Vector3(0,1,0));
        houseRoofMesh.pivot.scale(new ƒ.Vector3(1.2, 1, 1.2));

        houseNode.appendChild(houseBaseNode);
        houseNode.appendChild(houseRoofNode);

        sceneNode.appendChild(houseNode);


        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(0, 5, 8));
        cmpCamera.pivot.rotate(new ƒ.Vector3(30, 180, 0))

        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", sceneNode, cmpCamera, canvas);
        ƒ.Debug.log(viewport);

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
}