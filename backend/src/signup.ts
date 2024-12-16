import crypto from "crypto";
import { validateCpf } from "./validateCpf";

export default class Signup {
	constructor(readonly serviceData: SignupData){}

	isValidName(name: string) {
		return name.match(/[a-zA-Z] [a-zA-Z]+/);
	}
	
	isValidEmail(email: string) {
		return email.match(/^(.+)@(.+)$/);
	}
	
	isValidCarPlate(carPlate: string) {
		return carPlate.match(/[A-Z]{3}[0-9]{4}/)
	}
	
	async signup(input: any) {
		const account = {
			accountId: crypto.randomUUID(),
			name: input.name,
			email: input.email,
			cpf: input.cpf,
			password: input.password,
			isPassenger: input.isPassenger,
			carPlate: input.carPlate,
			isDriver: input.isDriver
		}
	
		const existingAccount = await this.serviceData.getAccountByEmail(account.email);
		if (existingAccount) throw new Error("Duplicated Account");
		if (!this.isValidName(account.name)) throw new Error("Invalid Name");
		if (!this.isValidEmail(account.email)) throw new Error("Invalid Email")
		if (!validateCpf(account.cpf)) throw new Error("Invalid CPF");
		if (account.isDriver && !this.isValidCarPlate(account.carPlate)) throw new Error ("Invalid Car Plate");
		await this.serviceData.saveAccount(account);
		return { accountId: account.accountId };
	}
}

export interface SignupData {
	saveAccount (account: any): Promise<any>;
	getAccountByEmail (email: string): Promise<any>;
}