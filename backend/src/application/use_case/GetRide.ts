import { AccountRepository } from "../repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";
import Account from "../../domain/Account";
import Coord from "../../domain/vo/Coord";

export default class GetRide {
	constructor(
		readonly accountRepository: AccountRepository,
		readonly rideRepository: RideRepository
	){}

	async execute(rideId: string): Promise<Output>{
		const ride = await this.rideRepository.getRideById(rideId);
		const passengerAccount: Account = await this.accountRepository.getAccountById(ride.getPassengerId());

		let distance = 0;

		for (const [index, position] of ride.positions.entries()) {
			const nextPosition = ride.positions[index + 1];
			if (!nextPosition) break;
			distance += this.calculateDistance(position.getCoord(), nextPosition.getCoord());
		}

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

	calculateDistance(from: Coord, to: Coord) {
		const earthRadius = 6371;
		const degreesToRadians = Math.PI / 180;
		const deltaLat = (to.getLat() - from.getLat()) * degreesToRadians;
		const deltaLon = (to.getLong() - from.getLong()) * degreesToRadians;
		const a =
			Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
			Math.cos(from.getLat() * degreesToRadians) *
			Math.cos(to.getLat() * degreesToRadians) *
			Math.sin(deltaLon / 2) *
			Math.sin(deltaLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = earthRadius * c;
		return Math.round(distance);
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