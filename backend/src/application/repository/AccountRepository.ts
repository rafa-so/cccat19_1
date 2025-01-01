import Account from "../../domain/Account";

export interface AccountRepository {
    saveAccount (account: Account): Promise<any>;
    getAccountByEmail (email: string): Promise<Account | undefined>;
    getAccountById (id: string): Promise<Account>;
}