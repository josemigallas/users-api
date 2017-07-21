export default class Sleep {

    /**
    * Waits a certain time of milliseconds.
    * @param ms Milliseconds to wait
    * @example
    * await sleep(1000);
    */
    public static millis(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
