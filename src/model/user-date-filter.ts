import User from "./user";
import Name from "./name";
import Location from "./location";
import Picture from "./picture";

export default interface UserDateFilter extends User {

    registeredMax?: number,
    registeredMin?: number,
    dobMax?: number,
    dobMin?: number

}
