/// <reference path="Food.ts"/>

namespace Snake3D {
  import ƒ = FudgeCore;

  //import ƒAid = FudgeAid;

  window.addEventListener("load", hndLoad);
  export let viewport: ƒ.Viewport;
  export let graph: ƒ.Node;
  export let size: number = 10;
  let food: ƒ.Node;
  let snake: Snake;
  let aISnake: AISnake;
  //let cosys: ƒAid.NodeCoordinateSystem = new ƒAid.NodeCoordinateSystem("ControlSystem");
  ƒ.RenderManager.initialize(true);


  function hndLoad(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    ƒ.Debug.log(canvas);

    graph = new ƒ.Node("Game");
    snake = new Snake("PlayerSnake");
    snake.rotate(ƒ.Vector3.Y(180))
    graph.addChild(snake);
    aISnake = new AISnake();
    graph.addChild(aISnake);
    console.log(snake);

    let foodAmount: number = 30;

    for (var i = 0; i < foodAmount; i++) {
      createNewFood();
    }

    //cosys.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(10))));
    // graph.addChild(cosys);
    createCube();

    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    cmpCamera.pivot.translate(new ƒ.Vector3(5, 10, 40));
    cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
    // cmpCamera.pivot.rotateY(180);

    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, cmpCamera, canvas);
    ƒ.Debug.log(viewport);

    let cmpLightAmbient: ƒ.ComponentLight = new ƒ.ComponentLight(new ƒ.LightAmbient(new ƒ.Color(0.2, 0.2, 0.2)));
    let cmpLightDirectional: ƒ.ComponentLight = new ƒ.ComponentLight(new ƒ.LightDirectional(new ƒ.Color(1, 1, 1)));
    let cmp2LightDirectional: ƒ.ComponentLight = new ƒ.ComponentLight(new ƒ.LightDirectional(new ƒ.Color(1, 1, 1)));

    cmpLightDirectional.pivot.lookAt(new ƒ.Vector3(10, -15, -5))
    cmp2LightDirectional.pivot.lookAt(new ƒ.Vector3(-10, 15, 5))

    graph.addComponent(cmpLightAmbient);
    graph.addComponent(cmpLightDirectional);
    graph.addComponent(cmp2LightDirectional);

    document.addEventListener("keydown", control);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 7);
  }

  function update(_event: ƒ.Eventƒ): void {
    collisionDetection();
    snake.move()
    aISnake.move();
    moveCamera();
    viewport.draw();
  }

  function moveCamera(): void {
    let posCamera: ƒ.Vector3 = aISnake.head.cmpTransform.local.translation.copy;
    posCamera.normalize(70);
    viewport.camera.pivot.translation = posCamera;

    // let transformation: ƒ.Vector3= ƒ.Vector3.TRANSFORMATION(ƒ.Vector3.X(), aISnake.head.mtxLocal, false);
    viewport.camera.pivot.lookAt(ƒ.Vector3.ZERO());
    //console.log(transformation);

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
      case ƒ.KEYBOARD_CODE.D:
        rotation = ƒ.Vector3.Y(-90);
        break;
      case ƒ.KEYBOARD_CODE.ARROW_LEFT:
        rotation = ƒ.Vector3.Y(90);
        break;
      case ƒ.KEYBOARD_CODE.A:
        rotation = ƒ.Vector3.Y(90);
        break;
      case ƒ.KEYBOARD_CODE.SPACE:
        rotation = ƒ.Vector3.Z(-90);
        break;
      default:
        return;
    }

    snake.rotate(rotation);
    console.log(rotation);
    // cosys.mtxLocal.rotate(rotation);
  }

  function collisionDetection(): void {
    for (let i = 3; i < snake.getChildren().length; i++) {
      let segment = snake.getChildren()[i];
      if (snake.collisionSphere.isColliding(segment)) {
        console.log("Collision")
        gameover();
      }
    }

    for (let i = 3; i < aISnake.getChildren().length; i++) {
      let segment = aISnake.getChildren()[i];
      if (aISnake.collisionSphere.isColliding(segment)) {
        console.log("Collision")
        gameover();
      }
    }

    graph.getChildrenByName("Food").forEach((value) => {
      if (snake.collisionSphere.isColliding(value)) {
        graph.removeChild(value);
        createNewFood();
        snake.grow(1);
      }

      if (aISnake.collisionSphere.isColliding(value)) {
        graph.removeChild(value);
        createNewFood();
        aISnake.grow(1);
      }
    })

    // if ( food!=null && snake.isColliding(food)) {
    //   graph.removeChild(food);
    //   createNewFood();
    //   snake.addNewSnakePart();
    // }
  }

  function gameover(): void {
    //window.location.reload();
    ƒ.Loop.stop();
  }

  function createNewFood(): void {
    let newFood: Food;
    let checkCollision: Boolean;
    do {
      checkCollision = true;
      newFood = new Food();
      for (let snakeSegment of aISnake.getChildren()) {
        if (newFood != null && newFood.collisionSphere.isColliding(snakeSegment)) {
          checkCollision = false;
          return;
        }
      }

      graph.getChildrenByName("Food").forEach((value) => {
        if (newFood != null && newFood.collisionSphere.isColliding(value)) {
          checkCollision = false;
          return;
        }
      });

    } while (!checkCollision);

    food = newFood;
    graph.appendChild(food);
  }

  function createCube() {
    let mesh: ƒ.MeshCube = new ƒ.MeshCube();
    let mtrPlayfield: ƒ.Material = new ƒ.Material("playfield", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.4, 0.4, 0.6, 0.5)));

    let cube: ƒ.Node = new ƒ.Node("playfield");
    cube.addComponent(new ƒ.ComponentMesh(mesh));
    cube.addComponent(new ƒ.ComponentMaterial(mtrPlayfield));
    cube.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE((size * 2) - 1))));

    graph.addChild(cube);
  }

}