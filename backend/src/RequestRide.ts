import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import MailerGateway from "./MailerGateway";
import { AccountDAO } from "./AccoundDAO";

export default class RequestRide {
	constructor(
		readonly accountDAO: AccountDAO,
		readonly rideDAO: RideDAO
	){}

	async execute(input: any) {
		
	}
}

export interface SignupData {
	saveAccount (account: any): Promise<any>;
	getAccountByEmail (email: string): Promise<any>;
}