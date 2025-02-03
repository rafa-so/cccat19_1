import sinon from "sinon";
import RequestRide from "../../src/application/use_case/RequestRide";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepository";
import GetRide from "../../src/application/use_case/GetRide";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnecction";
import AcceptRide from "../../src/application/use_case/AcceptRide";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import AccountGateway, { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway";

let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let connection: DatabaseConnection;
let accountGateway: AccountGateway;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    accountGateway = new AccountGatewayHttp();
    const rideRepository = new RideRepositoryDatabase(connection);
    const positionsRepository = new PositionRepositoryDatabase(connection);
    requestRide = new RequestRide(accountGateway, rideRepository);
    getRide = new GetRide(accountGateway, rideRepository, positionsRepository);
    acceptRide = new AcceptRide(accountGateway, rideRepository);
});

afterEach(async () => {
    await connection.close();
});

test("Deve aceitar uma corrida", async () => {
    const inputPassenger = { name: "John Doe", email: `john.doe.${Math.random()}@gmail.com`, cpf: "74582712053", password: '123456', isPassenger: true };
    const outputSignupPassenger = await accountGateway.signup(inputPassenger);

    const inputDriver = { name: "John Doe", email: `john.doe.${Math.random()}@gmail.com`, cpf: "74582712053", password: '123456', carPlate: "AAA9999", isDriver: true };
    const outputSignupDriver = await accountGateway.signup(inputDriver);

    const inputRequestRide = { passengerId: outputSignupPassenger.accountId, fromLat: -27.584905257808835, fromLong:-48.545022195325124, toLat: -27.496887588317275, toLong: -48.522234807850476 };
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputAcceptRide = { rideId: outputRequestRide.rideId, driverId: outputSignupDriver.accountId }

    await acceptRide.execute(inputAcceptRide);

    const outputGetRide = await getRide.execute(inputAcceptRide.rideId);
    expect(outputGetRide.status).toBe("accepted");
    expect(outputGetRide.driverId).toBe(inputAcceptRide.driverId);
});
