"use strict";
var L05_Snake3DStart;
(function (L05_Snake3DStart) {
    var ƒ = FudgeCore;
    class Snake extends ƒ.Node {
        constructor() {
            super("Snake");
            this.dirCurrent = ƒ.Vector3.X();
            console.log("Creating Snake");
            this.createSegement(4);
        }
        move() {
            this.dirCurrent = this.dirNew || this.dirCurrent;
            let child = this.getChildren()[0];
            let cmpPrev = child.getComponent(ƒ.ComponentTransform);
            let mtxHead;
            while (true) {
                mtxHead = cmpPrev.local.copy;
                mtxHead.translate(this.dirCurrent);
                if (Math.abs(mtxHead.translation.x) < 6 && Math.abs(mtxHead.translation.y) < 6 && Math.abs(mtxHead.translation.z) < 6)
                    break;
                this.rotate(ƒ.Vector3.Z(-90));
            }
            let cmpNew = new ƒ.ComponentTransform(mtxHead);
            for (let segment of this.getChildren()) {
                cmpPrev = segment.getComponent(ƒ.ComponentTransform);
                segment.removeComponent(cmpPrev);
                segment.addComponent(cmpNew);
                cmpNew = cmpPrev;
            }
        }
        set direction(_new) {
            if (this.dirCurrent.equals(ƒ.Vector3.SCALE(_new, -1)))
                return;
            //console.log(this.dirCurrent, _new);
            this.dirNew = _new;
        }
        rotate(_rotation) {
            let head = this.getChildren()[0];
            head.mtxLocal.rotate(_rotation);
        }
        createSegement(_segments) {
            let mesh = new ƒ.MeshCube();
            let mtrSolidGreen = new ƒ.Material("SolidGreen", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));
            for (let i = 0; i < _segments; i++) {
                let segment = new ƒ.Node("Segment");
                let cmpMesh = new ƒ.ComponentMesh(mesh);
                segment.addComponent(cmpMesh);
                cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.8));
                let cmpMaterial = new ƒ.ComponentMaterial(mtrSolidGreen);
                segment.addComponent(cmpMaterial);
                segment.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-1 * i, 0, 0))));
                this.appendChild(segment);
            }
        }
        isColliding(_inputObject) {
            let snakeHead = this.getChildren()[0];
            let snakeHeadPos = snakeHead.cmpTransform.local.translation;
            let snakeHeadScale = snakeHead.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            let inputPos = _inputObject.cmpTransform.local.translation;
            let inputScale = _inputObject.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            let xval = snakeHeadPos.x - inputPos.x;
            let yval = snakeHeadPos.y - inputPos.y;
            let zval = snakeHeadPos.z - inputPos.z;
            let distance = Math.sqrt((xval * xval) + (yval * yval) + (zval * zval));
            if (distance <= (snakeHeadScale.x + inputScale.x)) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    L05_Snake3DStart.Snake = Snake;
})(L05_Snake3DStart || (L05_Snake3DStart = {}));
//# sourceMappingURL=Snake.js.map