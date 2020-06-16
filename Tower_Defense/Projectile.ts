namespace TowerDefense{
    import ƒ = FudgeCore;

    export class Projectile extends ƒ.Node{
        startingposition: ƒ.Vector3;
        direction: ƒ.Vector3;
        speed: number;

        constructor(_pos: ƒ.Vector3, _dir: ƒ.Vector3, _speed: number= 2){
            super("Projectile");
            this.startingposition= _pos;
            this.direction= _dir;
            this.speed= _speed;
            this.init();
            console.log("Projectile created")
        }

        private init(){
            this.createObject();
            projectiles.add(this);
        }

        private createObject(){
            let mesh: ƒ.MeshSphere= new ƒ.MeshSphere();
            let mtrPlayfield: ƒ.Material= new ƒ.Material("projectileMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));

            let meshCmp: ƒ.ComponentMesh= new ƒ.ComponentMesh(mesh)
            meshCmp.pivot.scale(ƒ.Vector3.ONE(0.3))
            this.addComponent(meshCmp);
            this.addComponent(new ƒ.ComponentMaterial(mtrPlayfield));

            let transformationComponent: ƒ.ComponentTransform= new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.startingposition));
            this.addComponent(transformationComponent);

            graph.appendChild(this);
        }

        public update(){
            let movement: ƒ.Vector3= this.direction.copy
            movement.normalize(this.speed);
            this.cmpTransform.local.translate(movement);
        }
    }
}