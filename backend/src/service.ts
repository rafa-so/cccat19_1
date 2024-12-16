import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import Data from "./data";

export default class Service {
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
		const data = new Data();
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
	
		const existingAccount = await data.getAccountByEmail(account.email);
		if (existingAccount) throw new Error("Duplicated Account");
		if (!this.isValidName(account.name)) throw new Error("Invalid Name");
		if (!this.isValidEmail(account.email)) throw new Error("Invalid Email")
		if (!validateCpf(account.cpf)) throw new Error("Invalid CPF");
		if (account.isDriver && !this.isValidCarPlate(account.carPlate)) throw new Error ("Invalid Car Plate");
		await data.saveAccount(account);
		return { accountId: account.accountId };
	}
	
	async getAccount(accountId: string) {
		const data = new Data();
		const accountData = await data.getAccountById(accountId);
		return accountData;
	}
}
