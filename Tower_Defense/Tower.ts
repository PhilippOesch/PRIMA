/// <reference path="Projectile.ts"/>

namespace TowerDefense {
    import ƒ = FudgeCore;

    export class Tower extends ƒ.Node {
        private position: ƒ.Vector3;
        private rate: number = 1000; //in ms
        private shootingInterval: number;
        private isShooting: boolean = false;
        private range: number = 10;

        constructor(_pos: ƒ.Vector3) {
            super("Tower");
            this.position = _pos;
            this.init();
        }

        public update(): void {
            this.follow();
        }

        public follow(): void {
            let enemy: Enemy = <Enemy>viewport.getGraph().getChildrenByName("Enemy")[0];

            if (enemy != undefined) {
                let distanceSquared: number = ƒ.Vector3.DIFFERENCE(this.mtxWorld.translation, enemy.mtxWorld.translation).magnitudeSquared;
                // console.log("Squared Distanze is:" + distanceSquared);
                if (distanceSquared < (this.range * this.range)) {
                    let enemyPos: ƒ.Vector3 = enemy.cmpTransform.local.translation.copy;
                    let cannon: ƒ.Node = this.getChildrenByName("Tower Cannon")[0];
                    if (cannon != null) {
                        cannon.cmpTransform.local.lookAt(enemyPos, ƒ.Vector3.Y());
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
            }  else if(this.isShooting){
                this.isShooting = false;
                clearInterval(this.shootingInterval);
            }

        }

        private fireProjectile = (): void => {
            let startingPos: ƒ.Matrix4x4 = this.getChildrenByName("Tower Cannon")[0].cmpTransform.local.copy;
            startingPos.translateY(1, false);

            let newProjectile: Projectile = new Projectile(startingPos.translation.copy, enemy);
            graph.appendChild(newProjectile);
        }

        private init(): void {
            this.createNodes();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
            // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.fireProjectile);
            // ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 1);
        }

        private createNodes(): void {
            let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            //let meshPyramid: ƒ.MeshPyramid= new ƒ.MeshPyramid();
            let meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere();
            let mtr: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.5, 0.5, 0.5)));
            let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));

            let base: ƒ.Node = new ƒ.Node("Tower Base");
            let baseMeshCmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(4, 0.5, 4));
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
            body.addComponent(bodyTransformation);
            this.appendChild(body);

            let cannon: ƒ.Node = new ƒ.Node("Tower Cannon");
            let cannonMeshCmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshSphere);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            cannon.addComponent(cannonMeshCmp);
            cannon.addComponent(new ƒ.ComponentMaterial(mtr));
            let cannonTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            cannonTransformation.local.translateY(3.3, false);
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

            let towerTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            towerTransformation.local.translate(this.position);
            this.addComponent(towerTransformation);
        }
    }
}