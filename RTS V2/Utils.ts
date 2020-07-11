namespace RTS_V2 {
    import ƒ = FudgeCore;

    export module Utils {
        export function adjustLookAtToGameworld(_lookAtPos: ƒ.Vector3, _node: ƒ.Node): void {
            let adjustetLookAtToWorld: ƒ.Vector3 = _lookAtPos.copy;
            adjustetLookAtToWorld.subtract(_node.mtxWorld.translation.copy);
            _node.mtxLocal.lookAt(adjustetLookAtToWorld, ƒ.Vector3.Z());
            _node.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
        }

        export function createTargetPosArray(_pos: ƒ.Vector3, _distance: number, _positionCount: number): ƒ.Vector3[] {
            let targetPosArray: Array<ƒ.Vector3> = new Array<ƒ.Vector3>();
            for (let i = 0; i < _positionCount; i++) {
                let angle: number = i * (360 / _positionCount);
                let dir: ƒ.Vector3 = new ƒ.Vector3(1, 0, 0);
                dir.transform(ƒ.Matrix4x4.ROTATION_Z(angle));
                dir.normalize(_distance);
                let position: ƒ.Vector3 = _pos.copy;
                position.add(dir);
                targetPosArray.push(position);
            }
    
            return targetPosArray;
        }

    }
}