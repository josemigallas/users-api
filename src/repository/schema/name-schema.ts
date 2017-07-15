import { ObjectSchema } from "realm";

const NameSchema: ObjectSchema = {
    name: "Name",
    properties: {
        title: "string",
        first: "string",
        last: "string"
    }
}

export default NameSchema;
