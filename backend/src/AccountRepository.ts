import Account from "./Account";
import DatabaseConnection from "./DatabaseConnecction";

export interface AccountRepository {
	saveAccount (account: Account): Promise<any>;
	getAccountByEmail (email: string): Promise<Account | undefined>;
	getAccountById (id: string): Promise<Account>;
}

export default class AccountRepositoryDatabase implements AccountRepository {
	constructor(readonly connection: DatabaseConnection){}

	async  getAccountByEmail( email: string ) {
		const [accountData] = await this.connection.query("select * from ccca.account where email = $1", [email]);
		if (!accountData) return;
		return new Account(
			accountData.account_id,
			accountData.name,
			accountData.email,
			accountData.cpf,
			accountData.car_plate,
			accountData.password,
			accountData.is_passenger,
			accountData.is_driver
		); 
	}
	
	async getAccountById( accountId: string ) {
		const [accountData] = await this.connection.query("select * from ccca.account where account_id = $1", [accountId]);
		return new Account(
			accountData.account_id,
			accountData.name,
			accountData.email,
			accountData.cpf,
			accountData.car_plate,
			accountData.password,
			accountData.is_passenger,
			accountData.is_driver
		); 
	}
	
	async saveAccount( account: Account ) {
		await this.connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", 
			[account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.password]);
	}
}

export class AccountRepositoryMemory implements AccountRepository {
	accounts: Account[];

	constructor() {
		this.accounts = [];
	}

	async  getAccountByEmail( email: string ) {
		const account = this.accounts.find((account: any) => account.email === email);
		if (!account) throw new Error();
		return account;
	}
	
	async getAccountById( accountId: string ) {
		const account = this.accounts.find((account: any) => account.accountId === accountId);
		if (!account) throw new Error();
		return account;
	}
	
	async saveAccount(account: Account) {
		this.accounts.push(account);
	}
}