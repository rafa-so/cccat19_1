import sinon from "sinon";
import Signup from '../../src/application/use_case/Signup';
import GetAccount from '../../src/application/use_case/getAccount';
import AccountRepositoryDatabase, { AccountRepositoryMemory } from '../../src/infra/repository/AccountRepository';
import { MailerGatewayMemory } from '../../src/infra/gateway/MailerGateway';
import RequestRide from "../../src/application/use_case/RequestRide";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepository";
import GetRide from "../../src/application/use_case/GetRide";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnecction";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let connection: DatabaseConnection;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    const rideRepository = new RideRepositoryDatabase(connection);
    // const accountRepository = new AccountRepositoryMemory();
    const mailerGateway = new MailerGatewayMemory();
    signup = new Signup(accountRepository, mailerGateway);
    getAccount = new GetAccount(accountRepository);
    requestRide = new RequestRide(accountRepository, rideRepository);
    getRide = new GetRide(accountRepository, rideRepository);
});

afterEach(async () => {
    await connection.close();
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

test("Não deve solicitar uma corrida se a conta não for de um passageiro", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        carPlate: "AAA9999",
        isDriver: true
    }

    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong:-48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807850476,    
    }
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account must be from a passenger"));
});

test("Não pode solicitar uma corrida se já tiver outra ativa", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    };

    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong:-48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807850476,    
    };

    await requestRide.execute(inputRequestRide);
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Passenger already have an active ride"));
});