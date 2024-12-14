import axios from 'axios';

axios.defaults.validateStatus = function() {
    return true;
}

test("Deve criar um passageiro com sucesso", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    const outputSignup = responseSignup.data;

    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;

    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
    expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
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

    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    const outputSignup = responseSignup.data;

    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;

    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
    expect(outputGetAccount.car_plate).toBe(input.carPlate);
    expect(outputGetAccount.is_driver).toBe(input.isDriver);
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

    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe(-5);
});

test("Não deve criar uma conta de passageiro com nome inválido", async () => {
    const input = {
        name: "John",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe(-3);
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

    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe(-1);
});

test("Não deve criar uma conta de passageiro com email inválido", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe(-2);
});

test("Não deve criar uma conta de passageiro duplicada", async () => {
    const input = {
        name: "John Doe",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    await axios.post('http://localhost:3000/signup', input);
    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe(-4);
});