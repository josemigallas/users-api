import * as Realm from 'realm';

import LocationSchema from "./schema/location-schema";
import NameSchema from "./schema/name-schema";
import PictureSchema from "./schema/picture-schema";
import UserSchema from "./schema/user-schema";
import User from '../model/user';

/**
 * Helper class that setup the Realm DB and serves as data access layer.
 */
export default class RealmHelper {

    private static _realm: Realm;

    private static _config: Realm.Configuration = {
        path: "database/users",
        schema: [
            UserSchema,
            NameSchema,
            LocationSchema,
            PictureSchema
        ]
    };

    public static get defaultRealm(): Realm {
        if (!this._realm) {
            this._realm = new Realm(this.config);
        }
        return new Realm(this.config);
    }

    public static get config(): Realm.Configuration {
        return this._config;
    }

    public static init(mode: string): void {
        if (mode === "development") {
            this._config.path = "database/test/users";
        }

        const realm = this.defaultRealm;

        if (!realm.empty) {
            return;
        }

        const users: User[] = require("./seed.json").users;

        realm.write(() => {
            for (const user of users) {
                realm.create(UserSchema.name, user);
            }
        });
    }

    static getUsers(): User[] {
        const results: Realm.Results<User> = this.defaultRealm
            .objects(UserSchema.name);

        return Array.prototype.slice.call(results, 0, results.length);
    }

    static getUserByUsername(username: string): User {
        return this.defaultRealm
            .objectForPrimaryKey(UserSchema.name, username);
    }

    static findUsers(filter: User): User[] {
        const query: string = this.getFilterQueryForUser(filter);

        const results: Realm.Results<User> = this.defaultRealm
            .objects(UserSchema.name)
            .filtered(query);

        return Array.prototype.slice.call(results, 0, results.length);
    }

    static getFilterQueryForUser(user: User): string {
        let query: string = "";

        // TODO refactor this kamehameha
        for (const key in user) {
            if (typeof user[key] !== "object") {
                if (user[key]) {
                    if (key.match(".*Max")) {
                        query += `${key.slice(0, -3)} <= "${user[key]}" AND `;
                    } else if (key.match(".*Min")) {
                        query += `${key.slice(0, -3)} >= "${user[key]}" AND `;
                    } else {
                        query += `${key} = "${user[key]}" AND `;
                    }
                }
            } else {
                for (const subkey in user[key]) {
                    if (user[key][subkey]) {
                        query += `${key}.${subkey} = "${user[key][subkey]}" AND `;
                    }
                }
            }
        }

        query = query.slice(0, -5)

        return query;
    }

    static addUser(user: User): User | void {
        const realm: Realm = this.defaultRealm;

        realm.write(() => {
            return realm.create(UserSchema.name, user, false);
        });
    }

    static updateUser(newUser: User): User | void {
        const user: User = this.getUserByUsername(newUser.username);

        if (!user) {
            throw new Error(`User: ${newUser.username} does not exist`);
        }

        const assignEach = (values, object) => {
            for (const key in values) {
                if (typeof values[key] !== "object" && key !== "username") {
                    object[key] = values[key];
                } else {
                    assignEach(values[key], object[key]);
                }
            }
        }

        this.defaultRealm.write(() => {
            assignEach(newUser, user);
        });
    }

    static deleteUser(username: string): void {
        const realm = this.defaultRealm;
        const user: User = realm.objectForPrimaryKey(UserSchema.name, username);

        if (!user) {
            return;
        }

        realm.write(() => {
            return realm.delete(user);
        })
    }

}
