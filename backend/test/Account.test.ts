import Account from "../src/Account";

test('Deve criar uma conta', function() {
    const email = `john.doe.${Math.random()}@gmail.com`;
    const account = Account.createAccount("John Doe", email, '74582712053', 'AAA9999', '123456', true, false);
    expect(account.name).toBe('John Doe');
    expect(account.email).toBe(email);
});

test('Não deve criar uma conta com nome inválido', function() {
    const email = `john.doe.${Math.random()}@gmail.com`;
    expect(() => Account.createAccount("John Doe", email, '74582712053', 'AAA9999', '123456', true, false)).rejects.toThrow(new Error())
});

test('Não deve criar uma conta com email inválido', function(){});

test('Não deve criar uma conta com CPF inválido', function(){});

test('Não deve criar uma conta com placa do carro inválida', function(){});

test("Não deve criar uma conta de passageiro com nome inválido", async () => {
    const input = {
        name: "John",
        email: `john.doe.${Math.random()}@gmail.com`,
        cpf: "74582712053",
        password: '123456',
        isPassenger: true
    }

    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    expect(responseSignup.status).toBe(422);

    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid Name");
});