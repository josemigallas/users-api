import * as express from "express";
import * as bodyParser from "body-parser";

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

RealmHelper.init(process.env.ENV_NODE === "development");

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Users API listening on port ${port} in ${process.env.ENV_NODE} mode`);
});
