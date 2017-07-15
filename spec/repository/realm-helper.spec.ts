import RealmHelper from "../../src/repository/realm-helper";

import User from "../../src/model/user";

import UserSchema from "../../src/repository/schema/user-schema";
import NameSchema from "../../src/repository/schema/name-schema";
import LocationSchema from "../../src/repository/schema/location-schema";
import PictureSchema from "../../src/repository/schema/picture-schema";

import TestUsers from "./test-users";

const TEST_USER = TestUsers[0];
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

beforeEach(() => {
    const testRealm = RealmHelper.defaultRealm;
    testRealm.write(() => {
        testRealm.deleteAll();
        for (const user of TestUsers) {
            testRealm.create(UserSchema.name, user);
        }
    });
});

describe("getUsers", () => {

    it("should return an array with all users", () => {
        const users = RealmHelper.getUsers();

        expect(users.length).toEqual(TestUsers.length);
    });

});

describe("getUserById", () => {

    it("should return a user by its username", () => {
        const username1 = "josemigallas";
        const user1: User = RealmHelper.getUserByUsername(username1);

        const username2 = "josefa_la_jefa";
        const user2: User = RealmHelper.getUserByUsername(username2);

        expect(user1.username).toEqual(username1);
        expect(user2.username).toEqual(username2);
    });

});
