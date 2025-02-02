import sinon from "sinon";
import Signup from '../../src/application/use_case/Signup';
import GetAccount from '../../src/application/use_case/getAccount';
import AccountRepositoryDatabase, { AccountRepositoryMemory } from '../../src/infra/repository/AccountRepository';
import { MailerGatewayMemory } from '../../src/infra/gateway/MailerGateway';
import RequestRide from "../../src/application/use_case/RequestRide";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepository";
import GetRide from "../../src/application/use_case/GetRide";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnecction";
import AcceptRide from "../../src/application/use_case/AcceptRide";
import StartRide from "../../src/application/use_case/StartRide";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let connection: DatabaseConnection;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    const rideRepository = new RideRepositoryDatabase(connection);
    const positionsRepository = new PositionRepositoryDatabase(connection);
    // const accountRepository = new AccountRepositoryMemory();
    const mailerGateway = new MailerGatewayMemory();
    signup = new Signup(accountRepository, mailerGateway);
    getAccount = new GetAccount(accountRepository);
    requestRide = new RequestRide(accountRepository, rideRepository);
    getRide = new GetRide(accountRepository, rideRepository, positionsRepository);
    acceptRide = new AcceptRide(accountRepository, rideRepository);
    startRide = new StartRide(rideRepository);
});

afterEach(async () => {
    await connection.close();
});

test("Deve iniciar uma corrida", async () => {
    const inputPassenger = { name: "John Doe", email: `john.doe.${Math.random()}@gmail.com`, cpf: "74582712053", password: '123456', isPassenger: true };
    const outputSignupPassenger = await signup.execute(inputPassenger);

    const inputDriver = { name: "John Doe", email: `john.doe.${Math.random()}@gmail.com`, cpf: "74582712053", password: '123456', carPlate: "AAA9999", isDriver: true };
    const outputSignupDriver = await signup.execute(inputDriver);

    const inputRequestRide = { passengerId: outputSignupPassenger.accountId, fromLat: -27.584905257808835, fromLong:-48.545022195325124, toLat: -27.496887588317275, toLong: -48.522234807850476 };
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputAcceptRide = { rideId: outputRequestRide.rideId, driverId: outputSignupDriver.accountId }
    const inputStartRide = { rideId: outputRequestRide.rideId };

    await acceptRide.execute(inputAcceptRide);
    await startRide.execute(inputStartRide);

    const outputGetRide = await getRide.execute(inputAcceptRide.rideId);
    expect(outputGetRide.status).toBe("in_progress");
});
