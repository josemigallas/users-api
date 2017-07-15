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

describe("addUser", () => {

    it("should create a new user in the DB", () => {
        const usersBeforeAddition = RealmHelper.getUsers();
        expect(usersBeforeAddition.length).toEqual(TestUsers.length);

        const newUser: User = TestUsers[0];
        newUser.username = "spiderman1991";
        RealmHelper.addUser(newUser);

        const usersAfterAddition = RealmHelper.getUsers();
        expect(usersAfterAddition.length).toEqual(TestUsers.length + 1);
    });

    it("should throw if trying to add an existing user", () => {
        const existingUser: User = TestUsers[0];
        const test = () => RealmHelper.addUser(existingUser);

        expect(test).toThrowError();
    });

});

describe("deleteUser", () => {

    it("should delete an existing user in the DB", () => {
        const usersBeforeDeletion = RealmHelper.getUsers();
        expect(usersBeforeDeletion.length).toEqual(TestUsers.length);

        const userToBeDeleted: User = TestUsers[0];
        RealmHelper.deleteUser(userToBeDeleted.username);

        const usersAfterDeletion = RealmHelper.getUsers();
        expect(usersAfterDeletion.length).toEqual(TestUsers.length - 1);
    });

    it("should not throw if trying to delete a nonexistent user", () => {
        const nonExistentUsername: string = "TheThing67";
        const test = () => RealmHelper.deleteUser(nonExistentUsername);

        expect(test).not.toThrowError();
    });

});
