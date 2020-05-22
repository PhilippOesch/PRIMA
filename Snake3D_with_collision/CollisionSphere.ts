namespace Snake3D {
    import ƒ = FudgeCore;

    export class CollisionSphere {
        protected parentnode: ƒ.Node
        
        constructor(_parentnode: ƒ.Node) {
            this.parentnode= _parentnode
        }

        public isColliding(_inputObject: ƒ.Node): boolean {
            let snakeHeadPos: ƒ.Vector3 =  this.parentnode.cmpTransform.local.translation;
            let snakeHeadScale: ƒ.Vector3 =  this.parentnode.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            let inputPos: ƒ.Vector3 = _inputObject.mtxLocal.translation;
            let inputScale: ƒ.Vector3 = _inputObject.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
      
            let xval: number = Math.abs(snakeHeadPos.x - inputPos.x);
            let yval: number = Math.abs(snakeHeadPos.y - inputPos.y);
            let zval: number = Math.abs(snakeHeadPos.z - inputPos.z);
      
            let distance: number = Math.sqrt((xval * xval) + (yval * yval) + (zval * zval));
      
            if (distance < (snakeHeadScale.x / 2 + inputScale.x / 2)) {
              return true
            } else {
              return false
            }
          }
    }

}