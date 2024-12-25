import crypto from "crypto";
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
    ){
        if (!this.isValidName(name)) throw new Error("Invalid Name");
        if (!this.isValidEmail(email)) throw new Error("Invalid Email");
        if (isDriver && !this.isValidCarPlate(carPlate)) throw new Error("Invalid Car Plate");
		if (!validateCpf(cpf)) throw new Error("Invalid CPF");
    }

    isValidName(name: string) {
        return name.match(/[a-zA-Z] [a-zA-Z]+/);
    }
    
    isValidEmail(email: string) {
        return email.match(/^(.+)@(.+)$/);
    }
    
    isValidCarPlate(carPlate: string) {
        return carPlate.match(/[A-Z]{3}[0-9]{4}/)
    }

    static create (name: string, email: string, cpf: string, carPlate: string, password: string, isPassenger: boolean, isDriver: boolean) {
        console.log("\n --- || DEBUG ACCOUNT OBJ || --- \n",
            {
                name, email, cpf, carPlate, password, isPassenger, isDriver
            }
        );
        const accountId = crypto.randomUUID();
        return new Account(accountId, name, email, cpf, carPlate, password, isPassenger, isDriver);
    }
}