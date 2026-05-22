import express from "express";
import cors from "cors";
import GetAccount from "./GetAccount";
import AccountDAODatabase from "./data";
import Signup from "./Signup";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async function (req, res) {
    try {
        const input = req.body;
        const accountDAO = new AccountDAODatabase();
        const service = new Signup(accountDAO);
        const output = await service.signup(input);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({ message: e.message });
    }
});

app.get("/account/:accountId", async function (req, res) {
    const accountId = req.params.accountId;
    const accountDAO = new AccountDAODatabase();
    const service = new GetAccount(accountDAO);
    const output = await service.getAccount(accountId);
    res.json(output);
});

app.listen(3000);
