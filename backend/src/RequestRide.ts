import crypto from "crypto";
import { AccountDAO } from "./AccoundDAO";
import { RideDAO } from "./RideDAO";

export default class RequestRide {
	constructor(
		readonly accountDAO: AccountDAO,
		readonly rideDAO: RideDAO
	){}

	async execute(input: Input) {
		const ride = { 
			rideId: crypto.randomUUID(),
			passengerId: input.passengerId,
			fromLat: input.fromLat,
			fromLong: input.fromLong,
			toLat: input.toLat,
			toLong: input.toLong,
			status: 'requested',
			fare: 0,
			distance: 0,
			date: new Date()

		};

		const accountData = await this.accountDAO.getAccountById(input.passengerId);
		if (!accountData.isPassenger) throw new Error("Account must be from a passenger");

		await this.rideDAO.saveRide(ride);
		return { rideId: ride.rideId };
	}
}

type Input = {
	passengerId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number
} 