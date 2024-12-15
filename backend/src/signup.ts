import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const input = req.body;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		const id = crypto.randomUUID();
		const [existingAccount] = await connection.query("select * from ccca.account where email = $1", [input.email]);
		if (existingAccount) throw new Error("Duplicated Account");
		if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid Name");
		if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid Email")
		if (!validateCpf(input.cpf)) throw new Error("Invalid CPF");
		if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error ("Invalid Car Plate");
		await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
		res.json({ accountId: id });
	} catch (e: any) {
		res.status(422).json({ message: e.message });
	} finally {
		await connection.$pool.end();
	}
});


app.get("/accounts/:accountId", async function (req, res) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [req.params.accountId]);

	await connection.$pool.end();
	res.json(accountData);
});

app.listen(3000);
