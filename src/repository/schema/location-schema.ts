import { ObjectSchema } from "realm";

const LocationSchema: ObjectSchema = {
    name: "Location",
    properties: {
        street: "string",
        city: "string",
        state: "string",
        zip: "int",
    }
};

export default LocationSchema;
