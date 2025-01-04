import { AccountRepository } from "../repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";
import Ride from "../../domain/Ride";

export default class RequestRide {
	constructor(
		readonly accountRepository: AccountRepository,
		readonly rideRepository: RideRepository
	){}

	async execute(input: Input) {
		const accountData = await this.accountRepository.getAccountById(input.passengerId);
		if (!accountData.isPassenger) throw new Error("Account must be from a passenger");
		const hasActiviteRide = await this.rideRepository.hasActiviteRideByPassengerId(input.passengerId);
		const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
		if (hasActiviteRide) throw new Error("Passenger already have an active ride"); 
		await this.rideRepository.saveRide(ride);
		return { rideId: ride.getRideId()};
	}
}

type Input = {
	passengerId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number
} 