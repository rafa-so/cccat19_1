import sinon from "sinon";
import Signup from '../src/Signup';
import GetAccount from '../src/getAccount';
import AccountDAODatabase, { AccountDAOMemory } from '../src/AccoundDAO';
import { MailerGatewayMemory } from '../src/MailerGateway';

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;

beforeEach(() => {
    const accountDAO = new AccountDAODatabase();
    const rideDAO = new RideDAODatabase();
    // const accountDAO = new AccountDAOMemory();
    const mailerGateway = new MailerGatewayMemory();
    signup = new Signup(accountDAO, mailerGateway);
    getAccount = new GetAccount(accountDAO);
    requestRide = new RiquestRide(accountDAO, rideDAO);
});

test("Deve solicitar uma corrida", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    const outputSignup = await signup.signup(inputSignup);
    const inputRequestRide = {
        pessengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong:-48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807850476,    
    }
    const outputRequestRide = await requestRide.excute(inputRequestRide);
    expect(outputRequestRide).toBeDefined();
});
