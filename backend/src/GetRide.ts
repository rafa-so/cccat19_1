import crypto from "crypto";
import { AccountDAO } from "./AccoundDAO";
import { RideDAO } from "./RideDAO";

export default class GetRide {
	constructor(
		readonly accountDAO: AccountDAO,
		readonly rideDAO: RideDAO
	){}

	async execute(rideId: string) {
		const rideData = await this.rideDAO.getRideById(rideId);
		return rideData;	
	}
}