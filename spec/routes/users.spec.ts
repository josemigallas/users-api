import ApiTestClient from "../support/api-test-client";

import User from "../../src/model/user";

describe("GET /users", () => {

    it("returns an array with all users", done => {
        ApiTestClient
            .getUsers()
            .then(users => {
                expect(users).toEqual(jasmine.any(Array));
                done();
            })
            .catch(err => fail(err));
    });

});

describe("GET /users/:username", () => {

    it("returns a user if it exists", done => {
        ApiTestClient
            .getUserByUsername("tinywolf709")
            .then(user => {
                expect(user.username).toEqual("tinywolf709");
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