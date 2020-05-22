namespace Snake3D {
    import ƒ = FudgeCore;

    export class Food extends ƒ.Node {
        public collisionSphere: CollisionSphere;

        constructor() {
            super("Food");
            this.init(13);
            this.collisionSphere= new CollisionSphere(this);
        }

        private init(size: number): void{
            let position: ƒ.Vector3 = new ƒ.Vector3(
                ƒ.Random.default.getRangeFloored(-size, size),
                ƒ.Random.default.getRangeFloored(-size, size),
                ƒ.Random.default.getSign() * size
              );
              position.shuffle();

            this.addComponent(new ƒ.ComponentMaterial( new ƒ.Material("Food", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("RED")))));
            this.addComponent( new ƒ.ComponentMesh(new ƒ.MeshCube()));
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(position)));

        }
    }
}