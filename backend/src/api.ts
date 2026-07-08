import express from "express";
import cors from "cors";
import GetAccount from "./GetAccount";
import AccountRepositoryDatabase from "./AccountRepository";
import Signup from "./Signup";
import { MailerGatewayMemory } from "./MailerGateway";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async function (req, res) {
    try {
        const input = req.body;
        const accountDAO = new AccountRepositoryDatabase();
        const mailerGateway = new MailerGatewayMemory();
        const service = new Signup(accountDAO, mailerGateway);
        const output = await service.execute(input);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({ message: e.message });
    }
});

app.get("/account/:accountId", async function (req, res) {
    const accountId = req.params.accountId;
    const accountDAO = new AccountRepositoryDatabase();
    const service = new GetAccount(accountDAO);
    const output = await service.execute(accountId);
    res.json(output);
});

app.listen(3000);
