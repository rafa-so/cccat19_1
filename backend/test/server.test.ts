import Service, { getAccount, signup } from "../src/service";

const service = new Service();

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
    const responseSignup = await service.signup(input);
    const responseGetAccount = await service.getAccount(responseSignup.accountId);

    // Then
    expect(responseSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.is_passenger).toBe(input.isPassenger);
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

    const responseSignup = await service.signup(input);
    const responseGetAccount = await getAccount(responseSignup.accountId);

    expect(responseSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.is_passenger).toBe(input.isPassenger);
    expect(responseGetAccount.is_driver).toBe(input.isDriver);
    expect(responseGetAccount.car_plate).toBe(input.carPlate);
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

    await expect(service.signup(input)).rejects.toThrow(new Error("Invalid name"));
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

    await expect(service.signup(input)).rejects.toThrow(new Error("Invalid email"));
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

    await expect(service.signup(input)).rejects.toThrow(new Error("Invalid cpf"));
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

    await expect(service.signup(input)).rejects.toThrow(new Error("Invalid car plate"));
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

    await service.signup(input);
    await expect(service.signup(input)).rejects.toThrow(new Error("Duplicated account"));
});