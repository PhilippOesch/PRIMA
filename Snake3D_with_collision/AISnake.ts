/// <reference path="Snake.ts"/>

namespace Snake3D {
    import ƒ = FudgeCore;

    export class AISnake extends Snake {
        public awarenessArea: AwarenesArea

        constructor() {
            var material = new ƒ.Material("AISnakeMaterial", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("Orange")));
            super("AISnake", material)
            this.awarenessArea = new AwarenesArea(14, this.head);
        }

        public move() {
            //get food Objects inside detection Area
            let inAwarenesArea: Array<ƒ.Node> = this.getFoodInArea();
            let closest: ƒ.Node = null
            let child: ƒ.Node = this.head;

            //get nearest Food Object
            if (inAwarenesArea != undefined) {
                inAwarenesArea.forEach((value) => {
                    if (closest == null) {
                        closest = value;
                    } else if (this.getDistance(value.mtxLocal.translation, child.mtxLocal.translation) < this.getDistance(closest.mtxLocal.translation, child.mtxLocal.translation)) {
                        closest = value;
                    }
                });
            }


            let goRightPos: ƒ.Matrix4x4 = child.mtxLocal.copy;
            goRightPos.rotate(ƒ.Vector3.Y(-90))
            goRightPos.translate(this.dirCurrent);
            if (!(Math.abs(goRightPos.translation.x) < size + 1 && Math.abs(goRightPos.translation.y) < size + 1 && Math.abs(goRightPos.translation.z) < size + 1))
                goRightPos.rotate(ƒ.Vector3.Z(-90));

            let goLeftPos: ƒ.Matrix4x4 = child.mtxLocal.copy;
            goLeftPos.rotate(ƒ.Vector3.Y(90))
            goLeftPos.translate(this.dirCurrent);
            if (!(Math.abs(goLeftPos.translation.x) < size + 1 && Math.abs(goLeftPos.translation.y) < size + 1 && Math.abs(goLeftPos.translation.z) < size + 1))
                goLeftPos.rotate(ƒ.Vector3.Z(-90));

            let goStreightPos: ƒ.Matrix4x4 = child.mtxLocal.copy;
            goStreightPos.translate(this.dirCurrent);
            if (!(Math.abs(goStreightPos.translation.x) < size + 1 && Math.abs(goStreightPos.translation.y) < size + 1 && Math.abs(goStreightPos.translation.z) < size + 1))
                goStreightPos.rotate(ƒ.Vector3.Z(-90));

            //Check Collision in new Pos
            let goRightCollision = this.isCollidingwithItself(goRightPos.translation);
            let goLeftCollision = this.isCollidingwithItself(goLeftPos.translation);
            let goStreightCollision = this.isCollidingwithItself(goStreightPos.translation);

            let direction: string = "";

            if (closest != null) {

                // let goRightDist: number = this.getDistance(closest.mtxLocal.translation, goRightPos.translation);
                // let goLeftDist: number = this.getDistance(closest.mtxLocal.translation, goLeftPos.translation);
                // let goStreightDist: number = this.getDistance(closest.mtxLocal.translation, goStreightPos.translation);

                let sorted: Array<ƒ.Vector3> = Array(goRightPos.translation, goLeftPos.translation, goStreightPos.translation);

                sorted.sort((a, b) => {
                    let aDistance = this.getDistance(closest.mtxLocal.translation, a);
                    let bDistance = this.getDistance(closest.mtxLocal.translation, b);

                    if (aDistance < bDistance) {
                        return -1;
                    }
                    if (aDistance > bDistance) {
                        return 1;
                    }

                    return 1;
                })

                console.dir(sorted);

                for (let value of sorted) {
                    if ((value.equals(goStreightPos.translation) && !goStreightCollision)) {
                        direction = "streight";
                    } else if ((value.equals(goRightPos.translation) && !goRightCollision)) {
                        direction = "right";
                    } else if ((value.equals(goLeftPos.translation) && !goLeftCollision)) {
                        direction = "left";
                    }

                    if (direction !== "") {
                        break;
                    }
                }

                //just selecting way to closest food
                // if(sorted[0].equals(goStreightPos.translation)){
                //     direction= "streight";
                // } else if(sorted[0].equals(goLeftPos.translation)){
                //     direction= "left";
                // } else if(sorted[0].equals(goRightPos.translation)){
                //     direction= "right";
                // }

            } else {
                if (!goStreightCollision) {
                    direction = "streight";
                } else if (!goLeftCollision) {
                    direction = "left";
                } else if (!goRightCollision) {
                    direction = "right";
                }
            }

            if (direction == "right") {
                this.rotate(ƒ.Vector3.Y(-90));
            }
            if (direction == "left") {
                this.rotate(ƒ.Vector3.Y(90));
            }

            let cmpPrev: ƒ.ComponentTransform = child.getComponent(ƒ.ComponentTransform);
            let mtxHead: ƒ.Matrix4x4;

            while (true) {
                mtxHead = cmpPrev.local.copy;
                mtxHead.translate(this.dirCurrent);
                if (Math.abs(mtxHead.translation.x) < size + 1 && Math.abs(mtxHead.translation.y) < size + 1 && Math.abs(mtxHead.translation.z) < size + 1)
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

        private getFoodInArea(): Array<ƒ.Node> {
            let objectsInArea: Array<ƒ.Node> = new Array<ƒ.Node>();
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

        public isCollidingwithItself(_input: ƒ.Vector3) {
            let checkcollision = false;
            this.getChildren().forEach((value, index) => {
                if (index > 2 && value.mtxLocal.translation.isInsideSphere(_input, 0.4)) {
                    checkcollision = true;
                    return;
                }
            });
            return checkcollision;
        }
    }
}