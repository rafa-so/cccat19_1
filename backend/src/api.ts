import express from "express";
import cors from "cors"; 
import Service from "./service";
import { servicesVersion } from "typescript";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async function (req, res) {
	const input = req.body;	
	try {
		const service = new Service();
		const output = await service.signup(input);
		res.json(output);
	} catch (e: any) {
		res.status(422).json({ message: e.message });
	}
});

app.get("/accounts/:accountId", async function (req, res) {
	const service = new Service();
	const output = await service.getAccount(req.params.accountId);
	res.json(output);
});

app.listen(3000);
