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

    public static init(): void {
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

    // CREATE
    static addUser(user: User): User | void {
        const realm: Realm = this.defaultRealm;

        // TODO check if user exists, if so throw Error.

        realm.write(() => {
            return realm.create(UserSchema.name, user);
        });
    }

    // UPDATE
    // Update can be done by "creating" an entity with the same primary key or retrieving it from the Realm
    // and changing its properties

    // DELETE
    static deleteUser(username: string): void {
        const realm = this.defaultRealm;
        const user: User = realm.objectForPrimaryKey(UserSchema.name, username);

        realm.write(() => {
            return realm.delete(user);
        })
    }

    // LIST
}
