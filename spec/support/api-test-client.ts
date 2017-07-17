import * as request from "request-promise-native";

import User from "../../src/model/user";
import UserDateFilter from "../../src/model/user-date-filter";

/**
 * Utility class that wraps all calls to API when running integration tests.
 */
export default class ApiTestClient {

    private static readonly URL: string = "http://localhost:3000";

    public static getUsers(): Promise<User[]> {
        return request.get(`${this.URL}/users`)
            .then(JSON.parse);
    }

    public static filterUsers(filter: UserDateFilter): Promise<User[]> {
        let url: string = `${this.URL}/users?`;

        for (const key in filter) {
            if (typeof filter[key] !== "object") {
                url += `${key}=${filter[key]}&`;
            } else {
                for (const subkey in filter[key]) {
                    url += `${key}[${subkey}]=${filter[key][subkey]}&`;
                }
            }
        }

        url = url.slice(0, -1);

        return request.get(url).then(JSON.parse);
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
