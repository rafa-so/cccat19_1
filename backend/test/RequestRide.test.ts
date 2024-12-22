import sinon from "sinon";
import Signup from '../src/Signup';
import GetAccount from '../src/getAccount';
import AccountDAODatabase, { AccountDAOMemory } from '../src/AccoundDAO';
import { MailerGatewayMemory } from '../src/MailerGateway';
import RequestRide from "../src/RequestRide";
import RideDAODatabase from "../src/RideDAO";
import GetRide from "../src/GetRide";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
    const accountDAO = new AccountDAODatabase();
    const rideDAO = new RideDAODatabase();
    // const accountDAO = new AccountDAOMemory();
    const mailerGateway = new MailerGatewayMemory();
    signup = new Signup(accountDAO, mailerGateway);
    getAccount = new GetAccount(accountDAO);
    requestRide = new RequestRide(accountDAO, rideDAO);
    getRide = new GetRide(accountDAO, rideDAO);
});

test("Deve solicitar uma corrida", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong:-48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807850476,    
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();

    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.passengerName).toBe(inputSignup.name);
    expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
    expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
    expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
    expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
    expect(outputGetRide.status).toBe("requested");
    expect(outputGetRide.fare).toBe(0);
    expect(outputGetRide.distance).toBe(0);
});

