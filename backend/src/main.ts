import Signup from "./Signup";
import GetAccount from "./getAccount";
import AccountRepositoryDatabase from "./AccountRepository";
import { MailerGatewayMemory } from "./MailerGateway";
import { PgPromiseAdapter } from "./DatabaseConnecction";
import { ExpressAdapter, HapiAdapter } from "./HttpServer";
import AccountController from "./AccountController";

// Entrypoint - Composition Root

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const accountDAO = new AccountRepositoryDatabase(connection);
const mailerGateway = new MailerGatewayMemory();
const signup = new Signup(accountDAO, mailerGateway);
const getAccount = new GetAccount(accountDAO);
new AccountController(httpServer, signup, getAccount);

httpServer.listen(3000);
