import Service from '../src/service';

test("Deve criar um passageiro com sucesso", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    const service = new Service();
    const outputSignup = await service.signup(input);
    const responseGetAccount = await service.getAccount(outputSignup.accountId);
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

    const service = new Service();
    const outputSignup = await service.signup(input);
    const responseGetAccount = await service.getAccount(outputSignup.accountId);
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

    const service = new Service();
    await expect(service.signup(input)).rejects.toThrow(new Error("Invalid Car Plate"));
});

test("Não deve criar uma conta de passageiro com nome inválido", async () => {
    const input = {
        name: "John",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    const service = new Service();
    await expect(service.signup(input)).rejects.toThrow(new Error("Invalid Name"));
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

    const service = new Service();
    await expect(service.signup(input)).rejects.toThrow(new Error("Invalid CPF"));
});

test("Não deve criar uma conta de passageiro com email inválido", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    const service = new Service();
    await expect(service.signup(input)).rejects.toThrow(new Error("Invalid Email"));
});

test("Não deve criar uma conta de passageiro duplicada", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    const service = new Service();
    await service.signup(input);
    await expect(service.signup(input)).rejects.toThrow(new Error("Duplicated Account"));
});