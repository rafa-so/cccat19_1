import { AccountRepository } from "../repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";
import Ride from "../../domain/Ride";

export default class AcceptRide {
	constructor(
		readonly accountRepository: AccountRepository,
		readonly rideRepository: RideRepository
	){}

	async execute(input: Input) {
		const account = await this.accountRepository.getAccountById(input.driverId);
		if (!account.isDriver) throw new Error("Account must be from a Driver");
	}
}

type Input = {
	rideId: string,
	driverId: string
} 