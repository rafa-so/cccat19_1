import express from "express";
import cors from "cors";
import { signup } from "./service";
import { getAccountById } from "./data";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async function (req, res) {
    try {
        console.log('signup', req.body);
        const input = req.body;
        const output = await signup(input);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({ message: e.message });
    }
});

app.get("/account/:accountId", async function (req, res) {
    const accountId = req.params.accountId;
    const output = await getAccountById(accountId)
    res.json(output);
});

app.listen(3000);
