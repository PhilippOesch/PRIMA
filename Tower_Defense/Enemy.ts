namespace TowerDefense {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Enemy extends ƒ.Node {
        public nextWaypoint: number = 0;

        //private direction: ƒ.Vector3;
        private speed: number;
        private startingPosition: ƒ.Vector3;
        private health: number = 1;
        private armor: number = 0.4; //Faktor for Damage Reduktion, closer to 0 means less Damage
        private isDead: boolean = false;
        private path: Path;

        private healtBarContainer: HTMLDivElement;
        private healtBar: HTMLDivElement;

        constructor(_pos: ƒ.Vector3 = ƒ.Vector3.ZERO(), _direction: ƒ.Vector3 = ƒ.Vector3.X(), _speed: number = 0, _path: Path) {
            super("Enemy");
            this.speed = _speed;
            this.startingPosition = _pos;
            this.path = _path;
            this.init();
            console.log(this.path);
        }

        public update(): void {

            let distanceToTravel: number = this.speed;
            let move: ƒ.Vector3;
            while (true) {
                if (this.nextWaypoint == this.path.length) {
                    break;
                }

                move = ƒ.Vector3.DIFFERENCE(this.path[this.nextWaypoint], this.mtxLocal.translation);
                if (move.magnitudeSquared > distanceToTravel * distanceToTravel)
                    break;

                this.nextWaypoint = ++this.nextWaypoint;
                if (this.nextWaypoint == 0)
                    this.mtxLocal.translation = this.path[0];
            }

            if (!(this.nextWaypoint == this.path.length)) {
                this.cmpTransform.local.translate(ƒ.Vector3.NORMALIZATION(move, distanceToTravel));
            } else if (this.healtBarContainer != null && this.healtBar != null) {
                this.removeEnemy()
            }

            this.updateHealthbar();
        }

        public calculateDamage(_projectile: Projectile): void {
            this.health -= (_projectile.strength * this.armor);
            if (this.health <= 0 && !this.isDead) {
                this.removeEnemy();
                this.isDead = true;
            }
        }

        private removeEnemy(): void {
            document.body.removeChild(this.healtBarContainer);
            this.healtBarContainer = null;
            this.healtBar = null;
            enemies.removeChild(this);
        }

        private updateHealthbar(): void {
            let currentPos: ƒ.Vector3 = this.mtxWorld.translation.copy;
            let client: ƒ.Vector2 = this.convertVector3ToClient(currentPos);

            if (this.healtBarContainer != null && this.healtBar != null) {
                this.healtBarContainer.style.left = client.x + "px";
                this.healtBarContainer.style.top = client.y + "px";

                let healtbarwidth: number = Math.floor(60 * this.health);
                this.healtBar.style.width = healtbarwidth + "px";
            }
        }

        private init(): void {
            this.createNodes();
            this.createHealthbar();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
        }

        private createNodes(): void {
            let meshBody: ƒ.MeshCube = new ƒ.MeshCube();
            let meshHead: ƒ.MeshSphere = new ƒ.MeshSphere();
            let mtr: ƒ.Material = new ƒ.Material("enemyMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.5, 0, 0)));

            let body: ƒAid.Node = new ƒAid.Node("ememy Body", ƒ.Matrix4x4.IDENTITY(), mtr, meshBody);
            this.appendChild(body);
            let head: ƒAid.Node = new ƒAid.Node("ememy Head", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(1)), mtr, meshHead);
            this.appendChild(head);

            let enemyTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.startingPosition));
            this.addComponent(enemyTransformation);
        }

        private createHealthbar(): void {
            this.healtBarContainer = document.createElement("div");
            this.healtBar = document.createElement("div");
            this.healtBar.classList.add("healthbar");
            this.healtBarContainer.appendChild(this.healtBar);
            this.healtBarContainer.classList.add("healthbar-container");
            console.log(this.healtBarContainer);
            document.body.appendChild(this.healtBarContainer);
        }

        private convertVector3ToClient(_pos: ƒ.Vector3): ƒ.Vector2 {
            let camera: ƒ.ComponentCamera = viewport.camera;

            let projection: ƒ.Vector3 = camera.project(_pos);
            let screen: ƒ.Vector2 = viewport.pointClipToClient(projection.toVector2());

            return screen;
        }
    }
}