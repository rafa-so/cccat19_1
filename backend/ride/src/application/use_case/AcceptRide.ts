import AccountGateway from "../../infra/gateway/AccountGateway";
import { RideRepository } from "../../infra/repository/RideRepository";

export default class AcceptRide {
	constructor(
		readonly accountGateway: AccountGateway,
		readonly rideRepository: RideRepository
	){}

	async execute(input: Input) {
		const account = await this.accountGateway.getAccountById(input.driverId);
		if (!account.isDriver) throw new Error("Account must be from a Driver");
		const hasActiveRide = await this.rideRepository.hasActiviteRideByDriverId(account.accountId);
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