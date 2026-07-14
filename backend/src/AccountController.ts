import HttpServer from "./HttpServer";
import Signup from "./Signup";
import GetAccount from "./GetAccount";

export default class AccountController {
    constructor(
        readonly httpServer: HttpServer, 
        readonly signup: Signup, 
        readonly getAccount: GetAccount
    ){
        httpServer.register('post', '/signup', async (params: any, body: any) => {
            const output = await this.signup.execute(body);
            return output;
        });

        httpServer.register('get', '/account/:{accountId}', async (params: any, body: any) => {
            const output = await this.getAccount.execute(params.accountId);
            return output;
        });
    }
}
