export default class GetAccount {
	constructor(readonly serviceData: GetAccountData){}
	
	async getAccount(accountId: string) {
		const accountData = await this.serviceData.getAccountById(accountId);
		return {
			accountId: accountData.account_id,
			name: accountData.name,
			email: accountData.email,
			cpf: accountData.cpf,
			carPlate: accountData.car_plate,
			password: accountData.password,
			isDriver: accountData.is_driver,
			isPassenger: accountData.is_passenger
		};
	}
}

export interface GetAccountData {
	getAccountById (id: string): Promise<any>;
}