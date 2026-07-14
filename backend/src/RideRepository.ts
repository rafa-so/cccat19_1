import pgp from "pg-promise";
import Ride from "./Ride";
import DatabaseConnection from "./DatabaseConnection";

export interface RideRepository {
    saveRide(ride: Ride): Promise<void>;
    getRideById(rideId: string): Promise<Ride>;
    hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
}

export default class RideRepositoryDatabase implements RideRepository {

    constructor(readonly connection: DatabaseConnection) {}

    async getRideById(rideId: string): Promise<Ride> {
        const [rideData] = await this.connection.query("SELECT * FROM ccca.ride WHERE ride_id = $1", [ rideId ]);
        return new Ride(
            rideData.ride_id,
            rideData.passenger_id,
            rideData.driver_id,
            parseFloat(rideData.from_lat),
            parseFloat(rideData.from_long),
            parseFloat(rideData.to_lat),
            parseFloat(rideData.to_long),
            parseFloat(rideData.fare),
            parseFloat(rideData.distance),
            rideData.status,
            rideData.date
        );
    }

    async saveRide(ride: Ride) {
        await this.connection.query("insert into ccca.ride (ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long, fare, distance, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", 
            [ride.rideId, ride.passengerId, ride.driverId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.fare, ride.distance, ride.status, ride.date]
        );
    }

    async hasActiveRideByPassengerId(passengerId: string) {
        const [rideData] = await this.connection.query("SELECT 1 FROM ccca.ride WHERE passenger_id = $1 AND status NOT IN ('completed', 'cancelled') LIMIT 1", [ passengerId ]);
        return !!rideData;
    }
}
