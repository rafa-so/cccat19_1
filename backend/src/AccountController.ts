import GetAccount from "./getAccount";
import HttpServer from "./HttpServer";
import Signup from "./Signup";

export default class AccountController {
    constructor(
        readonly httpServer: HttpServer, 
        readonly signup: Signup, 
        readonly getAccount: GetAccount
    ) {
        httpServer.register('post', '/signup', async (params: any, body: any) => {
            const output = await signup.execute(body);
            return output;
        });
        
        httpServer.register('get','/accounts/:{accountId}', async(params: any, body: any) => {
            const output = await getAccount.execute(params.accountId);
            return output;
        });
    }
}
