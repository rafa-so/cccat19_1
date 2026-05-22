import { beforeEach, test, expect } from "@jest/globals";
import AccountDAODatabase, { AccountDAOMemory } from "../src/data";
import GetAccount from "../src/GetAccount";
import Signup from "../src/Signup";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    // const accountDAO = new AccountDAODatabase();
    const accountDAO = new AccountDAOMemory();
    signup = new Signup(accountDAO);
    getAccount = new GetAccount(accountDAO);
})

test("Deve criar uma conta de passageiro", async function() {
    // Given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true,
    }

    // When
    const responseSignup = await signup.signup(input);
    const responseGetAccount = await getAccount.getAccount(responseSignup.accountId);

    // Then
    expect(responseSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.isPassenger).toBe(input.isPassenger);
});

test("Deve criar uma conta de motorista", async function() {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: false,
        isDriver: true,
        carPlate: "ABC1234"
    }

    const responseSignup = await signup.signup(input);
    const responseGetAccount = await getAccount.getAccount(responseSignup.accountId);

    expect(responseSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.isPassenger).toBe(input.isPassenger);
    expect(responseGetAccount.isDriver).toBe(input.isDriver);
    expect(responseGetAccount.carPlate).toBe(input.carPlate);
});

test("Não deve criar uma conta de passageiro com o nome inválido", async function() {
    // Given
    const input = {
        name: "John",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true,
    }

    await expect(signup.signup(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta de passageiro com o email inválido", async function() {
    // Given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true,
    }

    await expect(signup.signup(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar uma conta de passageiro com o cpf inválido", async function() {
    // Given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321",
        password: "123456",
        isPassenger: true,
    }

    await expect(signup.signup(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Deve criar uma conta de motorista", async function() {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: false,
        isDriver: true,
        carPlate: "ABC12"
    }

    await expect(signup.signup(input)).rejects.toThrow(new Error("Invalid car plate"));
});

test("Não deve criar uma conta de passageiro com conta duplicada", async function() {
    // Given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true,
    }

    await signup.signup(input);
    await expect(signup.signup(input)).rejects.toThrow(new Error("Duplicated account"));
});