namespace RTS_V2 {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Unit extends ƒ.Node {
        public static mesh: ƒ.MeshSprite = new ƒ.MeshSprite();

        public static bodyImg: HTMLImageElement;
        public static enemyBodyImg: HTMLImageElement;
        public static cannonImg: HTMLImageElement;
        public static barrelImg: HTMLImageElement;
        public static enemyBarrelImg: HTMLImageElement;
        public static selectedImg: HTMLImageElement;

        public collisionRange: number = 1;
        private isPlayer: boolean;
        private bodyNode: ƒ.Node;
        private cannonNode: ƒ.Node;
        private moveTo: ƒ.Vector3;
        private speed: number = 3 / 1000;
        private selected: ƒ.Node;
        //private target: Unit;
        //private shootingTimer: ƒ.Timer;

        constructor(_name: string, _pos: ƒ.Vector3, _isPlayer: boolean = true) {
            super(_name);
            this.isPlayer = _isPlayer;
            this.createNodes(_pos);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
            // if (this.target != null) {
            //     this.shootingTimer = new ƒ.Timer(ƒ.Time.game, 500, 0, () => this.shoot(this, this.target));
            //     console.log(this.shootingTimer);
            // }
        }

        public static loadImages(): void {
            Unit.bodyImg = document.querySelector("#tank");
            Unit.cannonImg = document.querySelector("#cannon");
            Unit.enemyBodyImg = document.querySelector("#enemytank");
            Unit.enemyBarrelImg = document.querySelector("#enemybarrel");
            Unit.barrelImg = document.querySelector("#barrel");
            Unit.selectedImg = document.querySelector("#selected");
        }

        public set movePos(_pos: ƒ.Vector3) {
            this.moveTo = _pos;
        }

        public isInPickingRange(_ray: ƒ.Ray): boolean {
            let distanceVector: ƒ.Vector3 = _ray.getDistance(this.mtxWorld.translation.copy);
            if (distanceVector.magnitudeSquared < this.collisionRange ** 2) {
                return true;
            } else {
                return false;
            }
        }

        public setPicked(_bool: boolean): void {
            if (_bool) {
                this.appendChild(this.selected);
            } else {
                this.removeChild(this.selected);
            }
        }

        public update(): void {
            this.move();

            //this.follow();
        }

        private move(): void{
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


        // private shoot = (_node: ƒ.Node, _target: Unit): void => {
        //     let startingPos: ƒ.Matrix4x4 = _node.mtxWorld.copy;
        //     let bullet = new Bullet(startingPos.translation.copy, _target);

        //     bullets.appendChild(bullet);
        // }

        // private follow(): void {
        //     if (this.target != null) {
        //         let targetpos: ƒ.Vector3 = this.target.mtxWorld.translation.copy;
        //         //targetpos.subtract(this.mtxWorld.translation.copy);
        //         this.cannonNode.cmpTransform.lookAt(targetpos, ƒ.Vector3.Z());
        //         this.cannonNode.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
        //     }
        // }

        private createNodes(_pos: ƒ.Vector3): void {
            let cannonMtr: ƒ.Material = this.getTextureMaterial(Unit.cannonImg);
            let selectedMtr: ƒ.Material = this.getTextureMaterial(Unit.selectedImg);

            let bodyMtr: ƒ.Material;
            let barrelMtr: ƒ.Material;

            if (this.isPlayer) {
                bodyMtr = this.getTextureMaterial(Unit.bodyImg);
                barrelMtr = this.getTextureMaterial(Unit.barrelImg);
            } else {
                bodyMtr = this.getTextureMaterial(Unit.enemyBodyImg);
                barrelMtr = this.getTextureMaterial(Unit.enemyBarrelImg);
            }

            this.selected = new ƒAid.Node("Unit Selected", ƒ.Matrix4x4.IDENTITY(), selectedMtr, Unit.mesh);
            let selectedCmpNode: ƒ.ComponentMesh = this.selected.getComponent(ƒ.ComponentMesh);
            selectedCmpNode.pivot.scale(ƒ.Vector3.ONE(1.3));

            let unitCmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos));
            this.addComponent(unitCmpTransform);

            this.bodyNode = new ƒAid.Node("Unit Body", ƒ.Matrix4x4.IDENTITY(), bodyMtr, Unit.mesh);
            let bodyCmpMesh: ƒ.ComponentMesh = this.bodyNode.getComponent(ƒ.ComponentMesh);
            bodyCmpMesh.pivot.scale(ƒ.Vector3.ONE());
            bodyCmpMesh.pivot.rotateZ(90);

            this.cannonNode = new ƒAid.Node("Unit Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.12)), cannonMtr, Unit.mesh);
            let cannonCmpMesh: ƒ.ComponentMesh = this.cannonNode.getComponent(ƒ.ComponentMesh);
            cannonCmpMesh.pivot.scale(ƒ.Vector3.ONE(0.7));

            let barrelNode: ƒAid.Node = new ƒAid.Node("Unit Barrel", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-0.5, 0, 0.11)), barrelMtr, Unit.mesh);
            let barrelCmpMesh: ƒ.ComponentMesh = barrelNode.getComponent(ƒ.ComponentMesh);
            barrelCmpMesh.pivot.scale(new ƒ.Vector3(0.7, 0.3, 0));
            barrelCmpMesh.pivot.rotateZ(90);

            this.appendChild(this.bodyNode);
            this.appendChild(this.cannonNode);
            this.cannonNode.appendChild(barrelNode);

        }

        private getTextureMaterial(_img: HTMLImageElement): ƒ.Material {
            let txt: ƒ.TextureImage = new ƒ.TextureImage();
            let coatTxt: ƒ.CoatTextured = new ƒ.CoatTextured();
            txt.image = _img;
            coatTxt.texture = txt;
            return new ƒ.Material(name, ƒ.ShaderTexture, coatTxt);
        }

    }
}