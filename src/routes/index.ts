import { Router } from "express";
import * as Realm from "realm";
import RealmHelper from "../repository/realm-helper";
import UserSchema from "../repository/schema/user-schema";
import User from "../model/user";

const index: Router = Router();

index.get("/", (req, res) => {
    res.send("Hello from Users API!");
});

export default index;
