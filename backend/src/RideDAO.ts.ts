import pgp from "pg-promise";

export interface RideDAO {
    saveRide(ride: any): Promise<any>;
    getRideById(rideId: string): Promise<any>;
    hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
}

export default class RideDAODatabase implements RideDAO {
    async getRideById(rideId: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [rideData] = await connection.query("SELECT * FROM ccca.ride WHERE ride_id = $1", [ rideId ]);
        await connection.$pool.end();
        if (!rideData) return;
        return {
            rideId: rideData.ride_id,
            passengerId: rideData.passenger_id,
            driverId: rideData.driver_id,
            fromLat: parseFloat(rideData.from_lat),
            fromLong: parseFloat(rideData.from_long),
            toLat: parseFloat(rideData.to_lat),
            toLong: parseFloat(rideData.to_long),
            fare: parseFloat(rideData.fare),
            distance: parseFloat(rideData.distance),
            status: rideData.status,
            date: rideData.date,
        };
    }

    async saveRide(ride: any) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("insert into ccca.ride (ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long, fare, distance, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", 
            [ride.rideId, ride.passengerId, ride.driverId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.fare, ride.distance, ride.status, ride.date]
        );
        await connection.$pool.end();
    }

    async hasActiveRideByPassengerId(passengerId: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [rideData] = await connection.query("SELECT 1 FROM ccca.ride WHERE passenger_id = $1 AND status NOT IN ('completed', 'cancelled') LIMIT 1", [ passengerId ]);
        await connection.$pool.end();
        return !!rideData;
    }
}
