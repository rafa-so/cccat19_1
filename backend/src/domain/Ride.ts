import Coord from "./vo/Coord";
import UUID from "./vo/UUID";

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
        readonly status: string,
        readonly fare: number,
        readonly distance: number,
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