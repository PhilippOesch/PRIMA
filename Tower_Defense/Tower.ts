/// <reference path="Projectile.ts"/>

namespace TowerDefense{
    import ƒ = FudgeCore;

    export class Tower extends ƒ.Node{
        private position: ƒ.Vector3
        private rate: number= 1000; //in ms
        private shootingInterval: number;

        constructor(_pos: ƒ.Vector3){
            super("Tower");
            this.position= _pos
            this.init();
        }

        private init(): void{
            this.createNodes();
            this.shootingInterval= setInterval(this.fireProjectile, this.rate)
            console.log(this.shootingInterval);
        }

        private createNodes(): void{ 
            let meshCube: ƒ.MeshCube= new ƒ.MeshCube();
            //let meshPyramid: ƒ.MeshPyramid= new ƒ.MeshPyramid();
            let meshSphere: ƒ.MeshSphere= new ƒ.MeshSphere();   
            let mtr: ƒ.Material= new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.4, 0.4, 0.4)));

            let base: ƒ.Node= new ƒ.Node("Tower Base");
            let baseMeshCmp: ƒ.ComponentMesh= new ƒ.ComponentMesh(meshCube)
            baseMeshCmp.pivot.scale(new ƒ.Vector3(4, 0.5, 4))
            base.addComponent(baseMeshCmp);
            base.addComponent(new ƒ.ComponentMaterial(mtr));
            let baseTransformation= new ƒ.ComponentTransform();
            base.addComponent(baseTransformation);
            this.appendChild(base);

            let body: ƒ.Node= new ƒ.Node("Tower Body");
            let bodyMeshCmp: ƒ.ComponentMesh= new ƒ.ComponentMesh(meshCube)
            bodyMeshCmp.pivot.scale(new ƒ.Vector3(2, 4, 2))
            body.addComponent(bodyMeshCmp);
            body.addComponent(new ƒ.ComponentMaterial(mtr));
            let bodyTransformation= new ƒ.ComponentTransform();
            bodyTransformation.local.translate(ƒ.Vector3.Y(0.5));
            body.addComponent(bodyTransformation);
            this.appendChild(body);

            let cannon: ƒ.Node= new ƒ.Node("Tower Cannon");
            let cannonMeshCmp: ƒ.ComponentMesh= new ƒ.ComponentMesh(meshSphere);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            cannon.addComponent(cannonMeshCmp);
            cannon.addComponent(new ƒ.ComponentMaterial(mtr));
            let cannonTransformation= new ƒ.ComponentTransform();
            cannonTransformation.local.translateY(3.3, false);
            cannon.addComponent(cannonTransformation);
            this.appendChild(cannon);

            let cannonBarrel: ƒ.Node= new ƒ.Node("Canon Barrel");
            let cannonBarrelMeshCmp= new ƒ.ComponentMesh(meshCube)
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 2));
            cannonBarrel.addComponent(cannonBarrelMeshCmp);
            cannonBarrel.addComponent(new ƒ.ComponentMaterial(mtr));
            let cannonBarrelTransformation= new ƒ.ComponentTransform();
            cannonBarrelTransformation.local.translateZ(1);
            cannonBarrel.addComponent(cannonBarrelTransformation);
            cannon.appendChild(cannonBarrel);

            let towerTransformation: ƒ.ComponentTransform= new ƒ.ComponentTransform();
            towerTransformation.local.translate(this.position);
            this.addComponent(towerTransformation);
        }

        public update(): void{
            let enemyPos= enemy.cmpTransform.local.translation.copy;
            let cannon= this.getChildrenByName("Tower Cannon")[0];
            if(cannon!= null){
                cannon.cmpTransform.local.lookAt(enemyPos);
            }
        }

        fireProjectile = () => {
            let enemyPos: ƒ.Matrix4x4= enemy.cmpTransform.local.copy;
            let startingPos: ƒ.Matrix4x4= this.getChildrenByName("Tower Cannon")[0].cmpTransform.local.copy;
            startingPos.translateY(1, false)
            console.log(startingPos.translation);
            let direction: ƒ.Vector3= startingPos.getTranslationTo(enemyPos);
            direction.normalize();

            let newProjectile= new Projectile(startingPos.translation.copy, direction)
            graph.appendChild(newProjectile);
        }
    }
}