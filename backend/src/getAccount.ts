import { AccountDAO } from "./AccoundDAO";

export default class GetAccount {
	constructor(readonly serviceData: AccountDAO){}
	
	async execute(accountId: string) {
		const accountData = await this.serviceData.getAccountById(accountId);
		return accountData;
	}
}
