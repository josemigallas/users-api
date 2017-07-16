import RealmHelper from "../../src/repository/realm-helper";

import User from "../../src/model/user";
import UserDateFilter from "../../src/model/user-date-filter";
import Location from "../../src/model/location";
import Name from "../../src/model/name";

import UserSchema from "../../src/repository/schema/user-schema";
import NameSchema from "../../src/repository/schema/name-schema";
import LocationSchema from "../../src/repository/schema/location-schema";
import PictureSchema from "../../src/repository/schema/picture-schema";

import TestUsers from "../support/test-users";
import ApiTestClient from "../support/api-test-client";

describe("Route users", () => {

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

    describe("GET /users", () => {

        it("returns an array with all users", done => {
            ApiTestClient
                .getUsers()
                .then(users => {
                    expect(users).toEqual(jasmine.any(Array));
                    expect(users.length).toEqual(TestUsers.length);
                    done();
                })
                .catch(err => fail(err));
        });

    });

    describe("GET /users/:username", () => {

        it("returns a user if it exists", done => {
            ApiTestClient
                .getUserByUsername("josemigallas")
                .then(user => {
                    expect(user.username).toEqual("josemigallas");
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("returns 404 if user does not exist", done => {
            ApiTestClient
                .getUserByUsername("whatever")
                .then(user => {
                    fail("User should not exist");
                    done();
                })
                .catch(err => {
                    expect(err.statusCode).toEqual(404);
                    done();
                });
        });
    });

    describe("POST /users", () => {

        const newUser: User = {
            username: "newUser",
            name: {
                title: "title",
                first: "Jon",
                last: "Snow"
            },
            location: {
                city: "Black Castle",
                state: "Ice Wall"
            }
        };

        it("returns 201 if the user didn't exist already", done => {
            ApiTestClient
                .createUser(newUser)
                .then(res => {
                    expect(res.statusCode).toEqual(201);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("returns 409 if user exists already", done => {
            ApiTestClient
                .createUser(newUser)
                .then(res => {
                    fail("It should have thrown a 409 error");
                    done();
                })
                .catch(err => {
                    expect(err.statusCode).toEqual(409);
                    done();
                });
        });
    });

});
