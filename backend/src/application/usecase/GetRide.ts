import Coord from "../../domain/vo/Coord";
import { AccountRepository } from "../../infra/repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";
 
export default class GetRide {
    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {}

    async execute(rideId: any): Promise<Output> {
        const ride = await this.rideRepository.getRideById(rideId);
        const passengerAccount = await this.accountRepository.getAccountById(ride.getPassengerId());
        return {
            rideId: ride.getRideId(),
            passengerId: ride.getPassengerId(),
            driverId: ride.getDriverId(),
            fromLat: ride.getFrom().getLat(),
            fromLong: ride.getFrom().getLong(),
            toLat: ride.getTo().getLat(),
            toLong: ride.getTo().getLong(),
            fare: ride.fare,
            distance: ride.getDistance(),
            status: ride.getStatus(),
            date: ride.date,
            passengerName: passengerAccount?.getName() ?? '' 
        };
    }
}

type Output = {
    rideId: string,
    passengerId: string,
    passengerName: string;
    driverId?: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    fare: number,
    distance: number,
    status: string,
    date: Date,
}
