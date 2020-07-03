namespace TowerDefense {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class TowerBlock extends Tower {


        public snapToGrid(_pos: ƒ.Vector3): void {

            let adjustedPos: ƒ.Vector3 = _pos.copy;
            adjustedPos.add(new ƒ.Vector3(2, 0, 2));
            let gridArray: ƒ.Vector3[] = [].concat.apply([], grid);
            let closestGridPos: ƒ.Vector3 = gridArray[0];

            console.log(gridArray.length);
            for (let i = 1; i < gridArray.length; i++) {
                let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(adjustedPos, gridArray[i]);
                let currentDistanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(adjustedPos, closestGridPos);
                let distanceSquared: number = distanceVector.magnitudeSquared;
                let currentDistanceSquared: number = currentDistanceVector.magnitudeSquared;

                if (distanceSquared < currentDistanceSquared) {
                    closestGridPos = gridArray[i];
                }
            }

            let actualPosition: ƒ.Vector3 = closestGridPos.copy;
            let scaling: ƒ.Vector3 = this.getTowerBase().getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            actualPosition.subtract(new ƒ.Vector3(2, 0, 2));

            if (ƒ.Vector3.DIFFERENCE(adjustedPos, closestGridPos).magnitudeSquared < gridBlockSize ** 2 && !this.checkCollisionWithOtherTowers(actualPosition, scaling)) {
                let adjustgridpos: ƒ.Vector3 = closestGridPos.copy;
                adjustgridpos.subtract(new ƒ.Vector3(2, 0, 2));
                this.cmpTransform.local.translation = adjustgridpos;
                this.towerActive = true;

                spawnNewTower(this.originalposition);
            } else {
                let adjustgridpos: ƒ.Vector3 = this.originalposition.copy;
                adjustgridpos.add(new ƒ.Vector3(2, 0, 2));
                this.cmpTransform.local.translation = adjustgridpos;
            }

        }

        protected init(): void {
            this.createNodes();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
            this.addComponent(new ComponentPicker(2));
        }

        protected createNodes(): void {
            let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere();
            let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));

            let base: ƒAid.Node = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.IDENTITY(), this.mtr, meshCube);
            let baseMeshCmp: ƒ.ComponentMesh = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(8, 0.5, 8));
            this.appendChild(base);

            let body: ƒAid.Node = new ƒAid.Node("Tower Body", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(0.5)), this.mtr, meshCube);
            let bodyMeshCmp: ƒ.ComponentMesh = body.getComponent(ƒ.ComponentMesh);
            bodyMeshCmp.pivot.scale(new ƒ.Vector3(3, 4, 3));
            this.appendChild(body);

            let cannon: ƒAid.Node = new ƒAid.Node("Tower Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(4.3)), this.mtr, meshSphere);
            let cannonMeshCmp: ƒ.ComponentMesh = cannon.getComponent(ƒ.ComponentMesh);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(4));
            this.appendChild(cannon);

            let cannonBarrel: ƒAid.Node = new ƒAid.Node("Canon Barrel", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(1)), mtrCannon, meshCube);
            let cannonBarrelMeshCmp: ƒ.ComponentMesh = cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(1, 1, 4));
            cannon.appendChild(cannonBarrel);

            let towerTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            //let pos = this.originalposition.copy;
            //pos.add(new ƒ.Vector3(2, 0, 2));
            towerTransformation.local.translate(this.originalposition);
            this.addComponent(towerTransformation);
        }

        protected fireProjectile = (): void => {
            let startingPos: ƒ.Matrix4x4 = this.getChildrenByName("Tower Cannon")[0].mtxWorld.copy;

            let newProjectile: Projectile = new Projectile(startingPos.translation.copy, this.targetedEnemy, 0.8, 1);
            viewport.getGraph().appendChild(newProjectile);
        }
    }
}