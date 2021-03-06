/// <reference path="Projectile.ts"/>

namespace TowerDefense {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Tower extends ƒ.Node {
        public mtr: ƒ.Material;
        public towerActive: boolean = false

        protected originalposition: ƒ.Vector3;
        protected rate: number = 1000; //in ms
        protected shootingInterval: any;
        protected isShooting: boolean = false;
        protected range: number = 14;
        protected targetedEnemy: Enemy;
        protected color: ƒ.Color;

        constructor(_pos: ƒ.Vector3, _color: ƒ.Color = new ƒ.Color(0.5, 0.5, 0.5)) {
            super("Tower");
            this.originalposition = _pos;
            this.color = _color;
            this.mtr = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(_color));
            this.init();
        }

        public update(): void {
            if (this.towerActive) {
                this.follow();
            }
        }

        public setMaterialColor(_color: ƒ.Color): void {
            let cmpMaterial: ƒ.ComponentMaterial = this.getChildrenByName("Tower Base")[0].getComponent(ƒ.ComponentMaterial);
            cmpMaterial.clrPrimary = _color;
        }

        public resetMaterialColor(): void {
            let newcmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(this.color)))
            let cmpMaterial: ƒ.ComponentMaterial = this.getChildrenByName("Tower Base")[0].getComponent(ƒ.ComponentMaterial);
            this.getChildrenByName("Tower Base")[0].removeComponent(cmpMaterial);
            this.getChildrenByName("Tower Base")[0].addComponent(newcmpMaterial);
            //cmpMaterial.clrPrimary= this.color;
        }

        public rotate(_rotation: ƒ.Vector3): void {
            this.cmpTransform.local.rotate(_rotation);
        }

        public snapToGrid(_pos: ƒ.Vector3): void {

            let gridArray: ƒ.Vector3[] = [].concat.apply([], grid);
            let closestGridPos: ƒ.Vector3 = gridArray[0];

            console.log(gridArray.length);
            for (let i = 1; i < gridArray.length; i++) {
                let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_pos, gridArray[i]);
                let currentDistanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_pos, closestGridPos);
                let distanceSquared: number = distanceVector.magnitudeSquared;
                let currentDistanceSquared: number = currentDistanceVector.magnitudeSquared;

                if (distanceSquared < currentDistanceSquared) {
                    closestGridPos = gridArray[i];
                }
            }

            let scaling = this.getTowerBase().getComponent(ƒ.ComponentMesh).pivot.scaling.copy;

            if (ƒ.Vector3.DIFFERENCE(_pos, closestGridPos).magnitudeSquared < gridBlockSize ** 2 && !this.checkCollisionWithOtherTowers(closestGridPos, scaling)) {
                this.cmpTransform.local.translation = closestGridPos;
                this.towerActive = true;
                spawnNewTower(this.originalposition);
            } else {
                this.cmpTransform.local.translation = this.originalposition;
            }

        }

        public getTowerBase(): ƒ.Node {
            return this.getChildrenByName("Tower Base")[0];
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
            this.mtr = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(this.color));
            this.createNodes();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));

            this.addComponent(new ComponentPicker(1));
        }

        protected createNodes(): void {
            let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere();
            let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));

            let base: ƒAid.Node = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.IDENTITY(), this.mtr, meshCube);
            let baseMeshCmp: ƒ.ComponentMesh = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(4, 0.5, 4));
            this.appendChild(base);

            let body: ƒAid.Node = new ƒAid.Node("Tower Body", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(0.5)), this.mtr, meshCube);
            let bodyMeshCmp: ƒ.ComponentMesh = body.getComponent(ƒ.ComponentMesh);
            bodyMeshCmp.pivot.scale(new ƒ.Vector3(1.5, 4, 1.5));
            this.appendChild(body);

            let cannon: ƒAid.Node = new ƒAid.Node("Tower Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(3.3)), this.mtr, meshSphere);
            let cannonMeshCmp: ƒ.ComponentMesh = cannon.getComponent(ƒ.ComponentMesh);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(2));
            this.appendChild(cannon);

            let cannonBarrel: ƒAid.Node = new ƒAid.Node("Canon Barrel", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(1)), mtrCannon, meshCube);
            let cannonBarrelMeshCmp: ƒ.ComponentMesh = cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 2));
            cannon.appendChild(cannonBarrel);

            let towerTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.originalposition));
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

        protected checkCollisionWithOtherTowers(_pos: ƒ.Vector3, _scaling: ƒ.Vector3): boolean {
            // let graphtowers: ƒ.Node[] = towers.getChildren();
            // let corner1: ƒ.Vector3 = _pos.copy;
            // let corner2: ƒ.Vector3 = _pos.copy;

            // let halfscaling= ƒ.Vector3.NORMALIZATION(scaling, 0.5);
            // corner1.subtract(halfscaling);
            // corner2.add(halfscaling);


            // let isColliding: boolean = false;
            // for (let tower of graphtowers) {
            //     if (tower.mtxWorld.translation.isInsideCube(corner1, corner2))
            //         isColliding = true;
            // }

            // return isColliding;

            let graphtowers: Tower[] = towers.getChildren().map(val => <Tower>val);


            let isColliding: boolean = false;
            for (let tower of graphtowers) {

                if (tower.checkCollisionWithTower(_pos, _scaling) && tower != this) {
                    isColliding = true;
                }
            }

            return isColliding;
        }

        protected checkCollisionWithTower(_pos: ƒ.Vector3, _scaling: ƒ.Vector3): boolean {
            let thisTowerScaling: ƒ.Vector3 = this.getTowerBase().getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            let thisTowerTranslation: ƒ.Vector3 = this.getTowerBase().mtxWorld.translation;
            console.log(thisTowerTranslation);

            let otherTowerScaling: ƒ.Vector3 = _scaling.copy;
            let otherTowerTranslation: ƒ.Vector3 = _pos.copy;
            console.log(otherTowerTranslation);

            let minXThis: number = thisTowerTranslation.x - thisTowerScaling.x / 2;
            let minYThis: number = thisTowerTranslation.y - thisTowerScaling.y / 2;
            let minZThis: number = thisTowerTranslation.z - thisTowerScaling.z / 2;

            let maxXThis: number = thisTowerTranslation.x + thisTowerScaling.x / 2;
            let maxYThis: number = thisTowerTranslation.y + thisTowerScaling.y / 2;
            let maxZThis: number = thisTowerTranslation.z + thisTowerScaling.z / 2;

            let minXOther: number = otherTowerTranslation.x - otherTowerScaling.x / 2;
            let minYOther: number = otherTowerTranslation.y - otherTowerScaling.y / 2;
            let minZOther: number = otherTowerTranslation.z - otherTowerScaling.z / 2;

            let maxXOther: number = otherTowerTranslation.x + otherTowerScaling.x / 2;
            let maxYOther: number = otherTowerTranslation.y + otherTowerScaling.y / 2;
            let maxZOther: number = otherTowerTranslation.z + otherTowerScaling.z / 2;

            return (minXThis < maxXOther && maxXThis > minXOther) &&
                (minYThis < maxYOther && maxYThis > minYOther) &&
                (minZThis < maxZOther && maxZThis > minZOther);
        }

    }
}