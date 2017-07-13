import { Router } from "express";

const index: Router = Router();

index.get('/', (req, res) => {
    res.send("Hello from TS Users API!");
});

export default index;
