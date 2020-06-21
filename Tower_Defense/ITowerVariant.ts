/// <reference path="Tower.ts"/>

namespace TowerDefense{
    export class ITowerVariant extends ITower{
        protected init(): void {
            this.range= 12;
            this.cannon1RelPos= ƒ.Vector3.Z(-4);
            this.cannon2RelPos= ƒ.Vector3.Z(4);
            this.xScale= 4;
            this.zScale= 12;
            this.createNodes();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
            // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.fireProjectile);
            // ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 1);
        }
    }
}