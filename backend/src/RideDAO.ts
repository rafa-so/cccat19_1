import pgp from "pg-promise";

export interface RideDAO {
	saveRide (ride: any): Promise<any>;
	getRideById (id: string): Promise<any>;
}

export default class RideDAODatabase implements RideDAO {
	async getRideById( rideId: string ) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [rideData] = await connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
		await connection.$pool.end();
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
			date: rideData.date
		};
	}
	
	async saveRide(ride: any) {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("INSERT INTO ccca.ride (ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long, fare, distance, status, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
			[ride.rideId, ride.passengerId, ride.driver_id, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.fare, ride.distance, ride.status, ride.date]
		)
		await connection.$pool.end();
	}
}

export class RideDAOMemory implements RideDAO {
	accounts: any[];

	constructor() {
		this.accounts = [];
	}
	
	async getRideById(rideId: string ) {
		return this.accounts.find((ride: any) => ride.rideId === rideId);
	}
	
	async saveRide(ride: any) {
		this.accounts.push(ride);
	}
}