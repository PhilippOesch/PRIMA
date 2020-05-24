/// <reference path="Snake.ts"/>

namespace Snake3D {
    import ƒ = FudgeCore;

    export class AISnake extends Snake {
        public awarenessArea: AwarenesArea

        constructor() {
            var material = new ƒ.Material("AISnakeMaterial", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("Orange")));
            super("AISnake", material)
            this.awarenessArea = new AwarenesArea(15, this.head);
        }

        public move() {
            //get food Objects inside detection Area
            let inAwarenesArea: Array<ƒ.Node> = this.getFoodInArea();
            let segInAwarenesArea: Array<ƒ.Node> = this.getSegmentsInArea();
            let closest: ƒ.Node = null
            let child: ƒ.Node = this.head;
            let closestSegmentDistance: number= null;

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


            if (segInAwarenesArea != undefined) {
                //averageSegmentDistance= this.getAverageDistance(segInAwarenesArea, child.mtxLocal);
                segInAwarenesArea.forEach((value)=>{
                    if(closestSegmentDistance== null){
                        closestSegmentDistance= this.getDistance(value.mtxLocal.translation, child.mtxLocal.translation);
                    } else if(this.getDistance(value.mtxLocal.translation, child.mtxLocal.translation) < closestSegmentDistance){
                        closestSegmentDistance= this.getDistance(value.mtxLocal.translation, child.mtxLocal.translation);
                    }
                });
            } 
            console.log(closestSegmentDistance);
    
                let goRightPos: ƒ.Matrix4x4 = child.mtxLocal.copy;
                goRightPos.rotate(ƒ.Vector3.Y(-90))
                goRightPos.translate(this.dirCurrent);

                let goLeftPos: ƒ.Matrix4x4 = child.mtxLocal.copy;
                goLeftPos.rotate(ƒ.Vector3.Y(90))
                goLeftPos.translate(this.dirCurrent);

                let goStreightPos: ƒ.Matrix4x4 = child.mtxLocal.copy;
                goStreightPos.translate(this.dirCurrent);

                if (closestSegmentDistance!=null && closestSegmentDistance < 2.5) {
                    // let goRightDist = this.getDistance(closestSegment.mtxLocal.translation, goRightPos.translation);
                    // let goLeftDist = this.getDistance(closestSegment.mtxLocal.translation, goLeftPos.translation);
                    // let goStreightDist = this.getDistance(closestSegment.mtxLocal.translation, goStreightPos.translation);

                    let goRightDist= this.getAverageDistance(segInAwarenesArea, goRightPos);
                    let goLeftDist= this.getAverageDistance(segInAwarenesArea, goLeftPos);
                    let goStreightDist= this.getAverageDistance(segInAwarenesArea, goStreightPos);

                    if (goRightDist >= goLeftDist && goRightDist > goStreightDist) {
                        this.rotate(ƒ.Vector3.Y(-90));
                    } else if (goLeftDist > goRightDist && goLeftDist > goStreightDist) {
                        this.rotate(ƒ.Vector3.Y(90));
                    }
                } else if(closest != null) {

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
                if (Math.abs(mtxHead.translation.x) < size+1 && Math.abs(mtxHead.translation.y) < size+1 && Math.abs(mtxHead.translation.z) < size+1)
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

        private getSegmentsInArea(): Array<ƒ.Node> {
            let objectsInArea: Array<ƒ.Node> = new Array<ƒ.Node>();
            this.getChildren().forEach((value, index) => {
                if (this.awarenessArea.isColliding(value) && index > 3) {
                    objectsInArea.push(value);
                }
            });
            return objectsInArea;
        }

        private getDistance(_input1: ƒ.Vector3, _input2: ƒ.Vector3): number {
            let xval: number = Math.abs(_input1.x - _input2.x);
            let yval: number = Math.abs(_input1.y - _input2.y);
            let zval: number = Math.abs(_input1.z - _input2.z);

            return Math.sqrt((xval * xval) + (yval * yval) + (zval * zval));
        }

        private getAverageDistance(_array: Array<ƒ.Node>, _local: ƒ.Matrix4x4): number{
            let addedValue= 0;
            _array.forEach((value)=>{
                addedValue+= this.getDistance(value.mtxLocal.translation, _local.translation)
            });
            return addedValue/ _array.length;
        }
    }
}