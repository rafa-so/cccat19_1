import { getAccount, signup } from '../src/service';

test("Deve criar um passageiro com sucesso", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    const outputSignup = await signup(input);
    const responseGetAccount = await getAccount(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.password).toBe(input.password);
    expect(responseGetAccount.is_passenger).toBe(input.isPassenger);
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

    const outputSignup = await signup(input);
    const responseGetAccount = await getAccount(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(responseGetAccount.name).toBe(input.name);
    expect(responseGetAccount.email).toBe(input.email);
    expect(responseGetAccount.cpf).toBe(input.cpf);
    expect(responseGetAccount.password).toBe(input.password);
    expect(responseGetAccount.is_driver).toBe(input.isDriver);
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

    await expect(signup(input)).rejects.toThrow(new Error("Invalid Car Plate"));
});

test("Não deve criar uma conta de passageiro com nome inválido", async () => {
    const input = {
        name: "John",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    await expect(signup(input)).rejects.toThrow(new Error("Invalid Name"));
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

    await expect(signup(input)).rejects.toThrow(new Error("Invalid CPF"));
});

test("Não deve criar uma conta de passageiro com email inválido", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }


    await expect(signup(input)).rejects.toThrow(new Error("Invalid Email"));
});

test("Não deve criar uma conta de passageiro duplicada", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    await signup(input);
    await expect(signup(input)).rejects.toThrow(new Error("Duplicated Account"));
});