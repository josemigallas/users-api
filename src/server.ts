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

RealmHelper.init();

app.listen(3000, () => {
    console.log("Users API listening on port 3000...");
})