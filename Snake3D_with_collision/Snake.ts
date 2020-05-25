namespace Snake3D {
  import ƒ = FudgeCore;
  //import ƒAid = FudgeAid;

  export class Snake extends ƒ.Node {
    public head: ƒ.Node;
    protected dirCurrent: ƒ.Vector3 = ƒ.Vector3.X();
    protected dirNew: ƒ.Vector3;
    public collisionSphere: CollisionSphere;
    protected mesh: ƒ.MeshCube;
    protected material: ƒ.Material;

    constructor(_name: string, _material: ƒ.Material= new ƒ.Material("SnakeMaterial", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")))) {
      super(_name);
      console.log("Creating Snake");
      this.mesh = new ƒ.MeshCube();
      this.material= _material
      this.grow(4);
      this.head = this.getChild(0);
      this.collisionSphere= new CollisionSphere(this.head);
    }

    public move(): void {
      this.dirCurrent = this.dirNew || this.dirCurrent;
      let child: ƒ.Node = this.head;
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

    public set direction(_new: ƒ.Vector3) {
      if (this.dirCurrent.equals(ƒ.Vector3.SCALE(_new, -1)))
        return;
      console.log(this.dirCurrent, _new);
      this.dirNew = _new;
    }

    public rotate(_rotation: ƒ.Vector3): void {
      this.head.mtxLocal.rotate(_rotation);
    }

    protected createSegment(): ƒ.Node {
      let segment: ƒ.Node = new ƒ.Node("Segment");

      let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(this.mesh);
      segment.addComponent(cmpMesh);
      cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.8));

      let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(this.material);
      segment.addComponent(cmpMaterial);

      let mtxSegment: ƒ.Matrix4x4 = new ƒ.Matrix4x4();
      if (this.nChildren)
        mtxSegment = this.getChild(this.nChildren - 1).mtxLocal.copy;
      segment.addComponent(new ƒ.ComponentTransform(mtxSegment));

      return segment;
    }

    public grow(_nSegments: number): void {
      if (_nSegments < 0)
        return;

      for (let i: number = 0; i < _nSegments; i++) {
        let segment: ƒ.Node = this.createSegment();
        this.appendChild(segment);
      }
    }
  }
}