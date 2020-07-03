namespace Real_Time_Strategie {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Unit extends ƒ.Node {
        public static mesh: ƒ.MeshSprite = new ƒ.MeshSprite();
        public static material: ƒ.Material = new ƒ.Material("UnitMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0.7, 0.7, 0.7)));
        public static cannonMaterial: ƒ.Material = new ƒ.Material("UnitMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0.3, 0.3, 0.3)));
        public static cannonBarrelMaterial: ƒ.Material = new ƒ.Material("UnitMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0.4, 0.4, 0.4)));
        public static pickedColor: ƒ.Color = new ƒ.Color(1, 0, 0);

        public pickingRange: number = 1;
        public speed: number = 2 / 1000;
        public moveTo: ƒ.Vector3;
        private base: ƒ.Node;
        //private speed: number;

        constructor(_name: string, _pos: ƒ.Vector3) {
            super(_name);
            this.createNodes(_pos);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
        }

        public set move(_pos: ƒ.Vector3) {
            this.moveTo = _pos;
        }

        public setPicked(_bool: boolean): void {
            let cmpMaterial: ƒ.ComponentMaterial = this.base.getComponent(ƒ.ComponentMaterial);
            if (_bool) {
                cmpMaterial.clrPrimary = Unit.pickedColor;
            } else {
                let newCmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Unit.material)
                this.base.removeComponent(cmpMaterial);
                this.base.addComponent(newCmpMaterial);
            }
        }

        public update(): void {
            let distanceToTravel: number = this.speed * ƒ.Loop.timeFrameGame;
            let move: ƒ.Vector3;

            if (this.moveTo != null) {
                while (true) {
                    move = ƒ.Vector3.DIFFERENCE(this.moveTo, this.mtxLocal.translation);
                    console.log(move);
                    if (move.magnitudeSquared > distanceToTravel * distanceToTravel)
                        break;

                    this.moveTo = null;
                }
            
                
                let pointAt: ƒ.Vector3 = this.moveTo.copy;
                pointAt.subtract(this.mtxWorld.translation);
                this.base.mtxLocal.lookAt(pointAt, ƒ.Vector3.Z());
                this.base.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
                this.cmpTransform.local.translate(ƒ.Vector3.NORMALIZATION(move, distanceToTravel));
            }
        }

        public isInPickingRange(_ray: ƒ.Ray): boolean {
            let distanceVector: ƒ.Vector3 = _ray.getDistance(this.mtxWorld.translation.copy);
            if (distanceVector.magnitudeSquared < this.pickingRange ** 2) {
                return true;
            } else {
                return false;
            }
        }

        private createNodes(_pos: ƒ.Vector3): void {
            this.base = new ƒAid.Node("Unit Base", ƒ.Matrix4x4.IDENTITY(), Unit.material, Unit.mesh);
            let baseCmpMesh: ƒ.ComponentMesh = this.base.getComponent(ƒ.ComponentMesh);
            baseCmpMesh.pivot.scale(new ƒ.Vector3(1.5, 1, 0));
            this.appendChild(this.base);

            let cannon: ƒAid.Node = new ƒAid.Node("Unit Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.10001)), Unit.cannonMaterial, Unit.mesh);
            let cannonCmpMesh: ƒ.ComponentMesh = cannon.getComponent(ƒ.ComponentMesh);
            cannonCmpMesh.pivot.scale(new ƒ.Vector3(0.7, 0.7, 0));

            let cannonBarrel: ƒAid.Node = new ƒAid.Node("Unit Cannonbarrel", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.X(0.5)), Unit.cannonBarrelMaterial, Unit.mesh);
            let cannonBarrelCmpMesh: ƒ.ComponentMesh = cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelCmpMesh.pivot.scale(new ƒ.Vector3(1, 0.2, 0));

            cannon.appendChild(cannonBarrel);
            this.appendChild(cannon);

            let unitCmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos));
            this.addComponent(unitCmpTransform);
        }

    }
}