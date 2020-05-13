"use strict";
var L06_Snake3D_HeadControl;
(function (L06_Snake3D_HeadControl) {
    var ƒ = FudgeCore;
    class Food extends ƒ.Node {
        constructor() {
            super("Food");
            this.init();
        }
        init() {
            let foodPos;
            let ebene = Math.floor(Math.random() * 4) + 0;
            let randomX = Math.floor(Math.random() * 4) + 0;
            randomX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            let randomY = Math.floor(Math.random() * 4) + 0;
            randomY *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            let randomZ = Math.floor(Math.random() * 4) + 0;
            randomZ *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            switch (ebene) {
                case 0:
                    foodPos = new ƒ.Vector3(randomX, randomY, 5);
                    break;
                case 1:
                    foodPos = new ƒ.Vector3(randomX, randomY, -5);
                    break;
                case 2:
                    foodPos = new ƒ.Vector3(randomX, 5, randomZ);
                    break;
                case 3:
                    foodPos = new ƒ.Vector3(randomX, -5, randomZ);
                    break;
                case 4:
                    foodPos = new ƒ.Vector3(4, randomY, randomZ);
                    break;
                case 5:
                    foodPos = new ƒ.Vector3(-4, randomY, randomZ);
                    break;
            }
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("Food", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("RED")))));
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube()));
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(foodPos)));
        }
        isColliding(_input) {
            let object1Pos = this.cmpTransform.local.translation;
            let object1Scale = this.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            let object2Pos = _input.cmpTransform.local.translation;
            let object2Scale = _input.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            let xval = object1Pos.x - object2Pos.x;
            let yval = object1Pos.y - object2Pos.y;
            let zval = object1Pos.z - object2Pos.z;
            let distance = Math.sqrt((xval * xval) + (yval * yval) + (zval * zval));
            if (distance <= (object1Scale.x / 2 + object2Scale.x / 2)) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    L06_Snake3D_HeadControl.Food = Food;
})(L06_Snake3D_HeadControl || (L06_Snake3D_HeadControl = {}));
//# sourceMappingURL=Food.js.map