namespace L05_Snake3DStart {
  import ƒ = FudgeCore;

  window.addEventListener("load", hndLoad);
  export let viewport: ƒ.Viewport;
  let scene: ƒ.Node;
  let snake: Snake;
  let playfield: ƒ.Node;
  let cmpCamera: ƒ.ComponentCamera;


  function hndLoad(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    ƒ.Debug.log(canvas);

    scene = new ƒ.Node("scene");
    playfield = createSpielfeld();
    scene.appendChild(playfield)
    snake = new Snake();


    playfield.cmpTransform.local.rotateY(20);
    playfield.cmpTransform.local.translateY(-2);
    playfield.appendChild(snake);

    cmpCamera= new ƒ.ComponentCamera();
    cmpCamera.pivot.translate(new ƒ.Vector3(5, 10, 40));
    cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());


    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", scene, cmpCamera, canvas);
    ƒ.Debug.log(viewport);

    // let axisVertical = new ƒ.Axis("Vertical", 1, ƒ.CONTROL_TYPE.PROPORTIONAL, true);
    // axisVertical.addControl(new ƒ.Control())

    document.addEventListener("keydown", control);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 5);
  }

  function update(_event: ƒ.Eventƒ): void {
    viewport.draw();
    moveCamera();
    collisionDetection();
    snake.move();
  }

  function control(_event: KeyboardEvent): void {
    // let direction: ƒ.Vector3;
    // direction = ƒ.Keyboard.mapToValue(ƒ.Vector3.Y(), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.W]);
    // direction.add(ƒ.Keyboard.mapToValue(ƒ.Vector3.Y(-1), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.S]));

    // if (direction.y == 0) {
    //   direction = ƒ.Keyboard.mapToValue(ƒ.Vector3.X(), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.D]);
    //   direction.add(ƒ.Keyboard.mapToValue(ƒ.Vector3.X(-1), ƒ.Vector3.ZERO(), [ƒ.KEYBOARD_CODE.A]));
    // }

    // if (!direction.equals(ƒ.Vector3.ZERO()))
    //   snake.direction = direction;

    let rotation: ƒ.Vector3 = ƒ.Vector3.ZERO();

    switch (_event.code) {
      case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
        rotation = ƒ.Vector3.Y(-90);
        break;
      case ƒ.KEYBOARD_CODE.ARROW_LEFT:
        rotation = ƒ.Vector3.Y(90);
        break;
      case ƒ.KEYBOARD_CODE.SPACE:
        rotation = ƒ.Vector3.Z(-90);
        break;
      default:
        return;
    }

    snake.rotate(rotation);
    // cosys.mtxLocal.rotate(rotation);
  }

  function createSpielfeld() {
    let mesh: ƒ.MeshCube = new ƒ.MeshCube();
    let mtrSolidGrey: ƒ.Material = new ƒ.Material("SolidGrey", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("GREY")));

    let feld: ƒ.Node = new ƒ.Node("Spielfeld");

    let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
    cmpMesh.pivot.scale(new ƒ.Vector3(10, 10, 10))
    let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidGrey);
    let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform()

    feld.addComponent(cmpMesh);
    feld.addComponent(cmpMaterial)
    feld.addComponent(cmpTransform);

    return feld;
  }

  function gameover(): void {
    window.location.reload();
  }

  function moveCamera(): void {
    let posCamera: ƒ.Vector3 = ƒ.Vector3.NORMALIZATION(snake.getChildren()[0].mtxLocal.translation, 30);
    viewport.camera.pivot.translation = posCamera;
    viewport.camera.pivot.lookAt(ƒ.Vector3.ZERO());
  }

  function collisionDetection(): void {
    for (let i = 3; i < snake.getChildren().length; i++) {
      let segment = snake.getChildren()[i];
      if (snake.isColliding(segment)) {
        console.log("Collision")
        gameover();
      }
    }
  }
}