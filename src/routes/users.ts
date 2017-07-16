import { Router } from "express";
import RealmHelper from "../repository/realm-helper";
import User from "../model/user";

const users: Router = Router();

/**
 * Returns a list of all users
 */
users.get("/", (req, res) => {
    const users: User[] = RealmHelper.getUsers();
    res.send(users)
});

/**
 * Returns a single user by its username
 */
users.get("/:username", (req, res) => {
    const user: User = RealmHelper.getUserByUsername(req.params.username);

    if (user) {
        res.send(user)
    } else {
        res.sendStatus(404);
    }
});

/**
 * Adds a new user or throws an error if it exists already. User model are sent in the body of the request.
 */
users.post("/", (req, res) => {
    const user: User = req.body;

    if (RealmHelper.getUserByUsername(user.username)) {
        return res.status(409).send("User already exists");
    }

    RealmHelper.addUser(user);
    res.sendStatus(201);
});

export default users;
