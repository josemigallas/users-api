import * as express from "express";
import * as bodyParser from "body-parser";

// Constants
const port: string = process.env.PORT || "3000";
const mode: string = process.env.ENV_NODE || "development";

// Server app definitions
const app: express.Express = express();

app.use(bodyParser.json());

// Routes definitions
import index from "./routes/index";
import users from "./routes/users";

app.use("/", index);
app.use("/users", users);

// Realm configuration
import RealmHelper from "./repository/realm-helper";

RealmHelper.init(mode);

app.listen(port, () => {
    console.log(`Users API v${process.env.npm_package_version} listening on port ${port} in ${mode} mode`);
});
