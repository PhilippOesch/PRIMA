/// <reference path="Tower.ts"/>
namespace TowerDefense{
    export class ITower extends Tower{

        public follow(): void {

            this.targetedEnemy = this.getClosestEnemy();

            //let enemy: Enemy = <Enemy>enemies.getChildrenByName("Enemy")[0];

            if (this.targetedEnemy != undefined) {
                let distanceSquared: number = ƒ.Vector3.DIFFERENCE(this.mtxWorld.translation, this.targetedEnemy.mtxWorld.translation).magnitudeSquared;

                // console.log("Squared Distanze is:" + distanceSquared);
                if (distanceSquared < (this.range * this.range)) {
                    let enemyPos: ƒ.Vector3 = this.targetedEnemy.mtxLocal.translation.copy;
                    let cannon: ƒ.Node = this.getChildrenByName("Tower Cannon")[0];
                    let cannon2: ƒ.Node = this.getChildrenByName("Tower2 Cannon")[0];
                    enemyPos.subtract(this.mtxWorld.translation.copy); //Adjust Direction to point at the right pos //Adjust Direction to point at the right pos
                    if (cannon != null) {
                        cannon.mtxLocal.lookAt(enemyPos, ƒ.Vector3.Y());
                        cannon2.mtxLocal.lookAt(enemyPos, ƒ.Vector3.Y());
                    }
                    if (!this.isShooting) {
                        this.shootingInterval = setInterval(this.fireProjectile, this.rate);
                        this.isShooting = true;
                    }
                } else {
                    if (this.isShooting) {
                        clearInterval(this.shootingInterval);
                        this.isShooting = false;
                    }
                }
            } else if (this.isShooting) {
                this.isShooting = false;
                clearInterval(this.shootingInterval);

            }

        }

        protected init(){
            this.createNodes();
            this.range= 16;
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
        }

        protected fireProjectile = (): void => {
            let startingPos: ƒ.Matrix4x4 = this.getChildrenByName("Tower Cannon")[0].mtxWorld.copy;
            let startingPos2: ƒ.Matrix4x4 = this.getChildrenByName("Tower2 Cannon")[0].mtxWorld.copy;

            let newProjectile: Projectile = new Projectile(startingPos.translation.copy, this.targetedEnemy);
            let newProjectile2: Projectile = new Projectile(startingPos2.translation.copy, this.targetedEnemy);
            viewport.getGraph().appendChild(newProjectile);
            viewport.getGraph().appendChild(newProjectile2);
        }

        protected createNodes(): void {
            let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            //let meshPyramid: ƒ.MeshPyramid= new ƒ.MeshPyramid();
            let meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere();
            let mtr: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.3, 0.3, 0.3)));
            let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));

            let base: ƒ.Node = new ƒ.Node("Tower Base");
            let baseMeshCmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
            baseMeshCmp.pivot.translate(ƒ.Vector3.X(2));
            baseMeshCmp.pivot.scale(new ƒ.Vector3(16, 0.5, 4));
            base.addComponent(baseMeshCmp);
            base.addComponent(new ƒ.ComponentMaterial(mtr));
            let baseTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            base.addComponent(baseTransformation);
            this.appendChild(base);

            let body: ƒ.Node = new ƒ.Node("Tower Body");
            let bodyMeshCmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
            bodyMeshCmp.pivot.scale(new ƒ.Vector3(2, 4, 2));
            body.addComponent(bodyMeshCmp);
            body.addComponent(new ƒ.ComponentMaterial(mtr));
            let bodyTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            bodyTransformation.local.translate(ƒ.Vector3.Y(0.5));
            bodyTransformation.local.translate(ƒ.Vector3.X(-2));
            body.addComponent(bodyTransformation);
            this.appendChild(body);

            let cannon: ƒ.Node = new ƒ.Node("Tower Cannon");
            let cannonMeshCmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshSphere);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            cannon.addComponent(cannonMeshCmp);
            cannon.addComponent(new ƒ.ComponentMaterial(mtr));
            let cannonTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            cannonTransformation.local.translateY(3.3, false);
            cannonTransformation.local.translate(ƒ.Vector3.X(-2));
            cannon.addComponent(cannonTransformation);
            this.appendChild(cannon);

            let cannonBarrel: ƒ.Node = new ƒ.Node("Canon Barrel");
            let cannonBarrelMeshCmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 2));
            cannonBarrel.addComponent(cannonBarrelMeshCmp);
            cannonBarrel.addComponent(new ƒ.ComponentMaterial(mtrCannon));
            let cannonBarrelTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            cannonBarrelTransformation.local.translateZ(1);
            cannonBarrel.addComponent(cannonBarrelTransformation);
            cannon.appendChild(cannonBarrel);

            let body2: ƒ.Node = new ƒ.Node("Tower Body");
            let body2MeshCmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
            body2MeshCmp.pivot.scale(new ƒ.Vector3(2, 4, 2));
            body2.addComponent(body2MeshCmp);
            body2.addComponent(new ƒ.ComponentMaterial(mtr));
            let body2Transformation: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            body2Transformation.local.translate(ƒ.Vector3.Y(0.5));
            body2Transformation.local.translate(ƒ.Vector3.X(6));
            body2.addComponent(body2Transformation);
            this.appendChild(body2);

            let cannon2: ƒ.Node = new ƒ.Node("Tower2 Cannon");
            let cannon2MeshCmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshSphere);
            cannon2MeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            cannon2.addComponent(cannon2MeshCmp);
            cannon2.addComponent(new ƒ.ComponentMaterial(mtr));
            let cannon2Transformation: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            cannon2Transformation.local.translateY(3.3, false);
            cannon2Transformation.local.translateX(6);
            cannon2.addComponent(cannon2Transformation);
            this.appendChild(cannon2);

            let cannon2Barrel: ƒ.Node = new ƒ.Node("Canon Barrel");
            let cannon2BarrelMeshCmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
            cannon2BarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 2));
            cannon2Barrel.addComponent(cannon2BarrelMeshCmp);
            cannon2Barrel.addComponent(new ƒ.ComponentMaterial(mtrCannon));
            let cannon2BarrelTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            cannon2BarrelTransformation.local.translateZ(1);
            cannon2Barrel.addComponent(cannon2BarrelTransformation);
            cannon2.appendChild(cannon2Barrel);

            let towerTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            towerTransformation.local.translate(this.position);
            this.addComponent(towerTransformation);
        }
    }
}