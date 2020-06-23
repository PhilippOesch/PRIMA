/// <reference path="Tower.ts"/>

namespace TowerDefense {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class ITower extends Tower {
        shootingInterval2: any;
        isShooting2: boolean = false;
        cannon1RelPos: ƒ.Vector3;
        cannon2RelPos: ƒ.Vector3;
        protected xScale: number;
        protected zScale: number;

        public follow(): void {

            let targetedEnemy1: Enemy = <Enemy>this.getClosestEnemyOfNode(this.getChildrenByName("Tower Cannon")[0]);
            let targetedEnemy2: Enemy = <Enemy>this.getClosestEnemyOfNode(this.getChildrenByName("Tower2 Cannon")[0]);
            let cannon1: ƒ.Node = this.getChildrenByName("Tower Cannon")[0];
            let cannon2: ƒ.Node = this.getChildrenByName("Tower2 Cannon")[0];

            //let enemy: Enemy = <Enemy>enemies.getChildrenByName("Enemy")[0];
            //this.targetAnEnemy(targetedEnemy2, cannon2, this.isShooting2, this.shootingInterval2);

            if (targetedEnemy1 != undefined) {
                let distanceSquared: number = ƒ.Vector3.DIFFERENCE(cannon1.mtxWorld.translation, targetedEnemy1.mtxWorld.translation).magnitudeSquared;

                // console.log("Squared Distanze is:" + distanceSquared);
                if (distanceSquared < (this.range * this.range)) {
                    let enemyPos: ƒ.Vector3 = targetedEnemy1.mtxWorld.translation.copy;
                    enemyPos.add(this.cannon1RelPos);
                    enemyPos.subtract(cannon1.mtxWorld.translation); //Adjust Direction to point at the right pos
                    if (cannon1 != null) {
                        cannon1.mtxLocal.lookAt(enemyPos, ƒ.Vector3.Y());
                    }
                    if (!this.isShooting) {
                        this.shootingInterval = setInterval(() => this.fireProjectile(cannon1, targetedEnemy1), this.rate);
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


            if (targetedEnemy2 != undefined) {
                let distanceSquare2: number = ƒ.Vector3.DIFFERENCE(cannon2.mtxWorld.translation, targetedEnemy2.mtxWorld.translation).magnitudeSquared;

                // console.log("Squared Distanze is:" + distanceSquared);
                if (distanceSquare2 < (this.range * this.range)) {
                    let enemyPos: ƒ.Vector3 = targetedEnemy2.mtxWorld.translation.copy;
                    enemyPos.add(this.cannon2RelPos);
                    enemyPos.subtract(cannon2.mtxWorld.translation); //Adjust Direction to point at the right pos
                    if (cannon2 != null) {
                        cannon2.mtxLocal.lookAt(enemyPos, ƒ.Vector3.Y());
                    }
                    if (!this.isShooting2) {
                        this.shootingInterval2 = setInterval(() => this.fireProjectile(cannon2, targetedEnemy2), this.rate);
                        this.isShooting2 = true;
                    }
                } else {
                    if (this.isShooting2) {
                        clearInterval(this.shootingInterval2);
                        this.isShooting2 = false;
                    }
                }
            } else if (this.isShooting2) {
                this.isShooting2 = false;
                clearInterval(this.shootingInterval2);
            }
        }

        protected init(): void {
            this.range = 12;
            this.cannon1RelPos = ƒ.Vector3.X(-4);
            this.cannon2RelPos = ƒ.Vector3.X(4);
            this.xScale = 12;
            this.zScale = 4;
            this.createNodes();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
            this.addComponent(new ComponentPicker(1));
        }

        protected createNodes(): void {
            let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            //let meshPyramid: ƒ.MeshPyramid= new ƒ.MeshPyramid();
            let meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere();
            let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));

            let base: ƒAid.Node = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.IDENTITY(), this.mtr, meshCube);
            let baseMeshCmp: ƒ.ComponentMesh = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(this.xScale, 0.5, this.zScale));
            this.appendChild(base);

            let body: ƒAid.Node = new ƒAid.Node("Tower Body", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(0.5)), this.mtr, meshCube);
            let bodyMeshCmp: ƒ.ComponentMesh = body.getComponent(ƒ.ComponentMesh);
            bodyMeshCmp.pivot.scale(new ƒ.Vector3(1.5, 4, 1.5));
            let bodyTransformation: ƒ.ComponentTransform = body.getComponent(ƒ.ComponentTransform);
            bodyTransformation.local.translate(this.cannon1RelPos);
            this.appendChild(body);

            let body2: ƒAid.Node = new ƒAid.Node("Tower Body", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(0.5)), this.mtr, meshCube);
            let body2MeshCmp: ƒ.ComponentMesh = body2.getComponent(ƒ.ComponentMesh);
            body2MeshCmp.pivot.scale(new ƒ.Vector3(1.5, 4, 1.5));
            let body2Transformation: ƒ.ComponentTransform = body2.getComponent(ƒ.ComponentTransform);
            body2Transformation.local.translate(this.cannon2RelPos);
            this.appendChild(body2);

            let cannon: ƒAid.Node = new ƒAid.Node("Tower Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(3.3)), this.mtr, meshSphere);
            let cannonMeshCmp: ƒ.ComponentMesh = cannon.getComponent(ƒ.ComponentMesh);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            let cannonTransformation: ƒ.ComponentTransform = cannon.getComponent(ƒ.ComponentTransform);
            cannonTransformation.local.translate(this.cannon1RelPos);
            this.appendChild(cannon);

            let cannon2: ƒAid.Node = new ƒAid.Node("Tower2 Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(3.3)), this.mtr, meshSphere);
            let cannon2MeshCmp: ƒ.ComponentMesh = cannon2.getComponent(ƒ.ComponentMesh);
            cannon2MeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            let cannon2Transformation: ƒ.ComponentTransform = cannon2.getComponent(ƒ.ComponentTransform);
            cannon2Transformation.local.translate(this.cannon2RelPos);
            this.appendChild(cannon2);

            let cannonBarrel: ƒAid.Node = new ƒAid.Node("Canon Barrel", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(1)), mtrCannon, meshCube);
            let cannonBarrelMeshCmp: ƒ.ComponentMesh = cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 2));
            cannon.appendChild(cannonBarrel);

            let cannon2Barrel: ƒAid.Node = new ƒAid.Node("Canon2 Barrel", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(1)), mtrCannon, meshCube);
            let cannon2BarrelMeshCmp: ƒ.ComponentMesh = cannon2Barrel.getComponent(ƒ.ComponentMesh);
            cannon2BarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 2));
            cannon2.appendChild(cannon2Barrel);

            let towerTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            this.addComponent(towerTransformation);
        }


        protected getClosestEnemyOfNode(_node: ƒ.Node): Enemy {
            let enemiesArray: Array<Enemy> = enemies.getChildren().map((value) => {
                return <Enemy>value;
            });

            if (enemiesArray.length != 0) {
                enemiesArray.sort((a, b) => {
                    let aTranslation: ƒ.Vector3 = _node.mtxWorld.getTranslationTo(a.mtxWorld);
                    let aDistance: number = aTranslation.magnitudeSquared;
                    let bTranslation: ƒ.Vector3 = _node.mtxWorld.getTranslationTo(b.mtxWorld);
                    let bDistance: number = bTranslation.magnitudeSquared;

                    if (aDistance < bDistance) {
                        return -1;
                    }
                    if (aDistance > bDistance) {
                        return 1;
                    }

                    return 0;
                });

                return enemiesArray[0];
            } else {
                return null;
            }

        }
    }
}