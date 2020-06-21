namespace TowerDefense {
    import ƒ = FudgeCore;

    export class Projectile extends ƒ.Node {
        public strength: number = 0.4;

        private startingposition: ƒ.Vector3;
        private enemy: Enemy;
        private speed: number;
        private collisionActive = true;
        private size: number;

        constructor(_pos: ƒ.Vector3, _enemy: Enemy, _strength: number= 0.4, _size: number= 0.5, _speed: number = 1) {
            super("Projectile");
            this.startingposition = _pos;
            this.enemy = _enemy;
            this.speed = _speed;
            this.size= _size;
            this.strength= _strength;
            this.init();
        }

        public update(): void {
            let enemyPos: ƒ.Matrix4x4 = this.enemy.cmpTransform.local.copy;
            let startingPos: ƒ.Matrix4x4 = this.cmpTransform.local.copy;
            let movement: ƒ.Vector3 = startingPos.getTranslationTo(enemyPos);
            movement.normalize(this.speed);
            if (this.enemy == undefined) {
                viewport.getGraph().removeChild(this);
            }
            this.cmpTransform.local.translate(movement);
            this.collidingWithEnemy();
        }

        private collidingWithEnemy(): void {
            if (this.collisionActive) {
                let thisPos: ƒ.Vector3 = this.mtxWorld.translation;
                if (thisPos.isInsideSphere(this.enemy.mtxLocal.translation, 1)) {
                    this.collisionActive = false;
                    this.enemy.calculateDamage(this);
                    viewport.getGraph().removeChild(this);
                }
            }
        }

        private init(): void {
            this.createObject();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
        }

        private createObject(): void {
            let mesh: ƒ.MeshSphere = new ƒ.MeshSphere();
            let mtrPlayfield: ƒ.Material = new ƒ.Material("projectileMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));

            let meshCmp: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
            meshCmp.pivot.scale(ƒ.Vector3.ONE(this.size));
            this.addComponent(meshCmp);
            this.addComponent(new ƒ.ComponentMaterial(mtrPlayfield));

            let transformationComponent: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.startingposition));
            this.addComponent(transformationComponent);

            viewport.getGraph().appendChild(this);
        }
    }
}