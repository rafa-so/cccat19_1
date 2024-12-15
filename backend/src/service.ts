import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import { getAccountByEmail, getAccountById, saveAccount } from "./data";

function isValidName(name: string) {
	return name.match(/[a-zA-Z] [a-zA-Z]+/);
}

function isValidEmail(email: string) {
	return email.match(/^(.+)@(.+)$/);
}

function isValidCarPlate(carPlate: string) {
	return carPlate.match(/[A-Z]{3}[0-9]{4}/)
}

export async function signup(input: any) {
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

	const existingAccount = await getAccountByEmail(account.email);
	if (existingAccount) throw new Error("Duplicated Account");
	if (!isValidName(account.name)) throw new Error("Invalid Name");
	if (!isValidEmail(account.email)) throw new Error("Invalid Email")
	if (!validateCpf(account.cpf)) throw new Error("Invalid CPF");
	if (account.isDriver && !isValidCarPlate(account.carPlate)) throw new Error ("Invalid Car Plate");
	await saveAccount(account);
	return { accountId: account.accountId };
}

export async function getAccount(accountId: string) {
	const accountData = await getAccountById(accountId);
	return accountData;
}
