import crypto from "crypto";
import { AccountDAO } from "./data";
import { RideDAO } from "./RideDAO.ts";
 
export default class Signup {
    constructor(readonly accountDAO: AccountDAO, readonly rideDAO: RideDAO) {}

    async execute(input: Input) {
        const ride = { 
            rideId: crypto.randomUUID(),
            passengerId: input.passengerId,
            fromLat: input.fromLat,
            fromLong: input.fromLong,
            toLat: input.toLat,
            toLong: input.toLong,
            fare: 0,
            distance: 0,
            status: "requested",
            date: new Date(),
        }
        await this.rideDAO.saveRide(ride);
        return { rideId: ride.rideId }
    }
}

type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
}