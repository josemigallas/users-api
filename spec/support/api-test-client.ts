import * as request from "request-promise-native";

import User from "../../src/model/user";

/**
 * Utility class that wraps all calls to API when running integration tests.
 */
export default class ApiTestClient {

    private static readonly URL: string = "http://localhost:3000";

    public static getUsers(): Promise<User[]> {
        return request.get(`${this.URL}/users`)
            .then(JSON.parse);
    }

    public static getUserByUsername(username: string): Promise<User> {
        return request.get(`${this.URL}/users/${username}`)
            .then(JSON.parse);
    }

    public static createUser(user: User): Promise<any> {
        const options = {
            uri: `${this.URL}/users`,
            body: user,
            json: true,
            resolveWithFullResponse: true
        };

        return request.post(options);
    }

    public static updateUser(user: User): Promise<any> {
        const options = {
            uri: `${this.URL}/users`,
            body: user,
            json: true,
            resolveWithFullResponse: true
        };

        return request.put(options);
    }

    public static deleteUser(username: string): Promise<any> {
        const options = {
            uri: `${this.URL}/users/${username}`,
            resolveWithFullResponse: true
        };

        return request.delete(options);
    }

}
