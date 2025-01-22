import { AccountRepository } from "../repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";
import Account from "../../domain/entity/Account";
import Coord from "../../domain/vo/Coord";
import PositionRepository from "../../infra/repository/PositionRepository";
import DistanceCalculator from "../../domain/service/DistanceCalculator";

export default class GetRide {
	constructor(
		readonly accountRepository: AccountRepository,
		readonly rideRepository: RideRepository,
		readonly positionsRepository: PositionRepository
	){}

	async execute(rideId: string): Promise<Output>{
		const ride = await this.rideRepository.getRideById(rideId);
		const passengerAccount: Account = await this.accountRepository.getAccountById(ride.getPassengerId());
		const positions = await this.positionsRepository.listByRideId(rideId);
		const distance = DistanceCalculator.calculateDistanceBetweenPositions(positions);
		return { 
			rideId: ride.getRideId(),
			passengerId: ride.getPassengerId(),
			driverId: ride.getDriverId(),
			fromLat: ride.getFrom().getLat(),
			fromLong: ride.getFrom().getLong(),
			toLat: ride.getTo().getLat(),
			toLong: ride.getTo().getLong(),
			status: ride.getStatus(),
			fare: ride.fare,
			distance,
			date: ride.date, 
			passengerName: passengerAccount.getName()
		}
	}
}

type Output = {
	rideId: string,
	passengerId: string,
	passengerName: string,
	driverId?: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
	fare: number,
	distance: number,
	status: string,
	date: Date
}