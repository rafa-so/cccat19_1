import Signup from "./application/use_case/Signup";
import GetAccount from "./application/use_case/getAccount";
import AccountRepositoryDatabase from "./infra/repository/AccountRepository";
import { MailerGatewayMemory } from "./infra/gateway/MailerGateway";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnecction";
import { ExpressAdapter, HapiAdapter } from "./infra/http/HttpServer";
import AccountController from "./infra/controller/AccountController";

// Entrypoint - Composition Root

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const accountDAO = new AccountRepositoryDatabase(connection);
const mailerGateway = new MailerGatewayMemory();
const signup = new Signup(accountDAO, mailerGateway);
const getAccount = new GetAccount(accountDAO);
new AccountController(httpServer, signup, getAccount);

httpServer.listen(3000);
