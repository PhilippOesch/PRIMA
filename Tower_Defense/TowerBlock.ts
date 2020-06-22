namespace TowerDefense {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class TowerBlock extends Tower {

        protected init(): void {
            this.createNodes();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
            this.addComponent(new ComponentPicker(2));
        }

        protected createNodes(): void {
            let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let meshSphere: ƒ.MeshSphere = new ƒ.MeshSphere();
            let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));

            let base: ƒAid.Node= new ƒAid.Node("Tower Base", ƒ.Matrix4x4.IDENTITY(), this.mtr, meshCube);
            let baseMeshCmp: ƒ.ComponentMesh= base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(8, 0.5, 8));
            this.appendChild(base);

            let body: ƒAid.Node= new ƒAid.Node("Tower Body", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(0.5)), this.mtr, meshCube);
            let bodyMeshCmp: ƒ.ComponentMesh= body.getComponent(ƒ.ComponentMesh);
            bodyMeshCmp.pivot.scale(new ƒ.Vector3(4, 4, 4));
            this.appendChild(body);

            let cannon: ƒAid.Node= new ƒAid.Node("Tower Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(4.3)), this.mtr, meshSphere);
            let cannonMeshCmp: ƒ.ComponentMesh= cannon.getComponent(ƒ.ComponentMesh);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(4));
            this.appendChild(cannon);

            let cannonBarrel: ƒAid.Node= new ƒAid.Node("Canon Barrel", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(1)), mtrCannon, meshCube);
            let cannonBarrelMeshCmp: ƒ.ComponentMesh= cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(1, 1, 4));
            cannon.appendChild(cannonBarrel);

            let towerTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            let pos = this.position.copy;
            pos.add(new ƒ.Vector3(2, 0, 2));
            towerTransformation.local.translate(pos);
            this.addComponent(towerTransformation);
        }

        protected fireProjectile = (): void => {
            let startingPos: ƒ.Matrix4x4 = this.getChildrenByName("Tower Cannon")[0].mtxWorld.copy;

            let newProjectile: Projectile = new Projectile(startingPos.translation.copy, this.targetedEnemy, 0.8, 1);
            viewport.getGraph().appendChild(newProjectile);
        }
    }
}