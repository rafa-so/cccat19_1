import MailerGateway from "../../infra/gateway/MailerGateway";
import Account from "../../domain/Account";
import { AccountRepository } from "../repository/AccountRepository";

export default class Signup {
	constructor(
		readonly serviceData: AccountRepository,
		readonly mailerGateway: MailerGateway
	){}
	
	async execute(input: any) {
		const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.password, input.isPassenger, input.isDriver);
		const existingAccount = await this.serviceData.getAccountByEmail(account.email);
		if (existingAccount) throw new Error("Duplicated Account");
		await this.serviceData.saveAccount(account);
		await this.mailerGateway.send(account.email, "Welcome", "...");
		return { accountId: account.accountId };
	}
}
