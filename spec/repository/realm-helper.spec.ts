import RealmHelper from "../../src/repository/realm-helper";

import User from "../../src/model/user";

import UserSchema from "../../src/repository/schema/user-schema";
import NameSchema from "../../src/repository/schema/name-schema";
import LocationSchema from "../../src/repository/schema/location-schema";
import PictureSchema from "../../src/repository/schema/picture-schema";

const TEST_USER: User = {
    gender: "male",
    name: {
        title: "Lord",
        first: "Josemi",
        last: "Gallas"
    },
    location: {
        street: "123 Lie Av.",
        city: "Nowhere",
        state: "Solid",
        zip: 12345
    },
    email: "josemigallas@gmail.com",
    username: "josemigallas",
    password: "secret",
    salt: "lypI10wj",
    md5: "bbdd6140e188e3bf68ae7ae67345df65",
    sha1: "4572d25c99aa65bbf0368168f65d9770b7cacfe6",
    sha256: "ec0705aec7393e2269d4593f248e649400d4879b2209f11bb2e012628115a4eb",
    registered: 1237176893,
    dob: 932871968,
    phone: "111-555-9999",
    cell: "222-444-8888",
    PPS: "3123123T",
    picture: {
        large: "https://avatars1.githubusercontent.com/u/11672286?v=3&s=460",
        medium: "https://avatars1.githubusercontent.com/u/11672286?v=3&s=460",
        thumbnail: "https://avatars1.githubusercontent.com/u/11672286?v=3&s=460"
    }
};

const TEST_CONFIG: Realm.Configuration = {
    path: "database/test/users",
    schema: [
        UserSchema,
        NameSchema,
        LocationSchema,
        PictureSchema
    ]
};

beforeAll(() => {
    spyOnProperty(RealmHelper, "config", "get").and.returnValue(TEST_CONFIG);
});

afterAll(() => {
    RealmHelper.defaultRealm.write(() => {
        RealmHelper.defaultRealm.deleteAll();
    });
});

describe("getUsers", () => {

    beforeEach(() => {
        const testRealm = RealmHelper.defaultRealm;
        testRealm.write(() => {
            testRealm.deleteAll();
            testRealm.create(UserSchema.name, TEST_USER);
        });
    });

    it("should return an array with all users", () => {
        const users = RealmHelper.getUsers();

        expect(users.length).toEqual(1);
        expect(users[0].username).toEqual(TEST_USER.username);
    });

});
