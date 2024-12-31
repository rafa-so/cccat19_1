import sinon from "sinon";
import Signup from '../src/Signup';
import GetAccount from '../src/getAccount';
import AccountRepositoryDatabase, { AccountRepositoryMemory } from '../src/AccountRepository';
import { MailerGatewayMemory } from '../src/MailerGateway';
import Account from "../src/Account";
import DatabaseConnection, { PgPromiseAdapter } from "../src/DatabaseConnecction";

let signup: Signup;
let getAccount: GetAccount;
let connection: DatabaseConnection;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    // const accountRepository = new AccountRepositoryMemory();
    const mailerGateway = new MailerGatewayMemory();
    signup = new Signup(accountRepository, mailerGateway);
    getAccount = new GetAccount(accountRepository);
});

afterEach(async () => {
    await connection.close();
});

test("Deve criar um passageiro com sucesso", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        carPlate: "",
        password: '123456',
        isPassenger: true,
        isDriver: false
    }

    const outputSignup = await signup.execute(input);
    const responseGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.password).toBe(input.password);
    expect(responseGetAccount.isPassenger).toBe(input.isPassenger);
});

test("Deve criar um passageiro com sucesso com stub", async () => {
    const mailerStub = sinon.stub(MailerGatewayMemory.prototype, "send").resolves();
    const accountRepositoryStub1 = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountByEmail").resolves();
    const accountRepositoryStub3 = sinon.stub(AccountRepositoryDatabase.prototype, "saveAccount").resolves();
    
    const input = {
        accountId: "",
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true,
        isDriver: false,
        carPlate: ""
    }

    const accountRepositoryStub2 = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountById").resolves(new Account(input.accountId, input.name, input.email, input.cpf, input.carPlate, input.password, input.isPassenger, input.isDriver));

    const outputSignup = await signup.execute(input);
    const responseGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.password).toBe(input.password);
    expect(responseGetAccount.isPassenger).toBe(input.isPassenger);
    mailerStub.restore();
    accountRepositoryStub1.restore();
    accountRepositoryStub2.restore();
    accountRepositoryStub3.restore();
});

test("Deve criar uma conta de motorista", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        carPlate: "AAA9999",
        isDriver: true
    }

    const outputSignup = await signup.execute(input);
    const responseGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.password).toBe(input.password);
    expect(responseGetAccount.carPlate).toBe(input.carPlate);
    expect(responseGetAccount.isDriver).toBe(input.isDriver);
});


test("Não deve criar uma conta de passageiro com nome inválido", async () => {
    const input = {
        name: "John",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    await expect(signup.execute(input)).rejects.toThrow(new Error("Invalid Name"));
});

test("Não deve criar uma conta de passageiro duplicada", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    await signup.execute(input);
    await expect(signup.execute(input)).rejects.toThrow(new Error("Duplicated Account"));
});

test("Deve criar um passageiro com sucesso com spy", async () => {
    const mailerGatewaySpy = sinon.spy(MailerGatewayMemory.prototype, "send");

    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    };

    const outputSignup = await signup.execute(input);
    const responseGetAccount = await getAccount.execute(outputSignup.accountId);

    expect(outputSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.password).toBe(input.password);
    expect(responseGetAccount.isPassenger).toBe(input.isPassenger);
    expect(mailerGatewaySpy.calledOnce).toBe(true);
    expect(mailerGatewaySpy.calledWith(input.email, "Welcome", "...")).toBe(true);
    
    mailerGatewaySpy.restore();
});

test("Deve criar um passageiro com sucesso com mock", async () => {
    const mailerGatewayMock = sinon.mock(MailerGatewayMemory.prototype);

    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    };

    mailerGatewayMock
        .expects("send")
        .withArgs(input.email, "Welcome", "...")
        .once()
        .callsFake(() => {
            console.log("abc");
        })

    const outputSignup = await signup.execute(input);
    const responseGetAccount = await getAccount.execute(outputSignup.accountId);

    expect(outputSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.password).toBe(input.password);
    expect(responseGetAccount.isPassenger).toBe(input.isPassenger);
    mailerGatewayMock.verify();
    mailerGatewayMock.restore();
});