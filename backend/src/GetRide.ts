import { AccountRepository } from "./AccountRepository";
import { RideDAO } from "./RideDAO.ts";
 
export default class GetRide {
    constructor(readonly accountRepository: AccountRepository, readonly rideDAO: RideDAO) {}

    async execute(rideId: any): Promise<Output> {
        const rideData = await this.rideDAO.getRideById(rideId);
        const account = await this.accountRepository.getAccountById(rideData.passengerId);
        const passengerData = account.get;
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
