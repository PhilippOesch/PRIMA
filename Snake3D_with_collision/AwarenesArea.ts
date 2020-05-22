/// <reference path="CollisionSphere.ts"/>

namespace Snake3D {
    import ƒ = FudgeCore;

    export class AwarenesArea extends CollisionSphere{
        size: number;

        constructor(_size: number, _parentNode: ƒ.Node){
            super(_parentNode)
            this.size= _size;
        }

        public isColliding(_inputObject: ƒ.Node): boolean {

            let snakeHeadPos: ƒ.Vector3 =  this.parentnode.cmpTransform.local.translation;
            console.log(snakeHeadPos)
            let snakeHeadScale: number =  this.size;
            let inputPos: ƒ.Vector3 = _inputObject.mtxLocal.translation;
            let inputScale: ƒ.Vector3 = _inputObject.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
      
            let xval: number = Math.abs(snakeHeadPos.x - inputPos.x);
            let yval: number = Math.abs(snakeHeadPos.y - inputPos.y);
            let zval: number = Math.abs(snakeHeadPos.z - inputPos.z);
      
            let distance: number = Math.sqrt((xval * xval) + (yval * yval) + (zval * zval));
      
            if (distance < (snakeHeadScale / 2 + inputScale.x / 2)) {
              return true
            } else {
              return false
            }
          }

    }

}