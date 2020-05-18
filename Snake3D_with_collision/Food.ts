namespace L06_Snake3D_HeadControl {
    import ƒ = FudgeCore;

    export class Food extends ƒ.Node {

        constructor() {
            super("Food");
            this.init();
        }

        private init(): void{
            let foodPos: ƒ.Vector3;
            let ebene: number = Math.floor(Math.random() * 6) + 0;

            let randomX = Math.floor(Math.random() * 11) + 0;
            randomX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

            let randomY = Math.floor(Math.random() * 11) + 0;
            randomY *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

            let randomZ = Math.floor(Math.random() * 11) + 0;
            randomZ *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

            switch (ebene) {
                case 0: foodPos = new ƒ.Vector3(randomX, randomY, 13)
                    break;
                case 1: foodPos = new ƒ.Vector3(randomX, randomY, -13)
                    break;
                case 2: foodPos = new ƒ.Vector3(randomX, 13, randomZ)
                    break;
                case 3: foodPos = new ƒ.Vector3(randomX, -13, randomZ)
                    break;
                case 4: foodPos = new ƒ.Vector3(13, randomY, randomZ)
                    break;
                case 5: foodPos = new ƒ.Vector3(-13, randomY, randomZ)
                    break;
            }

            this.addComponent(new ƒ.ComponentMaterial( new ƒ.Material("Food", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("RED")))));
            this.addComponent( new ƒ.ComponentMesh(new ƒ.MeshCube()));
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(foodPos)));

        }

        public isColliding(_input: ƒ.Node): boolean {
            let thisPos: ƒ.Vector3 = this.cmpTransform.local.translation;
            let thisScale: ƒ.Vector3 = this.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            let inputPos: ƒ.Vector3 = _input.cmpTransform.local.translation;
            let inputScale: ƒ.Vector3 = _input.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
        
            let xval = Math.abs(thisPos.x - inputPos.x)
            let yval = Math.abs(thisPos.y - inputPos.y)
            let zval = Math.abs(thisPos.z - inputPos.z)
        
            let distance = Math.sqrt((xval * xval) + (yval * yval) + (zval * zval));
        
            if (distance <= (thisScale.x/2 + inputScale.x/2)) {
                return true
            } else {
                return false
            }
        }
    }
}