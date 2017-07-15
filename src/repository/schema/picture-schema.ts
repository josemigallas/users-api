import { ObjectSchema } from "realm";

const PictureSchema: ObjectSchema = {
    name: "Picture",
    properties: {
        large: "string",
        medium: "string",
        thumbnail: "string"
    }
}

export default PictureSchema;
