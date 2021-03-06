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

describe("RealmHelper", () => {

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

    describe(".getUsers", () => {

        it("should return an array with all users", () => {
            const users = RealmHelper.getUsers();

            expect(users.length).toEqual(TestUsers.length);
        });

    });

    describe(".getUserById", () => {

        it("should return a user by its username", () => {
            const username1 = "josemigallas";
            const user1: User = RealmHelper.getUserByUsername(username1);

            const username2 = "josefa_la_jefa";
            const user2: User = RealmHelper.getUserByUsername(username2);

            expect(user1.username).toEqual(username1);
            expect(user2.username).toEqual(username2);
        });

    });

    describe(".addUser", () => {

        it("should create a new user in the DB", () => {
            const usersBeforeAddition = RealmHelper.getUsers();
            expect(usersBeforeAddition.length).toEqual(TestUsers.length);

            const newUser: User = JSON.parse(JSON.stringify(TEST_USER));
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

    describe(".deleteUser", () => {

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

    describe(".updateUser", () => {

        it("should update a user of the DB", () => {
            const userBeforeUpdating = RealmHelper.getUserByUsername(TEST_USER.username);

            const newEmail: string = "josemigallas@example.com";
            expect(userBeforeUpdating.email).not.toEqual(newEmail);
            TEST_USER.email = newEmail;

            RealmHelper.updateUser(TEST_USER);

            const userAfterUpdating = RealmHelper.getUserByUsername(TEST_USER.username);
            expect(userAfterUpdating.email).toEqual(newEmail);
        });

        it("should update a user of the DB even if some properties are undefined", () => {
            const userBeforeUpdating = RealmHelper.getUserByUsername(TEST_USER.username);

            // Check value to update is different
            const newEmail: string = "josemigallas@example.com";
            expect(userBeforeUpdating.email).not.toEqual(newEmail);

            // Check some value that won't be changed
            const originalDob: number = userBeforeUpdating.dob;

            const userToUpdate: User = {
                username: TEST_USER.username,
                email: newEmail
            };

            RealmHelper.updateUser(userToUpdate);

            const userAfterUpdating = RealmHelper.getUserByUsername(TEST_USER.username);
            expect(userAfterUpdating.email).toEqual(newEmail);
            expect(userAfterUpdating.dob).toEqual(originalDob);
        });

        it("should throw if trying to update a nonexistent user", () => {
            const nonExistentUsername: string = "TheThing67";
            expect(TEST_USER.username).not.toEqual(nonExistentUsername);

            TEST_USER.username = nonExistentUsername;
            const test = () => RealmHelper.updateUser(TEST_USER);

            expect(test).toThrowError();
        });

    });

    describe(".getFilterQueryForUser", () => {

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


        it("should return a well formed query for max date filters", () => {
            const maxDateFilter: UserDateFilter = {
                dobMax: 999,
                registeredMax: 999
            };

            let expectedMaxDateQuery: string = `dob <= "${maxDateFilter.dobMax}" AND `;
            expectedMaxDateQuery += `registered <= "${maxDateFilter.registeredMax}"`;

            expect(RealmHelper.getFilterQueryForUser(maxDateFilter)).toEqual(expectedMaxDateQuery);
        });

        it("should return a well formed query for min date filters", () => {
            const minDateFilter: UserDateFilter = {
                dobMin: 111,
                registeredMin: 999
            };

            let expectedMinDateQuery: string = `dob >= "${minDateFilter.dobMin}" AND `;
            expectedMinDateQuery += `registered >= "${minDateFilter.registeredMin}"`;

            expect(RealmHelper.getFilterQueryForUser(minDateFilter)).toEqual(expectedMinDateQuery);
        });

        it("should return a well formed query for date interval filters", () => {
            const intervalDateFilter: UserDateFilter = {
                dobMin: 1,
                dobMax: 2,
                registeredMin: 10,
                registeredMax: 20
            }

            let expectedIntervalDateQuery: string = `dob >= "${intervalDateFilter.dobMin}" AND `;
            expectedIntervalDateQuery += `dob <= "${intervalDateFilter.dobMax}" AND `;
            expectedIntervalDateQuery += `registered >= "${intervalDateFilter.registeredMin}" AND `;
            expectedIntervalDateQuery += `registered <= "${intervalDateFilter.registeredMax}"`;

            expect(RealmHelper.getFilterQueryForUser(intervalDateFilter)).toEqual(expectedIntervalDateQuery);
        });

    });

    describe(".findUsers", () => {

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

        it("should filter by gender", () => {
            const genderFilter: User = {
                gender: "male"
            };

            const filteredMales: User[] = RealmHelper.findUsers(genderFilter);
            expect(filteredMales.length).toEqual(2);

            genderFilter.gender = "female";

            const filteredFemales: User[] = RealmHelper.findUsers(genderFilter);
            expect(filteredFemales.length).toEqual(1);
        });

        it("should filter by name", () => {
            const name: Name = {
                last: "Gallas"
            };

            const nameFilter: User = {
                name
            };

            const filteredByLastName: User[] = RealmHelper.findUsers(nameFilter);
            expect(filteredByLastName.length).toEqual(2);

            nameFilter.name.first = "Josemi";

            const filteredByFirstAndLastName: User[] = RealmHelper.findUsers(nameFilter);
            expect(filteredByFirstAndLastName.length).toEqual(1);

            nameFilter.name.title = "Lord";

            const filteredByFirstLastAndTitle: User[] = RealmHelper.findUsers(nameFilter);
            expect(filteredByFirstAndLastName.length).toEqual(1);

            nameFilter.name.title = "Mr";

            const filteredByWrongTitle: User[] = RealmHelper.findUsers(nameFilter);
            expect(filteredByWrongTitle.length).toEqual(0);
        });

        it("should filter by zip code", () => {
            const zipFilter: User = {
                location: { zip: 12345 }
            };

            let filteredByZip: User[] = RealmHelper.findUsers(zipFilter);
            expect(filteredByZip.length).toEqual(2);

            zipFilter.location.zip = 99999;

            filteredByZip = RealmHelper.findUsers(zipFilter);
            expect(filteredByZip.length).toEqual(1);
        });

        it("should filter by max date", () => {
            const maxDateFilter: UserDateFilter = {
                dobMax: 932871967
            };

            let filteredByMaxDate: User[] = RealmHelper.findUsers(maxDateFilter);
            expect(filteredByMaxDate.length).toEqual(0);

            maxDateFilter.dobMax = 932871968;
            filteredByMaxDate = RealmHelper.findUsers(maxDateFilter);
            expect(filteredByMaxDate.length).toEqual(1);

            maxDateFilter.dobMax = 932871969;
            filteredByMaxDate = RealmHelper.findUsers(maxDateFilter);
            expect(filteredByMaxDate.length).toEqual(2);

            maxDateFilter.dobMax = 932871970;
            filteredByMaxDate = RealmHelper.findUsers(maxDateFilter);
            expect(filteredByMaxDate.length).toEqual(3);
        });

        it("should filter by min date", () => {
            const minDateFilter: UserDateFilter = {
                dobMin: 932871968
            };

            let filteredByMaxDate: User[] = RealmHelper.findUsers(minDateFilter);
            expect(filteredByMaxDate.length).toEqual(3);

            minDateFilter.dobMin = 932871969;
            filteredByMaxDate = RealmHelper.findUsers(minDateFilter);
            expect(filteredByMaxDate.length).toEqual(2);

            minDateFilter.dobMin = 932871970;
            filteredByMaxDate = RealmHelper.findUsers(minDateFilter);
            expect(filteredByMaxDate.length).toEqual(1);

            minDateFilter.dobMin = 932871971;
            filteredByMaxDate = RealmHelper.findUsers(minDateFilter);
            expect(filteredByMaxDate.length).toEqual(0);
        });

        it("should filter by max date interval", () => {
            const intervalDateFilter: UserDateFilter = {
                dobMin: 932871968,
                dobMax: 932871970
            };

            let filteredByDateInterval: User[] = RealmHelper.findUsers(intervalDateFilter);
            expect(filteredByDateInterval.length).toEqual(3);

            intervalDateFilter.dobMin = 932871968;
            intervalDateFilter.dobMax = 932871969;

            filteredByDateInterval = RealmHelper.findUsers(intervalDateFilter);
            expect(filteredByDateInterval.length).toEqual(2);
        });

    });

})
