import pgp from "pg-promise";
import Account from "./Account";

export interface AccountRepository {
    getAccountById(accountId: string): Promise<Account | undefined>;
    saveAccount(account: Account): Promise<void>;
    getAccountByEmail(email: string): Promise<Account | undefined>;
}

export default class AccountRepositoryDatabase implements AccountRepository {
    async getAccountByEmail(email: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [accountData] = await connection.query("select * from ccca.account where email = $1", [email]);
        await connection.$pool.end();
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

    async getAccountById(accountId: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [accountData] = await connection.query("SELECT * FROM ccca.account WHERE account_id = $1", [ accountId ]);
        await connection.$pool.end();
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

    async saveAccount(account: Account) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", 
            [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.password]
        );
        await connection.$pool.end();
    }
}

export class AccountRepositoryMemory implements AccountRepository {
    accounts: Account[];

    constructor() {
        this.accounts = [];
    }

    async getAccountByEmail(email: string) {
        return this.accounts.find((account: Account) => account.email === email);
    }

    async getAccountById(accountId: string) {
        return this.accounts.find((account: Account) => account.accountId === accountId);
    }

    async saveAccount(account: Account) {
        this.accounts.push(account);
    }
}