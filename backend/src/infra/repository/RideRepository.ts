import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConnecction";

export interface RideRepository {
	saveRide (ride: Ride): Promise<void>;
	getRideById (rideId: string): Promise<Ride>;
	hasActiviteRideByPassengerId(passengerId: string): Promise<boolean>;
	hasActiviteRideByDriverId(driverId: string): Promise<boolean>;
	updateRide (ride: Ride): Promise<void>;
}

export default class RideRepositoryDatabase implements RideRepository {
	constructor(readonly connection: DatabaseConnection){}
	async updateRide(ride: Ride): Promise<void> {
		await this.connection.query("UPDATE ccca.ride SET status = $1, driver_id = $2 WHERE ride_id = $3",
			[ride.getStatus(), ride.getDriverId(), ride.getRideId()]
		);
	}

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
	
	async saveRide(ride: Ride) {
		await this.connection.query("INSERT INTO ccca.ride (ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long, fare, distance, status, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
			[ride.getRideId(), ride.getPassengerId(), ride.getDriverId(), ride.getFrom().getLat(), ride.getFrom().getLong(), ride.getTo().getLat(), ride.getTo().getLong(), ride.fare, ride.distance, ride.getStatus(), ride.date]
		);
	}

	async hasActiviteRideByPassengerId( passengerId: string ) {
		const [rideData] = await this.connection.query("SELECT 1 FROM ccca.ride WHERE passenger_id = $1 AND status NOT IN ('completed', 'cancelled') LIMIT 1", [passengerId]);
		return !!rideData;
	}

	async hasActiviteRideByDriverId( driverId: string ) {
		const [rideData] = await this.connection.query("SELECT 1 FROM ccca.ride WHERE driver_id = $1 AND status NOT IN ('completed', 'cancelled') LIMIT 1", [driverId]);
		return !!rideData;
	}
}

export class RideRepositoryMemory implements RideRepository {
	rides: any[];

	constructor() {
		this.rides = [];
	}
	
	async getRideById(rideId: string ) {
		return this.rides.find((ride: any) => ride.rideId === rideId);
	}
	
	async saveRide(ride: any) {
		this.rides.push(ride);
	}

	async hasActiviteRideByPassengerId( passengerId: string ) {
		const rideData = this.rides.filter((element: any) => element.status !== 'completed');
		return rideData.length > 0;
	}

	async hasActiviteRideByDriverId( passengerId: string ) {
		const rideData = this.rides.filter((element: any) => element.status !== 'completed');
		return rideData.length > 0;
	}

	async updateRide(ride: Ride) {
		const rideData = this.rides.find((element: any) => element.rideId === ride.getRideId());
	}
}