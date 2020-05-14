"use strict";
var L06_Snake3D_HeadControl;
(function (L06_Snake3D_HeadControl) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Snake extends ƒ.Node {
        constructor() {
            super("Snake");
            this.dirCurrent = ƒ.Vector3.X();
            console.log("Creating Snake");
            this.createSegement(2);
        }
        move() {
            this.dirCurrent = this.dirNew || this.dirCurrent;
            let child = this.head;
            let cmpPrev = child.getComponent(ƒ.ComponentTransform);
            let mtxHead;
            while (true) {
                mtxHead = cmpPrev.local.copy;
                mtxHead.translate(this.dirCurrent);
                if (Math.abs(mtxHead.translation.x) < 7 && Math.abs(mtxHead.translation.y) < 7 && Math.abs(mtxHead.translation.z) < 7)
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
            console.log(this.dirCurrent, _new);
            this.dirNew = _new;
        }
        rotate(_rotation) {
            this.head.mtxLocal.rotate(_rotation);
        }
        createSegement(_segments) {
            let mesh = new ƒ.MeshCube();
            let mtrSolidWhite = new ƒ.Material("SolidWhite", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));
            for (let i = 0; i < _segments; i++) {
                let segment = new ƒ.Node("Segment");
                let cmpMesh = new ƒ.ComponentMesh(mesh);
                segment.addComponent(cmpMesh);
                cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.8));
                let cmpMaterial = new ƒ.ComponentMaterial(mtrSolidWhite);
                segment.addComponent(cmpMaterial);
                cmpMaterial.clrPrimary = ƒ.Color.CSS("WHITE");
                segment.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-1 * i, 0, 0))));
                this.appendChild(segment);
            }
            this.head = this.getChildren()[0];
            let cosys = new ƒAid.NodeCoordinateSystem("ControlSystem");
            cosys.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(5))));
            this.head.addChild(cosys);
        }
        isColliding(_inputObject) {
            let snakeHead = this.getChildren()[0];
            let snakeHeadPos = snakeHead.cmpTransform.local.translation;
            let snakeHeadScale = snakeHead.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            let inputPos = _inputObject.cmpTransform.local.translation;
            let inputScale = _inputObject.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            let xval = Math.abs(snakeHeadPos.x - inputPos.x);
            let yval = Math.abs(snakeHeadPos.y - inputPos.y);
            let zval = Math.abs(snakeHeadPos.z - inputPos.z);
            let distance = Math.sqrt((xval * xval) + (yval * yval) + (zval * zval));
            if (distance < (snakeHeadScale.x / 2 + inputScale.x / 2)) {
                return true;
            }
            else {
                return false;
            }
        }
        createSnakePart() {
            let snakeLength = this.getChildren().length;
            let lastSegmentPos = this.getChildren()[snakeLength - 1].cmpTransform.local.translation.copy;
            let mesh = new ƒ.MeshCube();
            let mtrSolidGreen = new ƒ.Material("SolidGreen", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));
            let node = new ƒ.Node("Snakepart");
            let cmpMesh = new ƒ.ComponentMesh(mesh); //attache Mesh to Node
            cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.8));
            node.addComponent(cmpMesh); //Add Component into node component Map
            let cmpMat = new ƒ.ComponentMaterial(mtrSolidGreen); //attache Mesh to Node
            node.addComponent(cmpMat); //Add Component into node component Map
            //Place new Segment behind the recently last segment
            node.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(lastSegmentPos.x - 1, lastSegmentPos.y, lastSegmentPos.z))));
            return node;
        }
        addNewSnakePart() {
            let newpart = this.createSnakePart();
            this.appendChild(newpart);
        }
    }
    L06_Snake3D_HeadControl.Snake = Snake;
})(L06_Snake3D_HeadControl || (L06_Snake3D_HeadControl = {}));
//# sourceMappingURL=Snake.js.map