export default {
    // function to convert meters per second to miles per hour rounded to 1 decimal place
    mpsToMph(mps:number):number {
        return Math.round(mps * 2.2369 * 10) / 10;
    },

    // function to convert meters per second to kilometers per hour rounded to 1 decimal place
    mpsToKph(mps:number):number {
        return Math.round(mps * 3.6 * 10) / 10;
    },

    // function to convert meters to miles rounded to 1 decimal place
    metersToMiles(meters:number):number {
        return Math.round(meters * 0.00062137 * 10) / 10;
    },

    // function to convert seconds to hours rounded to the nearest minute in HH:MM format
    secondsToHours(seconds:number):string {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }
}