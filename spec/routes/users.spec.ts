import RealmHelper from "../../src/repository/realm-helper";
import Sleep from "../../src/utils/sleep";

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

        // Starts the server in order to run integration tests
        require("../../src/server");
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
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("should filter by location", done => {
            const locationFilter: User = {
                location: {
                    street: "123 Lie Av."
                }
            };

            ApiTestClient
                .filterUsers(locationFilter)
                .then(users => {
                    expect(users.length).toEqual(2);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("should return 400 if trying to filter with wrong parameters", done => {
            const wrongFilter: any = {
                street: "123 Lie Av."
            };

            ApiTestClient
                .filterUsers(wrongFilter)
                .then(users => {
                    fail("It should have not filtered");
                    done();
                })
                .catch(err => {
                    expect(err.statusCode).toEqual(400);
                    done();
                });
        });

        it("should filter by gender", done => {
            const genderFilter: User = {
                gender: "male"
            };

            ApiTestClient
                .filterUsers(genderFilter)
                .then(users => {
                    expect(users.length).toEqual(2);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });

            genderFilter.gender = "female";

            ApiTestClient
                .filterUsers(genderFilter)
                .then(users => {
                    expect(users.length).toEqual(1);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("should filter by name", done => {
            const nameFilter: User = {
                name: {
                    last: "Gallas"
                }
            };

            ApiTestClient
                .filterUsers(nameFilter)
                .then(users => {
                    expect(users.length).toEqual(2);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });

            nameFilter.name.first = "Josemi";

            ApiTestClient
                .filterUsers(nameFilter)
                .then(users => {
                    expect(users.length).toEqual(1);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });

            nameFilter.name.title = "Lord";

            ApiTestClient
                .filterUsers(nameFilter)
                .then(users => {
                    expect(users.length).toEqual(1);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });

            nameFilter.name.title = "Mr";

            ApiTestClient
                .filterUsers(nameFilter)
                .then(users => {
                    expect(users.length).toEqual(0);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("should filter by zip code", done => {
            const zipFilter: User = {
                location: { zip: 12345 }
            };

            ApiTestClient
                .filterUsers(zipFilter)
                .then(users => {
                    expect(users.length).toEqual(2);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });

            zipFilter.location.zip = 99999;

            ApiTestClient
                .filterUsers(zipFilter)
                .then(users => {
                    expect(users.length).toEqual(1);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("should filter by max date", done => {
            const maxDateFilter: UserDateFilter = {
                dobMax: 932871967
            };

            ApiTestClient
                .filterUsers(maxDateFilter)
                .then(users => {
                    expect(users.length).toEqual(0);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });

            maxDateFilter.dobMax = 932871968;

            ApiTestClient
                .filterUsers(maxDateFilter)
                .then(users => {
                    expect(users.length).toEqual(1);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });

            maxDateFilter.dobMax = 932871969;

            ApiTestClient
                .filterUsers(maxDateFilter)
                .then(users => {
                    expect(users.length).toEqual(2);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });

            maxDateFilter.dobMax = 932871970;

            ApiTestClient
                .filterUsers(maxDateFilter)
                .then(users => {
                    expect(users.length).toEqual(3);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("should filter by min date", done => {
            const minDateFilter: UserDateFilter = {
                dobMin: 932871968
            };

            ApiTestClient
                .filterUsers(minDateFilter)
                .then(users => {
                    expect(users.length).toEqual(3);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });

            minDateFilter.dobMin = 932871969;

            ApiTestClient
                .filterUsers(minDateFilter)
                .then(users => {
                    expect(users.length).toEqual(2);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });

            minDateFilter.dobMin = 932871970;

            ApiTestClient
                .filterUsers(minDateFilter)
                .then(users => {
                    expect(users.length).toEqual(1);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });

            minDateFilter.dobMin = 932871971;

            ApiTestClient
                .filterUsers(minDateFilter)
                .then(users => {
                    expect(users.length).toEqual(0);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("should filter by max date interval", done => {
            const intervalDateFilter: UserDateFilter = {
                dobMin: 932871968,
                dobMax: 932871970
            };

            ApiTestClient
                .filterUsers(intervalDateFilter)
                .then(users => {
                    expect(users.length).toEqual(3);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });

            intervalDateFilter.dobMin = 932871968;
            intervalDateFilter.dobMax = 932871969;

            ApiTestClient
                .filterUsers(intervalDateFilter)
                .then(users => {
                    expect(users.length).toEqual(2);
                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
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

        it("returns 201 if the user is succesfully created", async done => {
            RealmHelper.deleteUser(newUser.username);

            await Sleep.millis(200);

            const user: User = RealmHelper.getUserByUsername(newUser.username);
            expect(user).toBeFalsy();

            ApiTestClient
                .createUser(newUser)
                .then(async res => {
                    expect(res.statusCode).toEqual(201);

                    await Sleep.millis(200);

                    const createdUser: User = RealmHelper.getUserByUsername(newUser.username);
                    expect(createdUser).toBeTruthy();

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
                .then(async res => {
                    expect(res.statusCode).toEqual(200);

                    await Sleep.millis(200);

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
                .then(async res => {
                    expect(res.statusCode).toEqual(200);

                    await Sleep.millis(200);

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

    describe("DELETE /users/:username", () => {

        it("returns 200 if user has been successfully deleted", done => {
            const user: User = RealmHelper.getUserByUsername("josemigallas");
            expect(user).toBeTruthy();

            ApiTestClient
                .deleteUser("josemigallas")
                .then(async res => {
                    expect(res.statusCode).toEqual(200);

                    await Sleep.millis(200);

                    const user: User = RealmHelper.getUserByUsername("josemigallas");
                    expect(user).toBeFalsy();

                    done();
                })
                .catch(err => {
                    fail(err);
                    done();
                });
        });

        it("returns 404 if user does not exist", done => {
            ApiTestClient
                .deleteUser("whatever")
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

});
