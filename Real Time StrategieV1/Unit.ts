namespace Real_Time_Strategie_V2 {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Unit extends ƒ.Node {
        public static mesh: ƒ.MeshSprite = new ƒ.MeshSprite();
        public static pickedColor: ƒ.Color = new ƒ.Color(1, 0, 0);
        public static bodymaterial: ƒ.Material;
        public static cannonMaterial: ƒ.Material;
        public static cannonBarrelMaterial: ƒ.Material;

        public pickingRange: number = 1;
        private moveTo: ƒ.Vector3;
        private speed: number = 3 / 1000;
        private bodyNode: ƒ.Node;

        constructor(_name: string, _pos: ƒ.Vector3) {
            super(_name);
            this.createNodes(_pos);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
        }

        public static loadMaterials(): void {
            let bodyImg: HTMLImageElement = document.querySelector(".tankbody");
            let barrelImg: HTMLImageElement = document.querySelector(".tankbarrel");
            let cannonlImg: HTMLImageElement = document.querySelector(".tankcannon");

            Unit.bodymaterial = Unit.loadMaterialWithTexture("bodyMtr", bodyImg);
            Unit.cannonMaterial = Unit.loadMaterialWithTexture("cannonMtr", cannonlImg);
            Unit.cannonBarrelMaterial = Unit.loadMaterialWithTexture("cannonBarrelMtr", barrelImg);
        }

        public static loadMaterialWithTexture(_name: String, _img: HTMLImageElement): ƒ.Material {
            let txt: ƒ.TextureImage = new ƒ.TextureImage();
            console.log(_img);
            txt.image = _img;
            console.log(txt.type);
            let coatTxt: ƒ.CoatTextured = new ƒ.CoatTextured();
            coatTxt.texture = txt;
            let mtr: ƒ.Material = new ƒ.Material(name, ƒ.ShaderTexture, coatTxt);
            return mtr;

        }

        public set move(_pos: ƒ.Vector3) {
            this.moveTo = _pos;
        }

        public setPicked(_bool: boolean): void {
            //let cmpMaterial: ƒ.ComponentMaterial = this.bodyNode.getComponent(ƒ.ComponentMaterial);
            if (_bool) {
               //cmpMaterial.clrPrimary = Unit.pickedColor;
            } else {
                // let newCmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(this.bodymaterial)
                // this.bodyNode.removeComponent(cmpMaterial);
                // this.bodyNode.addComponent(newCmpMaterial);
            }
        }

        public update(): void {
            let distanceToTravel: number = this.speed * ƒ.Loop.timeFrameGame;
            let move: ƒ.Vector3;

            if (this.moveTo != null) {
                while (true) {
                    move = ƒ.Vector3.DIFFERENCE(this.moveTo, this.mtxLocal.translation);
                    if (move.magnitudeSquared > distanceToTravel * distanceToTravel)
                        break;

                    this.moveTo = null;
                }

                let pointAt: ƒ.Vector3 = this.moveTo.copy;
                pointAt.subtract(this.mtxWorld.translation);
                this.bodyNode.mtxLocal.lookAt(pointAt, ƒ.Vector3.Z());
                this.bodyNode.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
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

            this.bodyNode = new ƒAid.Node("Unit Base", ƒ.Matrix4x4.IDENTITY(), Unit.bodymaterial, Unit.mesh);
            let baseCmpMesh: ƒ.ComponentMesh = this.bodyNode.getComponent(ƒ.ComponentMesh);
            baseCmpMesh.pivot.scale(new ƒ.Vector3(1, 1, 0));
            this.appendChild(this.bodyNode);

            let cannon: ƒAid.Node = new ƒAid.Node("Unit Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.2)), Unit.cannonMaterial, Unit.mesh);
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