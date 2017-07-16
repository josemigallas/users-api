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

/**
 * Updates an existing user or throws an error if it doesn't. User model are sent in the body of the request.
 * Properties that won't be changed can be undefined but the entity must match the model.
 */
users.put("/", (req, res) => {
    const user: User = req.body;

    try {
        RealmHelper.updateUser(user);
        return res.sendStatus(200);
    } catch (e) {
        if (e.message.indexOf("does not exist") !== -1) {
            return res.status(404).send(e);
        }
        return res.status(500).send(e.message);
    }
});

/**
 * Deletes an existing user or throws an error if it doesn't.
 */
users.delete("/:username", (req, res) => {
    const username: string = req.params.username;

    if (!RealmHelper.getUserByUsername(username)) {
        return res.status(404).send(`User: ${username} does not exist`);
    }

    RealmHelper.deleteUser(username);
    res.status(200).send(`Successfuly delete: ${username}`);
});

export default users;
