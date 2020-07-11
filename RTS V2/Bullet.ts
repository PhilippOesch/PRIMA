namespace RTS_V2 {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Bullet extends ƒ.Node {
        public static bulletImg: HTMLImageElement;

        public damage: number = 0.5;

        private target: Unit;
        private speed: number;
        private collisionActive: boolean = true;
        private textureNode: ƒ.Node;

        constructor(_pos: ƒ.Vector3, _target: Unit, _speed: number = 0.1) {
            super("Bullet");
            this.target = _target;
            this.speed = _speed;
            this.createNodes(_pos);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
            Audio.play(AUDIO.SHOOT);
        }

        public static loadImages(): void {
            Bullet.bulletImg = document.querySelector("#tankbullet");
        }

        public update(): void {
            let enemyPos: ƒ.Matrix4x4 = this.target.cmpTransform.local.copy;
            let pos: ƒ.Matrix4x4 = this.cmpTransform.local.copy;
            let movement: ƒ.Vector3 = pos.getTranslationTo(enemyPos);
            movement.normalize(this.speed);
            if (this.target == undefined) {
                bullets.removeChild(this);
            }

            this.cmpTransform.local.translate(movement);
            let pointAt: ƒ.Vector3 = enemyPos.translation.copy;
            pointAt.subtract(this.mtxWorld.translation);
            this.textureNode.mtxLocal.lookAt(pointAt, ƒ.Vector3.Z());
            this.textureNode.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
            this.collidingWithEnemy();
        }

        private createNodes(_pos: ƒ.Vector3): void {
            let mtr: ƒ.Material = this.getTextureMaterial("BulletMtr", Bullet.bulletImg);
            let mesh: ƒ.MeshSprite = new ƒ.MeshSprite();

            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos));

            this.textureNode= new ƒAid.Node("Bullet Texture Node", ƒ.Matrix4x4.IDENTITY(), mtr, mesh);
            let cmpMesh: ƒ.ComponentMesh = this.textureNode.getComponent(ƒ.ComponentMesh);
            cmpMesh.pivot.scale(new ƒ.Vector3(0.4, 0.3, 0));
            cmpMesh.pivot.rotateZ(90);

            this.addComponent(cmpTransform);
            this.appendChild(this.textureNode);

        }


        private collidingWithEnemy(): void {
            if (this.collisionActive) {
                let thisPos: ƒ.Vector3 = this.mtxWorld.translation;
                let targetPos: ƒ.Vector3 = this.target.mtxWorld.translation.copy;
                let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(thisPos, targetPos);
                if (distanceVector.magnitudeSquared < this.target.collisionRange) {
                    this.target.calculateDamage(this);
                    this.collisionActive = false;
                    bullets.removeChild(this);
                    Audio.play(AUDIO.IMPACT);
                }
            }
        }

        private getTextureMaterial(_name: string, _img: HTMLImageElement): ƒ.Material {
            let txt: ƒ.TextureImage = new ƒ.TextureImage();
            let coatTxt: ƒ.CoatTextured = new ƒ.CoatTextured();
            txt.image = _img;
            coatTxt.texture = txt;
            return new ƒ.Material(_name, ƒ.ShaderTexture, coatTxt);
        }

    }
}