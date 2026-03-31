import axios from "axios"
import { isExportDeclaration } from "typescript";

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
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    const responseGetAccount = await axios.get(`http://localhost:3000/account/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;

    // Then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
});
