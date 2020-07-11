namespace RTS_V2 {
    import ƒ = FudgeCore;

    export abstract class Unit extends ƒ.Node {
        public collisionRange: number;
        public isPlayer: boolean;

        protected shootingRange: number;
        protected shootingRate: number;
        protected target: Unit;
        protected shootingTimer: ƒ.Timer;
        protected moveTo: ƒ.Vector3;
        protected speed: number = 3 / 1000;
        protected health: number = 1;
        protected armor: number = 2;
        protected flock: Flock;
        protected isDead: boolean = false;

        protected healthBar: Healthbar;

        public set setMove(_pos: ƒ.Vector3) {
            this.moveTo = _pos;
        }

        public set setTarget(_target: Unit) {
            this.target = _target;
        }

        public get getHealth(): number {
            return this.health;
        }

        public attack(): void {
            let targetPos: ƒ.Vector3 = this.target.mtxWorld.translation.copy;
            this.moveTo = targetPos;
            let thisPos: ƒ.Vector3 = this.mtxWorld.translation.copy;
            let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(targetPos, thisPos);
            if (distanceVector.magnitudeSquared < this.shootingRange ** 2) {
                this.moveTo = null;
                this.follow();
                if (this.shootingTimer == null || !this.shootingTimer.active) {
                    this.shootingTimer = new ƒ.Timer(ƒ.Time.game, this.shootingRate, 0, () => this.shoot(this, this.target));
                }
            } else {
                this.clearTimer();
            }

            if (this.target == undefined || this.target.isDead) {
                this.target = null;
                this.clearTimer();
            }
        }

        public isInPickingRange(_ray: ƒ.Ray): boolean {
            let distanceVector: ƒ.Vector3 = _ray.getDistance(this.mtxWorld.translation.copy);
            if (distanceVector.magnitudeSquared < this.collisionRange ** 2) {
                return true;
            } else {
                return false;
            }
        }

        public calculateDamage(_bullet: Bullet): void {
            this.health -= (_bullet.damage / this.armor);
            //(<Healthbar>this.healthBar).health = Math.floor(this.health * 100);
            if (this.health <= 0 && !this.isDead) {
                units.removeChild(this);
                this.isDead = true;
                this.healthBar.delete();
                this.healthBar = null;
            }
        }


        public setPicked(_bool: boolean): void {
            console.log("isPicked");
        }

        protected move(_move: ƒ.Vector3): void {
            let distanceToTravel: number = this.speed * ƒ.Loop.timeFrameGame;
            let moveVector: ƒ.Vector3;

            moveVector = ƒ.Vector3.DIFFERENCE(_move, this.mtxLocal.translation);

            while (true) {
                moveVector = ƒ.Vector3.DIFFERENCE(this.moveTo, this.mtxLocal.translation);
                if (moveVector.magnitudeSquared > distanceToTravel ** 2)
                    break;

                this.moveTo = null;
            }

            moveVector = this.flock.calculateMove(moveVector);
            let pointAt: ƒ.Vector3 = moveVector.copy;
            pointAt.subtract(this.mtxWorld.translation);
            this.cmpTransform.local.translate(ƒ.Vector3.NORMALIZATION(moveVector, distanceToTravel));

        }

        protected getTextureMaterial(_img: HTMLImageElement): ƒ.Material {
            let txt: ƒ.TextureImage = new ƒ.TextureImage();
            let coatTxt: ƒ.CoatTextured = new ƒ.CoatTextured();
            txt.image = _img;
            coatTxt.texture = txt;
            return new ƒ.Material(name, ƒ.ShaderTexture, coatTxt);
        }

        protected shoot = (_node: ƒ.Node, _target: Unit): void => {
            let startingPos: ƒ.Matrix4x4 = _node.mtxWorld.copy;
            let bullet: Bullet = new Bullet(startingPos.translation.copy, _target);

            bullets.appendChild(bullet);
        }

        protected clearTimer(): void {
            if (this.shootingTimer != undefined) {
                this.shootingTimer.clear();
            }
        }

        protected follow(): void {
            if (this.target != null && this.target != undefined) {
                let targetpos: ƒ.Vector3 = this.target.mtxWorld.translation.copy;
                //targetpos.subtract(this.mtxWorld.translation.copy);
                console.log(targetpos);

            }
        }

    }
}