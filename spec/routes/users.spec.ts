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

    const TEST_USER = JSON.parse(JSON.stringify(TestUsers[0]));
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

        const newUser: User = JSON.parse(JSON.stringify(TEST_USER));
        newUser.username = "newUser";

        it("returns 201 if the user is succesfully created", done => {
            RealmHelper.deleteUser(newUser.username);

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
            RealmHelper.addUser(newUser);

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

    describe("PUT /users", () => {

        it("returns 200 if the user is succesfully updated", done => {
            const userToUpdate: User = JSON.parse(JSON.stringify(TEST_USER));
            const userBeforeUpdating: User = RealmHelper.getUserByUsername(userToUpdate.username);
            expect(userBeforeUpdating.email).toEqual(userToUpdate.email);

            userToUpdate.email += "-updated";

            ApiTestClient
                .updateUser(userToUpdate)
                .then(res => {
                    expect(res.statusCode).toEqual(200);

                    const userAfterUpdating: User = RealmHelper.getUserByUsername(userToUpdate.username);
                    expect(userAfterUpdating.email).toEqual(userToUpdate.email);

                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("should update even if some user's properties are undefined", done => {
            const userToUpdate: User = {
                username: TEST_USER.username,
                location: {
                    city: TEST_USER.location.city
                }
            };

            const userBeforeUpdating: User = RealmHelper.getUserByUsername(userToUpdate.username);
            expect(userBeforeUpdating.location.city).toEqual(userToUpdate.location.city);

            userToUpdate.location.city += " of tht South";

            ApiTestClient
                .updateUser(userToUpdate)
                .then(res => {
                    expect(res.statusCode).toEqual(200);

                    const userAfterUpdating: User = RealmHelper.getUserByUsername(userToUpdate.username);
                    expect(userAfterUpdating.location.city).toEqual(userToUpdate.location.city);

                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("returns 404 if user does not exist", done => {
            const userToUpdate: User = {
                username: "whatever"
            };

            const nonExistentUser: User = RealmHelper.getUserByUsername(userToUpdate.username);
            expect(nonExistentUser).toBeFalsy();

            ApiTestClient
                .updateUser(userToUpdate)
                .then(res => {
                    fail("It should have thrown a 404 error");
                    done();
                })
                .catch(err => {
                    expect(err.statusCode).toEqual(404);
                    done();
                });
        });
    });

});
