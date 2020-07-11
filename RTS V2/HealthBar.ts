namespace RTS_V2 {
    import ƒ = FudgeCore;
    //import ƒUi = FudgeUserInterface;

    export class Healthbar /* implements ƒ.MutableForUserInterface*/{
        element: HTMLProgressElement;
        // element: HTMLElement;
        unit: Unit;
        //uiController: ƒUi.Controller;
        health: number = 0;

        constructor(_unit: Unit) {
            this.unit = _unit;
            this.health = this.unit.getHealth;
            this.element = document.createElement("progress");
            //this.element = document.createElement("custom-healtbar");
            this.element.value = this.health;
            this.element.setAttribute("value", this.health + "");
            this.element.setAttribute("key", "health");
            this.element.setAttribute("min", "0");
            //this.element.max = 100;
            this.element.setAttribute("max", "1");
            document.body.appendChild(this.element);
            if (this.unit.isPlayer) {
                this.element.classList.add("player");
            } else {
                this.element.classList.add("enemy");
            }
            //this.uiController = new ƒUi.Controller(this, this.element);

            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
        }

        // public getMutator(): ƒ.Mutator {
        //     let mutator: ƒ.Mutator = {};
        //     this.updateMutator(mutator);
        //     return mutator;
        // }

        // public updateMutator(_mutator: ƒ.Mutator): void {
        //     _mutator.health = this.health;
        //     //console.log(this.health);
        // }

        public update(): void {
            let camera: ƒ.ComponentCamera = viewport.camera;
            let projection: ƒ.Vector3 = camera.project(this.unit.mtxWorld.translation.copy);
            let screenPos: ƒ.Vector2 = viewport.pointClipToClient(projection.toVector2());
            this.element.style.left = screenPos.x + "px";
            this.element.style.top = screenPos.y + "px";
            this.element.setAttribute("value", this.unit.getHealth + "")
        }

        public delete(){
            ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            document.body.removeChild(this.element);
        }
    }
}