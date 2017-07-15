
import { ObjectSchema } from "realm";
import LocationSchema from "./location-schema";
import NameSchema from "./name-schema";
import PictureSchema from "./picture-schema";

const UserSchema: ObjectSchema = {
    name: "User",
    primaryKey: "username",
    properties: {
        gender: "string",
        name: NameSchema.name,
        location: LocationSchema.name,
        email: "string",
        username: "string",
        password: "string",
        salt: "string",
        md5: "string",
        sha1: "string",
        sha256: "string",
        registered: "int",
        dob: "int",
        phone: "string",
        cell: "string",
        PPS: "string",
        picture: PictureSchema.name
    }
}

export default UserSchema;
