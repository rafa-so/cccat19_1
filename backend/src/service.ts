import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import { getAccountByEmail, getAccountById, saveAccount } from "./data";

function isValidName(name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/);
}
 
function isValidEmail(email: string){
    return email.match(/^(.+)@(.+)$/)
}

function isValidCarPlate(carPlate: string) {
    return carPlate.match(/[A-Z]{3}[0-9]{4}/);
}

export async function signup(input: any) {
    const account = {
        accountId: crypto.randomUUID(),
        name: input.name,
        email: input.email,
        cpf: input.cpf,
        isPassenger: input.isPassenger,
        isDriver: input.isDriver,
        password: input.password,
        carPlate: input.carPlate
    }
    const existingAccount = await getAccountByEmail(input.email);
    if (existingAccount) throw new Error("Duplicated account");
    if (!isValidName(input.name)) throw new Error("Invalid name");
    if (!isValidEmail(input.email)) throw new Error("Invalid email");
    if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
    if (input.isDriver && !isValidCarPlate(input.carPlate)) throw new Error("Invalid car plate");
    await saveAccount(account)
    return { accountId: account.accountId };
}

export async function getAccount (accountId: string) {
    const accountData = await getAccountById(accountId);
    return accountData;
}
