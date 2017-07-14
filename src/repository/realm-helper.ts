import * as Realm from 'realm';

import LocationSchema from './schema/location-schema';
import NameSchema from './schema/name-schema';
import PictureSchema from './schema/picture-schema';
import UserSchema from './schema/user-schema';

const _config: Realm.Configuration = {
    path: "database/users",
    schema: [
        UserSchema,
        NameSchema,
        LocationSchema,
        PictureSchema
    ]
};

export default class RealmHelper {

    static getDefaultRealm(): Realm {
        return new Realm(_config);
    }

}
