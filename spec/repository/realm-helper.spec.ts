import RealmHelper from "../../src/repository/realm-helper";

import User from "../../src/model/user";
import Location from "../../src/model/location";

import UserSchema from "../../src/repository/schema/user-schema";
import NameSchema from "../../src/repository/schema/name-schema";
import LocationSchema from "../../src/repository/schema/location-schema";
import PictureSchema from "../../src/repository/schema/picture-schema";

import TestUsers from "../support/test-users";

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

describe("updateUser", () => {

    it("should update a user of the DB", () => {
        const userBeforeUpdating = RealmHelper.getUserByUsername(TEST_USER.username);

        const newEmail: string = "josemigallas@example.com";
        expect(TEST_USER.email).not.toEqual(newEmail);
        TEST_USER.email = newEmail;

        RealmHelper.updateUser(TEST_USER);

        const userAfterUpdating = RealmHelper.getUserByUsername(TEST_USER.username);
        expect(userAfterUpdating.email).toEqual(newEmail);
    });

    it("should throw if trying to update a nonexistent user", () => {
        const nonExistentUsername: string = "TheThing67";
        expect(TEST_USER.username).not.toEqual(nonExistentUsername);

        TEST_USER.username = nonExistentUsername;
        const test = () => RealmHelper.updateUser(TEST_USER);

        expect(test).toThrowError();
    });

});

describe("getFilterQueryForUser", () => {

    it("should return a well formed query with object's properties", () => {
        const filter: User = {
            gender: "male",
            salt: "123456789",
            email: "test@example.com"
        };

        let expectedQuery: string = `gender = "${filter.gender}" AND `;
        expectedQuery += `salt = "${filter.salt}" AND `;
        expectedQuery += `email = "${filter.email}"`;

        expect(RealmHelper.getFilterQueryForUser(filter)).toEqual(expectedQuery);
    });

    it("should return a well formed query with object's inner objects", () => {
        const location: Location = {
            street: "123 Lie Av.",
            city: "Nowhere",
            state: "Solid",
            zip: 12345
        };

        const filter: User = {
            location
        };

        let expectedQuery: string = `location.street = "${location.street}" AND `;
        expectedQuery += `location.city = "${location.city}" AND `;
        expectedQuery += `location.state = "${location.state}" AND `;
        expectedQuery += `location.zip = "${location.zip}"`;

        expect(RealmHelper.getFilterQueryForUser(filter)).toEqual(expectedQuery);
    });

    it("should return a well formed query with object's properties and inner objects", () => {
        const filter: User = {
            gender: "male",
            salt: "123456789",
            email: "test@example.com",
            location: {
                street: "123 Lie Av.",
                city: "Nowhere",
                state: "Solid",
                zip: 12345
            }
        };
        let expectedQuery: string = `gender = "${filter.gender}" AND `;
        expectedQuery += `salt = "${filter.salt}" AND `;
        expectedQuery += `email = "${filter.email}" AND `;
        expectedQuery += `location.street = "${filter.location.street}" AND `;
        expectedQuery += `location.city = "${filter.location.city}" AND `;
        expectedQuery += `location.state = "${filter.location.state}" AND `;
        expectedQuery += `location.zip = "${filter.location.zip}"`;

        expect(RealmHelper.getFilterQueryForUser(filter)).toEqual(expectedQuery);
    });

});

describe("findUsers", () => {

    it("should filter by location", () => {
        const location: Location = {
            street: "123 Lie Av."
        };

        const locationFilter: User = {
            location
        };

        const filteredByLocation: User[] = RealmHelper.findUsers(locationFilter);
        expect(filteredByLocation.length).toEqual(2);
    });


    it("should filter by genre", () => {
        const genderFilter: User = {
            gender: "male"
        };

        const filteredMales: User[] = RealmHelper.findUsers(genderFilter);
        expect(filteredMales.length).toEqual(2);

        genderFilter.gender = "female";

        const filteredFemales: User[] = RealmHelper.findUsers(genderFilter);
        expect(filteredFemales.length).toEqual(1);
    });

});
