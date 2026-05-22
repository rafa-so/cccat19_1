import { AccountDAO } from "./data";

 export default class GetAccount {
    constructor(readonly accountDAO: AccountDAO) {
    }

    async getAccount(accountId: string) {
        const accountData = await this.accountDAO.getAccountById(accountId);
        return accountData;
    }
}
