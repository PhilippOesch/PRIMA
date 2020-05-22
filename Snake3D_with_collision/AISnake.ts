/// <reference path="Snake.ts"/>

namespace Snake3D {
    import ƒ = FudgeCore;

    export class AISnake extends Snake {
        public awarenessArea: AwarenesArea

        constructor() {
            super("AISnake")
            this.awarenessArea = new AwarenesArea(10, this.head);
        }

        public move() {
            //get food Objects inside detection Area
            let inAwarenesArea: Array<ƒ.Node> = this.getAwarenessArea();
            let closest: ƒ.Node = null
            let child: ƒ.Node = this.head;

            //get nearest Food Object
            if (inAwarenesArea!= undefined) {
                inAwarenesArea.forEach((value) => {
                    if (closest == null) {
                        closest = value
                    } else if (this.getDistance(value.mtxLocal.translation, child.mtxLocal.translation) < this.getDistance(closest.mtxLocal.translation, child.mtxLocal.translation)) {
                        closest = value
                    }
                });
            }

            if (closest != null) {
                let goRightPos: ƒ.Matrix4x4 = child.mtxLocal.copy;
                goRightPos.rotate(ƒ.Vector3.Y(-90))
                goRightPos.translate(this.dirCurrent);

                let goLeftPos: ƒ.Matrix4x4 = child.mtxLocal.copy;
                goLeftPos.rotate(ƒ.Vector3.Y(90))
                goLeftPos.translate(this.dirCurrent);

                let goStreightPos: ƒ.Matrix4x4 = child.mtxLocal.copy;
                goStreightPos.translate(this.dirCurrent);

                let goRightDist = this.getDistance(closest.mtxLocal.translation, goRightPos.translation);
                let goLeftDist = this.getDistance(closest.mtxLocal.translation, goLeftPos.translation);
                let goStreightDist = this.getDistance(closest.mtxLocal.translation, goStreightPos.translation);

                if (goRightDist <= goLeftDist && goRightDist < goStreightDist) {
                    this.rotate(ƒ.Vector3.Y(-90));
                } else if (goLeftDist < goRightDist && goLeftDist < goStreightDist) {
                    this.rotate(ƒ.Vector3.Y(90));
                } 
            }
            let cmpPrev: ƒ.ComponentTransform = child.getComponent(ƒ.ComponentTransform);
            let mtxHead: ƒ.Matrix4x4;
            while (true) {
              mtxHead = cmpPrev.local.copy;          
              mtxHead.translate(this.dirCurrent);
              if (Math.abs(mtxHead.translation.x) < 14 && Math.abs(mtxHead.translation.y) < 14 && Math.abs(mtxHead.translation.z) < 14)
                break;
              this.rotate(ƒ.Vector3.Z(-90));
            }
      
            let cmpNew: ƒ.ComponentTransform = new ƒ.ComponentTransform(mtxHead);
      
            for (let segment of this.getChildren()) {
              cmpPrev = segment.getComponent(ƒ.ComponentTransform);
              segment.removeComponent(cmpPrev);
              segment.addComponent(cmpNew);
              cmpNew = cmpPrev;
            }
        }

        private getAwarenessArea(): Array<ƒ.Node> {
            let objectsInArea: Array<ƒ.Node>= new Array<ƒ.Node>();
            graph.getChildrenByName("Food").forEach(value => {
                if (this.awarenessArea.isColliding(value)) {
                    objectsInArea.push(value);
                }
            });
            // console.log(objectsInArea);
            return objectsInArea;
        }

        private getDistance(_input1: ƒ.Vector3, _input2: ƒ.Vector3): number {
            let xval: number = Math.abs(_input1.x - _input2.x);
            let yval: number = Math.abs(_input1.y - _input2.y);
            let zval: number = Math.abs(_input1.z - _input2.z);

            return Math.sqrt((xval * xval) + (yval * yval) + (zval * zval));
        }

    }
}