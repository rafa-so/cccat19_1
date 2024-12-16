export default class GetAccount {
	constructor(readonly serviceData: GetAccountData){}
	
	async getAccount(accountId: string) {
		const accountData = await this.serviceData.getAccountById(accountId);
		return accountData;
	}
}

export interface GetAccountData {
	getAccountById (id: string): Promise<any>;
}