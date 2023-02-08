/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ActivityStream {
    time: number[];
    distance: number[];
    // latlng: number[][],
    altitude: number[];
    heartrate: number[];
    watts: number[];
    temp: number[];
}

interface Activity {
    id: number;
    name: string;
    type: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    start_date: string;
    map: string;
    start_latlng: number[];
    end_latlng: number[];
    average_speed: number;
    max_speed: number;
    average_watts?: number;
    kilojoules?: number;
    average_heartrate?: number;
    max_heartrate?: number;
    calories?: number;
    meta: {
      show: boolean;
      highlight: boolean;
    }
}