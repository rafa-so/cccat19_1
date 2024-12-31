import Ride from "./Ride";
import DatabaseConnection from "./DatabaseConnecction";

export interface RideRepository {
	saveRide (ride: Ride): Promise<void>;
	getRideById (id: string): Promise<Ride>;
	hasActiviteRideByPassengerId(passengerId: string): Promise<boolean>;
}

export default class RideRepositoryDatabase implements RideRepository {
	constructor(readonly connection: DatabaseConnection){}

	async getRideById( rideId: string ) {
		const [rideData] = await this.connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
		return new Ride(
			rideData.ride_id, 
			rideData.passenger_id, 
			rideData.driver_id, 
			parseFloat(rideData.from_lat), 
			parseFloat(rideData.from_long), 
			parseFloat(rideData.to_lat), 
			parseFloat(rideData.to_long), 
			rideData.status, 
			parseFloat(rideData.fare), 
			parseFloat(rideData.distance), 
			rideData.date
		);
	}
	
	async saveRide(ride: any) {
		await this.connection.query("INSERT INTO ccca.ride (ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long, fare, distance, status, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
			[ride.rideId, ride.passengerId, ride.driver_id, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.fare, ride.distance, ride.status, ride.date]
		)
	}

	async hasActiviteRideByPassengerId( passengerId: string ) {
		const [rideData] = await this.connection.query("SELECT 1 FROM ccca.ride WHERE passenger_id = $1 AND status NOT IN ('completed', 'cancelled') LIMIT 1", [passengerId]);
		return !!rideData;
	}
}

export class RideRepositoryMemory implements RideRepository {
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

	async hasActiviteRideByPassengerId( passengerId: string ) {
		const rideData = this.accounts.filter((element: any) => element.status !== 'completed');
		return rideData.length > 0;
	}
}