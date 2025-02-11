import DistanceCalculator from "../service/DistanceCalculator";
import Coord from "../vo/Coord";
import UUID from "../vo/UUID";
import Position from "./Position";

export default class Ride {
    private rideId: UUID;
    private passengerId: UUID;
    private driverId?: UUID;
    private from: Coord;
    private to: Coord;

    constructor(
        rideId: string, 
        passengerId: string, 
        driverId: string | null, 
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number,
        private status: string,
        private fare: number,
        private distance: number,
        readonly date: Date
    ) {
        this.rideId = new UUID(rideId);
        this.passengerId = new UUID(passengerId);
        if (driverId) this.driverId = new UUID(driverId);
        this.from = new Coord(fromLat, fromLong);
        this.to = new Coord(toLat, toLong);
    }

    static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
        const rideId = UUID.create();
        const fare = 0;
        const distance = 0;
        const date = new Date();
        const status = "requested";
        return new Ride(rideId.getValue(), passengerId, null, fromLat, fromLong, toLat, toLong, status, fare, distance, date);
    }

    accept(driverId: string) {
        this.driverId = new UUID(driverId);
        if (this.status !== "requested") throw new Error("Invalid status");
        this.status = "accepted";
    }

    start() {
        if (this.status !== "accepted") throw new Error("Invalid status");
        this.status = "in_progress";
    }

    finish(positions: Position[]) {
        if (this.status !== "in_progress") throw new Error("Invalid status");
        this.status = 'completed';
        for(const [index, position] of positions.entries()) {
            const nextPosition = positions[index + 1];
            if (!nextPosition) break;
            const distance = DistanceCalculator.calculateDistanceBetweenPositions([position, nextPosition]);
            if (position.date.getDay() === 0) {
                this.fare += distance * 5;
            } else {
                if (position.date.getHours() > 22 || position.date.getHours() < 6 ) {
                    this.fare += distance * 3.9;
                } else {
                    this.fare += distance * 2.1;
                }
            }
            this.distance += distance;
        }
    }

    getDistance() {
        return this.distance;
    }

    getFare() {
        return this.fare;
    }

    getStatus() {
        return this.status;
    }

    getFrom() {
        return this.from;
    }

    getTo() {
        return this.to;
    }

    getRideId() {
        return this.rideId.getValue();
    }

    getPassengerId() {
        return this.passengerId.getValue();
    }

    getDriverId() {
        return this.driverId?.getValue();
    }    
}