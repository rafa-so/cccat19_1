import MailerGateway from "../../infra/gateway/MailerGateway";
import Account from "../../domain/entity/Account";
import { AccountRepository } from "../repository/AccountRepository";

export default class Signup {
	constructor(
		readonly serviceData: AccountRepository,
		readonly mailerGateway: MailerGateway
	){}
	
	async execute(input: any) {
		const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.password, input.isPassenger, input.isDriver);
		const existingAccount = await this.serviceData.getAccountByEmail(account.getEmail());
		if (existingAccount) throw new Error("Duplicated Account");
		await this.serviceData.saveAccount(account);
		await this.mailerGateway.send(account.getEmail(), "Welcome", "...");
		return { accountId: account.getAccountId() };
	}
}
