import { AccountRepository } from "../repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";

export default class AcceptRide {
	constructor(
		readonly accountRepository: AccountRepository,
		readonly rideRepository: RideRepository
	){}

	async execute(input: Input) {
		const account = await this.accountRepository.getAccountById(input.driverId);
		if (!account.isDriver) throw new Error("Account must be from a Driver");
		const hasActiveRide = await this.rideRepository.hasActiviteRideByDriverId(account.getAccountId());
		if (hasActiveRide) throw new Error("Driver already have an active Ride");
		const ride = await this.rideRepository.getRideById(input.rideId);
		ride.accept(input.driverId);
		await this.rideRepository.updateRide(ride);
	}
}

type Input = {
	rideId: string,
	driverId: string
} 