import * as request from "request-promise-native";

import User from "../../src/model/user";

/**
 * Utility class that wraps all calls to API when running integration tests.
 */
export default class ApiTestClient {

    private static readonly URL: string = "http://localhost:3000";

    public static getUsers(): Promise<User[]> {
        return request.get(this.URL + "/users")
            .then(JSON.parse);
    }

}
