namespace RTS_V2 {

    export class Flock {
        unit: Unit;
        neighborRadius: number = 5;
        avoidanceRadius: number = 1.5;

        moveweight: number = 0.4;
        avoidanceWeight: number = 0.6;

        squareNeighborRadius: number;
        squareAvoidanceRadius: number;

        constructor(_unit: Unit) {
            this.unit = _unit;
            this.squareNeighborRadius = this.neighborRadius ** 2;
            this.squareAvoidanceRadius = this.avoidanceRadius ** 2;
        }

        public calculateMove(_move: ƒ.Vector3): ƒ.Vector3 {
            let move: ƒ.Vector3 = ƒ.Vector3.ZERO();
            let neighbors: Unit[] = this.getNearbyObjects(this.unit);

            let avoidanceMove: ƒ.Vector3 = this.avoidance(this.unit, neighbors);
            avoidanceMove.scale(this.avoidanceWeight);
            avoidanceMove = this.partialNormalization(avoidanceMove, this.avoidanceWeight);
            let weightedMove: ƒ.Vector3 = _move.copy;
            weightedMove.scale(this.moveweight);
            weightedMove = this.partialNormalization(weightedMove, this.moveweight);

            move.add(avoidanceMove);
            move.add(weightedMove);

            return move;
        }

        private avoidance(_node: Unit, _neighbors: Unit[]): ƒ.Vector3 {
            if (_neighbors.length == 0) {
                return ƒ.Vector3.ZERO();
            }

            let avoidanceMove: ƒ.Vector3 = ƒ.Vector3.ZERO();
            let nAvoide: number = 0;
            for (let element of _neighbors) {
                let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(element.mtxWorld.translation, _node.mtxWorld.translation);
                if (distanceVector.magnitudeSquared < this.squareAvoidanceRadius) {
                    let avoidVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_node.mtxWorld.translation, element.mtxWorld.translation);
                    avoidanceMove.add(avoidVector);
                    nAvoide++;
                }
            }

            if (nAvoide > 0)
                avoidanceMove.scale(1 / nAvoide);

            return avoidanceMove;
        }

        private partialNormalization(_vector: ƒ.Vector3, _weigth: number): ƒ.Vector3 {
            if (_vector.magnitudeSquared > _weigth ** 2) {
                _vector.normalize();
                _vector.scale(_weigth);
            }

            return _vector;
        }

        private getNearbyObjects(_node: Unit): Array<Unit> {
            let nearbyObjects: Unit[] = new Array<Unit>();
            let objects: Unit[] = getUnits();

            for (let value of objects) {
                let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(value.mtxWorld.translation, _node.mtxWorld.translation);
                let distanceSquared: number = distanceVector.magnitudeSquared;
                if (value != _node && distanceSquared < this.squareNeighborRadius) {
                    nearbyObjects.push(value);
                }
            }

            return nearbyObjects;
        }
    }
}