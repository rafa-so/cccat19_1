import { AccountDAO } from "./AccoundDAO";
import { RideDAO } from "./RideDAO";

export default class RequestRide {
	constructor(
		readonly accountDAO: AccountDAO,
		readonly rideDAO: RideDAO
	){}

	async execute(input: any) {
		const ride = {
			rideId: crypto.randomUUID()
		};

		await this.rideDAO.saveRide(ride);
		return {
			rideId: ride.rideId
		};
	}
}

export interface SignupData {
	saveAccount (account: any): Promise<any>;
	getAccountByEmail (email: string): Promise<any>;
}