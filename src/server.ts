import * as express from "express";
import * as bodyParser from "body-parser";

// Server app definitions
const app: express.Express = express();

app.use(bodyParser.json());

// Routes definitions
import index from "./routes/index";

app.use("/", index);

// Realm configuration
import RealmHelper from "./repository/realm-helper";
import UserSchema from './repository/schema/user-schema';
import User from "./model/user";

const realm: Realm = RealmHelper.getDefaultRealm();
const exampleUser: User = {
    "gender": "female",
    "name": {
        "title": "miss",
        "first": "alison",
        "last": "reid"
    },
    "location": {
        "street": "1097 the avenue",
        "city": "Newbridge",
        "state": "ohio",
        "zip": 28782
    },
    "email": "alison.reid@example.com",
    "username": "tinywolf709",
    "password": "rockon",
    "salt": "lypI10wj",
    "md5": "bbdd6140e188e3bf68ae7ae67345df65",
    "sha1": "4572d25c99aa65bbf0368168f65d9770b7cacfe6",
    "sha256": "ec0705aec7393e2269d4593f248e649400d4879b2209f11bb2e012628115a4eb",
    "registered": 1237176893,
    "dob": 932871968,
    "phone": "031-541-9181",
    "cell": "081-647-4650",
    "PPS": "3302243T",
    "picture": {
        "large": "https://randomuser.me/api/portraits/women/60.jpg",
        "medium": "https://randomuser.me/api/portraits/med/women/60.jpg",
        "thumbnail": "https://randomuser.me/api/portraits/thumb/women/60.jpg"
    }
};

if (realm.empty) {
    realm.write(() => {
        realm.create(UserSchema.name, exampleUser);
    });
}

app.listen(3000, () => {
    console.log("Users API listening on port 3000...");
})