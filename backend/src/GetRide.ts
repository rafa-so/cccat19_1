import crypto from "crypto";
import { AccountRepository } from "./AccountRepository";
import { RideDAO } from "./RideDAO";
import Account from "./Account";

export default class GetRide {
	constructor(
		readonly accountDAO: AccountRepository,
		readonly rideDAO: RideDAO
	){}

	async execute(rideId: string): Promise<Output>{
		const rideData = await this.rideDAO.getRideById(rideId);
		const passengerData: Account = await this.accountDAO.getAccountById(rideData.passengerId);
		rideData.passengerName = passengerData.name;
		return rideData;	
	}
}

type Output = {
	rideId: string,
	passengerId: string,
	passengerName: string,
	driverId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
	fare: number,
	distance: number,
	status: string,
	date: Date
}