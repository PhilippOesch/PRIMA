namespace L05_Snake3DStart {
  import ƒ = FudgeCore;

  export class Snake extends ƒ.Node {
    private dirCurrent: ƒ.Vector3 = ƒ.Vector3.X();
    private dirNew: ƒ.Vector3;

    constructor() {
      super("Snake");
      console.log("Creating Snake");
      this.createSegement(4);
    }

    public move(): void {
      this.dirCurrent = this.dirNew || this.dirCurrent;
      let child: ƒ.Node = this.getChildren()[0];
      let cmpPrev: ƒ.ComponentTransform = child.getComponent(ƒ.ComponentTransform); 
      let mtxHead: ƒ.Matrix4x4;
      while (true) {
        mtxHead = cmpPrev.local.copy;
        mtxHead.translate(this.dirCurrent);
        if (Math.abs(mtxHead.translation.x) < 6 && Math.abs(mtxHead.translation.y) < 6 && Math.abs(mtxHead.translation.z) < 6)
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

    public set direction(_new: ƒ.Vector3) {
      if (this.dirCurrent.equals(ƒ.Vector3.SCALE(_new, -1)))
      return;
      //console.log(this.dirCurrent, _new);
      this.dirNew = _new;
    }
    
    public rotate(_rotation: ƒ.Vector3): void {
      let head: ƒ.Node = this.getChildren()[0];
      head.mtxLocal.rotate(_rotation);
    }

    private createSegement(_segments: number): void {
      let mesh: ƒ.MeshCube = new ƒ.MeshCube();
      let mtrSolidGreen: ƒ.Material = new ƒ.Material("SolidGreen", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));

      for (let i: number = 0; i < _segments; i++) {
        let segment: ƒ.Node = new ƒ.Node("Segment");

        let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
        segment.addComponent(cmpMesh);
        cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.8));

        let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidGreen);
        segment.addComponent(cmpMaterial);

        segment.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-1 * i, 0, 0))));

        this.appendChild(segment);
      }
    }

    public isColliding(_inputObject: ƒ.Node): boolean{
      let snakeHead: ƒ.Node= this.getChildren()[0];
      let snakeHeadPos: ƒ.Vector3= snakeHead.cmpTransform.local.translation;
      let snakeHeadScale: ƒ.Vector3= snakeHead.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
      let inputPos: ƒ.Vector3= _inputObject.cmpTransform.local.translation;
      let inputScale: ƒ.Vector3= _inputObject.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;

      let xval= snakeHeadPos.x-inputPos.x
      let yval= snakeHeadPos.y-inputPos.y
      let zval= snakeHeadPos.z-inputPos.z

      let distance= Math.sqrt((xval* xval)+ (yval* yval)+ (zval* zval));
      
      if(distance<= (snakeHeadScale.x+ inputScale.x)){
        return true
      } else {
        return false
      }
    }
  }
}