import Signup from "./Signup";
import GetAccount from "./getAccount";
import AccountRepositoryDatabase from "./AccountRepository";
import { MailerGatewayMemory } from "./MailerGateway";
import { PgPromiseAdapter } from "./DatabaseConnecction";
import { ExpressAdapter, HapiAdapter } from "./HttpServer";

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
// const httpServer = new HapiAdapter(); 

httpServer.register('post', '/signup', async (params: any, body: any) => {
	const accountDAO = new AccountRepositoryDatabase(connection);
	const mailerGateway = new MailerGatewayMemory();
	const signup = new Signup(accountDAO, mailerGateway);
	const output = await signup.execute(body);
	return output;
});

httpServer.register('get','/accounts/:{accountId}', async(params: any, body: any) => {
	const accountDAO = new AccountRepositoryDatabase(connection);
	const getAccount = new GetAccount(accountDAO);
	const output = await getAccount.execute(params.accountId);
	return output;
});

httpServer.listen(3000);
