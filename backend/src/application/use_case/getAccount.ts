import { AccountRepository } from "../repository/AccountRepository";

export default class GetAccount {
	constructor(readonly serviceData: AccountRepository){}
	
	async execute(accountId: string) {
		const accountData = await this.serviceData.getAccountById(accountId);
		return accountData;
	}
}
