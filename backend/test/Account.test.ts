import Account from "../src/Account";

test('Deve criar uma conta', function() {
    const email = `john.doe.${Math.random()}@gmail.com`;
    const account = Account.create("John Doe", email, '74582712053', 'AAA9999', '123456', true, false);
    expect(account.name).toBe('John Doe');
    expect(account.email).toBe(email);
});

test('Não deve criar uma conta com nome inválido', function() {
    expect(() => Account.create("John", `john.doe.${Math.random()}@gmail.com`, '74582712053', 'AAA9999', '123456', true, false)).toThrow(new Error("Invalid Name"));
});

test('Não deve criar uma conta com email inválido', function(){
    expect(() => Account.create("John Doe", "john.doe", '74582712053', 'AAA9999', '123456', true, false)).toThrow(new Error("Invalid Email"));
});

test('Não deve criar uma conta com CPF inválido', function(){
    expect(() => Account.create("John Doe", `john.doe.${Math.random()}@gmail.com`, '7458271205', 'AAA9999', '123456', true, false)).toThrow(new Error("Invalid CPF"));
});

test('Não deve criar uma conta com placa do carro inválida', function(){
    expect(() => Account.create("John Doe", `john.doe.${Math.random()}@gmail.com`, '74582712053', 'AAA999', '123456', false, true)).toThrow(new Error("Invalid Car Plate"));
});
