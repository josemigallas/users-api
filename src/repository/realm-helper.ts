import * as Realm from "realm";

import LocationSchema from "./schema/location-schema";
import NameSchema from "./schema/name-schema";
import PictureSchema from "./schema/picture-schema";
import UserSchema from "./schema/user-schema";

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

    static getDefaultRealm(): Realm {
        if (!RealmHelper._realm) {
            RealmHelper._realm = new Realm(RealmHelper._config);
        }
        return new Realm(RealmHelper._config);
    }

}
