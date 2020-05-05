namespace L03_SnakeMove {
  import ƒ = FudgeCore;

  window.addEventListener("load", hndLoad);
  export let viewport: ƒ.Viewport;
  let snake: Snake;

  let directions: Array<ƒ.Vector3>;

  let wantedDir: String;
  let currentDirectionIndex: number; //Index for direction inside from direction Array

  function hndLoad(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    ƒ.Debug.log(canvas);

    currentDirectionIndex= 1;
    directions = [ƒ.Vector3.Y(1), ƒ.Vector3.X(1), ƒ.Vector3.Y(-1), ƒ.Vector3.X(-1)];

    snake = new Snake();

    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    cmpCamera.pivot.translateZ(30);
    cmpCamera.pivot.rotateY(180);

    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", snake, cmpCamera, canvas);
    ƒ.Debug.log(viewport);

    document.addEventListener("keydown", hndKeydown);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 10);
  }

  function update(_event: ƒ.Eventƒ): void {
    if (wantedDir == 'right') {
      if ((currentDirectionIndex + 1) >= 4) {
        currentDirectionIndex = 0;
      } else {
        currentDirectionIndex++;
      }
      snake.direction = directions[currentDirectionIndex];
      wantedDir = '';
    } else if (wantedDir == 'left') {
      if ((currentDirectionIndex - 1) <= -1) {
        currentDirectionIndex = 3;
      } else {
        currentDirectionIndex--;
      }
      snake.direction = directions[currentDirectionIndex];
      wantedDir = '';
    }


    viewport.draw();
    snake.move();
    console.log("Loop");
    console.log(currentDirectionIndex);
  }

  function hndKeydown(_event: KeyboardEvent): void {
    switch (_event.code) {
      case ƒ.KEYBOARD_CODE.D: wantedDir = 'right';
        break;
      case ƒ.KEYBOARD_CODE.A: wantedDir = 'left';
        break;
      case ƒ.KEYBOARD_CODE.ARROW_RIGHT: wantedDir = 'right';
        break;
      case ƒ.KEYBOARD_CODE.ARROW_LEFT: wantedDir = 'left';
        break;
    }
  }
}