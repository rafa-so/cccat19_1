import axios from "axios"

test("Deve criar uma conta de passageiro", async function() {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "123456",
        isPassenger: true,
    }

    await axios.post("http://localhost:3000/signup", input);
});
