/// <reference path="Projectile.ts"/>

namespace TowerDefense {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Tower extends ƒ.Node {
        mtr: ƒ.Material;

        protected position: ƒ.Vector3;
        protected rate: number = 1000; //in ms
        protected shootingInterval: number;
        protected isShooting: boolean = false;
        protected range: number = 14;
        protected targetedEnemy: Enemy;

        constructor(_pos: ƒ.Vector3, 
                    _material: ƒ.Material= new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.5, 0.5, 0.5)))) {
            super("Tower");
            this.position = _pos;
            this.mtr= _material;
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
                        this.shootingInterval = setInterval(() => this.fireProjectile(cannon, this.targetedEnemy), this.rate);
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

        protected fireProjectile = (_node: ƒ.Node, _enemy: Enemy): void => {
            let startingPos: ƒ.Matrix4x4 = _node.mtxWorld.copy;

            let newProjectile: Projectile = new Projectile(startingPos.translation.copy, _enemy);
            viewport.getGraph().appendChild(newProjectile);
        }

        protected init(): void {
            this.createNodes();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
        }

        protected createNodes(): void {
            let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere();
            let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));

            let base: ƒAid.Node= new ƒAid.Node("Tower Base", ƒ.Matrix4x4.IDENTITY(), this.mtr, meshCube);
            let baseMeshCmp: ƒ.ComponentMesh= base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(4, 0.5, 4));
            this.appendChild(base);

            let body: ƒAid.Node= new ƒAid.Node("Tower Body", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(0.5)), this.mtr, meshCube);
            let bodyMeshCmp: ƒ.ComponentMesh= body.getComponent(ƒ.ComponentMesh);
            bodyMeshCmp.pivot.scale(new ƒ.Vector3(2, 4, 2));
            this.appendChild(body);

            let cannon: ƒAid.Node= new ƒAid.Node("Tower Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(3.3)), this.mtr, meshSphere);
            let cannonMeshCmp: ƒ.ComponentMesh= cannon.getComponent(ƒ.ComponentMesh);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            this.appendChild(cannon);

            let cannonBarrel: ƒAid.Node= new ƒAid.Node("Canon Barrel", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(1)), mtrCannon, meshCube);
            let cannonBarrelMeshCmp: ƒ.ComponentMesh= cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 2));
            cannon.appendChild(cannonBarrel);

            let towerTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
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