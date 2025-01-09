import { AccountRepository } from "../repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";
import Account from "../../domain/Account";

export default class GetRide {
	constructor(
		readonly accountRepository: AccountRepository,
		readonly rideRepository: RideRepository
	){}

	async execute(rideId: string): Promise<Output>{
		const ride = await this.rideRepository.getRideById(rideId);
		const passengerAccount: Account = await this.accountRepository.getAccountById(ride.getPassengerId());

		console.log(ride);

		return { 
			rideId: ride.getRideId(),
			passengerId: ride.getPassengerId(),
			driverId: ride.getDriverId(),
			fromLat: ride.getFrom().getLat(),
			fromLong: ride.getFrom().getLong(),
			toLat: ride.getTo().getLat(),
			toLong: ride.getTo().getLong(),
			status: ride.getStatus(),
			fare: ride.fare,
			distance: ride.distance,
			date: ride.date, 
			passengerName: passengerAccount.getName()
		}
	}
}

type Output = {
	rideId: string,
	passengerId: string,
	passengerName: string,
	driverId?: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
	fare: number,
	distance: number,
	status: string,
	date: Date
}