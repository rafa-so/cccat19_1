import sinon from "sinon";
import Signup from '../src/signup';
import GetAccount from '../src/getAccount';
import AccountDAODatabase, { AccountDAOMemory } from '../src/data';
import { MailerGatewayMemory } from '../src/MailerGateway';

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    const accountDAO = new AccountDAODatabase();
    // const accountDAO = new AccountDAOMemory();
    const mailerGateway = new MailerGatewayMemory();
    signup = new Signup(accountDAO, mailerGateway);
    getAccount = new GetAccount(accountDAO);
});

test("Deve criar um passageiro com sucesso", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    const outputSignup = await signup.signup(input);
    const responseGetAccount = await getAccount.getAccount(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.password).toBe(input.password);
    expect(responseGetAccount.isPassenger).toBe(input.isPassenger);
});

test("Deve criar um passageiro com sucesso com stub", async () => {
    const mailerStub = sinon.stub(MailerGatewayMemory.prototype, "send").resolves();
    const accountDAOStub1 = sinon.stub(AccountDAODatabase.prototype, "getAccountByEmail").resolves();
    const accountDAOStub3 = sinon.stub(AccountDAODatabase.prototype, "saveAccount").resolves();
    
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

    const accountDAOStub2 = sinon.stub(AccountDAODatabase.prototype, "getAccountById").resolves(input);

    const outputSignup = await signup.signup(input);
    const responseGetAccount = await getAccount.getAccount(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.password).toBe(input.password);
    expect(responseGetAccount.isPassenger).toBe(input.isPassenger);
    mailerStub.restore();
    accountDAOStub1.restore();
    accountDAOStub2.restore();
    accountDAOStub3.restore();
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

    const outputSignup = await signup.signup(input);
    const responseGetAccount = await getAccount.getAccount(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.password).toBe(input.password);
    expect(responseGetAccount.carPlate).toBe(input.carPlate);
    expect(responseGetAccount.isDriver).toBe(input.isDriver);
});

test("Não deve criar uma conta de motorista com placa inválida", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        carPlate: "AAA999",
        isDriver: true
    }

    await expect(signup.signup(input)).rejects.toThrow(new Error("Invalid Car Plate"));
});

test("Não deve criar uma conta de passageiro com nome inválido", async () => {
    const input = {
        name: "John",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    await expect(signup.signup(input)).rejects.toThrow(new Error("Invalid Name"));
});

test("Não deve criar uma conta de passageiro com cpf inválido", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "7458271205",
        password: '123456',
        carPlate: "AAA9999",
        isPassenger: true
    }

    await expect(signup.signup(input)).rejects.toThrow(new Error("Invalid CPF"));
});

test("Não deve criar uma conta de passageiro com email inválido", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    await expect(signup.signup(input)).rejects.toThrow(new Error("Invalid Email"));
});

test("Não deve criar uma conta de passageiro duplicada", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    await signup.signup(input);
    await expect(signup.signup(input)).rejects.toThrow(new Error("Duplicated Account"));
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

    const outputSignup = await signup.signup(input);
    const responseGetAccount = await getAccount.getAccount(outputSignup.accountId);

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

test.only("Deve criar um passageiro com sucesso com mock", async () => {
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

    const outputSignup = await signup.signup(input);
    const responseGetAccount = await getAccount.getAccount(outputSignup.accountId);

    expect(outputSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.password).toBe(input.password);
    expect(responseGetAccount.isPassenger).toBe(input.isPassenger);
    mailerGatewayMock.verify();
    mailerGatewayMock.restore();
});