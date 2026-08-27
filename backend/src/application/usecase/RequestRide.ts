import { AccountRepository } from "../../infra/repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";
import Ride from "../../domain/entity/Ride";
 
export default class RequestRide {
    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {}

    async execute(input: Input) {
        const accountData = await this.accountRepository.getAccountById(input.passengerId)
        if (!accountData?.isPassenger) throw new Error("Account must be from a passenger");
        const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(input.passengerId);
        if (hasActiveRide) throw new Error("Passenger already have an active ride");
        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
        await this.rideRepository.saveRide(ride);
        console.log("Ride created with ID:", ride.getRideId());
        return { rideId: ride.getRideId() }
    }
}

type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
}