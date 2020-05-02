namespace SnakeGame {
    import ƒ = FudgeCore;

    export class Snake extends ƒ.Node {
        public snakeSegmentList: Array<ƒ.Node>;
        public direction: ƒ.Vector3 = ƒ.Vector3.X();

        constructor() {
            super("Snake");
            this.snakeSegmentList = new Array<ƒ.Node>();
            this.create(1);
        }

        create(_segments: number): void {
            let mesh = new ƒ.MeshQuad();
            let mtrSolidGreen = new ƒ.Material("SolidGreen", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("green")));

            for (let i = 0; i < _segments; i++) {
                let segment: ƒ.Node = new ƒ.Node("SnakeSegment"); //Node for our Object

                let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh); //attache Mesh to Node
                cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.8));
                segment.addComponent(cmpMesh); //Add Component into node component Map

                let cmpMat: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidGreen); //attache Mesh to Node
                segment.addComponent(cmpMat); //Add Component into node component Map

                segment.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-1 * i, 0, 0))));
                // node.mtxLocal.scale(ƒ.Vector3.ONE(0.8));
                this.appendChild(segment);
                this.snakeSegmentList.push(segment);
            }
        }

        move() : void {
            let newhead: ƒ.Node = this.createSnakePart(); // create a new snake part

            let currentHeadPos = this.snakeSegmentList[0].cmpTransform.local.translation; //get the position of the head of the snake
            let snakeEnd: ƒ.Node = this.snakeSegmentList.pop(); //get last Snakepart and delete it from the Array

            if((currentHeadPos.x+ this.direction.x)>13){
                currentHeadPos= new ƒ.Vector3(-13, currentHeadPos.y, 0);
            } else if((currentHeadPos.x+ this.direction.x)<-13){
                currentHeadPos= new ƒ.Vector3(13, currentHeadPos.y, 0);
            } else if((currentHeadPos.y+ this.direction.y)>9){
                currentHeadPos= new ƒ.Vector3(currentHeadPos.x, -9, 0);
            } else if((currentHeadPos.y+ this.direction.y)<-9){
                currentHeadPos= new ƒ.Vector3(currentHeadPos.x, 9, 0);
            } else {
                currentHeadPos.add(this.direction)
            }
            //currentHeadPos.add(this.direction)
            
            newhead.cmpTransform.local.translate(currentHeadPos)

            this.snakeSegmentList.unshift(newhead); //add part at the beginning of array

            this.addChild(newhead); //add new part to snakenode
            this.removeChild(snakeEnd); //delete End part from snakenode
        }

        isColliding(_inputObject: ƒ.Node): boolean{
            let snakeHead: ƒ.Node= this.snakeSegmentList[0];
            let snakeHeadPos: ƒ.Vector3= snakeHead.cmpTransform.local.translation;
            let snakeHeadScale: ƒ.Vector3= snakeHead.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;
            let inputPos: ƒ.Vector3= _inputObject.cmpTransform.local.translation;
            let inputScale: ƒ.Vector3= _inputObject.getComponent(ƒ.ComponentMesh).pivot.scaling.copy;

            let rect1: ƒ.Rectangle= new ƒ.Rectangle(snakeHeadPos.x, snakeHeadPos.y, snakeHeadScale.x, snakeHeadScale.y, ƒ.ORIGIN2D.CENTER);
            let rect2: ƒ.Rectangle= new ƒ.Rectangle(inputPos.x, inputPos.y, inputScale.x, inputScale.y, ƒ.ORIGIN2D.CENTER);

            return rect1.collides(rect2);
        }

        createSnakePart(): ƒ.Node{
            let mesh = new ƒ.MeshQuad();
            let mtrSolidGreen = new ƒ.Material("SolidGreen", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("green")));

            let node: ƒ.Node = new ƒ.Node("Snakepart");

            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh); //attache Mesh to Node
            cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.8));
            node.addComponent(cmpMesh); //Add Component into node component Map
    
            let cmpMat: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidGreen); //attache Mesh to Node
            node.addComponent(cmpMat); //Add Component into node component Map
    
            node.addComponent(new ƒ.ComponentTransform());
            return node;
        }

        addNewSnakePart(): void{
            let newpart: ƒ.Node= this.createSnakePart();
            this.snakeSegmentList.push(newpart);
            this.appendChild(newpart);
        }
    }
}