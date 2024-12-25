import crypto from "crypto";
import { AccountRepository } from "./AccountRepository";
import { RideRepository } from "./RideRepository";
import Account from "./Account";

export default class GetRide {
	constructor(
		readonly accountRepository: AccountRepository,
		readonly rideRepository: RideRepository
	){}

	async execute(rideId: string): Promise<Output>{
		const ride = await this.rideRepository.getRideById(rideId);
		const passengerAccount: Account = await this.accountRepository.getAccountById(ride.passengerId);
		return { ...ride, passengerName: passengerAccount.name }
	}
}

type Output = {
	rideId: string,
	passengerId: string,
	passengerName: string,
	driverId: string | null,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
	fare: number,
	distance: number,
	status: string,
	date: Date
}