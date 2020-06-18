namespace TowerDefense {
    import ƒ = FudgeCore;

    export class Enemy extends ƒ.Node {
        public nextWaypoint: number = 0;

        //private direction: ƒ.Vector3;
        private speed: number;
        private startingPosition: ƒ.Vector3;
        private health: number = 1;
        private armor: number = 0.5; //Faktor for Damage Reduktion, closer to 0 means less Damage
        private isDead: boolean = false;
        private path: Path;

        constructor(_pos: ƒ.Vector3 = ƒ.Vector3.ZERO(), _direction: ƒ.Vector3 = ƒ.Vector3.X(), _speed: number = 0, _path: Path) {
            super("Enemy");
            //this.direction = _direction;
            this.speed = _speed;
            this.startingPosition = _pos;
            this.path = _path;
            this.init();
            console.log(this.path);
        }

        public update(): void {
            // let movement: ƒ.Vector3 = this.direction.copy;
            // movement.normalize(this.speed);
            // this.cmpTransform.local.translate(movement);

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
            } else {
                enemies.removeChild(this);
            }
        }

        public calculateDamage(_projectile: Projectile): void {
            this.health -= (_projectile.strength * this.armor);
            if (this.health <= 0 && !this.isDead) {
                enemies.removeChild(this);
                // let newPath: Path = new Path(grid[0][0], grid[3][0], grid[3][14]);
                // let enemy: Enemy = new Enemy(newPath[0], ƒ.Vector3.X(), 0.1, newPath);
                // enemies.appendChild(enemy);
                this.isDead = true;
            }
        }

        private init(): void {
            this.createNodes();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
        }

        private createNodes(): void {
            let meshBody: ƒ.MeshCube = new ƒ.MeshCube();
            let meshHead: ƒ.MeshSphere = new ƒ.MeshSphere();
            let mtr: ƒ.Material = new ƒ.Material("enemyMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.5, 0, 0)));

            let body: ƒ.Node = new ƒ.Node("ememy Body");
            body.addComponent(new ƒ.ComponentMesh(meshBody));
            body.addComponent(new ƒ.ComponentMaterial(mtr));
            let bodyTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(new ƒ.Vector3(1, 1, 1)));
            body.addComponent(bodyTransformation);
            this.appendChild(body);

            let head: ƒ.Node = new ƒ.Node("ememy Head");
            head.addComponent(new ƒ.ComponentMesh(meshHead));
            head.addComponent(new ƒ.ComponentMaterial(mtr));
            let headTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(new ƒ.Vector3(1, 1, 1)));
            headTransformation.local.translate(ƒ.Vector3.Y(1));
            head.addComponent(headTransformation);
            this.appendChild(head);

            let enemyTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            enemyTransformation.local.translate(this.startingPosition);
            this.addComponent(enemyTransformation);
        }
    }
}