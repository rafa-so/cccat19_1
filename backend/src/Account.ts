import { validateCpf } from "./validateCpf";

export default class Account {
    constructor(
        readonly accountId: string, 
        readonly name: string, 
        readonly email: string, 
        readonly cpf: string, 
        readonly carPlate: string, 
        readonly password: string, 
        readonly isPassenger: boolean, 
        readonly isDriver: boolean
    ) {
        if (!this.isValidName(name)) throw new Error("Invalid name");
        if (!this.isValidEmail(email)) throw new Error("Invalid email");
        if (!validateCpf(cpf)) throw new Error("Invalid cpf");
        if (isDriver && !this.isValidCarPlate(carPlate)) throw new Error("Invalid car plate");
    }

    isValidName(name: string) {
        return name.match(/[a-zA-Z] [a-zA-Z]+/);
    }

    isValidEmail(email: string) {
        return email.match(/^(.+)@(.+)$/)
    }

    isValidCarPlate(carPlate: string) {
        return carPlate.match(/[A-Z]{3}[0-9]{4}/);
    }
}