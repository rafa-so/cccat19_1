import GetAccount from "./GetAccount";
import AccountRepositoryDatabase from "./AccountRepository";
import Signup from "./Signup";
import { MailerGatewayMemory } from "./MailerGateway";
import { PgPromiseAdapter } from "./DatabaseConnection";
import { ExpressAdapter } from "./HttpServer";

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();

httpServer.register('post', '/signup', async function(params: any, body: any) {
    const accountDAO = new AccountRepositoryDatabase(connection);
    const mailerGateway = new MailerGatewayMemory();
    const service = new Signup(accountDAO, mailerGateway);
    const output = await service.execute(body);
    return output;
});

httpServer.register('get', '/account/:accountId', async (params: any, body: any) => {
    const accountDAO = new AccountRepositoryDatabase(connection);
    const service = new GetAccount(accountDAO);
    const output = await service.execute(params.accountId);
    return output;
});

httpServer.listen(3000);
