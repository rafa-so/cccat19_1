import sinon from "sinon";
import RequestRide from "../../src/application/use_case/RequestRide";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepository";
import GetRide from "../../src/application/use_case/GetRide";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnecction";
import AcceptRide from "../../src/application/use_case/AcceptRide";
import StartRide from "../../src/application/use_case/StartRide";
import UpdatePosition from "../../src/application/use_case/UpdatePosition";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import AccountGateway, { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway";
import { AxiosAdapter } from "../../src/infra/http/HttpClient";
import FinishRide from "../../src/application/use_case/FinishRide";

let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let connection: DatabaseConnection;
let updatePosition: UpdatePosition;
let accountGateway: AccountGateway;
let finishRide: FinishRide;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const httpClient = new AxiosAdapter();
    accountGateway = new AccountGatewayHttp(httpClient);
    const rideRepository = new RideRepositoryDatabase(connection);
    const positionRepository = new PositionRepositoryDatabase(connection);
    requestRide = new RequestRide(accountGateway, rideRepository);
    getRide = new GetRide(accountGateway, rideRepository, positionRepository);
    acceptRide = new AcceptRide(accountGateway, rideRepository);
    startRide = new StartRide(rideRepository);
    updatePosition = new UpdatePosition(rideRepository, positionRepository);
    finishRide = new FinishRide(rideRepository, positionRepository);
});

afterEach(async () => {
    await connection.close();
});

test("Deve finalizar uma corrida em horário comercial", async () => {
    const inputPassenger = { name: "John Doe", email: `john.doe.${Math.random()}@gmail.com`, cpf: "74582712053", password: '123456', isPassenger: true };
    const outputSignupPassenger = await accountGateway.signup(inputPassenger);

    const inputDriver = { name: "John Doe", email: `john.doe.${Math.random()}@gmail.com`, cpf: "74582712053", password: '123456', carPlate: "AAA9999", isDriver: true };
    const outputSignupDriver = await accountGateway.signup(inputDriver);

    const inputRequestRide = { passengerId: outputSignupPassenger.accountId, fromLat: -27.584905257808835, fromLong:-48.545022195325124, toLat: -27.496887588317275, toLong: -48.522234807850476 };
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputAcceptRide = { rideId: outputRequestRide.rideId, driverId: outputSignupDriver.accountId }
    const inputStartRide = { rideId: outputRequestRide.rideId };

    await acceptRide.execute(inputAcceptRide);
    await startRide.execute(inputStartRide);

    const inputUpdatePosition1 = { 
        rideId: outputRequestRide.rideId, lat: -27.584905257808835, long: -48.545022195325124, date: new Date("2023-03-01T10:00:00") 
    };
    await updatePosition.execute(inputUpdatePosition1);
    const inputUpdatePosition2 = { 
        rideId: outputRequestRide.rideId, lat: -27.496887588317275, long: -48.522234807850476, date: new Date("2023-03-01T10:30:00")
    };
    await updatePosition.execute(inputUpdatePosition2);

    const inputFinished = { rideId: outputRequestRide.rideId }

    await finishRide.execute(inputFinished);
    const outputGetRide = await getRide.execute(inputAcceptRide.rideId);
    expect(outputGetRide.status).toBe("completed");
    expect(outputGetRide.distance).toBe(10);
    expect(outputGetRide.fare).toBe(21);
});

test("Deve finalizar uma corrida em horário noturno", async () => {
    const inputPassenger = { name: "John Doe", email: `john.doe.${Math.random()}@gmail.com`, cpf: "74582712053", password: '123456', isPassenger: true };
    const outputSignupPassenger = await accountGateway.signup(inputPassenger);

    const inputDriver = { name: "John Doe", email: `john.doe.${Math.random()}@gmail.com`, cpf: "74582712053", password: '123456', carPlate: "AAA9999", isDriver: true };
    const outputSignupDriver = await accountGateway.signup(inputDriver);

    const inputRequestRide = { passengerId: outputSignupPassenger.accountId, fromLat: -27.584905257808835, fromLong:-48.545022195325124, toLat: -27.496887588317275, toLong: -48.522234807850476 };
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputAcceptRide = { rideId: outputRequestRide.rideId, driverId: outputSignupDriver.accountId }
    const inputStartRide = { rideId: outputRequestRide.rideId };

    await acceptRide.execute(inputAcceptRide);
    await startRide.execute(inputStartRide);

    const inputUpdatePosition1 = { 
        rideId: outputRequestRide.rideId, lat: -27.584905257808835, long: -48.545022195325124, date: new Date("2023-03-01T23:00:00")
    };
    await updatePosition.execute(inputUpdatePosition1);
    const inputUpdatePosition2 = { 
        rideId: outputRequestRide.rideId, lat: -27.496887588317275, long: -48.522234807850476, date: new Date("2023-03-01T23:30:00")
    };
    await updatePosition.execute(inputUpdatePosition2);

    const inputFinished = { rideId: outputRequestRide.rideId }
    await finishRide.execute(inputFinished);
    const outputGetRide = await getRide.execute(inputAcceptRide.rideId);
    expect(outputGetRide.status).toBe("completed");
    expect(outputGetRide.distance).toBe(10);
    expect(outputGetRide.fare).toBe(39);
});
