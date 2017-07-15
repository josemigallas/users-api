import * as Realm from 'realm';

import LocationSchema from "./schema/location-schema";
import NameSchema from "./schema/name-schema";
import PictureSchema from "./schema/picture-schema";
import UserSchema from "./schema/user-schema";
import User from '../model/user';

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

    /**
     * Singleton getter for the Realm.
     */
    private static get defaultRealm(): Realm {
        if (!this._realm) {
            this._realm = new Realm(this._config);
        }
        return new Realm(this._config);
    }

    /**
     * Initialization method for the Database, intenden to be called when the server app starts up.
     */
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

    /**
     * Gets an array of all users in the realm.
     */
    static getUsers(): User[] {
        const results: Realm.Results<User> = RealmHelper.defaultRealm
            .objects(UserSchema.name);

        return Array.prototype.slice.call(results, 0, results.length);
    }

}
