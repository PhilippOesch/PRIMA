/// <reference path="Projectile.ts"/>

namespace TowerDefense {
    import ƒ = FudgeCore;

    export class Tower extends ƒ.Node {
        protected position: ƒ.Vector3;
        protected rate: number = 1000; //in ms
        protected shootingInterval: number;
        protected isShooting: boolean = false;
        protected range: number = 12;
        protected targetedEnemy: Enemy;

        constructor(_pos: ƒ.Vector3) {
            super("Tower");
            this.position = _pos;
            this.init();
        }

        public update(): void {
            this.follow();
        }

        
        public rotate(_rotation: ƒ.Vector3): void{
            this.cmpTransform.local.rotate(_rotation);
        }

        public follow(): void {

            this.targetedEnemy = this.getClosestEnemy();

            //let enemy: Enemy = <Enemy>enemies.getChildrenByName("Enemy")[0];

            if (this.targetedEnemy != undefined) {
                let distanceSquared: number = ƒ.Vector3.DIFFERENCE(this.mtxWorld.translation, this.targetedEnemy.mtxWorld.translation).magnitudeSquared;

                // console.log("Squared Distanze is:" + distanceSquared);
                if (distanceSquared < (this.range * this.range)) {
                    let enemyPos: ƒ.Vector3 = this.targetedEnemy.mtxWorld.translation.copy;
                    let cannon: ƒ.Node = this.getChildrenByName("Tower Cannon")[0];
                    enemyPos.subtract(cannon.mtxWorld.translation); //Adjust Direction to point at the right pos
                    if (cannon != null) {
                        cannon.mtxLocal.lookAt(enemyPos, ƒ.Vector3.Y());
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

        protected fireProjectile = (): void => {
            let startingPos: ƒ.Matrix4x4 = this.getChildrenByName("Tower Cannon")[0].mtxWorld.copy;

            let newProjectile: Projectile = new Projectile(startingPos.translation.copy, this.targetedEnemy);
            viewport.getGraph().appendChild(newProjectile);
        }

        protected init(): void {
            this.createNodes();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
            // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.fireProjectile);
            // ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 1);
        }

        protected createNodes(): void {
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

        protected getClosestEnemy(): Enemy {
            let enemiesArray: Array<Enemy> = enemies.getChildren().map((value) => {
                return <Enemy>value;
            });

            if (enemiesArray.length != 0) {
                enemiesArray.sort((a, b) => {
                    let aTranslation: ƒ.Vector3 = this.mtxWorld.getTranslationTo(a.mtxWorld);
                    let aDistance: number = aTranslation.magnitudeSquared;
                    let bTranslation: ƒ.Vector3 = this.mtxWorld.getTranslationTo(b.mtxWorld);
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

        protected calculateRelativeMatrix(_matrix: ƒ.Matrix4x4, _relativeTo: ƒ.Matrix4x4): ƒ.Matrix4x4 {
            let result: ƒ.Matrix4x4;
            result = ƒ.Matrix4x4.INVERSION(_relativeTo);
            result = ƒ.Matrix4x4.MULTIPLICATION(result, _matrix);
            return result;
          }
    }
}