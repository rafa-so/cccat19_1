import Position from "../../domain/entity/Position";
import { RideRepository } from "../../infra/repository/RideRepository";

export default class UpdatePosition {
	constructor(readonly rideRepository: RideRepository){}

	async execute(input: Input) {
		const ride = await this.rideRepository.getRideById(input.rideId);
		const position = Position.create(ride.getRideId(), input.lat, input.long);
		ride.updatePosition(position);
		await this.rideRepository.updateRide(ride);
	}
}

type Input = { 
	rideId: string,
	lat: number,
	long: number
} 
