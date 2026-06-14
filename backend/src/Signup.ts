import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import { AccountDAO } from "./data";
import MailerGateway from "./MailerGateway";
 
export default class Signup {
    constructor(
        readonly accountDAO: AccountDAO,
        readonly mailerGateway: MailerGateway
    ) {
    }

    isValidName(name: string) {
        return name.match(/[a-zA-Z] [a-zA-Z]+/);
    }

    isValidEmail(email: string) {
        return email.match(/^(.+)@(.+)$/)
    }

    isValidCarPlate(carPlate: string) {
        return carPlate.match(/[A-Z]{3}[0-9]{4}/);
    }

    async execute(input: any) {
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
        const existingAccount = await this.accountDAO.getAccountByEmail(input.email);
        if (existingAccount) throw new Error("Duplicated account");
        if (!this.isValidName(input.name)) throw new Error("Invalid name");
        if (!this.isValidEmail(input.email)) throw new Error("Invalid email");
        if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
        if (input.isDriver && !this.isValidCarPlate(input.carPlate)) throw new Error("Invalid car plate");
        await this.accountDAO.saveAccount(account);
        await this.mailerGateway.send(account.email, "Welcome!", "...");
        return { accountId: account.accountId };
    }
}
