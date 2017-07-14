import { Router } from "express";
import * as Realm from "realm";
import RealmHelper from "../repository/realm-helper";
import UserSchema from "../repository/schema/user-schema";
import User from "../model/user";

const index: Router = Router();

index.get("/", (req, res) => {
    const realm: Realm = RealmHelper.getDefaultRealm();
    const user: User = realm.objectForPrimaryKey(UserSchema.name, "tinywolf709")

    res.send(user);
});

export default index;
