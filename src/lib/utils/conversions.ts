// misc. unit conversion functions
export default {
    /**
     * Convert meters per second to miles per hour rounded to 1 decimal place
     * @param mps meters/second
     */
    mpsToMph(mps:number):number {
        return Math.round(mps * 2.2369 * 10) / 10;
    },

    /** 
     * Convert meters per second to kilometers per hour rounded to 1 decimal place
     * @param mps meters/second
     */
    mpsToKph(mps:number):number {
        return Math.round(mps * 3.6 * 10) / 10;
    },

    /** 
     * Convert meters to miles rounded to 1 decimal place
     * @param meters
     */
    metersToMiles(meters:number):number {
        return Math.round(meters * 0.00062137 * 10) / 10;
    },

    /**
     * Convert seconds to hours rounded to the nearest minute in HH:MM format 
     * @param seconds
     */
    secondsToHours(seconds:number):string {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }
}