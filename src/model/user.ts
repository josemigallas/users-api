import Name from "./name";
import Location from "./location";
import Picture from "./picture";

export default interface User {

    gender: string,
    name: Name,
    location: Location,
    email: string,
    username: string,
    password: string,
    salt: string,
    md5: string,
    sha1: string,
    sha256: string,
    registered: number,
    dob: number,
    phone: string,
    cell: string,
    PPS: string,
    picture: Picture

}
