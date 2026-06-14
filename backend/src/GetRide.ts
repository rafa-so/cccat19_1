import { AccountDAO } from "./data";
import { RideDAO } from "./RideDAO.ts";
 
export default class GetRide {
    constructor(readonly accountDAO: AccountDAO, readonly rideDAO: RideDAO) {}

    async execute(rideId: any): Promise<Output> {
        const rideData = await this.rideDAO.getRideById(rideId);
        const passengerData = await this.accountDAO.getAccountById(rideData.passengerId);
        rideData.passengerName = passengerData.name;
        return rideData;
    }
}

type Output = {
    rideId: string,
    passengerId: string,
    passengerName: string;
    driverId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    fare: number,
    distance: number,
    status: string,
    date: Date,
}
